import type { BrandTemplate } from "@canva/connect-api-ts/types.gen";
import {
  Box,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCampaignContext } from "src/context";

export const BrandTemplatesStack = () => {
  const { selectedBrandTemplates, setSelectedBrandTemplates } =
    useCampaignContext();

  const handleRemove = (brandTemplate: BrandTemplate) => {
    const newSelectedBrandTemplates = selectedBrandTemplates.filter(
      (template) => template.id !== brandTemplate.id,
    );
    setSelectedBrandTemplates(newSelectedBrandTemplates);
  };

  return (
    <Stack spacing={2}>
      {selectedBrandTemplates.map((brandTemplate) => (
        <Box
          key={brandTemplate.id}
          display="flex"
          padding={2}
          borderRadius={2}
          position="relative"
        >
          <CardMedia
            component="img"
            sx={{
              width: 100,
              height: 100,
              borderRadius: 2,
              objectFit: "contain",
              bgcolor: "#302e35",
            }}
            image={
              brandTemplate.thumbnail?.url ||
              "https://placehold.co/100x100/000000/FFF"
            }
            alt={`${brandTemplate.title}-image`}
          />
          <Box display="flex" flexDirection="column" flex="1 0 auto">
            <CardContent>
              <Typography variant="h6">{brandTemplate.title}</Typography>
            </CardContent>
          </Box>
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              top: 32,
              right: 8,
            }}
            onClick={() => handleRemove(brandTemplate)}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      ))}
    </Stack>
  );
};
