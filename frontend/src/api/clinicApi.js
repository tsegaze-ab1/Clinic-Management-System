import useSWR, { mutate } from 'swr';
import { endpoints } from './endpoints';
import { request } from './httpClient';

export function useCollection(path, query = {}) {
  const key = JSON.stringify({ path, query });
  return useSWR(key, () => request({ url: path, query }));
}

export function useEntity(path, id) {
  const key = id ? `${path}/${id}` : null;
  return useSWR(key, () => request({ url: `${path}/${id}` }));
}

export async function createEntity(path, payload) {
  const optimisticId = `tmp-${Date.now()}`;
  mutate(JSON.stringify({ path, query: {} }), (current) => {
    if (!current?.items) return current;
    return { ...current, items: [{ id: optimisticId, ...payload, optimistic: true }, ...current.items] };
  }, false);

  const created = await request({ method: 'POST', url: path, body: payload });
  mutate((key) => typeof key === 'string' && key.includes(path));
  return created;
}

export async function updateEntity(path, id, payload) {
  return request({ method: 'PATCH', url: `${path}/${id}`, body: payload });
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
