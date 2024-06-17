import { Button as MUIButton, CircularProgress } from "@mui/material";
import type { ButtonProps as MUIButtonProps } from "@mui/material";

type DemoButtonVariant = "primary" | "secondary" | "destructive";

interface DemoButtonProps extends MUIButtonProps {
  demoVariant: DemoButtonVariant;
  loading?: boolean;
  // ... add more project specific props here if should be extended.
}

const DEMO_BUTTON_COLORS: Record<DemoButtonVariant, MUIButtonProps["color"]> = {
  primary: "primary", // See src/theme.ts: theme.palette.primary.main (green)
  secondary: "secondary", // See src/theme.ts: theme.palette.secondary.main (white)
  destructive: "error", // See src/theme.ts: theme.palette.error.main (purple)
};

/**
 * DemoButton - implemented for consistent button theming across the e-commerce_shop.
 * @param props - follows all the native MUIButtonProps from material-ui plus project
 *  specific props. E.g. demoVariant.
 * @returns the JSX Element that can be used with the demo shop styles baked in
 */
export const DemoButton = ({
  ...demoButtonProps
}: DemoButtonProps): JSX.Element => {
  const {
    demoVariant,
    loading,
    // Override different usage of MUIButtonProps by force unpacking different props here:
    variant,
    startIcon,
    endIcon,
    disabled,
    children,
    ...remainingProps
  } = demoButtonProps;
  return (
    <MUIButton
      variant="outlined"
      size="large"
      color={DEMO_BUTTON_COLORS[demoVariant]}
      disabled={disabled || loading}
      startIcon={!loading && startIcon}
      endIcon={!loading && endIcon}
      {...remainingProps}
    >
      {loading ? <CircularProgress color="inherit" size={26} /> : children}
    </MUIButton>
  );
};
