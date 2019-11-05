import React, { Component } from 'react';
import WorldMap from './WorldMap';

import XYPlot from 'reactochart/XYPlot';
import XAxis from 'reactochart/XAxis';
import YAxis from 'reactochart/YAxis';
import BarChart from 'reactochart/BarChart';
import 'reactochart/styles.css';

const SONGKICK_KEY = process.env.REACT_APP_SONGKICK_KEY;

const NON_EUROPE = ['US', 'Canada'];

const EUROPE_COUNTRY_CODES = [
  'AL', 'AD', 'AM', 'AT', 'BY', 'BE', 'BA', 'BG', 'CH', 'CY', 'CZ', 'DE',
  'DK', 'EE', 'ES', 'FO', 'FI', 'FR', 'GB', 'GE', 'GI', 'GR', 'HU', 'HR',
  'IE', 'IS', 'IT', 'LI', 'LT', 'LU', 'LV', 'MC', 'MK', 'MT', 'NO', 'NL', 'PL',
  'PT', 'RO', 'RU', 'SE', 'SI', 'SK', 'SM', 'TR', 'UA', 'UK', 'VA',
  'France', 'Germany', 'Belgium', 'Netherlands', 'Switzerland',
  'Germany', 'Italy', 'Spain', 'Liechtenstein', 'Austria', 'Norway', 'Portugal',
  'Denmark', 'Sweden', 'Czech Republic', 'Finland', 'Hungary'
];

function pastGigsUrl(artist_id) {
  const params = {
    apikey: SONGKICK_KEY,
    min_date: '2019-01-01',
    max_date: '2019-12-31',
    per_page: 50
  };

  let url = [];

  url.push(`https://api.songkick.com/api/3.0/artists/${artist_id}/gigography.json?`);

  Object.keys(params).forEach(key => url.push(`${key}=${params[key]}`));

  return url.join('&');
};

function upcomingGigsUrl(artist_id) {
  const params = {
    apikey: SONGKICK_KEY,
    per_page: 50
  };

  let url = [];

  url.push(`https://api.songkick.com/api/3.0/artists/${artist_id}/calendar.json?`);

  Object.keys(params).forEach(key => url.push(`${key}=${params[key]}`));

  return url.join('&');
};

const artists = [
  ['Cécile McLorin Salvant', '2804751'],
  ['Chris Potter', '466442'],
  ['Fred Hersch', '216551'],
  ['Fred Hersch Trio', '26926'],
  ['Brad Mehldau', '429459'],
  ['Melissa Aldana', '6813869']
];

function getCountryFromLocation(location) {
  let tokens = location.city.split(', ');
  let country = tokens[tokens.length - 1];
  return country;

}
function isInEurope(location) {
  let country = getCountryFromLocation(location);
  let result = EUROPE_COUNTRY_CODES.includes(country);

  if (!result && !NON_EUROPE.includes(country)) {
    console.log(`country ${country} is ${result ? 'in' : 'not in'} Europe (${location.city})`);
  }
  return result;
}

class Europe extends Component {
  constructor() {
    super();
    this.state = {
      cities: {}
    };
  }

  consumeData(response) {
    let cities = Object.assign({}, this.state.cities);

    if (!response.resultsPage.results.event) {
      return;
    }

    response.resultsPage.results.event.forEach(rawEvent => {
      const { displayName, uri, location, start } = rawEvent;

      let event = {
        displayName,
        uri,
        location,
        startDate: start.date
      };

      if (!isInEurope(location)) {
        return;
      }

      if (!cities[location.city]) {
        cities[location.city] = {
          location,
          events: []
        };
      }

      cities[location.city].events.push(event);
    });

    this.setState({ cities });
  }

  fetchData(url) {
    fetch(url)
    .then(response => {
      response.json().then(results => this.consumeData(results));
    });
  }

  componentDidMount() {
    let maxArtist = artists.length; // 0

    artists.forEach((artist, i) => {
      if (i > maxArtist) { return; }
      let artistId = artist[1];
      this.fetchData(pastGigsUrl(artistId));
      this.fetchData(upcomingGigsUrl(artistId));
    });
  }

  render() {
    let { cities } = this.state;
    let markers = Object.keys(cities).map(c => cities[c]);

    let countries = markers.reduce((result, marker) => {
      let country = getCountryFromLocation(marker.location);
      if (result[country]) {
        result[country] = result[country] + 1;
      } else {
        result[country] = 1;
      }
      return result;
    }, {});

    let data = Object.keys(countries).map(country => {
      return { x: country, y: countries[country] };
    });

    return (
      <div>
        <WorldMap markers={markers}/>

        <XYPlot width={1200} height={300}>
          <XAxis />
          <YAxis />
          <BarChart
            data={data}
            x={d => d.x}
            y={d => d.y}
          />
        </XYPlot>

      </div>
    );
  }
}

export default Europe;
