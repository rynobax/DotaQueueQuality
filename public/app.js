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
require('./fonts/Roboto/index.scss');

/********/
/* Page */
/********/

let data = {};

const body = document.body;
body.style.height = '100%';
body.style.margin = '0';
body.style.background = backgroundColor;
body.style.overflow = 'hidden';

/**********/
/* Header */
/**********/

const header = document.createElement('div');
const headerHeight = 100;
body.appendChild(header);
header.id = 'header'
header.style.height = headerHeight + 'px';
header.style.display = 'flex';
header.style.justifyContent = 'space-around';

for (const region in regions) {
  /* Button */
  const { name } = regions[region];
  const regionDiv = document.createElement('div');
  regionDiv.id = name;
  regionDiv.onclick = (ev) => {
    regions[region].enabled = !regions[region].enabled;
    styleHeader();
    renderData();
  };
  regionDiv.style.flex = '1';
  regionDiv.style.margin = '10px';
  regionDiv.style.maxWidth = '200px';
  regionDiv.style.display = 'flex';
  regionDiv.style.flexDirection = 'column';
  regionDiv.style.justifyContent = 'center';

  /* Text */
  const regionTextDiv = document.createElement('div');
  regionTextDiv.style.fontFamily = 'Roboto';
  regionTextDiv.style.textAlign = 'center'
  regionTextDiv.style.margin = 'auto';
  regionDiv.appendChild(regionTextDiv);
  const regionText = document.createTextNode(name);
  regionTextDiv.appendChild(regionText);

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

const bgDiv = document.createElement('div');
bgDiv.id = 'bgDiv';
graphDiv.appendChild(bgDiv);

const dataDiv = document.createElement('div');
dataDiv.id = 'dataDiv';
graphDiv.appendChild(dataDiv);

function clearDiv(div) {
  // Remove all children
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
}

function getOptions() {
  return {
    bounds: getGraphBounds(data),
    style: {
      height: graphDiv.style.height,
      top: headerHeight,
      left: 0,
      position: 'absolute',
      width: '100vw'
    }
  };
}

function renderData() {
  clearDiv(dataDiv);
  const options = getOptions();
  scatter(data, options, dataDiv);
  avgline(data, options, dataDiv);
}

function renderBackground() {
  clearDiv(bgDiv);
  const options = getOptions();
  background(data, options, bgDiv);
  divider(data, options, bgDiv);
}

function initGraphs() {
  graphDiv.style.height = window.innerHeight - headerHeight + 'px';
  renderBackground();
  renderData();
}

let resizeTimeout;
window.onresize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(initGraphs, 400);
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
      .map((e) => {
        for (const region in e.games) {
          e.games[region] = e.games[region].filter(e => e > 5500);
        }
        return e;
      })
      .sort((a, b) => {
        return a.time - b.time
      });
    data = sortedUniqBy(data, 'time');
    initGraphs();
  }
});
