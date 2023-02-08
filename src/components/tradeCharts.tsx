import {
  VictoryChart,
  VictoryLine,
  VictoryBar,
  VictoryScatter,
  VictoryAxis,
  VictoryLabel,
} from "victory";
import {
  Spinner,
  Box,
  Stack,
  Flex,
  Heading,
  Text,
  Spacer,
} from "@chakra-ui/react";
import { useToken } from "@chakra-ui/react";
import { unixTimeToDateString } from "../utils/timeConversion";
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
        labels={(datum) => {
          return datum.datum["name"];
        }}
        labelComponent={<VictoryLabel />}
        x={x}
        y={y}
        style={{
          // profit is green, loss is red
          parent: { border: "1px solid #ccc" },
          labels: { fill: "none" },
          data: {
            fill: ({ datum }) => (datum[y] > 0 ? brand100 : brand300),
            fillOpacity: 0.6,
            stroke: ({ datum }) => (datum[y] > 0 ? brand100 : brand300),
            strokeWidth: 1,
          },
        }}
        events={[
          {
            target: "data",
            eventHandlers: {
              onMouseOver: () => {
                return [
                  {
                    target: "labels",
                    mutation: (props) => {
                      return {
                        style: Object.assign({}, props.style, {
                          fill: brand200,
                          fontSize: 8,
                          backgroundStyle: { fill: "black", fillOpacity: 0.5 },
                          backgroundPadding: 10,
                        }),
                      };
                    },
                  },
                ];
              },
              onMouseOut: () => {
                return [
                  {
                    target: "labels",
                    mutation: (props) => {
                      return {
                        style: Object.assign({}, props.style, { fill: "none" }),
                      };
                    },
                  },
                ];
              },
            },
          },
        ]}
        {...props}
      />
    </VictoryChart>
  );
}
