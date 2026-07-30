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
  /** Index used to stagger the card entrance animation. */
  index?: number;
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

const StatusBadge = ({ status }: { status: string }) => {
  const { color, label } = getStatusColor(status);

  return (
    <Box
      sx={{
        position: "absolute",
        top: 28,
        left: 28,
        bgcolor: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(6px)",
        borderRadius: "2px",
        px: 1.25,
        py: 0.5,
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        boxShadow: "0 4px 14px -4px rgba(26, 31, 43, 0.3)",
      }}
    >
      <Box
        sx={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          bgcolor: color,
        }}
      />
      <Typography
        variant="overline"
        sx={{
          fontWeight: 700,
          fontSize: "0.62rem",
          lineHeight: 1,
          letterSpacing: "0.12em",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

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
  index = 0,
}: PropertyCardProps) => {
  const { isAuthorized } = useAppContext();

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

  // Price is the hero element — leads the card hierarchy so buyers see the
  // number at a glance before reading the address.
  const priceSection = (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontFamily: (t) => t.typography.h5.fontFamily,
          fontWeight: 600,
          color: "primary.main",
          lineHeight: 1.1,
        }}
      >
        {formatPrice(property.price)}
      </Typography>
      <Typography
        noWrap={true}
        sx={{
          mt: 0.75,
          fontSize: "0.9rem",
          fontWeight: 600,
          color: "text.primary",
        }}
      >
        {property.address}
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
      index={index}
    >
      {isAuthorized && (
        <DemoButton
          demoVariant="secondary"
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
