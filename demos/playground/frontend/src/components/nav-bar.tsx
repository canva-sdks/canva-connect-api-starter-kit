import { AppBar, Container, Toolbar, Typography } from "@mui/material";

export const NavBar = () => (
  <AppBar
    position="fixed"
    sx={{
      background: (theme) => theme.palette.background.default,
      color: (theme) => theme.palette.text.primary,
      zIndex: (theme) => theme.zIndex.drawer + 1,
    }}
  >
    <Container maxWidth={false}>
      <Toolbar disableGutters={true}>
        <Typography variant="h4">Connect API Playground</Typography>
      </Toolbar>
    </Container>
  </AppBar>
);
