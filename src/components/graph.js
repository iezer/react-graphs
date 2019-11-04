import React from 'react';
import XYPlot from 'reactochart/XYPlot';
import XAxis from 'reactochart/XAxis';
import YAxis from 'reactochart/YAxis';
import LineChart from 'reactochart/LineChart';
import 'reactochart/styles.css';

function QuickStartGraph1(props) {
  return (
    <XYPlot width={400} height={300}>
      <XAxis />
      <YAxis />
      <LineChart
        data={[
          {x: 0, y: 20},
          {x: 5, y: 30},
          {x: 10, y: 35},
          {x: 15, y: 30},
        ]}
        x={d => d.x}
        y={d => d.y}
      />
    </XYPlot>
  );
}

export default QuickStartGraph1;
