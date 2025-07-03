import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Slider,
  Typography,
  InputAdornment,
  type SelectChangeEvent,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { memo, useCallback } from "react";

/**
 * Property filter state interface
 */
export type PropertyFilters = {
  /** Search text query for address */
  searchQuery: string;
  /** Minimum number of bedrooms */
  bedrooms: string;
  /** Minimum number of bathrooms */
  bathrooms: string;
  /** Price range as [min, max] */
  priceRange: [number, number];
  /** Square footage range as [min, max] */
  sqFootageRange: [number, number];
};

/**
 * Props for the PropertyFilters component
 */
type PropertyFiltersProps = {
  /** Current filter values */
  filters: PropertyFilters;
  /** Callback when filters change */
  onFiltersChange: (filters: PropertyFilters) => void;
  /** Overall price range bounds [min, max] */
  priceRange: [number, number];
  /** Overall square footage bounds [min, max] */
  sqFootageRange: [number, number];
};

/**
 * Component that provides filters for property listings
 * Includes search, bedrooms/bathrooms selectors and price/area range sliders
 */
export const PropertyFilters = memo(
  ({
    filters,
    onFiltersChange,
    priceRange,
    sqFootageRange,
  }: PropertyFiltersProps): JSX.Element => {
    const theme = useTheme();
    /**
     * Handle search input changes
     */
    const handleSearchChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({ ...filters, searchQuery: event.target.value });
      },
      [filters, onFiltersChange],
    );

    /**
     * Handle bedroom filter changes
     */
    const handleBedroomChange = useCallback(
      (event: SelectChangeEvent<string>) => {
        onFiltersChange({ ...filters, bedrooms: event.target.value });
      },
      [filters, onFiltersChange],
    );

    /**
     * Handle bathroom filter changes
     */
    const handleBathroomChange = useCallback(
      (event: SelectChangeEvent<string>) => {
        onFiltersChange({ ...filters, bathrooms: event.target.value });
      },
      [filters, onFiltersChange],
    );

    /**
     * Handle price range slider changes
     */
    const handlePriceRangeChange = useCallback(
      (_event: Event, newValue: number | number[]) => {
        onFiltersChange({
          ...filters,
          priceRange: newValue as [number, number],
        });
      },
      [filters, onFiltersChange],
    );

    /**
     * Handle square footage slider changes
     */
    const handleSqFootageRangeChange = useCallback(
      (_event: Event, newValue: number | number[]) => {
        onFiltersChange({
          ...filters,
          sqFootageRange: newValue as [number, number],
        });
      },
      [filters, onFiltersChange],
    );

    /**
     * Format price as USD currency
     */
    const formatPrice = useCallback((value: number): string => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }, []);

    /**
     * Format square footage with SF unit
     */
    const formatSqFootage = useCallback((value: number): string => {
      return `${value.toLocaleString()} SF`;
    }, []);

    // Input field styling
    const inputStyles = {
      "& .MuiOutlinedInput-root": {
        backgroundColor: "white",
        borderRadius: theme.shape.borderRadius,
        "&.Mui-focused": {
          "& fieldset": {
            borderColor: theme.palette.primary.main,
            borderWidth: 2,
          },
        },
      },
    };

    // Slider styling
    const sliderStyles = {
      color: theme.palette.primary.main,
      height: 6,
      "& .MuiSlider-thumb": {
        width: 16,
        height: 16,
      },
    };

    return (
      <Box paddingBottom={2}>
        <Grid container={true} spacing={3}>
          <Grid item={true} xs={12}>
            <TextField
              fullWidth={true}
              placeholder="Search by address or location"
              value={filters.searchQuery}
              onChange={handleSearchChange}
              sx={inputStyles}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                "aria-label": "Search properties",
              }}
            />
          </Grid>
          <Grid item={true} xs={12} sm={6} md={3}>
            <FormControl fullWidth={true} sx={inputStyles}>
              <InputLabel id="bedrooms-label">Bedrooms</InputLabel>
              <Select
                labelId="bedrooms-label"
                value={filters.bedrooms}
                label="Bedrooms"
                onChange={handleBedroomChange}
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="1">1+</MenuItem>
                <MenuItem value="2">2+</MenuItem>
                <MenuItem value="3">3+</MenuItem>
                <MenuItem value="4">4+</MenuItem>
                <MenuItem value="5">5+</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item={true} xs={12} sm={6} md={3}>
            <FormControl fullWidth={true} sx={inputStyles}>
              <InputLabel id="bathrooms-label">Bathrooms</InputLabel>
              <Select
                labelId="bathrooms-label"
                value={filters.bathrooms}
                label="Bathrooms"
                onChange={handleBathroomChange}
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="1">1+</MenuItem>
                <MenuItem value="2">2+</MenuItem>
                <MenuItem value="3">3+</MenuItem>
                <MenuItem value="4">4+</MenuItem>
                <MenuItem value="5">5+</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item={true} xs={12} md={3}>
            <Typography gutterBottom={true} fontWeight="medium">
              Price range
            </Typography>
            <Slider
              value={filters.priceRange}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              min={priceRange[0]}
              max={priceRange[1]}
              step={50000}
              valueLabelFormat={formatPrice}
              sx={sliderStyles}
              aria-labelledby="price-range-slider"
            />
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography variant="caption" color="text.secondary">
                {formatPrice(filters.priceRange[0])}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatPrice(filters.priceRange[1])}
              </Typography>
            </Box>
          </Grid>
          <Grid item={true} xs={12} md={3}>
            <Typography gutterBottom={true} fontWeight="medium">
              Square footage
            </Typography>
            <Slider
              value={filters.sqFootageRange}
              onChange={handleSqFootageRangeChange}
              valueLabelDisplay="auto"
              min={sqFootageRange[0]}
              max={sqFootageRange[1]}
              step={100}
              valueLabelFormat={formatSqFootage}
              sx={sliderStyles}
              aria-labelledby="square-footage-slider"
            />
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography variant="caption" color="text.secondary">
                {formatSqFootage(filters.sqFootageRange[0])}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatSqFootage(filters.sqFootageRange[1])}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  },
);
