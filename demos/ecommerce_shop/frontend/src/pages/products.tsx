import { useState, useEffect } from "react";
import type { Design } from "@canva/connect-api-ts/types.gen";
import { Box, Grid } from "@mui/material";
import { SuccessfulDesignModal, PageHeader, ProductCard } from "src/components";
import { useAppContext } from "src/context";
import type { Product } from "src/models";
import {
  getProducts,
  uploadAssetAndCreateDesignFromProduct,
} from "src/services";

export const ProductsPage = () => {
  const { setErrors } = useAppContext();

  const [isModelOpen, setIsModelOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>();
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createdDesign, setCreatedDesign] = useState<Design | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsFetching(true);
        const getProductsResult = await getProducts();

        if (!getProductsResult.products.length) {
          setErrors((prevState) => prevState.concat("No products found."));
        } else {
          setProducts(getProductsResult.products);
        }
      } catch (error) {
        console.error(error);
        setErrors((prevState) =>
          prevState.concat("Something went wrong fetching products."),
        );
      } finally {
        setIsFetching(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCreateDesignClick = async (product: Product) => {
    setIsLoading(true);
    setIsModelOpen(true);

    try {
      const design = await uploadAssetAndCreateDesignFromProduct({
        product,
      });
      setCreatedDesign(design);
    } catch (error) {
      console.error(error);
      setErrors((prevState) =>
        prevState.concat("Something went wrong creating the design."),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModelOpen(false);
    setCreatedDesign(undefined);
  };

  return (
    <Box paddingY={2}>
      <PageHeader title="Products" />
      {!isFetching && (
        <>
          <Grid container={true} spacing={8} marginBottom={4}>
            {products?.map((product) => (
              <Grid item={true} key={product.id} xs={12} sm={6} md={4} lg={4}>
                <ProductCard
                  product={product}
                  onClick={() => handleCreateDesignClick(product)}
                />
              </Grid>
            ))}
          </Grid>
          <SuccessfulDesignModal
            isOpen={isModelOpen}
            isLoading={isLoading}
            createdDesign={createdDesign}
            onClose={handleCloseModal}
          />
        </>
      )}
    </Box>
  );
};
