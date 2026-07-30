import { Button as MUIButton, CircularProgress } from "@mui/material";
import type { ButtonProps as MUIButtonProps } from "@mui/material";
import type { JSX } from "react";

/**
 * Available button variants for the demo application.
 * - primary: contained ink (dark) button — primary actions
 * - primaryOutlined: outlined ink button — secondary/ghost actions
 * - secondary: contained Canva gradient button — prominent CTAs
 * - destructive: error-coloured button — destructive actions
 */
export type DemoButtonVariant =
  | "primary"
  | "primaryOutlined"
  | "secondary"
  | "destructive";

export interface DemoButtonProps extends Omit<MUIButtonProps, "variant"> {
  demoVariant: DemoButtonVariant;
  loading?: boolean;
}

const DEMO_BUTTON_COLORS: Record<DemoButtonVariant, MUIButtonProps["color"]> = {
  primary: "primary",
  primaryOutlined: "primary",
  secondary: "secondary",
  destructive: "error",
};

const DEMO_BUTTON_VARIANTS: Record<
  DemoButtonVariant,
  MUIButtonProps["variant"]
> = {
  primary: "contained",
  primaryOutlined: "outlined",
  secondary: "contained",
  destructive: "outlined",
};

export const DemoButton = ({
  demoVariant,
  loading = false,
  startIcon,
  endIcon,
  disabled,
  children,
  ...remainingProps
}: DemoButtonProps): JSX.Element => {
  return (
    <MUIButton
      variant={DEMO_BUTTON_VARIANTS[demoVariant]}
      size="large"
      color={DEMO_BUTTON_COLORS[demoVariant]}
      disabled={disabled || loading}
      startIcon={!loading && startIcon}
      endIcon={!loading && endIcon}
      {...remainingProps}
    >
      {loading ? <CircularProgress color="inherit" size={24} /> : children}
    </MUIButton>
  );
};
