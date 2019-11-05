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
  render() {
    console.log(`rendering ${this.state.worldData.length}`);
    return (
      <svg width={ 800 } height={ 450 } viewBox="0 0 800 450">
        <g className="countries">
          {
            this.state.worldData.map((d,i) => (
              <path
                key={ `path-${ i }` }
                d={ geoPath().projection(this.projection())(d) }
                className="country"
                fill={ `rgba(38,50,56,${1 / this.state.worldData.length * i})` }
                stroke="#FFFFFF"
                strokeWidth={ 0.5 }
              />
            ))
          }
        </g>
        <g className="markers">
          <circle
            cx={ this.projection()([8,48])[0] }
            cy={ this.projection()([8,48])[1] }
            r={ 10 }
            fill="#E91E63"
            className="marker"
          />
        </g>
      </svg>
    );
  }
}

export default WorldMap;
