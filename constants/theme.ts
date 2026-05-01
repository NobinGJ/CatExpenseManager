export const Colors = {
  light: {
    background: "#FFF9F5",
    surface: "#FFFFFF",
    surfaceAlt: "#FFF0E8",
    primary: "#E8A87C",
    primaryDark: "#D4896A",
    primaryLight: "#F5D5C0",
    secondary: "#C4A4D4",
    secondaryLight: "#E8D8F0",
    text: "#2D2D3A",
    textSecondary: "#8E8E9E",
    textTertiary: "#B8B8C8",
    border: "#F0E6DE",
    borderLight: "#F8F2ED",
    danger: "#E57373",
    dangerLight: "#FDECEA",
    success: "#81C784",
    successLight: "#E8F5E9",
    shadow: "#D4C4BA",
    tabBar: "#FFFFFF",
    tabBarInactive: "#C0B8B0",
  },
  dark: {
    background: "#1A1A2E",
    surface: "#25253D",
    surfaceAlt: "#2E2E48",
    primary: "#E8A87C",
    primaryDark: "#D4896A",
    primaryLight: "#3D3050",
    secondary: "#9B7DB8",
    secondaryLight: "#352E45",
    text: "#EAEAF0",
    textSecondary: "#8E8E9E",
    textTertiary: "#5E5E7E",
    border: "#3A3A52",
    borderLight: "#30304A",
    danger: "#EF5350",
    dangerLight: "#3D2020",
    success: "#66BB6A",
    successLight: "#1B3D1C",
    shadow: "#000000",
    tabBar: "#20203A",
    tabBarInactive: "#5E5E7E",
  },
};

export type ThemeColors = typeof Colors.light;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  hero: 36,
};
