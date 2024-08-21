import { Box, Card, CardContent, Grid, Paper, Typography } from "@mui/material";
import { BarChart } from "@mui/icons-material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { ConnectButton, DemoSalesChart, DeveloperNote } from "src/components";
import { useAppContext } from "src/context";

export const HomePage = () => {
  const { displayName } = useAppContext();

  return (
    <>
      <Typography variant="h4" gutterBottom={true}>
        {displayName ? `Good day, ${displayName}!` : `Good day!`}
      </Typography>
      <HomeTiles />
    </>
  );
};

const placeholderStats: {
  icon: React.ReactNode;
  title: string;
  label: string;
  number: number;
  changePct: number;
}[] = [
  {
    icon: <ShoppingCartOutlinedIcon />,
    title: "Abandoned carts",
    label: "This week",
    number: 20,
    changePct: 0.1,
  },
  {
    icon: <PeopleAltOutlinedIcon />,
    title: "Active customers",
    label: "This week",
    number: 1250,
    changePct: 0.15,
  },
  {
    icon: <ShoppingBagOutlinedIcon />,
    title: "All orders",
    label: "This week",
    number: 10,
    changePct: -0.1,
  },
];

const HomeTiles = () => (
  <Grid
    container={true}
    spacing={2}
    alignItems="stretch"
    direction="row"
    justifyContent="stretch"
  >
    {placeholderStats.map(({ icon, title, label, number, changePct }) => (
      <Grid key={title} item={true} xs={4}>
        <InfoPaper
          title={title}
          label={label}
          icon={icon}
          Content={<Stat number={number} changePct={changePct} />}
        />
      </Grid>
    ))}
    <Grid item={true} xs={8}>
      <InfoPaper
        icon={<BarChart />}
        label="This year"
        title="Sales summary"
        Content={<DemoSalesChart />}
      />
    </Grid>
    <Grid item={true} xs={4} display="flex">
      <ConnectToCanvaCta />
    </Grid>
  </Grid>
);

const toFormattedPercentage = (decimal: number) => {
  const percentage = decimal * 100;

  const sign = percentage >= 0 ? "+" : "";
  return `${sign}${percentage}%`;
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
      paddingX: 4,
      paddingY: 2,
      flexGrow: 1,
      height: "100%",
    }}
  >
    <Box display="flex" justifyContent="space-between" marginBottom={3}>
      {icon}
      <Box display="flex" gap={1}>
        <Typography>{label}</Typography>
      </Box>
    </Box>
    <Typography variant="h6" marginBottom={3}>
      {title}
    </Typography>
    {Content}
  </Paper>
);

const Stat = ({ number, changePct }: { number: number; changePct: number }) => {
  return (
    <Box display="flex" flexDirection="row" gap={1}>
      <Typography variant="subtitle2">{number}</Typography>
      <Typography
        variant="subtitle2"
        color={changePct >= 0 ? "primary" : "error"}
      >
        ({toFormattedPercentage(changePct)})
      </Typography>
    </Box>
  );
};

export const ConnectToCanvaCta = () => {
  return (
    <Card sx={{ minWidth: 275, paddingX: 5, paddingY: 2 }}>
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" align="center" gutterBottom={true}>
          Connect to Canva
        </Typography>
        <Box paddingY={6}>
          <Typography
            variant="caption"
            align="center"
            paragraph={true}
            gutterBottom={true}
          >
            Connect the Canva for <b>Nourish</b> integration to seamlessly
            manage existing assets, edit product images, and create designs at
            scale.
          </Typography>
          <Box display="flex" justifyContent="center">
            <ConnectButton />
          </Box>
        </Box>
        <Box display="flex" justifyContent="center">
          <DeveloperNote info="Set up an integration in the developer portal before connecting to Canva" />
        </Box>
      </CardContent>
    </Card>
  );
};
