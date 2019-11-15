import React, { useState, useEffect } from 'react';
import XYPlot from 'reactochart/XYPlot';
import XAxis from 'reactochart/XAxis';
import YAxis from 'reactochart/YAxis';
import LineChart from 'reactochart/LineChart';
import 'reactochart/styles.css';

function fetchData(useDataApi = false) {
  if (useDataApi) {
    return fetch("/api/datapoints")
    .then(response => response.json());
  }

  return Promise.resolve({
    datapoints: [
      {x: 0, y: 20},
      {x: 5, y: 30},
      {x: 10, y: 35},
      {x: 15, y: 30},
    ]
  });
}

function QuickStartGraph(props) {
  let [ data, setData ] = useState([]);

  useEffect(() => {
    fetchData()
    .then(json => setData(json.datapoints));
  }, []);

  let xTicks = data.map(d => d.x);
  let yTicks = data.map(d => d.y).concat([0, 40]);

  return (
    <div>
      <h2 data-test="graph">Graph</h2>
      <XYPlot width={400} height={300} yDomain={[0, 35]}>
        <XAxis ticks={xTicks} />
        <YAxis ticks={yTicks} />
        <LineChart
          data={data}
          x={d => d.x}
          y={d => d.y}
        />
      </XYPlot>
    </div>
  );
}

export default QuickStartGraph;
