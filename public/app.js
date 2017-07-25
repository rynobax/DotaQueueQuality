const { getMatches } = require('./query');
const { getGraphBounds } = require('./util');
const { backgroundColor } = require('./colors');
const { getTimeFromTimestamp, mix } = require('./util');
const sortedUniqBy = require('lodash.sorteduniqby');
const regions = require('./regions');

/* Charts */
const { background } = require('./charts/background');
const { avgline } = require('./charts/avgline');
const { scatter } = require('./charts/scatter');
const { divider } = require('./charts/divider');

/* CSS */
require('../node_modules/chartist/dist/chartist.css');

/********/
/* Page */
/********/

let data = {};

const body = document.body;
body.style.height = '100%';
body.style.margin = '0';
body.style.background = backgroundColor;

/**********/
/* Header */
/**********/

const header = document.createElement('div');
const headerHeight = 100;
body.appendChild(header);
header.id = 'header'
header.style.height = headerHeight + 'px';
header.style.display = 'flex';
for (const region in regions) {
  const { name } = regions[region];
  const regionDiv = document.createElement('div');
  regionDiv.id = name;
  regionDiv.style.flex = '1';
  regionDiv.style.margin = '10px';
  regionDiv.onclick = (ev) => {
    regions[region].enabled = !regions[region].enabled;
    styleHeader();
    renderGraphs();
  };
  const regionText = document.createTextNode(name);
  regionDiv.appendChild(regionText);
  header.appendChild(regionDiv);
}
styleHeader();
function styleHeader() {
  for (const region in regions) {
    const { lineColor, enabled, name } = regions[region];
    const regionDiv = document.getElementById(name);
    regionDiv.style.background = enabled ? lineColor : mix(backgroundColor, lineColor, 80);
  }
}

/**********/
/* Graphs */
/**********/

const graphDiv = document.createElement('div');
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

/*************/
/* Load Data */
/*************/

getMatches(function(err, res) {
  if (err) {
    // TODO: Display error
    const headerNode = document.createElement('H1');
    const errorMessage = document.createTextNode(err);
    headerNode.style.color = 'darkred';
    headerNode.style.textAlign = 'center';
    headerNode.appendChild(errorMessage);
    body.appendChild(headerNode);
  } else {
    // Add time (hour+(minute/60)) and sort
    data = res
      .map((e) => {
        e.time = getTimeFromTimestamp(e.date);
        return e;
      })
      .filter((e) => {
        // Filter out results that are not in past 24 hours
        return e.time !== null;
      })
      .sort((a, b) => {
        return a.time - b.time
      });
    data = sortedUniqBy(data, 'time');
    renderGraphs();
  }
});
