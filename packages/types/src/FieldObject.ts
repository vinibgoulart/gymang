export type FieldObject<T> = {
  [Key in keyof T]: string;
};
