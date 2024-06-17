import { Paper } from "@mui/material";

export const FormPaper = ({ children }: { children: React.ReactNode }) => (
  <Paper
    variant="outlined"
    sx={{
      borderRadius: 1,
      paddingX: 2,
      paddingY: 4,
    }}
  >
    {children}
  </Paper>
);
