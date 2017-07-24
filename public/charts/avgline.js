const Chartist = require('chartist');
const regions = require('../regions');
function formatDataLineGraph(data) {
  const seriesData = data.reduce((regionData, stats) => {
    // Series
    for (const region in stats.games) {
      const regionInfo = regions[region];
      if (!regionInfo || regionInfo.enabled === false) continue;
      const games = stats.games[region];
      const i = regionInfo.index;
      if (regionData[i] === undefined) regionData[i] = [];

      let sumCount = 0;
      const sum = games.sort((a, b) => b - a).slice(0, 4).reduce((sum, mmr) => {
        sumCount++;
        return sum + mmr;
      }, 0);
      const avg = sum / sumCount;

      regionData[i] = regionData[i].concat({
        x: stats.time,
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
  const {min, max, steps} = options.bounds;

  const div = document.createElement('div');
  for (const key in options.style) {
    div.style[key] = options.style[key];
  }
  div.id = 'avg-line-chart';
  graphDiv.appendChild(div);

  const lineData = formatDataLineGraph(data);
  const lineChart = new Chartist.Line('#avg-line-chart',
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

export { avgline };
