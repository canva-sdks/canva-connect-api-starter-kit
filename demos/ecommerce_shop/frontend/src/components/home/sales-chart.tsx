import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";

type Data = {
  /**
   * in the thousands
   */
  sales: number;
  month: string;
};

// Fake data for demonstration purposes
const dataset: Data[] = [
  {
    sales: 20,
    month: "Jan",
  },
  {
    sales: 40,
    month: "Feb",
  },
  {
    sales: 60,
    month: "Mar",
  },
  {
    sales: 80,
    month: "Apr",
  },
  {
    sales: 40,
    month: "May",
  },
];

const valueFormatter = (value: number | null) => `${value}k`;

const chartSetting = {
  yAxis: [
    {
      label: "Sales (000 $)",
    },
  ],
  series: [
    { dataKey: "sales", label: "Sales", valueFormatter, color: "#00c853" },
  ],
  height: 300,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: "translateX(-10px)",
    },
  },
};

export const DemoSalesChart = () => (
  <div style={{ width: "100%" }}>
    <BarChart
      dataset={dataset}
      xAxis={[
        {
          scaleType: "band",
          dataKey: "month",
          tickPlacement: "middle",
          tickLabelPlacement: "middle",
        },
      ]}
      {...chartSetting}
    />
  </div>
);
