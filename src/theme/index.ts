import { lightColors, darkColors, ColorTokens } from './colors';
import { spacing, Spacing } from './spacing';
import { typography, Typography } from './typography';
import { radius, Radius } from './radius';
import { elevation, Elevation } from './elevation';
import { motion, Motion } from './motion';
import { shadows, Shadows } from './shadows';

export const theme = {
  colors: lightColors,
  spacing,
  typography,
  radius,
  elevation,
  motion,
  shadows,
};

export const darkTheme = {
  ...theme,
  colors: darkColors,
};

export type Theme = typeof theme;
export {
  lightColors,
  darkColors,
  spacing,
  typography,
  radius,
  elevation,
  motion,
  shadows,
  ColorTokens,
  Spacing,
  Typography,
  Radius,
  Elevation,
  Motion,
  Shadows,
};