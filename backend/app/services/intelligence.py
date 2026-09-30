import re
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class ExtractedEntities(BaseModel):
    stolen_property: List[str]
    entry_methods: List[str]
    suspect_descriptors: List[str]
    locations: List[str]

class ActionableLead(BaseModel):
    id: str
    category: str
    action_item: str
    description: str
    priority: str  # HIGH, MEDIUM, LOW

class CaseIntelligenceBrief(BaseModel):
    demo_case_id: str
    case_title: str
    entities: ExtractedEntities
    actionable_leads: List[ActionableLead]
    historical_resolution_stats: Dict[str, int]
    total_similar_historical_evaluated: int
    top_match_score: int

class IntelligenceService:
    PROPERTY_PATTERNS = [
        (r'\b(laptop|macbook|computer|pc|tablet|ipad)\b', 'Electronics / Laptop'),
        (r'\b(phone|smartphone|iphone|galaxy)\b', 'Mobile Device'),
        (r'\b(watch|wrist watch|jewelry|gold|ring|necklace)\b', 'Jewelry & Watches'),
        (r'\b(cash|wallet|credit card|money|currency)\b', 'Financial & Currency'),
        (r'\b(bicycle|bike|electric bike|ebike)\b', 'Bicycle / E-Bike'),
        (r'\b(camera|hard drive|equipment)\b', 'Media & Camera Gear'),
        (r'\b(car|automobile|honda|civic|vehicle|truck)\b', 'Motor Vehicle'),
        (r'\b(backpack|bag|purse)\b', 'Bags & Accessories')
    ]

    ENTRY_PATTERNS = [
        (r'\b(forced window|window pried|window entry|window shattered|broken window)\b', 'Forced Window Entry'),
        (r'\b(door pried|door lock|side door|forced door|lock defeated)\b', 'Door Lock Breach'),
        (r'\b(parking garage|underground parking|garage)\b', 'Garage Trespass'),
        (r'\b(sidewalk|street|snatched)\b', 'Street Confrontation / Distraction'),
        (r'\b(phishing|email|wire transfer|online)\b', 'Digital / Social Engineering')
    ]

    def extract_entities(self, text: str, neighborhood: Optional[str] = None) -> ExtractedEntities:
        t = text.lower()
        stolen = []
        for pattern, label in self.PROPERTY_PATTERNS:
            if re.search(pattern, t):
                stolen.append(label)
        if not stolen:
            stolen.append("Unspecified Personal Property")

        entries = []
        for pattern, label in self.ENTRY_PATTERNS:
            if re.search(pattern, t):
                entries.append(label)
        if not entries:
            entries.append("General Trespass / Unlawful Entry")

        locs = [neighborhood] if neighborhood else []

        return ExtractedEntities(
            stolen_property=list(set(stolen)),
            entry_methods=list(set(entries)),
            suspect_descriptors=["Awaiting Witness Statements"],
            locations=locs
        )

    def generate_briefing(
        self,
        demo_case: Dict[str, Any],
        similar_results: List[Dict[str, Any]],
        total_evaluated: int
    ) -> CaseIntelligenceBrief:
        desc = demo_case.get("incident_description", "")
        neigh = demo_case.get("neighborhood") or "Incident Area"
        entities = self.extract_entities(desc, neigh)

        top_score = similar_results[0].get("similarity_score", 0) if similar_results else 0

        # Calculate resolution breakdown across top similar historical cases
        res_stats: Dict[str, int] = {}
        for r in similar_results:
            res = r.get("resolution") or "Open / Under Investigation"
            res_stats[res] = res_stats.get(res, 0) + 1

        # Generate Actionable Leads Checklist
        leads: List[ActionableLead] = []

        # 1. CCTV & Surveillance Lead
        leads.append(ActionableLead(
            id="lead-1",
            category="Surveillance & Video",
            action_item=f"Canvass & Request CCTV Footage in {neigh}",
            description=f"Identify municipal and private cameras within a 200m radius of {neigh} during estimated incident time window.",
            priority="HIGH"
        ))

        # 2. Pawn Shop & Marketplace Alert Lead
        items_str = ", ".join(entities.stolen_property)
        leads.append(ActionableLead(
            id="lead-2",
            category="Stolen Property Recovery",
            action_item=f"Flag Regional Pawn Shops & Marketplaces for ({items_str})",
            description=f"Cross-reference automated stolen property registries for newly listed {items_str} in San Francisco area.",
            priority="HIGH"
        ))

        # 3. Forensic & Evidence Lead
        entry_str = ", ".join(entities.entry_methods)
        leads.append(ActionableLead(
            id="lead-3",
            category="Forensics & MO Pattern",
            action_item=f"Process Entry Point for Latent Toolmarks & Fingerprints ({entry_str})",
            description=f"Inspect point of entry ({entry_str}) to match toolmarks against known burglary MO patterns in regional database.",
            priority="MEDIUM"
        ))

        # 4. Modus Operandi Cross-Reference
        leads.append(ActionableLead(
            id="lead-4",
            category="Pattern Analysis",
            action_item=f"Cross-Evaluate Top {len(similar_results)} Matched Historical SFPD Cases",
            description=f"Review suspect descriptions and resolution reports from past matched incidents in {demo_case.get('crime_category', 'Category')}.",
            priority="MEDIUM"
        ))

        return CaseIntelligenceBrief(
            demo_case_id=demo_case["id"],
            case_title=demo_case["title"],
            entities=entities,
            actionable_leads=leads,
            historical_resolution_stats=res_stats,
            total_similar_historical_evaluated=total_evaluated,
            top_match_score=top_score
        )

intelligence_service = IntelligenceService()
