import { Tooltip, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CanvaIcon } from "src/components/canva-icon";
import { DemoButton } from "src/components/demo-button";
import { Paths } from "src/routes";
import { useCallback } from "react";

/**
 * Button component for creating a new property design with Canva
 * Navigates to the design configuration page when clicked
 */
export const CreateDesignButton = (): JSX.Element => {
  const navigate = useNavigate();
  const theme = useTheme();

  /**
   * Navigates to the design configuration page for the default property
   */
  const handleCreateDesign = useCallback(() => {
    // Navigate to the design configuration page with property ID 1 (default property)
    navigate(Paths.CONFIGURE_DESIGN.replace(":propertyId", "1"));
  }, [navigate]);

  // Button styling
  const buttonStyles = {
    ml: 2,
    borderRadius: 2,
    boxShadow: theme.shadows[1],
  };

  return (
    <Tooltip
      title="Create property designs with Canva"
      arrow={true}
      placement="top"
    >
      <DemoButton
        demoVariant="primary"
        size="small"
        startIcon={<CanvaIcon />}
        onClick={handleCreateDesign}
        sx={buttonStyles}
      >
        Create a Canva design
      </DemoButton>
    </Tooltip>
  );
};
