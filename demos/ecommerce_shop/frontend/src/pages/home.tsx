import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { BarChart } from "@mui/icons-material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { ConnectButton, DemoSalesChart, DeveloperNote } from "src/components";
import { useAppContext } from "src/context";

export const HomePage = () => {
  const { displayName } = useAppContext();

  return (
    <>
      <Box className="fade-up" mb={3}>
        <Typography
          variant="overline"
          sx={{ color: "primary.light", display: "block", mb: 0.5 }}
        >
          Nourish · Wellness Co.
        </Typography>
        <Typography variant="h4" sx={{ lineHeight: 1.05 }}>
          {displayName ? `Good day, ${displayName}.` : `Good day.`}
        </Typography>
      </Box>
      <HomeTiles />
    </>
  );
};

const placeholderStats: {
  icon: React.ReactNode;
  title: string;
  label: string;
  number: string;
  changePct: number;
}[] = [
  {
    icon: <ShoppingCartOutlinedIcon fontSize="small" />,
    title: "Abandoned carts",
    label: "This week",
    number: "20",
    changePct: 0.1,
  },
  {
    icon: <PeopleAltOutlinedIcon fontSize="small" />,
    title: "Active customers",
    label: "This week",
    number: "1,250",
    changePct: 0.15,
  },
  {
    icon: <ShoppingBagOutlinedIcon fontSize="small" />,
    title: "All orders",
    label: "This week",
    number: "10",
    changePct: -0.1,
  },
];

const HomeTiles = () => (
  <Grid
    container={true}
    spacing={2.5}
    alignItems="stretch"
    direction="row"
    justifyContent="stretch"
  >
    {placeholderStats.map(({ icon, title, label, number, changePct }, i) => (
      <Grid key={title} item={true} xs={12} sm={4}>
        <StatTile
          icon={icon}
          title={title}
          label={label}
          number={number}
          changePct={changePct}
          index={i}
        />
      </Grid>
    ))}
    <Grid item={true} xs={12} md={8}>
      <InfoPaper
        icon={<BarChart fontSize="small" />}
        label="This year"
        title="Sales summary"
        Content={<DemoSalesChart />}
      />
    </Grid>
    <Grid item={true} xs={12} md={4} display="flex">
      <ConnectToCanvaCta />
    </Grid>
  </Grid>
);

const toFormattedPercentage = (decimal: number) => {
  const percentage = Math.round(decimal * 100);
  const sign = percentage >= 0 ? "+" : "";
  return `${sign}${percentage}%`;
};

/** A statistic tile with strong number hierarchy and a trend pill. */
const StatTile = ({
  icon,
  title,
  label,
  number,
  changePct,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  label: string;
  number: string;
  changePct: number;
  index: number;
}) => {
  const positive = changePct >= 0;
  return (
    <Paper
      className="rise-in"
      style={{ ["--card-index" as string]: index }}
      sx={{
        height: "100%",
        padding: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        transition: (t) =>
          `transform ${t.transitions.duration.standard}ms, box-shadow ${t.transitions.duration.standard}ms, border-color ${t.transitions.duration.standard}ms`,
        "&:hover": {
          transform: "translateY(-4px)",
          borderColor: "rgba(47, 169, 104, 0.4)",
          boxShadow: "0 22px 48px -24px rgba(47, 169, 104, 0.5)",
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 38,
            height: 38,
            borderRadius: "10px",
            color: "primary.light",
            border: "1px solid rgba(47, 169, 104, 0.25)",
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="overline"
          sx={{ color: "text.secondary", fontSize: "0.62rem" }}
        >
          {label}
        </Typography>
      </Box>

      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        <Box display="flex" alignItems="baseline" gap={1.5}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: (t) => t.typography.h4.fontFamily,
              lineHeight: 1,
            }}
          >
            {number}
          </Typography>
          <Chip
            size="small"
            icon={
              positive ? (
                <TrendingUpIcon sx={{ fontSize: 15 }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 15 }} />
              )
            }
            label={toFormattedPercentage(changePct)}
            sx={{
              height: 22,
              fontSize: "0.72rem",
              fontWeight: 700,
              color: positive ? "primary.light" : "error.main",
              bgcolor: positive
                ? "rgba(47, 169, 104, 0.14)"
                : "rgba(217, 104, 94, 0.14)",
              "& .MuiChip-icon": {
                color: positive ? "primary.light" : "error.main",
              },
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

const InfoPaper = ({
  icon,
  title,
  label,
  Content,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  Content: React.ReactNode;
}) => (
  <Paper
    sx={{
      paddingX: 3.5,
      paddingY: 3,
      flexGrow: 1,
      height: "100%",
    }}
  >
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      marginBottom={2.5}
    >
      <Box display="flex" alignItems="center" gap={1.5}>
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 36,
            height: 36,
            borderRadius: "10px",
            color: "primary.light",
            background: "rgba(47, 169, 104, 0.12)",
            border: "1px solid rgba(47, 169, 104, 0.22)",
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Typography
        variant="overline"
        sx={{ color: "text.secondary", fontSize: "0.62rem" }}
      >
        {label}
      </Typography>
    </Box>
    {Content}
  </Paper>
);

export const ConnectToCanvaCta = () => {
  return (
    <Card
      sx={{
        minWidth: 275,
        width: "100%",
        background:
          "linear-gradient(160deg, rgba(47, 169, 104, 0.12), rgba(25, 33, 28, 0) 55%)",
      }}
    >
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          flexDirection: "column",
          padding: 4,
        }}
      >
        <Typography variant="h6" align="center">
          Connect to Canva
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary">
          Connect the Canva for <b>Nourish</b> integration to seamlessly manage
          existing assets, edit product images, and create designs at scale.
        </Typography>
        <Box display="flex" justifyContent="center" width="100%" mt={0.5}>
          <ConnectButton />
        </Box>
        <Box display="flex" justifyContent="center">
          <DeveloperNote info="Set up an integration in the developer portal before connecting to Canva" />
        </Box>
      </CardContent>
    </Card>
  );
};
