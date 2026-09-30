const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.detail || `Server error (${response.status})`;
    throw new Error(message);
  }
  return response.json();
}

export async function fetchHealth() {
  const res = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(res);
}

export async function fetchDemoCases() {
  const res = await fetch(`${API_BASE_URL}/cases`);
  return handleResponse(res);
}

export async function createDemoCase(caseData) {
  const res = await fetch(`${API_BASE_URL}/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(caseData),
  });
  return handleResponse(res);
}

export async function fetchDemoCase(id) {
  const res = await fetch(`${API_BASE_URL}/cases/${id}`);
  return handleResponse(res);
}

export async function findSimilarCases(caseId, topK = 5) {
  const res = await fetch(`${API_BASE_URL}/cases/${caseId}/similar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ top_k: topK }),
  });
  return handleResponse(res);
}

export async function fetchCaseBriefing(caseId, topK = 5) {
  const res = await fetch(`${API_BASE_URL}/cases/${caseId}/briefing?top_k=${topK}`);
  return handleResponse(res);
}

export async function fetchHistoricalCases(query = '', category = '', page = 1, limit = 10) {
  const params = new URLSearchParams();
  if (query) params.append('query', query);
  if (category && category !== 'All') params.append('category', category);
  params.append('page', page);
  params.append('limit', limit);

  const res = await fetch(`${API_BASE_URL}/historical-cases?${params.toString()}`);
  return handleResponse(res);
}

export async function triggerImportSample() {
  const res = await fetch(`${API_BASE_URL}/historical-cases/import-sample`, {
    method: 'POST',
  });
  return handleResponse(res);
}
