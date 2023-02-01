import {
  VictoryChart,
  VictoryLine,
  VictoryBar,
  VictoryScatter,
  VictoryAxis,
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
import { unixTimeToDateString } from "../utils/timeConversion";
// currently not obvious why this should be extracted out
// into a component except for styling reasons.

interface chartProps {
  data: any[];
  x: string;
  y: string;
  props?: any;
}

function NoChart() {
  return (
    <Stack
      direction="column"
      alignItems="center"
      spacing={12}
      minW="100vw" // for now to center elements.
      py={24}
    >
      <Spinner />
      <Heading size="md">No data to display yet.</Heading>
    </Stack>
  );
}

export function LineChart({ data, x, y, ...props }: chartProps) {
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
    <VictoryChart domainPadding={{ x: 20, y: 20 }}>
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
        style={{ tickLabels: { angle: 0, fontSize: 10 } }}
        domain={[minY, maxY]}
      />
      <VictoryScatter
        data={data}
        x={x}
        y={y}
        style={{
          // profit is green, loss is red
          data: { fill: ({ datum }) => (datum[y] > 0 ? "green" : "red") },
        }}
        {...props}
      />
    </VictoryChart>
  );
}
