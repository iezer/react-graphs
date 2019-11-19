import React, { Component } from "react";
import { geoOrthographic, geoPath } from "d3-geo";
import * as d3 from "d3";
import { feature } from "topojson-client";

// examples of force-directed labels
// http://bl.ocks.org/ZJONSSON/1691430
// http://bl.ocks.org/susielu/9526340
// https://bl.ocks.org/rsk2327/23622500eb512b5de90f6a916c836a40
// http://bl.ocks.org/MoritzStefaner/1377729 and https://bl.ocks.org/mapio/53fed7d84cd1812d6a6639ed7aa83868
const MAX_RADIUS = 10;

// from https://medium.com/@zimrick/how-to-create-pure-react-svg-maps-with-topojson-and-d3-geo-e4a6b6848a98
// and https://bl.ocks.org/MariellaCC/0055298b94fcf2c16940
class WorldMap extends Component {
  constructor() {
    super();
    this.state = {
      width: 1200,
      height: 900,
      worldData: [],
    };
  }
  projection() {
    let { width, height } = this.state;

    return geoOrthographic()
    .center([ 13, 50 ]) //comment centrer la carte, longitude, latitude
    .translate([ width/2, height/2 ]) // centrer l'image obtenue dans le svg
    .scale([ width ]); // zoom, plus la valeur est petit plus le zoom est gros
  }
  componentDidMount() {
    fetch("/countries-110m.json")
    .then(response => {
      if (response.status !== 200) {
        console.log(`There was a problem: ${response.status}`);
        return;
      }
      response.json().then((worldData) => {
        this.setState({
          worldData: feature(worldData, worldData.objects.countries).features
        });
      });
    });
  }

  handleMarkerClick(index) {
    let marker = this.props.markers[index];
    let size = marker.events.length;
    let text = [
      marker.location.city,
      `${size} ${ size === 1 ? 'event' : 'events'}`
    ].concat(marker.events.map(e => e.displayName));

    alert(text.join(','));
    console.log(text.join(', '));
  }

  renderNodes() {
    console.log('renderNodes');
    let eventCounts = this.props.markers.map(m => m.events.length);
    let maxEvents = Math.max.apply(null, eventCounts);

    function calculateRadius(value) {
      return Math.sqrt(value / maxEvents) * MAX_RADIUS;
    }

    let projection = this.projection();
    let nodes = this.props.markers.map(function(d) {
      let { lat, lng, city } = d.location;
      let [x, y] = projection([lng, lat]);
      let r = calculateRadius(d.events.length);
      return {x, y, city, r};
    });

    let self = this;
    let g = d3.select('.markers');
    g.selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; })
    .attr('r', function(d) { return d.r; })
    .attr('fill', "#E91E63")
    .attr('class', function(d) {
      return `marker marker-${d.city}`;
    })
    .on('click', function(d,i) {
      self.handleMarkerClick(i);
    });
  }

  renderLabels() {
    let { width } = this.state;
    // render labels with D3
    let g = d3.select('.labels');
    let projection = this.projection();

    let graph = {
      nodes: [],
      links: []
    };

    this.props.markers.forEach((m, i) => {
      let { lat, lng } = m.location;
      let [x, y] = projection([lng, lat]);
      let label = m.location.city.split(',')[0];
      let node = { x, y, label };

      // store 2 instances of a each node with a link so that node can be tied to link.
      graph.nodes.push({node});
      graph.nodes.push({node});
      graph.links.push({ source: i * 2, target: i * 2 + 1 });
    });

    let nodes = g.selectAll('text')
        .data(graph.nodes)
        .enter()
        .append('text')
        .attr('text-anchor', 'middle')
        .text(function(d, i) { return i % 2 === 0 ? '' : d.node.label; })
        .attr('class', function(d) { return `label label-${d.node.label}`; });

    let lines = g.selectAll('line')
        .data(graph.nodes)
        .enter()
        .append('line')
        .attr('stroke', 'blue')
        .attr('x1', function(d) { return d.node.x; })
        .attr('x2', function(d) { return d.x; })
        .attr('y1', function(d) { return d.node.y; })
        .attr('y2', function(d) { return d.y; });

    function fixna(x) {
      if (isFinite(x)) return x;
      return 0;
    }

    function updateNode(node) {
      node.attr("transform", function(d) {
        return "translate(" + fixna(d.x) + "," + fixna(d.y) + ")";
      });
    }

    let simulation = d3.forceSimulation(graph.nodes)
        .alphaDecay(0.1)
        .force('charge', d3.forceManyBody().strength(-500))
        .force('link', d3.forceLink(graph.links).distance(15).strength(2));

    simulation
    .on("tick", function() {
      nodes.each(function(d, i) {
        if (i % 2 === 0) {
          d.x = d.node.x;
          d.y = d.node.y;
        } else {

          let b = this.getBBox();
          let diffX = d.x - d.node.x;
          let diffY = d.y - d.node.y;
          let dist = Math.sqrt(diffX * diffX + diffY * diffY);
          let shiftX = b.width * (diffX - dist) / (dist * 2);
          shiftX = Math.max(-b.width, Math.min(0, shiftX));
          let shiftY = 16;
          console.log(`b ${b.width} ${b.height} ${d.node.label} ${shiftX}`);
          this.setAttribute('transform', "translate(" + shiftX + "," + shiftY + ")");
        }
      });

      nodes.call(updateNode);

      lines
      .attr('x1', function(d) { return d.node.x; })
      .attr('x2', function(d) { return d.x; })
      .attr('y1', function(d) { return d.node.y; })
      .attr('y2', function(d) { return d.y; });

    });
  }

  render() {
    console.log(JSON.stringify(this.props.markers));
    let { width, height } = this.state;

    setTimeout(() => {
      this.renderNodes();
      this.renderLabels();
    }, 0);

    return (
      <svg width={ width } height={ height } viewBox={`0 0 ${width} ${height}`}>
        <g className="countries">
          {
            this.state.worldData.map((d,i) => {
              return (
                <path
                  key={ `path-${ i }` }
                  d={ geoPath().projection(this.projection())(d) }
                  className="country"
                  fill={ `rgba(38,50,56,${1 / this.state.worldData.length * i})` }
                  stroke="#FFFFFF"
                  strokeWidth={ 0.5 }
                />
              );
            })
          }
        </g>
        <g className="markers">
        </g>
        <g className="labels">
        </g>
      </svg>
    );
  }
}

export default WorldMap;
