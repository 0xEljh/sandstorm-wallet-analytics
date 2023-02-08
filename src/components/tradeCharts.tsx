import {
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryAxis,
  VictoryLabel,
  VictoryVoronoiContainer,
} from "victory";
import { Spinner, Stack, Heading } from "@chakra-ui/react";
import { useToken } from "@chakra-ui/react";
import { unixTimeToDateString } from "../utils/timeConversion";
import { lampToSol } from "../utils/currencyConversion";
// currently not obvious why this should be extracted out
// into a component except for styling reasons.

interface chartProps {
  data: any[];
  x: string;
  y: string;
  setActiveDatum?: (datum: any) => void;
  props?: any;
}

function NoChart() {
  return (
    <Stack direction="column" alignItems="center" spacing={12} my={32}>
      <Spinner color="brand.200" />
      <Heading size="md">No data to display yet.</Heading>
    </Stack>
  );
}

export function LineChart({
  data,
  x,
  y,
  setActiveDatum,
  ...props
}: chartProps) {
  return (
    <VictoryChart>
      <VictoryLine
        data={data}
        x={x}
        y={y}
        style={{ data: { stroke: "blue" } }}
        scale={{ x: "time" }}
        {...props}
      />
    </VictoryChart>
  );
}

export function ScatterChart({ data, x, y, ...props }: chartProps) {
  const [brand100, brand200, brand300] = useToken("colors", [
    "brand.100",
    "brand.200",
    "brand.300",
  ]);

  if (data.length === 0) {
    return <NoChart />;
  }

  const maxY = data.reduce((prev, curr) => (prev[y] > curr[y] ? prev : curr))[
    y
  ];
  const minY = data.reduce((prev, curr) => (prev[y] < curr[y] ? prev : curr))[
    y
  ];
  const maxX = data.reduce((prev, curr) => (prev[x] > curr[x] ? prev : curr))[
    x
  ];
  const minX = data.reduce((prev, curr) => (prev[x] < curr[x] ? prev : curr))[
    x
  ];

  return (
    <VictoryChart
      domainPadding={{ x: 20, y: 20 }}
      // padding={{ top: 50, bottom: 50, left: 50, right: 50 }}
      // height={300}
      containerComponent={
        <VictoryVoronoiContainer
          labels={(datum) => {
            const priceChangeText =
              lampToSol(datum.datum["buyPrice"]) +
              "→" +
              lampToSol(datum.datum["sellPrice"]) +
              "◎";
            if (datum.datum["name"] === "") {
              // return ["Unnamed NFT", priceChangeText];
              return "Unnamed NFT\n" + priceChangeText;
            }
            // return [datum.datum["name"], priceChangeText];
            return datum.datum["name"] + "\n" + priceChangeText;
          }}
          labelComponent={
            <VictoryLabel
              textAnchor="start"
              verticalAnchor="end"
              style={{ fontSize: 8, fill: brand200 }}
              dy={-10}
            />
          }
        />
      }
    >
      <VictoryAxis
        scale="time"
        domain={[minX, maxX]}
        tickFormat={(x) => unixTimeToDateString(x)}
        orientation="bottom"
        offsetY={50}
        tickCount={4}
        style={{ tickLabels: { angle: 0, fontSize: 10 } }}
      />
      <VictoryAxis
        dependentAxis
        crossAxis={false}
        tickFormat={(x) => x / 1000000000}
        style={{
          tickLabels: { angle: 0, fontSize: 10, fill: brand200 },
          axisLabel: { fontSize: 10, padding: 40 },
        }}
        label="Profit in ◎"
        domain={[minY, maxY]}
      />

      <VictoryScatter
        data={data}
        x={x}
        y={y}
        style={{
          parent: { border: "1px solid #ccc" },
          // profit is green, loss is red
          data: {
            fill: ({ datum }) => (datum[y] > 0 ? brand100 : brand300),
            fillOpacity: 0.6,
            stroke: ({ datum }) => (datum[y] > 0 ? brand100 : brand300),
            strokeWidth: 1.5,
          },
        }}
        {...props}
      />
    </VictoryChart>
  );
}
