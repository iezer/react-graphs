import React, { Component } from "react";
import { geoMercator, geoPath } from "d3-geo";
import * as d3 from "d3";
import { feature } from "topojson-client";

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

  render() {
    let eventCounts = this.props.markers.map(m => m.events.length);
    let maxEvents = Math.max.apply(null, eventCounts);

    function calculateRadius(value) {
      return Math.sqrt(value / maxEvents) * MAX_RADIUS;
    }

    let { width, height } = this.state;

    setTimeout(() => {
      // render labels with D3
      let g = d3.select('.labels');
      let projection = this.projection();
      g.selectAll('text')
      .data(this.props.markers)
      .enter()
      .append('text')
      .attr('dy', '.35em')
      .attr('transform', function(d) {
        let { lat, lng } = d.location;
        let points = projection([lng, lat]);
        return `translate(${points[0]}, ${points[1]})`;
      })
      .text(function(d) {
        let { city } = d.location;
        return city.split(',')[0];
      })
      .attr('class', function(d) { return `label label-${d.location.city}`; });
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
          {
            this.props.markers.map((m, i) => {
              let { lat, lng } = m.location;

              let projection = this.projection();
              let points = projection([lng, lat]);

              return (
                <circle
                  key={`marker-${m.location.city}`}
                  cx={ points[0] }
                  cy={ points[1] }
                  r={ calculateRadius(m.events.length) }
                  fill="#E91E63"
                  className={`marker marker-${m.location.city}`}
                  onClick={ () => this.handleMarkerClick(i) }
                >
                  <text>
                    {m.location.city}
                  </text>
                </circle>
              );
            })
          }
        </g>
        <g className="labels">
        </g>
      </svg>
    );
  }
}

export default WorldMap;