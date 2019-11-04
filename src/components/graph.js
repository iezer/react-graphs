import React from 'react';
import XYPlot from 'reactochart/XYPlot';
import XAxis from 'reactochart/XAxis';
import YAxis from 'reactochart/YAxis';
import LineChart from 'reactochart/LineChart';
import 'reactochart/styles.css';

function QuickStartGraph(props) {
  let data = [
    {x: 0, y: 20},
    {x: 5, y: 30},
    {x: 10, y: 35},
    {x: 15, y: 30},
  ];

  let xTicks = data.map(d => d.x);
  let yTicks = data.map(d => d.y).concat([0, 40]);

  return (
    <XYPlot width={400} height={300} yDomain={[0, 35]}>
      <XAxis ticks={xTicks} />
      <YAxis ticks={yTicks} />
      <LineChart
        data={data}
        x={d => d.x}
        y={d => d.y}
      />
    </XYPlot>
  );
}

export default QuickStartGraph;
