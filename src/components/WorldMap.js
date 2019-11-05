import React, { Component } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";

// from https://medium.com/@zimrick/how-to-create-pure-react-svg-maps-with-topojson-and-d3-geo-e4a6b6848a98
// and https://bl.ocks.org/MariellaCC/0055298b94fcf2c16940
class WorldMap extends Component {
  constructor() {
    super();
    this.state = {
      worldData: [],
    };
  }
  projection() {
    let width = 800;
    let height = 450;

    return geoMercator()
    .center([ 13, 52 ]) //comment centrer la carte, longitude, latitude
    .translate([ width/2, height/2 ]) // centrer l'image obtenue dans le svg
    .scale([ width/1.5 ]); // zoom, plus la valeur est petit plus le zoom est gros
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

    console.log(text.join(', '));
  }

  render() {
    return (
      <svg width={ 800 } height={ 450 } viewBox="0 0 800 450">
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
                  r={ m.events.length }
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
      </svg>
    );
  }
}

export default WorldMap;
