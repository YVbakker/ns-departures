#!/usr/bin/env node
require('dotenv').config()
const NSAPI = require('ns-api');
const moment = require('moment');

const [, , ...args] = process.argv

if(!args.length) {
  console.log('usage: departures [station]');
  return;
}

const ns = new NSAPI({
  key: process.env.API_KEY,
});

var stations = {
  'utrecht': 'UT',
  'amsterdam': 'ASD',
  'ede':'ED'
};

ns.getDepartures({
  station: stations[args[0]],
  maxJourneys: 25,
})
  .then(data => data.map(function (d) {
    return {
      richting: d.direction,
      vertrek: moment(d.actualDateTime).format("HH:mm"),
      spoor: d.plannedTrack,
      soort: d.trainCategory
    }
  }))
  .then(data => data.sort(function (a, b) {
    if (a[1] === b[1]) {
      return 0;
    }
    else {
      return (a[1] < b[1]) ? -1 : 1;
    }
  }))
  .then(data => console.table(data, ['richting', 'vertrek', 'spoor', 'soort']))
  .catch(console.error)
  ;

//   ns.getAllStations()
//   .then (data => data.filter (station => station.land === 'NL'))
//   .then (data => data.map(function (d) {
//     return {
//       code: d.code,
//       naam: d.namen.lang
//     };
//   }))
//   .then (data => console.table (data, ['code', 'naam']))
//   .catch (console.error)
// ;