const Chartist = require('chartist');
const regions = require('../regions');
function formatDataLineGraph(data, timeframe) {
  let toTake = 6;
  if (timeframe === 'week') {
    toTake *= 7;
  }
  const seriesData = data
    .filter((stats) => {
      if (stats.time[timeframe] === null) return false;
      return true;
    })
    .filter((e, i) => (i % toTake) === 0)
    .reduce((regionData, stats) => {
      // Series
      for (const region in stats.games) {
        const regionInfo = regions[region];
        if (!regionInfo || regionInfo.enabled === false) continue;
        const games = stats.games[region];
        const i = regionInfo.index;
        if (regionData[i] === undefined) regionData[i] = [];

        let sumCount = 0;
        const numToRemove = Math.floor(games.length * 0.2);
        const sum = games
          .sort((a, b) => b - a)
          .slice(numToRemove, games.length - numToRemove)
          .reduce((sum, mmr) => {
            sumCount++;
            return sum + mmr;
          }, 0);
        const avg = sum / sumCount;

        regionData[i] = regionData[i].concat({
          x: stats.time[timeframe],
          y: avg,
          meta: regionInfo.lineColor
        });
      }
      return regionData;
    }, []);
  const sortedSeriesData = seriesData.map((series) => {
    return series.sort((a, b) => a.x - b.x);
  });
  return {series: sortedSeriesData.filter(e => e !== undefined)}
}

function avgline(data, options, graphDiv) {
  const {vmin, vmax, vsteps} = options.verticalBounds;
  const {hmin, hmax, hsteps} = options.horizontalBounds;

  const div = document.createElement('div');
  for (const key in options.style) {
    div.style[key] = options.style[key];
  }
  div.id = 'avg-line-chart';
  graphDiv.appendChild(div);

  const lineData = formatDataLineGraph(data, options.timeframe);
  const lineChart = new Chartist.Line('#avg-line-chart',
    lineData,
    {
      chartPadding: {
        right: 40
      },
      showPoint: false,
      axisX: {
        type: Chartist.FixedScaleAxis,
        low: hmin,
        high: hmax,
        divisor: hsteps,
        showLabel: false,
        showGrid: false
      },
      axisY: {
        type: Chartist.FixedScaleAxis,
        low: vmin,
        high: vmax,
        divisor: vsteps,
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

export { avgline };
