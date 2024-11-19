export const isEnumValue = <T>(enumObj: T, value: any): value is T[keyof T] => {
  const normalizedValue = (value as string).trim().toLowerCase();
  return (Object.values(enumObj as any) as unknown as string[]).some(
    (enumValue: string) => enumValue.toLowerCase() === normalizedValue,
  );
};

export const isNotNullOrUndefined = <T>(
  value: T | null | undefined,
): value is T => {
  return value !== null && value !== undefined;
};
