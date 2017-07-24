const Chartist = require('chartist');
const regions = require('../regions');
const { getOpacity, mix } = require('../util');
const { backgroundColor } = require('../colors');

function formatDataScatterPlot(data) {
  const seriesDataObj = data.reduce((regionData, stats) => {
    const then = new Date(Number(stats.date));

    // Series
    for (const region in stats.games) {
      const regionInfo = regions[region];
      if (!regionInfo || regionInfo.enabled === false) continue;
      const games = stats.games[region];
      if (regionData[region] === undefined) regionData[region] = [];

      regionData[region] = regionData[region].concat(games.map((mmr) => {
        return {
          x: stats.time,
          y: mmr,
          meta: mix(regionInfo.dotColor.slice(1), backgroundColor.slice(1), getOpacity(then).toFixed(0))
        }
      }));
    }
    return regionData;
  }, {});
  const seriesData = [];
  for (const key in seriesDataObj) {
    if (seriesDataObj.hasOwnProperty(key)) {
      seriesData.push(seriesDataObj[key]);
    }
  }
  return {series: seriesData.filter(e => e !== undefined)};
}

function scatter(data, options, graphDiv) {
  const {min, max, steps} = options.bounds;

  const div = document.createElement('div');
  for (const key in options.style) {
    div.style[key] = options.style[key];
  }
  div.id = 'scatter-plot';
  graphDiv.appendChild(div);

  const scatterData = formatDataScatterPlot(data);
  const scatterPlot = new Chartist.Line('#scatter-plot',
    // Data
    scatterData,
    // Options
    {
      showLine: false,
      chartPadding: {
        right: 40
      },
      axisX: {
        type: Chartist.FixedScaleAxis,
        low: 0,
        high: 24,
        divisor: 24,
        showLabel: false,
        showGrid: false
      },
      axisY: {
        type: Chartist.FixedScaleAxis,
        low: min,
        high: max,
        divisor: steps,
        showLabel: false,
        showGrid: false
      }
    }
  );

  scatterPlot.on('draw', function(context) {
    if (context.type === 'point') {
      const styles = [
        `stroke: ${context.meta}`,
        'stroke-width: 4px',
        'stroke-linecap: round'
      ];
      context.element.attr({
        style: styles.join('; ')
      });
    }
  });
}

export { scatter };
