import { AppBar, Container, Toolbar } from "@mui/material";

export const NavBar = () => (
  <AppBar
    position="fixed"
    sx={{
      background: (theme) => theme.palette.background.default,
      zIndex: (theme) => theme.zIndex.drawer + 1,
    }}
  >
    <Container maxWidth={false}>
      <Toolbar disableGutters={true}>
        <img src="/logo.png" alt="nourish-logo" />
      </Toolbar>
    </Container>
  </AppBar>
);
