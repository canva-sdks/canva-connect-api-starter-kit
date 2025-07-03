import { Box, Typography, Divider } from "@mui/material";
import { GenericCard, CanvaIcon, DemoButton } from "src/components";
import { useAppContext } from "src/context";
import type { Property } from "@realty-demo/shared-models";
import HotelIcon from "@mui/icons-material/Hotel";
import BathtubIcon from "@mui/icons-material/Bathtub";
import SquareFootIcon from "@mui/icons-material/SquareFoot";

export type PropertyCardProps = {
  property: Property;
  formatPrice: (price: number) => string;
  onClick: () => void;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "for-sale":
      return { color: "#4caf50", label: "For sale" };
    case "pending":
      return { color: "#ff9800", label: "Pending" };
    case "sold":
      return { color: "#f44336", label: "Sold" };
    case "for-rent":
      return { color: "#2196f3", label: "For rent" };
    case "leased":
      return { color: "#9c27b0", label: "Leased" };
    default:
      return { color: "#9e9e9e", label: "Unknown" };
  }
};

/**
 * Status badge component that displays property status with appropriate color
 */
const StatusBadge = ({ status }: { status: string }) => {
  const { color, label } = getStatusColor(status);

  return (
    <Box
      sx={{
        position: "absolute",
        top: 30,
        left: 30,
        bgcolor: "white",
        borderRadius: 16,
        px: 1.5,
        py: 0.5,
        display: "flex",
        alignItems: "center",
        gap: 1,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          bgcolor: color,
        }}
      />
      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.75rem" }}>
        {label}
      </Typography>
    </Box>
  );
};

/**
 * Property feature component (bedroom, bathroom, square feet)
 */
const PropertyFeature = ({
  icon,
  value,
  hasDivider = true,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  hasDivider?: boolean;
}) => (
  <>
    <Box display="flex" alignItems="center" gap={0.5}>
      {icon}
      <Typography variant="body2">{value}</Typography>
    </Box>
    {hasDivider && <Divider orientation="vertical" flexItem={true} />}
  </>
);

export const PropertyCard = ({
  property,
  formatPrice,
  onClick,
}: PropertyCardProps) => {
  const { isAuthorized } = useAppContext();

  // Get all available images (prioritize Canva design or use property images)
  const allImages = property.imageUrls.filter((url) => url !== undefined);

  const propertyFeatures = (
    <Box display="flex" gap={3}>
      <PropertyFeature
        icon={<HotelIcon fontSize="small" color="action" />}
        value={property.bedrooms}
      />
      <PropertyFeature
        icon={<BathtubIcon fontSize="small" color="action" />}
        value={property.bathrooms}
      />
      <PropertyFeature
        icon={<SquareFootIcon fontSize="small" color="action" />}
        value={`${property.squareFeet} SF`}
        hasDivider={false}
      />
    </Box>
  );

  const priceSection = (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h6" fontWeight="bold" noWrap={true}>
        {property.address}
      </Typography>
      <Typography variant="h6" fontWeight="bold">
        {formatPrice(property.price)}
      </Typography>
    </Box>
  );

  return (
    <GenericCard
      title={priceSection}
      alt={property.address}
      subtitle={`${property.city}, ${property.state} ${property.zipCode}`}
      images={allImages}
      objectFit="cover"
      badge={<StatusBadge status={property.status} />}
      features={propertyFeatures}
    >
      {isAuthorized && (
        <DemoButton
          demoVariant="primary"
          onClick={onClick}
          fullWidth={true}
          startIcon={<CanvaIcon />}
          sx={{ mt: 1 }}
        >
          Create a Canva design
        </DemoButton>
      )}
    </GenericCard>
  );
};
