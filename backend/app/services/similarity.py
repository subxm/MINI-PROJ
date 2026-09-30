import numpy as np
from typing import List, Dict, Any, Optional, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.config import settings
from app.schemas.cases import SimilarCaseResult, MatchFactor

class SimilarityEngine:
    def __init__(self):
        self.vectorizer = None
        self.tfidf_matrix = None
        self.historical_records: List[Dict[str, Any]] = []

    def fit_or_update(self, historical_records: List[Dict[str, Any]]):
        """Fit or refresh TF-IDF vectorizer and document matrix in memory."""
        self.historical_records = historical_records
        if not historical_records:
            self.vectorizer = None
            self.tfidf_matrix = None
            return

        descriptions = [
            (rec.get("incident_description") or "").strip()
            for rec in historical_records
        ]
        
        # Filter non-empty descriptions for vectorizer fitting
        non_empty = [d for d in descriptions if d]
        if not non_empty:
            self.vectorizer = None
            self.tfidf_matrix = None
            return

        try:
            self.vectorizer = TfidfVectorizer(
                stop_words="english",
                ngram_range=(1, 2),
                max_features=5000
            )
            self.tfidf_matrix = self.vectorizer.fit_transform(descriptions)
        except Exception as e:
            print(f"Error fitting TfidfVectorizer: {e}")
            self.vectorizer = None
            self.tfidf_matrix = None

    def find_similar_cases(
        self,
        demo_case: Dict[str, Any],
        historical_candidates: List[Dict[str, Any]],
        top_k: int = 5
    ) -> List[SimilarCaseResult]:
        """Rank candidates against demo case using hybrid TF-IDF + structured matching."""
        if not historical_candidates:
            return []

        # Ensure vectorizer is fit to current candidates
        self.fit_or_update(historical_candidates)

        demo_desc = (demo_case.get("incident_description") or "").strip()
        demo_cat = (demo_case.get("crime_category") or "").strip().lower()
        demo_subcat = (demo_case.get("crime_subcategory") or "").strip().lower() if demo_case.get("crime_subcategory") else None
        demo_neigh = (demo_case.get("neighborhood") or "").strip().lower() if demo_case.get("neighborhood") else None

        # Compute text cosine similarity if vectorizer available
        text_sims = np.zeros(len(historical_candidates))
        if self.vectorizer is not None and self.tfidf_matrix is not None and demo_desc:
            try:
                demo_vec = self.vectorizer.transform([demo_desc])
                text_sims = cosine_similarity(demo_vec, self.tfidf_matrix)[0]
            except Exception as e:
                print(f"Error computing cosine similarity: {e}")
                text_sims = np.zeros(len(historical_candidates))

        scored_results: List[Tuple[float, SimilarCaseResult]] = []

        for idx, candidate in enumerate(historical_candidates):
            raw_text_score = float(text_sims[idx]) if idx < len(text_sims) else 0.0

            cand_cat = (candidate.get("crime_category") or "").strip().lower()
            cand_subcat = (candidate.get("crime_subcategory") or "").strip().lower() if candidate.get("crime_subcategory") else None
            cand_neigh = (candidate.get("neighborhood") or "").strip().lower() if candidate.get("neighborhood") else None

            # Base weights from settings
            weights = {
                "text": settings.WEIGHT_TEXT,
                "category": settings.WEIGHT_CATEGORY,
                "subcategory": settings.WEIGHT_SUBCATEGORY,
                "neighborhood": settings.WEIGHT_NEIGHBORHOOD
            }

            available_signals = {}
            factors: List[MatchFactor] = []
            reasons: List[str] = []

            # 1. Text Similarity Signal
            if demo_desc and candidate.get("incident_description"):
                available_signals["text"] = raw_text_score
                factors.append(MatchFactor(
                    factor_name="Text Similarity",
                    matched=raw_text_score > 0.1,
                    explanation=f"TF-IDF description cosine similarity: {raw_text_score:.2f}",
                    weight=weights["text"],
                    score=round(raw_text_score, 4)
                ))
                if raw_text_score > 0.15:
                    reasons.append(f"Description match score: {raw_text_score:.2f}")

            # 2. Crime Category Signal
            if demo_cat and cand_cat and demo_cat != "unknown" and cand_cat != "unknown":
                is_cat_match = (demo_cat == cand_cat)
                cat_score = 1.0 if is_cat_match else 0.0
                available_signals["category"] = cat_score
                cat_display = candidate.get("crime_category")
                factors.append(MatchFactor(
                    factor_name="Crime Category",
                    matched=is_cat_match,
                    explanation=f"Same crime category ('{cat_display}')" if is_cat_match else f"Category mismatch ('{demo_case.get('crime_category')}' vs '{cat_display}')",
                    weight=weights["category"],
                    score=cat_score
                ))
                if is_cat_match:
                    reasons.append(f"Same crime category ({cat_display})")

            # 3. Crime Subcategory Signal
            if demo_subcat and cand_subcat:
                is_subcat_match = (demo_subcat == cand_subcat)
                subcat_score = 1.0 if is_subcat_match else 0.0
                available_signals["subcategory"] = subcat_score
                subcat_display = candidate.get("crime_subcategory")
                factors.append(MatchFactor(
                    factor_name="Crime Subcategory",
                    matched=is_subcat_match,
                    explanation=f"Same crime subcategory ('{subcat_display}')" if is_subcat_match else f"Subcategory mismatch",
                    weight=weights["subcategory"],
                    score=subcat_score
                ))
                if is_subcat_match:
                    reasons.append(f"Same subcategory ({subcat_display})")

            # 4. Neighborhood Signal
            if demo_neigh and cand_neigh:
                is_neigh_match = (demo_neigh == cand_neigh)
                neigh_score = 1.0 if is_neigh_match else 0.0
                available_signals["neighborhood"] = neigh_score
                neigh_display = candidate.get("neighborhood")
                factors.append(MatchFactor(
                    factor_name="Neighborhood",
                    matched=is_neigh_match,
                    explanation=f"Same neighborhood ('{neigh_display}')" if is_neigh_match else f"Different neighborhood",
                    weight=weights["neighborhood"],
                    score=neigh_score
                ))
                if is_neigh_match:
                    reasons.append(f"Same neighborhood ({neigh_display})")

            # Weight Renormalization over available signals
            if available_signals:
                total_weight = sum(weights[k] for k in available_signals)
                if total_weight > 0:
                    final_score = sum(available_signals[k] * (weights[k] / total_weight) for k in available_signals)
                else:
                    final_score = 0.0
            else:
                final_score = 0.0

            # Fallback explanation if no high signals matched
            if not reasons:
                if raw_text_score > 0.05:
                    reasons.append(f"Partial narrative similarity ({raw_text_score:.2f})")
                else:
                    reasons.append("Low general attribute overlap")

            pct_score = min(100, max(0, int(round(final_score * 100))))

            result_obj = SimilarCaseResult(
                historical_record_id=str(candidate.get("id")),
                source_incident_id=candidate.get("source_incident_id"),
                crime_category=candidate.get("crime_category"),
                crime_subcategory=candidate.get("crime_subcategory"),
                incident_description=candidate.get("incident_description"),
                incident_datetime=candidate.get("incident_datetime"),
                neighborhood=candidate.get("neighborhood"),
                resolution=candidate.get("resolution"),
                similarity_score=pct_score,
                raw_score=round(final_score, 4),
                text_similarity=round(raw_text_score, 4) if demo_desc else None,
                match_reasons=reasons,
                match_factors=factors,
                source_label="Historical SFPD Record"
            )

            scored_results.append((final_score, result_obj))

        # Sort by final score descending
        scored_results.sort(key=lambda x: x[0], reverse=True)

        return [res for _, res in scored_results[:top_k]]

similarity_engine = SimilarityEngine()
