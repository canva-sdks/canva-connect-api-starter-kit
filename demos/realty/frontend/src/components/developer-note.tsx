import { HelpOutline } from "@mui/icons-material";
import { Chip, Tooltip, useTheme } from "@mui/material";

/**
 * Props for the DeveloperNote component
 */
type DeveloperNoteProps = {
  /** Information to display in the tooltip */
  info: React.ReactNode;
};

/**
 * A component that displays developer notes with tooltips
 * Used to provide additional context or explanations in the UI
 *
 * @example
 * <DeveloperNote info="This is how the Connect API integration works" />
 */
export const DeveloperNote = ({ info }: DeveloperNoteProps): JSX.Element => {
  const theme = useTheme();

  // Extract styles for better organization and readability
  const chipStyles = {
    width: "100%",
    justifyContent: "start",
    gap: 1,
    fontFamily: "monospace",
    paddingX: 1,
    paddingY: 3,
    borderRadius: "12px",
    borderColor: "transparent",
    background: theme.palette.warning.backgroundBase,
    "&:hover": {
      color: theme.palette.warning.light,
      borderColor: theme.palette.warning.light,
      cursor: "help",
      background: theme.palette.warning.backgroundHover,
    },
  };

  return (
    <Tooltip
      title={info}
      arrow={true}
      placement="top"
      enterTouchDelay={0}
      leaveTouchDelay={3000}
    >
      <Chip
        variant="outlined"
        color="warning"
        label="Developer note"
        icon={<HelpOutline sx={{ width: "29px", height: "29px" }} />}
        sx={chipStyles}
        aria-label="Developer note with additional information"
        role="note"
      />
    </Tooltip>
  );
};
