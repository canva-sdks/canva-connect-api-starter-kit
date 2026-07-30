import { Card, Skeleton, Stack } from "@mui/material";

/**
 * Shimmer placeholder shown while products are loading. Matches the real
 * ProductCard footprint so the grid does not reflow when data arrives.
 */
export const SkeletonCard = ({ index = 0 }: { index?: number }) => (
  <Card
    variant="outlined"
    className="rise-in"
    style={{ ["--card-index" as string]: index }}
    sx={{
      height: "100%",
      backgroundColor: "inherit",
      border: "none",
      boxShadow: "none",
    }}
  >
    <Skeleton
      variant="rounded"
      height={260}
      animation="wave"
      sx={{
        borderRadius: 4,
        marginBottom: 2,
        bgcolor: "rgba(255,255,255,0.07)",
        transform: "none",
      }}
    />
    <Stack spacing={1}>
      <Skeleton
        variant="text"
        width="65%"
        height={28}
        animation="wave"
        sx={{ bgcolor: "rgba(255,255,255,0.07)" }}
      />
      <Skeleton
        variant="text"
        width="35%"
        animation="wave"
        sx={{ bgcolor: "rgba(255,255,255,0.07)" }}
      />
      <Skeleton
        variant="text"
        width="25%"
        animation="wave"
        sx={{ bgcolor: "rgba(255,255,255,0.07)" }}
      />
    </Stack>
  </Card>
);
