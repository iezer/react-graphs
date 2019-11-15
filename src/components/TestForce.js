import React from 'react';
import * as d3 from "d3";

var width = 800;
var height = 600;
var color = d3.scaleOrdinal(d3.schemeCategory10);

// https://bl.ocks.org/mapio/53fed7d84cd1812d6a6639ed7aa83868
function drawGraph(graph) {
  var label = {
    'nodes': [],
    'links': []
  };

  graph.nodes.forEach(function(d, i) {
    label.nodes.push({node: d});
    label.nodes.push({node: d});
    label.links.push({
      source: i * 2,
      target: i * 2 + 1
    });
  });

  var labelLayout = d3.forceSimulation(label.nodes)
      .force("charge", d3.forceManyBody().strength(-100))
      .force("link", d3.forceLink(label.links).distance(0).strength(2))
      .on("tick", labelTicked);

  var graphLayout = d3.forceSimulation(graph.nodes)
      .force("charge", d3.forceManyBody().strength(-2000))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(1))
      .force("y", d3.forceY(height / 2).strength(1))
      .force("link", d3.forceLink(graph.links).id(function(d) {return d.id; }).distance(50).strength(1))
      .on("tick", graphTicked);

  var svg = d3.select("#viz").attr("width", width).attr("height", height);
  var container = svg.append("g");

  svg.call(
    d3.zoom()
    .scaleExtent([.1, 4])
    .on("zoom", function() { container.attr("transform", d3.event.transform); })
  );

  var link = container.append("g").attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter()
      .append("line")
      .attr("stroke", "#aaa")
      .attr("stroke-width", "1px");

  var node = container.append("g").attr("class", "nodes")
      .selectAll("g")
      .data(graph.nodes)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("fill", function(d) { return color(d.group); })

  var labelNode = container.append("g").attr("class", "labelNodes")
      .selectAll("text")
      .data(label.nodes)
      .enter()
      .append("text")
      .text(function(d, i) { return i % 2 == 0 ? "" : d.node.id; })
      .style("fill", "#555")
      .style("font-family", "Arial")
      .style("font-size", 12)
      .style("pointer-events", "none"); // to prevent mouseover/drag capture

  function graphTicked() {
    node.call(updateNode);
    link.call(updateLink);
  }


  function labelTicked() {
    labelNode.each(function(d, i) {
      if(i % 2 == 0) {
        d.x = d.node.x;
        d.y = d.node.y;
      }
    });
    labelNode.call(updateNode);

  }

  function fixna(x) {
    if (isFinite(x)) return x;
    return 0;
  }

  function updateLink(link) {
    link.attr("x1", function(d) { return fixna(d.source.x); })
    .attr("y1", function(d) { return fixna(d.source.y); })
    .attr("x2", function(d) { return fixna(d.target.x); })
    .attr("y2", function(d) { return fixna(d.target.y); });
  }

  function updateNode(node) {
    node.attr("transform", function(d) {
      return "translate(" + fixna(d.x) + "," + fixna(d.y) + ")";
    });
  }
}

let data = {
  "nodes": [
    {
      "id": "Myriel",
      "group": 1
    },
    {
      "id": "Napoleon",
      "group": 1
    },
    {
      "id": "Mlle.Baptistine",
      "group": 1
    },
    {
      "id": "Mme.Magloire",
      "group": 1
    },
    {
      "id": "CountessdeLo",
      "group": 1
    },
    {
      "id": "Geborand",
      "group": 1
    }
  ],
  "links": [
    {
      "source": "Napoleon",
      "target": "Myriel",
      "value": 1
    },
    {
      "source": "Mlle.Baptistine",
      "target": "Myriel",
      "value": 8
    },
    {
      "source": "Mme.Magloire",
      "target": "Myriel",
      "value": 10
    },
    {
      "source": "Mme.Magloire",
      "target": "Mlle.Baptistine",
      "value": 6
    },
    {
      "source": "CountessdeLo",
      "target": "Myriel",
      "value": 1
    },
    {
      "source": "Geborand",
      "target": "Myriel",
      "value": 1
    }
  ]
};

function TestForce() {
  setTimeout(function() {
    drawGraph(data);
  }, 0);

  return (
    <svg id='viz'></svg>
  );
}

export default TestForce;
