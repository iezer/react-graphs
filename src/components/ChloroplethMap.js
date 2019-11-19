import React, { Component } from "react";
import { geoOrthographic, geoPath } from "d3-geo";
import * as d3 from "d3";
import { feature } from "topojson-client";
class ChloroplethMap extends Component {
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

  render() {
    let { width, height } = this.state;
    let { countries } = this.props;
    let color = d3.scaleSequential(d3.interpolateYlGnBu)
        .domain(d3.extent(Object.values(countries)));

    return (
      <svg width={ width } height={ height } viewBox={`0 0 ${width} ${height}`}>
        <g className="countries">
          {
            this.state.worldData.map((d,i) => {

              let { name: country } = d.properties;
              let value = countries[country] || 0;
              return (
                <path
                  key={ `path-${ i }` }
                  d={ geoPath().projection(this.projection())(d) }
                  className={`chloropleth-country ${country}`}
                  fill={ value ? color(value): 'lightgray' }
                  stroke="black"
                  strokeWidth={ 0.5 }
                  onClick={ function() { alert(`${country}: ${value}`); }}
                />
              );
            })
          }
        </g>
      </svg>
    );
  }
}

export default ChloroplethMap;
