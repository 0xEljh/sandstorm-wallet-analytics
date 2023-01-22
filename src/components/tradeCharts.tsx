import { VictoryChart, VictoryLine, VictoryBar, VictoryAxis } from "victory";
import { unixTimeToDateString } from "../utils/timeConversion";
// currently not obvious why this should be extracted out
// into a component except for styling reasons.

interface chartProps {
  data: any[];
  x: string;
  y: string;
  props?: any;
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

export function BarChart({ data, x, y, ...props }: chartProps) {
  console.log(data);
  return (
    // set chart style such that positive bars are green and negative bars are red
    <VictoryChart>
      <VictoryAxis
        scale="time"
        // standalone={false}
        // domain={
        //   data.length >= 1
        //     ? [
        //         data.reduce((prev, curr) => (prev[x] > curr[x] ? prev : curr))[
        //           x
        //         ],
        //         data.reduce((prev, curr) => (prev[x] < curr[x] ? prev : curr))[
        //           x
        //         ],
        //       ]
        //     : [0, 0]
        // }
        tickFormat={(x) => unixTimeToDateString(x)}
        orientation="bottom"
        offsetY={50}
        tickCount={4}
        // flip the labels and translate downwards so they are readable
        style={{ tickLabels: { angle: 0, fontSize: 10 } }}
      />
      <VictoryAxis
        dependentAxis
        tickFormat={(x) => x / 1000000000}
        style={{ tickLabels: { angle: 0, fontSize: 10 } }}
      />
      <VictoryBar
        data={data}
        x={[...Array(data.length)]} // hacky way for now to get data evenly spaced
        y={y}
        style={{
          data: { fill: ({ datum }) => (datum[y] > 0 ? "green" : "red") },
        }}
        {...props}
      />
    </VictoryChart>
  );
}
