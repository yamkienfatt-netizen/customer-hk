import { createCache, MemoryCache, memoryStore } from 'cache-manager';

const memoryCaches: Map<string, MemoryCache> = new Map<string, MemoryCache>();

export const getMemoryCache = (cacheName: string, ttl = 60 * 1000 * 60, memoryMax = 9999): MemoryCache => {
  if (memoryCaches.has(cacheName)) {
    return memoryCaches.get(cacheName)!;
  }
  
  const newCache = createCache(
    memoryStore({
      max: memoryMax,
      ttl: ttl /*milliseconds*/,
    })
  );
  memoryCaches.set(cacheName, newCache);

  return newCache;
};

export const getCacheKey = (cacheName: string, args: Record<string, string | undefined>) => {
  const ret = [cacheName];
  if (args) {
    for (const k in args) {
      ret.push(`_#${k}:${args[k]}`);
    }
  }
  return ret.join('');
};

export const profileCache = getMemoryCache("UserProfileCache");