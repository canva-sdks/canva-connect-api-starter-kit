import { Box, Grid, Link } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import {
  DeveloperNote,
  OpeningDesignModal,
  PageHeader,
  PropertyCard,
} from "src/components";
import {
  PropertyFilters,
  type PropertyFilters as PropertyFiltersType,
} from "src/components/properties/property-filters";
import { useAppContext } from "src/context";
import type { Property } from "@realty-demo/shared-models";
import { getProperties } from "src/services";
import { useNavigate } from "react-router-dom";
import { Paths } from "../routes";

export const PropertiesPage = () => {
  const { addAlert, isAuthorized } = useAppContext();
  const [properties, setProperties] = useState<Property[]>();
  const [isFetching, setIsFetching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();

  // Calculate initial price and square footage ranges
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [sqFootageRange, setSqFootageRange] = useState<[number, number]>([
    0, 5000,
  ]);

  // Initialize filters
  const [filters, setFilters] = useState<PropertyFiltersType>({
    searchQuery: "",
    bedrooms: "",
    bathrooms: "",
    priceRange: [0, 1000000],
    sqFootageRange: [0, 5000],
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsFetching(true);
        const getPropertiesResult = await getProperties();

        if (!getPropertiesResult.properties.length) {
          addAlert({ title: "No properties found.", variant: "error" });
        } else {
          setProperties(getPropertiesResult.properties);

          // Update price and square footage ranges based on actual data
          const prices = getPropertiesResult.properties.map((p) => p.price);
          const sqFootages = getPropertiesResult.properties.map(
            (p) => p.squareFeet,
          );

          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          const minSqFt = Math.min(...sqFootages);
          const maxSqFt = Math.max(...sqFootages);

          setPriceRange([minPrice, maxPrice]);
          setSqFootageRange([minSqFt, maxSqFt]);

          setFilters((prev) => ({
            ...prev,
            priceRange: [minPrice, maxPrice],
            sqFootageRange: [minSqFt, maxSqFt],
          }));
        }
      } catch (error) {
        console.error(error);
        addAlert({
          title: "Something went wrong fetching properties.",
          variant: "error",
        });
      } finally {
        setIsFetching(false);
      }
    };
    fetchProperties();
  }, []);

  const onPropertyCardClick = async (property: Property) => {
    if (!isAuthorized) {
      addAlert({
        title: "Please connect with Canva to edit property designs",
        variant: "warning",
      });
      return;
    }

    setIsRedirecting(true);

    navigate(Paths.CONFIGURE_DESIGN, {
      state: {
        propertyId: property.id,
      },
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Filter properties based on current filters
  const filteredProperties = useMemo(() => {
    if (!properties) return [];

    return properties.filter((property) => {
      // Search query filter
      const searchMatch = property.address
        .toLowerCase()
        .includes(filters.searchQuery.toLowerCase());

      // Bedroom filter
      const bedroomMatch =
        !filters.bedrooms ||
        property.bedrooms >= parseInt(filters.bedrooms, 10);

      // Bathroom filter
      const bathroomMatch =
        !filters.bathrooms ||
        property.bathrooms >= parseInt(filters.bathrooms, 10);

      // Price range filter
      const priceMatch =
        property.price >= filters.priceRange[0] &&
        property.price <= filters.priceRange[1];

      // Square footage filter
      const sqFootageMatch =
        property.squareFeet >= filters.sqFootageRange[0] &&
        property.squareFeet <= filters.sqFootageRange[1];

      return (
        searchMatch &&
        bedroomMatch &&
        bathroomMatch &&
        priceMatch &&
        sqFootageMatch
      );
    });
  }, [properties, filters]);

  return (
    <Box paddingY={2}>
      <PageHeader title="Listings" />
      {!isAuthorized && (
        <Box position="relative" alignItems="center" display="flex" width={350}>
          <DeveloperNote
            info={
              <>
                Set up an integration before connecting to Canva via the{" "}
                <Link
                  sx={{ textDecoration: "underline", color: "inherit" }}
                  href="https://www.canva.com/developers/integrations"
                  target="_blank"
                >
                  Developer Portal
                </Link>
              </>
            }
          />
        </Box>
      )}
      {!isFetching && (
        <Box paddingTop={2}>
          <PropertyFilters
            filters={filters}
            onFiltersChange={setFilters}
            priceRange={priceRange}
            sqFootageRange={sqFootageRange}
          />
          <Grid container={true} spacing={2} paddingTop={2} paddingBottom={2}>
            {filteredProperties.map((property) => (
              <Grid item={true} key={property.id} xs={12} sm={6} md={4} lg={4}>
                <PropertyCard
                  property={property}
                  formatPrice={formatPrice}
                  onClick={() => onPropertyCardClick(property)}
                />
              </Grid>
            ))}
          </Grid>
          <OpeningDesignModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            isRedirecting={isRedirecting}
          />
        </Box>
      )}
    </Box>
  );
};
