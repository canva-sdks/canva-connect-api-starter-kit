import { Box, Card, CardMedia, Stack, Typography } from "@mui/material";
import { CanvaIcon, DemoButton } from "src/components";
import type { Product } from "src/models";
import { motion } from "src/theme";

export const ProductCard = ({
  product,
  onClick,
  index = 0,
}: {
  product: Product;
  onClick: () => void;
  index?: number;
}) => (
  <Card
    variant="outlined"
    className="rise-in"
    style={{ ["--card-index" as string]: index }}
    sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "inherit",
      border: "none",
      position: "relative",
      transition: `transform ${motion.base} ${motion.spring}`,
      willChange: "transform",
      "&:hover": {
        transform: "translateY(-8px)",
      },
      "&:hover .product-media": {
        transform: "scale(1.07)",
      },
      "&:hover .product-media-frame": {
        boxShadow: "0 22px 48px -18px rgba(47, 169, 104, 0.55)",
      },
      "&:hover .overlayButton": {
        opacity: 1,
        background: (theme) => theme.palette.background.paper,
      },
    }}
  >
    <Box
      className="product-media-frame"
      position="relative"
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        marginBottom: 2,
        transition: `box-shadow ${motion.base} ${motion.ease}`,
      }}
    >
      <CardMedia
        component="img"
        className="product-media"
        image={product.canvaDesign?.designExportUrl ?? product.imageUrl}
        alt={product.name}
        sx={{
          display: "block",
          transition: `transform ${motion.slow} ${motion.ease}`,
          willChange: "transform",
        }}
      />
      {product.canvaDesign?.designEditUrl && (
        <Box
          sx={{
            position: "absolute",
            bottom: 12,
            left: 12,
            backdropFilter: "blur(6px)",
            background: "rgba(0, 0, 0, 0.5)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
          display="flex"
          alignItems="center"
          gap={1}
          px={1.2}
          py={0.8}
          borderRadius={3}
        >
          <CanvaIcon />
          <Typography variant="body2">Recently edited</Typography>
        </Box>
      )}
      <DemoButton
        demoVariant="primary"
        onClick={onClick}
        className="overlayButton"
        startIcon={<CanvaIcon />}
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          opacity: 0,
          background: (theme) => theme.palette.background.default,
          transition: `opacity ${motion.base} ${motion.ease}, transform ${motion.base} ${motion.spring}`,
          "&:hover": {
            background: (theme) => theme.palette.background.default,
            color: (theme) => theme.palette.primary.light,
          },
          "&:focus": { opacity: 1 },
        }}
      >
        EDIT IN CANVA
      </DemoButton>
    </Box>
    <Stack spacing={1}>
      <Typography variant="h6">{product.name}</Typography>
      <Typography variant="body2" color="textSecondary">
        Unpublished
      </Typography>
      <Typography variant="body2" color="textSecondary">
        ${product.price.toFixed(2)}
      </Typography>
    </Stack>
  </Card>
);
