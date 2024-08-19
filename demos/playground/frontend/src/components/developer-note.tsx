import { HelpOutline } from "@mui/icons-material";
import { Chip, Tooltip } from "@mui/material";

export const DeveloperNote = ({ info }: { info: string }) => (
  <Tooltip title={info} arrow={true}>
    <Chip
      variant="outlined"
      color="warning"
      label="Developer note"
      icon={<HelpOutline sx={{ width: "29px", height: "29px" }} />}
      sx={{
        width: "100%",
        justifyContent: "start",
        gap: 1,
        fontFamily: "monospace",
        paddingX: 1,
        paddingY: 3,
        borderRadius: "12px",
        borderColor: "transparent",
        background: (theme) => theme.palette.warning.backgroundBase,
        "&:hover": {
          color: (theme) => theme.palette.warning.light,
          borderColor: (theme) => theme.palette.warning.light,
          cursor: "help",
          background: (theme) => theme.palette.warning.backgroundHover,
        },
      }}
    />
  </Tooltip>
);
