import React, { useState, useEffect } from 'react';

const SONGKICK_KEY = process.env.REACT_APP_SONGKICK_KEY;

const EUROPE_COUNTRY_CODES = [
  'AL', 'AD', 'AM', 'AT', 'BY', 'BE', 'BA', 'BG', 'CH', 'CY', 'CZ', 'DE',
  'DK', 'EE', 'ES', 'FO', 'FI', 'FR', 'GB', 'GE', 'GI', 'GR', 'HU', 'HR',
  'IE', 'IS', 'IT', 'LI', 'LT', 'LU', 'LV', 'MC', 'MK', 'MT', 'NO', 'NL', 'PL',
  'PT', 'RO', 'RU', 'SE', 'SI', 'SK', 'SM', 'TR', 'UA', 'UK', 'VA'
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

function Europe() {
  fetch(pastGigsUrl(artists[0][1]));
  fetch(upcomingGigsUrl(artists[0][1]));

  return (
    <div>
      Europe Gigs??
    </div>
  );
}

export default Europe;
