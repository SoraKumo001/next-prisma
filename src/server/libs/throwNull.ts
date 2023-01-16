export const throwNull = <T>(value: T) => {
  if (value === null) throw new Error("data is null");
  return value;
};
