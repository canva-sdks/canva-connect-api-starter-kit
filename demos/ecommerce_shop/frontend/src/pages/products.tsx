import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import {
  DeveloperNote,
  OpeningDesignModal,
  PageHeader,
  ProductCard,
} from "src/components";
import { useAppContext } from "src/context";
import type { Product } from "src/models";
import { EditInCanvaPageOrigins } from "src/models";
import {
  getProducts,
  uploadAssetAndCreateDesignFromProduct,
} from "src/services";
import { createNavigateToCanvaUrl } from "src/services/canva-return";

export const ProductsPage = () => {
  const { addAlert } = useAppContext();

  const [isModelOpen, setIsModelOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>();
  const [isFetching, setIsFetching] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsFetching(true);
        const getProductsResult = await getProducts();

        if (!getProductsResult.products.length) {
          addAlert({ title: "No products found.", variant: "error" });
        } else {
          setProducts(getProductsResult.products);
        }
      } catch (error) {
        console.error(error);
        addAlert({
          title: "Something went wrong fetching products.",
          variant: "error",
        });
      } finally {
        setIsFetching(false);
      }
    };
    fetchProducts();
  }, []);

  const handleEditInCanvaClick = async (product: Product) => {
    let canvaEditUrl: string;
    setIsModelOpen(true);

    try {
      if (!product.canvaDesign) {
        const createDesignFromProductResult =
          await uploadAssetAndCreateDesignFromProduct({ product });
        setProducts(createDesignFromProductResult.refreshedProducts);
        canvaEditUrl = createDesignFromProductResult.design.urls.edit_url;
      } else {
        canvaEditUrl = product.canvaDesign.designEditUrl;
      }

      setIsRedirecting(true);
      const navigateToCanvaUrl = createNavigateToCanvaUrl({
        editUrl: canvaEditUrl,
        correlationState: {
          originPage: EditInCanvaPageOrigins.PRODUCT,
          originProductId: product.id,
        },
      });
      window.open(navigateToCanvaUrl, "_self");
    } catch (error) {
      console.error(error);
      addAlert({
        title: "Something went wrong creating the design.",
        variant: "error",
      });
    }
  };

  const handleCloseModal = () => {
    setIsModelOpen(false);
  };

  return (
    <Box paddingY={2}>
      <PageHeader title="Products" />
      <Box position="relative" alignItems="center" display="flex" width={350}>
        <DeveloperNote info="The 'Edit in Canva' button navigates users to Canva with a 'correlation_state' of where they came from. On return to Nourish, the updated design is fetched and exported." />
      </Box>
      <Box>
        {!isFetching && (
          <>
            <Grid container={true} spacing={8} paddingTop={2} paddingBottom={4}>
              {products?.map((product) => (
                <Grid item={true} key={product.id} xs={12} sm={6} md={4} lg={4}>
                  <ProductCard
                    product={product}
                    onClick={() => handleEditInCanvaClick(product)}
                  />
                </Grid>
              ))}
            </Grid>
            <OpeningDesignModal
              isOpen={isModelOpen}
              onClose={handleCloseModal}
              isRedirecting={isRedirecting}
            />
          </>
        )}
      </Box>
    </Box>
  );
};
