import React, { Component } from "react";
import { geoMercator, geoPath } from "d3-geo";
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

    return geoMercator()
    .center([ 13, 48 ]) //comment centrer la carte, longitude, latitude
    .translate([ width/2, height/2 ]) // centrer l'image obtenue dans le svg
    .scale([ width ]); // zoom, plus la valeur est petit plus le zoom est gros
  }
  componentDidMount() {
    fetch("https://d3js.org/world-110m.v1.json")
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

    let foci = [];
    let labels = [];

    this.props.markers.forEach(m => {
      let { lat, lng } = m.location;
      let [x, y] = projection([lng, lat]);
      let label = m.location.city.split(',')[0];

      foci.push({x, y});;
      labels.push({x, y, label});
    });

    let node = g.selectAll('text')
        .data(labels)
        .enter()
        .append('text')
        .attr('x', function(d) { return d.x; })
        .attr('y', function(d) { return d.y; })
        .attr('text-anchor', 'middle')
        .text(function(d) { return d.label; })
        .attr('class', function(d) { return `label label-${d.label}`; });

    // http://bl.ocks.org/pnavarrc/5913636
    let simulation = d3.forceSimulation(labels)
        .alphaDecay(0.03)
        .force('repel', d3.forceManyBody().strength(-120).distance(width / 6))
        .force('attract', d3.forceManyBody().strength(40).distanceMax(width / 6));

    simulation
    .on("tick", function() {
      var k = .1 * simulation.alpha();
      labels.forEach(function(o, j) {
        // The change in the position is proportional to the distance
        // between the label and the corresponding place (foci)
        o.y += (foci[j].y - o.y) * k;
        o.x += (foci[j].x - o.x) * k;
      });

      // Update the position of the text element
      node
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; });
    });

    simulation.restart();
  }

  render() {
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
