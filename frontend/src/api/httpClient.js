import { clearSession, getSession } from '../auth/sessionStore';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
const MAX_RETRY = 2;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function enqueueOfflineRequest(config) {
  const key = 'clinic-offline-queue-v1';
  const current = JSON.parse(localStorage.getItem(key) || '[]');
  current.push(config);
  localStorage.setItem(key, JSON.stringify(current));
}

export async function flushOfflineQueue() {
  const key = 'clinic-offline-queue-v1';
  const current = JSON.parse(localStorage.getItem(key) || '[]');
  if (!current.length || !navigator.onLine) return;

  const pending = [...current];
  localStorage.setItem(key, '[]');
  for (const item of pending) {
    try {
      await request(item);
    } catch {
      enqueueOfflineRequest(item);
    }
  }
}

window.addEventListener('online', flushOfflineQueue);

export async function request({ method = 'GET', url, body, query, headers = {} }, retry = 0) {
  const session = getSession();
  const fullURL = new URL(`${baseURL}${url}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        fullURL.searchParams.set(key, value);
      }
    });
  }

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(session.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  };

  try {
    const response = await fetch(fullURL, config);

    if (response.status === 401) {
      clearSession();
      window.location.assign('/auth/sign-in');
      throw new Error('Unauthorized');
    }

    if (response.status === 403) {
      window.location.assign('/not-authorized');
      throw new Error('Forbidden');
    }

    if (!response.ok) {
      if (response.status >= 500 && retry < MAX_RETRY) {
        await sleep(400 * (retry + 1));
        return request({ method, url, body, query, headers }, retry + 1);
      }
      const text = await response.text();
      throw new Error(text || 'Request failed');
    }

    const contentType = response.headers.get('content-type') || '';
    return contentType.includes('application/json') ? response.json() : response.text();
  } catch (error) {
    if (!navigator.onLine && method !== 'GET') {
      enqueueOfflineRequest({ method, url, body, query, headers });
      return { queuedOffline: true };
    }
    throw error;
  }
}
