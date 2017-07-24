const { getMatches } = require('./query');
const { getGraphBounds } = require('./util');
const { backgroundColor } = require('./colors');
const { getTimeFromTimestamp } = require('./util');
const sortedUniqBy = require('lodash.sorteduniqby');

/* Charts */
const { background } = require('./charts/background');
const { avgline } = require('./charts/avgline');
const { scatter } = require('./charts/scatter');
const { divider } = require('./charts/divider');

/* CSS */
require('../node_modules/chartist/dist/chartist.css');

let data = {};

const body = document.body;
body.style.height = '100%';
body.style.margin = '0';

const header = document.createElement('div');
const headerHeight = 100;
header.style.height = headerHeight + 'px';
header.id = 'header'
body.appendChild(header);

const graphDiv = document.createElement('div');
graphDiv.style.background = backgroundColor;
graphDiv.id = 'graphDiv';
body.appendChild(graphDiv);

function resetGraphDiv() {
  // Remove all children
  while (graphDiv.firstChild) {
    graphDiv.removeChild(graphDiv.firstChild);
  }
  graphDiv.style.height = window.innerHeight - headerHeight + 'px';
}

function renderGraphs() {
  resetGraphDiv();
  const options = {
    bounds: getGraphBounds(data),
    style: {
      height: graphDiv.style.height,
      top: headerHeight,
      left: 0,
      position: 'fixed',
      width: '100vw'
    }
  };
  // If it ran twice in the same minute the graph looks strange 
  // So filter out duplicate time entries
  background(data, options, graphDiv);
  scatter(data, options, graphDiv);
  avgline(data, options, graphDiv);
  divider(data, options, graphDiv);
}

getMatches(function(err, res) {
  if (err) {
    // TODO: Display error
    // console.error(err);
  } else {
    // Add time (hour+(minute/60)) and sort
    data = res
      .map((e) => {
        e.time = getTimeFromTimestamp(e.date);
        return e;
      })
      .sort((a, b) => {
        return a.time - b.time
      });
    data = sortedUniqBy(data, 'time');
    renderGraphs();
  }
});
