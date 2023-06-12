export function filterUndefined<T extends Record<string, any>>(obj: T, undefinedProps: Set<string>): T {
  return Object.keys(obj).reduce((result, key) => {
    const value = obj[key]
    if (typeof value === 'object' && value !== obj && value !== null) {
      for (const subKey of Object.keys(value)) {
        if (value[subKey] === undefined)
          undefinedProps.add(subKey)
        else
          result[key as keyof T] = value
        if (undefinedProps.has(subKey))
          delete value[subKey]
      }
    }

    return result
  }, {} as T)
}
