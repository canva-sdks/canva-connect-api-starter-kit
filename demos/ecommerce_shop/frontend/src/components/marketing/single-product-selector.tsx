import { useEffect, useState } from "react";
import type { SelectChangeEvent } from "@mui/material";
import {
  Box,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";
import { useAppContext } from "src/context";
import type { Product } from "src/models";
import { getProducts } from "src/services";
import { useCampaignContext } from "src/context";

export const SingleProductSelector = ({ disabled }: { disabled: boolean }) => {
  const { setErrors } = useAppContext();
  const { selectedProduct, setSelectedProduct } = useCampaignContext();
  const [isFetching, setIsFetching] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        try {
          const { products } = await getProducts();
          setProducts(products);
          setSelectedProduct(products[0]);
        } catch (error) {
          console.error(error);
          setErrors((prevState: string[]) =>
            prevState.concat("Something went wrong fetching products."),
          );
        }
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (event: SelectChangeEvent<number>) => {
    const selectedId = event.target.value as number;
    const filteredProduct = products.find(
      (product) => product.id === selectedId,
    );
    setSelectedProduct(filteredProduct);
  };

  if (isFetching) {
    return <Skeleton variant="rounded" height={57} sx={{ marginBottom: 4 }} />;
  }

  if (!products) {
    return <Typography variant="h6">No products found.</Typography>;
  }

  return (
    <Box marginBottom={2}>
      <FormControl fullWidth={true}>
        <InputLabel id="product-select-label">Product</InputLabel>
        <Select
          label="Product"
          labelId="product-select-label"
          onChange={handleChange}
          value={selectedProduct?.id || ""}
          renderValue={() => selectedProduct?.name || ""}
          disabled={disabled}
        >
          {products.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              <ListItemText primary={product.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
