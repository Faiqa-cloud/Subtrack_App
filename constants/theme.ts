export const colors = {
  background: "#FFFFFF",
  primary: "#111827",
  accent: "#3B82F6",
  surface: "#F3F4F6",
  softBlue: "#EEF4FF",
  border: "#E5E7EB",
  success: "#D1FAE5",
  successIcon: "#059669",
  blue: "#3B82F6",
  amber: "#F59E0B",
  teal: "#0D9488",
  orange: "#F97316",
} as const;

export const spacing = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const components = {
  tabBar: {
    height: 72,
    radius: 32,
    horizontalInset: 20,
    iconFrame: 40,
  },
} as const;

export const theme = {
  colors,
  spacing,
  components,
} as const;
