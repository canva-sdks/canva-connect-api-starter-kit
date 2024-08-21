import { AppBar, Container, Link, Toolbar } from "@mui/material";

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
        <Link href="/#/">
          <img src="/logo.png" alt="nourish-logo" />
        </Link>
      </Toolbar>
    </Container>
  </AppBar>
);
