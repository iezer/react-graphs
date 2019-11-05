import React, { Component } from 'react';
import WorldMap from './WorldMap';

const SONGKICK_KEY = process.env.REACT_APP_SONGKICK_KEY;

const NON_EUROPE = ['US', 'Canada'];

const EUROPE_COUNTRY_CODES = [
  'AL', 'AD', 'AM', 'AT', 'BY', 'BE', 'BA', 'BG', 'CH', 'CY', 'CZ', 'DE',
  'DK', 'EE', 'ES', 'FO', 'FI', 'FR', 'GB', 'GE', 'GI', 'GR', 'HU', 'HR',
  'IE', 'IS', 'IT', 'LI', 'LT', 'LU', 'LV', 'MC', 'MK', 'MT', 'NO', 'NL', 'PL',
  'PT', 'RO', 'RU', 'SE', 'SI', 'SK', 'SM', 'TR', 'UA', 'UK', 'VA',
  'France', 'Germany', 'Belgium', 'Netherlands', 'Switzerland',
  'Germany', 'Italy', 'Spain', 'Liechtenstein',
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

function isInEurope(location) {
  let tokens = location.city.split(', ');
  let country = tokens[tokens.length - 1];
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
    this.fetchData(pastGigsUrl(artists[0][1]));
    this.fetchData(upcomingGigsUrl(artists[0][1]));
  }

  render() {
    let { cities } = this.state;
    let markers = Object.keys(cities).map(c => cities[c]);
    return (
      <div>
        Europe Gigs??
        <WorldMap markers={markers}/>
      </div>
    );
  }
}

export default Europe;
