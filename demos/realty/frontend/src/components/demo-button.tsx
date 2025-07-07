import { Button as MUIButton, CircularProgress } from "@mui/material";
import type { ButtonProps as MUIButtonProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";

/**
 * Available button variants for the demo application
 */
export type DemoButtonVariant =
  | "primary"
  | "primaryOutlined"
  | "secondary"
  | "destructive";

/**
 * Props for the DemoButton component
 */
export interface DemoButtonProps extends Omit<MUIButtonProps, "variant"> {
  /** The variant style to apply to the button */
  demoVariant: DemoButtonVariant;
  /** Whether the button is in a loading state */
  loading?: boolean;
}

/**
 * Maps demo variants to Material-UI color props
 */
const DEMO_BUTTON_COLORS: Record<DemoButtonVariant, MUIButtonProps["color"]> = {
  primary: "primary",
  primaryOutlined: "primary",
  secondary: "secondary",
  destructive: "error",
};

/**
 * A standardized button component that provides consistent styling
 * and loading state handling across the application.
 *
 * @example
 * <DemoButton demoVariant="primary" onClick={handleClick}>
 *   Click Me
 * </DemoButton>
 */
export const DemoButton = ({
  demoVariant,
  loading = false,
  startIcon,
  endIcon,
  disabled,
  children,
  sx,
  ...remainingProps
}: DemoButtonProps): JSX.Element => {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  // Base styles for primary variant
  const primaryStyles: SxProps<Theme> = {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  };

  // Base styles for secondary and destructive variants
  const baseStyles: SxProps<Theme> = {
    textTransform: "none",
    fontWeight: 500,
    cursor: "pointer",
    borderRadius: 2,
    py: 1,
    fontSize: "0.875rem",
  };

  // Disabled styles
  const disabledStyles: SxProps<Theme> = isDisabled
    ? {
        backgroundColor: theme.palette.grey[300],
        cursor: "not-allowed",
        "&:disabled": {
          backgroundColor: theme.palette.grey[300],
        },
      }
    : {};

  return (
    <MUIButton
      variant="outlined"
      size="large"
      color={DEMO_BUTTON_COLORS[demoVariant]}
      disabled={isDisabled}
      startIcon={!loading && startIcon}
      endIcon={!loading && endIcon}
      sx={{
        ...baseStyles,
        ...(demoVariant === "primary" ? primaryStyles : {}),
        ...disabledStyles,
      }}
      {...remainingProps}
    >
      {loading ? <CircularProgress color="inherit" size={26} /> : children}
    </MUIButton>
  );
};
