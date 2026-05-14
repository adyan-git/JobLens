const backendBaseUrl =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const TOKEN_KEY = 'joblensToken';

function authHeaders() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function fetchAllJobsFromBackend() {
  const response = await fetch(`${backendBaseUrl}/api/jobs`, {
    headers: {
      ...authHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch jobs: ${response.status}`);
  }

  return response.json();
}

export async function sendNewJobToBackend(jobData) {
  const response = await fetch(`${backendBaseUrl}/api/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(jobData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create job: ${response.status}`);
  }

  return response.json();
}

export async function addNewNoteToJob(jobId, noteText) {
  const response = await fetch(`${backendBaseUrl}/api/jobs/${jobId}/notes`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ noteText }),
  });

  if (!response.ok) {
    throw new Error(`Failed to add note: ${response.status}`);
  }

  return response.json();
}

