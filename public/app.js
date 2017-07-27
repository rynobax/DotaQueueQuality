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
require('./modal.css');

/* Google Analytics */
require('./google-analytics');

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

function applyHeaderStyle(div) {
  div.style.flex = '1';
  div.style.margin = '10px';
  div.style.maxWidth = '200px';
  div.style.display = 'flex';
  div.style.padding = '15px';
  div.style.flexDirection = 'column';
  div.style.justifyContent = 'center';
}

function applyTextStyle(text) {
  text.style.fontFamily = 'Roboto';
  text.style.textAlign = 'center'
  text.style.margin = 'auto';
}

// Time selector

// Region buttons
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
  applyHeaderStyle(regionDiv);

  /* Text */
  const regionTextDiv = document.createElement('div');
  applyTextStyle(regionDiv);
  regionDiv.appendChild(regionTextDiv);
  const regionText = document.createTextNode(name);
  regionTextDiv.appendChild(regionText);

  header.appendChild(regionDiv);
}

// Info Modal
const infoModal = document.createElement('div');
infoModal.classList.add('modal');
infoModal.appendChild(require('./info'));
body.appendChild(infoModal);
window.onclick = function(event) {
  if (event.target === infoModal) {
    infoModal.style.display = 'none';
  }
}

// Info Button
const infoDiv = document.createElement('div');
applyHeaderStyle(infoDiv);
const infoImage = document.createElement('img');
infoImage.src = require('./img/info.svg');
infoImage.style.width = '100%';
infoImage.style.height = '100%';
infoDiv.appendChild(infoImage);
header.appendChild(infoDiv);
infoImage.onclick = () => {
  infoModal.style.display = 'block';
}

// Called when buttons are pressed
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
