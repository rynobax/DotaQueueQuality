const Chartist = require('chartist');
const { getTimeFromTimestamp } = require('../util');
const { dividerColor } = require('../colors');
function formatDataDividerGraph(data, min, max, timeframe) {
  const now = new Date();
  const time = getTimeFromTimestamp(now.getTime());
  return {series: [[
    {
      x: time[timeframe],
      y: min
    },
    {
      x: time[timeframe] + 0.00001,
      y: max
    }
  ]]}
}

function divider(data, options, graphDiv) {
  const {vmin, vmax, vsteps} = options.verticalBounds;
  const {hmin, hmax, hsteps} = options.horizontalBounds;

  const div = document.createElement('div');
  for (const key in options.style) {
    div.style[key] = options.style[key];
  }
  div.id = 'divider';
  div.style.zIndex = 1;
  graphDiv.appendChild(div);

  const lineData = formatDataDividerGraph(data, vmin, vmax, options.timeframe);
  const lineChart = new Chartist.Line('#divider',
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
        `stroke: ${dividerColor}`,
        'stroke-width: 3px',
        'stroke-dasharray: 25px 8px;'
      ];
      context.element.attr({
        style: styles.join('; ')
      });
    }
  });
}

export { divider };
