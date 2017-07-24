const Chartist = require('chartist');
const regions = require('../regions');
const { getTimeFromTimestamp } = require('../util');
function formatDataLineGraph(data) {
  const seriesData = data.reduce((regionData, stats) => {
    const time = getTimeFromTimestamp(stats.date);

    // Series
    for (const region in stats.games) {
      const regionInfo = regions[region];
      if (!regionInfo || regionInfo.enabled === false) continue;
      const games = stats.games[region];
      const i = regionInfo.index;
      if (regionData[i] === undefined) regionData[i] = [];

      const sum = games.reduce((sum, mmr) => {
        return sum + mmr;
      });
      const avg = sum / games.length;

      regionData[i] = regionData[i].concat({
        x: time,
        y: avg,
        meta: regionInfo.lineColor
      });
    }
    return regionData;
  }, []);
  const sortedSeriesData = seriesData.map((series) => {
    return series.sort((a, b) => a.x - b.x);
  });
  return {series: sortedSeriesData}
}

function line(data, options) {
  const {min, max, steps} = options.bounds;

  const body = document.body;
  const div = document.createElement('div');
  div.style.top = 0;
  div.style.left = 0;
  div.style.position = 'fixed';
  div.style.height = '100vh';
  div.style.width = '100vw';
  div.id = 'line-chart';
  body.appendChild(div);

  const lineData = formatDataLineGraph(data);
  const lineChart = new Chartist.Line('#line-chart',
    lineData,
    {
      chartPadding: {
        right: 40
      },
      showPoint: false,
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
  lineChart.on('draw', function(context) {
    if (context.type === 'line') {
      const styles = [
        `stroke: ${context.series[0].meta}`,
        'stroke-width: 4px'
      ];
      context.element.attr({
        style: styles.join('; ')
      });
    }
  });
}

export { line };
