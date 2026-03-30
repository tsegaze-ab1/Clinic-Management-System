import useSWR, { mutate } from 'swr';
import { endpoints } from './endpoints';
import { request } from './httpClient';

function unwrapResponse(response) {
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data;
  }
  return response;
}

function normalizeCollection(payload) {
  if (Array.isArray(payload)) {
    return { items: payload, total: payload.length };
  }

  if (payload?.items && Array.isArray(payload.items)) {
    return {
      items: payload.items,
      total: Number(payload.total || payload.items.length)
    };
  }

  return { items: [], total: 0 };
}

export function useCollection(path, query = {}) {
  const key = JSON.stringify({ path, query });
  return useSWR(key, async () => {
    const response = await request({ url: path, query });
    return normalizeCollection(unwrapResponse(response));
  });
}

export function useEntity(path, id) {
  const key = id ? `${path}/${id}` : null;
  return useSWR(key, async () => {
    const response = await request({ url: `${path}/${id}` });
    return unwrapResponse(response);
  });
}

export async function createEntity(path, payload) {
  const optimisticId = `tmp-${Date.now()}`;
  mutate(JSON.stringify({ path, query: {} }), (current) => {
    if (!current?.items) return current;
    return { ...current, items: [{ id: optimisticId, ...payload, optimistic: true }, ...current.items] };
  }, false);

  const created = await request({ method: 'POST', url: path, body: payload });
  mutate((key) => typeof key === 'string' && key.includes(path));
  return unwrapResponse(created);
}

export async function updateEntity(path, id, payload) {
  const updated = await request({ method: 'PATCH', url: `${path}/${id}`, body: payload });
  return unwrapResponse(updated);
}

export async function removeEntity(path, id) {
  return request({ method: 'DELETE', url: `${path}/${id}` });
}

export const cmsApi = {
  endpoints,
  useCollection,
  useEntity,
  createEntity,
  updateEntity,
  removeEntity
};
