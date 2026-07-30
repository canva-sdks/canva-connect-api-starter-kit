import { Box, Card, Skeleton, Stack } from "@mui/material";

/**
 * Shimmer placeholder shown while listings are loading. Matches the real
 * PropertyCard footprint so the grid does not reflow when data arrives.
 */
export const SkeletonCard = ({ index = 0 }: { index?: number }) => (
  <Card
    variant="outlined"
    className="rise-in"
    style={{ ["--card-index" as string]: index }}
    sx={{
      height: "100%",
      borderRadius: "16px",
      border: "1px solid rgba(2, 2, 73, 0.10)",
      boxShadow: "0 2px 10px rgba(2, 2, 73, 0.06)",
      backgroundColor: "white",
    }}
  >
    <Box p={2} pb={1}>
      <Skeleton
        variant="rounded"
        height={240}
        sx={{ borderRadius: "12px", transform: "none" }}
        animation="wave"
      />
    </Box>
    <Stack spacing={1.2} p={2}>
      <Box display="flex" justifyContent="space-between">
        <Skeleton variant="text" width="55%" height={28} animation="wave" />
        <Skeleton variant="text" width="25%" height={28} animation="wave" />
      </Box>
      <Skeleton variant="text" width="40%" animation="wave" />
      <Box display="flex" gap={2} pt={1}>
        <Skeleton variant="rounded" width={44} height={22} animation="wave" />
        <Skeleton variant="rounded" width={44} height={22} animation="wave" />
        <Skeleton variant="rounded" width={60} height={22} animation="wave" />
      </Box>
    </Stack>
  </Card>
);
