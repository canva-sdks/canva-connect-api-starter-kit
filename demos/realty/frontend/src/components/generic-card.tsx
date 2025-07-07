import { Box, Card, Stack, Typography, useTheme } from "@mui/material";
import { ImageCarousel } from "src/components";

export type GenericCardProps = {
  title: string | React.ReactNode;
  alt: string;
  subtitle?: string;
  images: (string | undefined)[];
  imageHeight?: number;
  objectFit?: "contain" | "cover";
  badge?: React.ReactNode;
  features?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export const GenericCard = ({
  title,
  alt,
  subtitle,
  images,
  imageHeight = 240,
  objectFit = "contain",
  badge,
  features,
  children,
  className,
}: GenericCardProps) => {
  const theme = useTheme();

  // Filter out undefined images
  const validImages = images.filter((url) => url !== undefined);

  // Extract card styles for better readability
  const cardStyles = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    position: "relative",
    borderRadius: 3,
    boxShadow: "none",
    border: `1px solid ${theme.palette.divider}`,
  };

  return (
    <Card variant="outlined" sx={cardStyles} className={className}>
      <Box position="relative" p={2} pb={1}>
        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
          }}
        >
          <ImageCarousel
            images={validImages}
            alt={alt}
            height={imageHeight}
            borderRadius={2}
            objectFit={objectFit}
          />
        </Box>
        {badge}
      </Box>
      <Stack spacing={2} p={2} sx={{ flexGrow: 1 }}>
        <Box>
          {typeof title === "string" ? (
            <Typography variant="h6" fontWeight="bold" noWrap={true}>
              {title}
            </Typography>
          ) : (
            title
          )}
          {subtitle && (
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>

        {features && <Box>{features}</Box>}

        {children}
      </Stack>
    </Card>
  );
};
