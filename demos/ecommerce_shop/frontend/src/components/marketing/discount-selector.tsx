import {
  Box,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import { useCampaignContext } from "src/context";

export const DiscountSelector = ({ disabled }: { disabled: boolean }) => {
  const { selectedDiscount, setSelectedDiscount } = useCampaignContext();
  const discounts = ["5%", "10%", "15%", "20%"];

  return (
    <Box marginBottom={2}>
      <FormControl fullWidth={true}>
        <InputLabel id="discount-select-label">Discount</InputLabel>
        <Select
          label="Product"
          labelId="discount-select-label"
          onChange={(e) => setSelectedDiscount(e.target.value)}
          value={selectedDiscount}
          renderValue={() => selectedDiscount}
          disabled={disabled}
        >
          {discounts.map((discount) => (
            <MenuItem key={discount} value={discount}>
              <ListItemText primary={discount} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
