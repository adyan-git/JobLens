const backendBaseUrl =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export async function fetchAllJobsFromBackend() {
  const response = await fetch(`${backendBaseUrl}/api/jobs`);

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
    },
    body: JSON.stringify(jobData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create job: ${response.status}`);
  }

  return response.json();
}

