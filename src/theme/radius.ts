export const radius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  '2xl': 16,
  '3xl': 20,
  full: 9999,

  card: 16,
  button: 12,
  chip: 10,
  icon: 12,
  input: 10,
} as const;

export type Radius = typeof radius;
