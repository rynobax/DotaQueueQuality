const Chartist = require('chartist');
const regions = require('../regions');
const { getOpacity, shadeBlend, getTimeFromTimestamp } = require('../util');
const { backgroundColor } = require('../colors');

function formatDataScatterPlot(data) {
  const seriesData = data.reduce((regionData, stats) => {
    const time = getTimeFromTimestamp(stats.date);
    const then = new Date(Number(stats.date));

    // Series
    for (const region in stats.games) {
      const regionInfo = regions[region];
      if (!regionInfo || regionInfo.enabled === false) continue;
      const games = stats.games[region];
      const i = regionInfo.index;
      if (regionData[i] === undefined) regionData[i] = [];

      regionData[i] = regionData[i].concat(games.map((mmr) => {
        return {
          x: time,
          y: mmr,
          meta: shadeBlend(getOpacity(then).toFixed(2), backgroundColor, regionInfo.dotColor)
        }
      }));
      return regionData;
    }
  }, []);
  return {series: seriesData};
}

function scatter(data, options) {
  const {min, max, steps} = options.bounds;

  const body = document.body;
  const div = document.createElement('div');
  div.style.top = 0;
  div.style.left = 0;
  div.style.position = 'fixed';
  div.style.height = '100vh';
  div.style.width = '100vw';
  div.id = 'scatter-plot';
  body.appendChild(div);

  const scatterPlot = new Chartist.Line('#scatter-plot',
    // Data
    formatDataScatterPlot(data),
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
        'stroke-width: 5px',
        'stroke-linecap: round'
      ];
      context.element.attr({
        style: styles.join('; ')
      });
    }
  });

  scatterPlot.on('draw', function(context) {
    if (context.type === 'point') {
      const styles = [
        `stroke: ${context.meta}`,
        'stroke-width: 5px',
        'stroke-linecap: round'
      ];
      context.element.attr({
        style: styles.join('; ')
      });
    }
  });
}

export { scatter };
