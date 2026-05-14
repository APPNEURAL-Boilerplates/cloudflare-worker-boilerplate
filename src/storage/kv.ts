export async function getJsonFromKv<T>(
  namespace: KVNamespace,
  key: string,
): Promise<T | null> {
  return namespace.get<T>(key, "json");
}

export async function putJsonToKv<T>(
  namespace: KVNamespace,
  key: string,
  value: T,
  options?: KVNamespacePutOptions,
): Promise<void> {
  await namespace.put(key, JSON.stringify(value), options);
}
