const backendBaseUrl =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export async function register(name, email, password) {
  const response = await fetch(`${backendBaseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Register failed (${response.status})`);
  }
  return data;
}

export async function login(email, password) {
  const response = await fetch(`${backendBaseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Login failed (${response.status})`);
  }
  return data;
}
