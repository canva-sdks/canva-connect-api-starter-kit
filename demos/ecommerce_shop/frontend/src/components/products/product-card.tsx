import { Box, Card, CardMedia, Stack, Typography } from "@mui/material";
import { CanvaIcon, DemoButton } from "src/components";
import type { Product } from "src/models";

export const ProductCard = ({
  product,
  onClick,
}: {
  product: Product;
  onClick: () => void;
}) => (
  <Card
    variant="outlined"
    sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "inherit",
      border: "none",
      position: "relative",
      "&:hover .overlayButton": {
        opacity: 1,
        background: (theme) => theme.palette.background.paper,
      },
    }}
  >
    <Box position="relative">
      <CardMedia
        component="img"
        image={product.canvaDesign?.designExportUrl ?? product.imageUrl}
        alt={product.name}
        sx={{
          borderRadius: 3,
          marginBottom: 2,
        }}
      />
      {product.canvaDesign?.designEditUrl && (
        <Box
          sx={{
            position: "absolute",
            bottom: 24,
            left: 8,
            opacity: 0.7,
            background: (theme) => theme.palette.background.default,
          }}
          display="flex"
          alignItems="center"
          gap={1}
          px={1}
          py={1}
          borderRadius={3}
        >
          <CanvaIcon />
          <Typography>Recently Edited</Typography>
        </Box>
      )}
      <DemoButton
        demoVariant="primary"
        onClick={onClick}
        className="overlayButton"
        startIcon={<CanvaIcon />}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          opacity: 0,
          background: (theme) => theme.palette.background.default,
          transition: "opacity 0.3s ease",
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
