// Source: https://gist.github.com/dscheerens/8791470290d2a051934fb45890b23601

const GLOBAL_MEMOIZATION_MAP = new WeakMap<object, Map<string, unknown>>();

export function Memoized<T extends { constructor: Function }>(
  target: T,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  if (!descriptor.get) {
    throw new Error(`Cannot apply @Memoized decorator to '${target.constructor.name}.${propertyKey}' since it has no get accessor`);
  }

  return {
    ...descriptor,
    get(this: object): unknown {
      let localMemoizationMap = GLOBAL_MEMOIZATION_MAP.get(this);
      if (!localMemoizationMap) {
        localMemoizationMap = new Map<string, unknown>();
        GLOBAL_MEMOIZATION_MAP.set(this, localMemoizationMap);
      }

      if (localMemoizationMap.has(propertyKey)) {
        return localMemoizationMap.get(propertyKey);
      }

      const value = descriptor.get?.call(this);

      localMemoizationMap.set(propertyKey, value);

      return value;
    },
  };
}
