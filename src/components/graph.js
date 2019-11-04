import React, { useState, useEffect } from 'react';
import XYPlot from 'reactochart/XYPlot';
import XAxis from 'reactochart/XAxis';
import YAxis from 'reactochart/YAxis';
import LineChart from 'reactochart/LineChart';
import 'reactochart/styles.css';

function QuickStartGraph(props) {
  let [ data, setData ] = useState([]);

  useEffect(() => {
    fetch("/api/datapoints")
    .then(response => response.json())
    .then(json => setData(json.datapoints));
  }, []);

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
