import React, { Component } from "react";
import { geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { select } from "d3-selection";
import { max, extent } from "d3-array";
import { scaleLinear, scaleSequential } from "d3-scale";
import { axisRight } from "d3-axis";
import { interpolateYlOrRd } from "d3-scale-chromatic";

// https://bl.ocks.org/JulienAssouline/1ae3480c5277e2eecd34b71515783d6f
// countries comes from https://github.com/topojson/world-atlas

// hover labels http://bl.ocks.org/MaciejKus/61e9ff1591355b00c1c1caf31e76a668

const COUNTRY_NAMES = {
  "Czechia": "Czech Republic",
  "United Kingdom": "UK"
};

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
    .center([ 5, 50 ]) //comment centrer la carte, longitude, latitude
    .translate([ width/2, height/2 ]) // centrer l'image obtenue dans le svg
    .scale([ width * 1.5 ]); // zoom, plus la valeur est petit plus le zoom est gros
  }
  componentDidMount() {
    fetch("/countries-50m.json")
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

  componentDidUpdate() {
    this.renderLegendAxis();
  }

  renderLegendAxis() {
    let g = select(".legend .y-axis");
    let values = Object.values(this.props.countries);

    let yScale = scaleLinear()
        .range([300, 0])
        .domain(extent(values));

    let yAxis = axisRight(yScale);

    g.attr('transform', 'translate(70, 410)');
    g.call(yAxis);
  }

  renderLegend(minColor, maxColor) {
    return (
      <g className="legend">
        <defs>
          <linearGradient id="gradient" x1="100%" y1="0%" x2="100%" y2="100%" spreadMethod="pad">
            <stop offset="0%" stopColor={maxColor} stopOpacity="1"></stop>
            <stop offset="100%" stopColor={minColor} stopOpacity="1"></stop>
          </linearGradient>
        </defs>
        <rect x="20" y="400" width="40" height="300" fill="url(#gradient)" transform="translate(0, 10)"/>
        <g className="y-axis"></g>
      </g>
    );
  }

  validate() {
    let countries = Object.keys(this.props.countries);
    let {worldData} = this.state;

    if (!countries.length || !worldData.length) {
      return;
    }

    countries.forEach(country => {
      let match = worldData.find(d =>
                                 d.properties.name === country ||
                                 COUNTRY_NAMES[d.properties.name] === country);

      if (!match) {
        console.log(`no country in map found for "${country}"`);
      }
    });
  }

  showTooltip(event, d) {
    let tooltip = select('#chloropleth-map .tooltip');
    let label = this.info(d.properties.name);

    let { width } = this.state;
    let offsetL = 10;
    let offsetT = 10;
    let { pageX: x, pageY: y} = event;
    let map = document.getElementById('chloropleth-map');

    let style = x < width / 2 ?
        `left:${x + offsetL}px; top:${y + offsetT}px` :
        `right:${map.clientWidth - x + offsetL}px; top:${y + offsetT}px; text-align: right;`;

    tooltip
    .attr('hidden', null)
    .attr("style", style)
    .html(label);
  }

  info(country) {
    let { countries } = this.props;

    let value = countries[country] || countries[COUNTRY_NAMES[country]] || 0;

    if (value === 0) {
      return country;
    }

    return `${country}: ${value}${value === 1 ? " show" : " shows"}`;
  }

  render() {
    let { width, height } = this.state;
    let { countries } = this.props;
    let values = Object.values(countries);
    let maxV = max(values);
    let color = scaleSequential(interpolateYlOrRd)
        .domain(extent(values));

    this.validate();

    return (
      <div id="chloropleth-map">

        <div className="tooltip" hidden>
        </div>

        <svg width={ width } height={ height } viewBox={`0 0 ${width} ${height}`}>
          { this.renderLegend(color(0), color(maxV))}

          <g className="countries">
            {
              this.state.worldData.map((d,i) => {
                let { name: country } = d.properties;
                let value = countries[country] || countries[COUNTRY_NAMES[country]] || 0;
                return (
                  <path
                    key={ `path-${ i }` }
                    d={ geoPath().projection(this.projection())(d) }
                    className={`chloropleth-country ${country}`}
                    fill={ value ? color(value): 'lightgray' }
                    stroke="black"
                    strokeWidth={ 0.5 }
                    onMouseMove= {(event) => {
                      this.showTooltip(event, d);
                    }}
                    onMouseOut={ () => {
                      select('.tooltip').attr('hidden', true);
                    }}
                  />
                );
              })
            }
          </g>
        </svg>
      </div>
    );
  }
}

export default ChloroplethMap;
