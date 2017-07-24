const { getMatches } = require('./query');
const { getGraphBounds } = require('./util');
const { backgroundColor } = require('./colors');
const { background } = require('./charts/background');
const { line } = require('./charts/line');
const { scatter } = require('./charts/scatter');

function styleApp() {
  require('../node_modules/chartist/dist/chartist.css');
  const body = document.body;
  body.style.background = backgroundColor;
  body.style.height = '100vh';
  body.style.margin = '0';
  body.style.overflow = 'hidden';
}

styleApp();
getMatches(function(err, data) {
  if (err) {
    // TODO: Display error
    // console.error(err);
  } else {
    const options = {
      bounds: getGraphBounds(data)
    };
    background(data, options);
    line(data, options);
    scatter(data, options);
  }
});
