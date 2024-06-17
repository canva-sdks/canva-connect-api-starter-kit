import { Link as RouterLink, useLocation } from "react-router-dom";
import { Breadcrumbs, Link, Grid, Typography, Stack } from "@mui/material";

export const PageDescriptor = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <Grid item={true} xs={4}>
    <Stack spacing={4}>
      <BreadcrumbLinks currentPageTitle={title} />
      <Typography variant="h4">{title}</Typography>
      <Typography variant="body2">{description}</Typography>
    </Stack>
  </Grid>
);

const BreadcrumbLinks = ({
  currentPageTitle,
}: {
  currentPageTitle: string;
}) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb">
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          return isLast ? (
            <Typography color="text.primary" key={to} aria-current="page">
              {currentPageTitle}
            </Typography>
          ) : (
            <Link
              underline="hover"
              color="inherit"
              component={RouterLink}
              to={to}
              key={to}
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Link>
          );
        })}
      </Breadcrumbs>
    </div>
  );
};
