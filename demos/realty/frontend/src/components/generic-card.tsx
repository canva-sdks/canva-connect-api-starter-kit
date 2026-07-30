import { Box, Card, Stack, Typography, useTheme } from "@mui/material";
import { ImageCarousel } from "src/components";
import { motion } from "src/theme";

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
  /** Index used to stagger the entrance animation across a grid. */
  index?: number;
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
  index = 0,
}: GenericCardProps) => {
  const theme = useTheme();

  const validImages = images.filter((url) => url !== undefined);

  const cardStyles = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    position: "relative",
    borderRadius: "16px",
    boxShadow: "0 2px 10px rgba(2, 2, 73, 0.06)",
    border: `1px solid ${theme.palette.divider}`,
    transition: `transform ${motion.base} ${motion.spring}, box-shadow ${motion.base} ${motion.ease}, border-color ${motion.base} ${motion.ease}`,
    willChange: "transform",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 22px 48px -18px rgba(2, 2, 73, 0.45)",
      borderColor: "rgba(2, 2, 73, 0.22)",
    },
    // Image zoom on hover (image lives inside .gc-media below).
    "&:hover .gc-media": {
      transform: "scale(1.06)",
    },
  };

  return (
    <Card
      variant="outlined"
      sx={cardStyles}
      className={`rise-in ${className ?? ""}`}
      style={{ ["--card-index" as string]: index }}
    >
      <Box position="relative" p={2} pb={1}>
        <Box
          sx={{
            backgroundColor: "#f3f6fa",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <Box
            className="gc-media"
            sx={{
              transition: `transform ${motion.slow} ${motion.ease}`,
              willChange: "transform",
            }}
          >
            <ImageCarousel
              images={validImages}
              alt={alt}
              height={imageHeight}
              borderRadius={1.5}
              objectFit={objectFit}
            />
          </Box>
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
