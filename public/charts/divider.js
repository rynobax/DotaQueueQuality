const Chartist = require('chartist');
const { getTimeFromTimestamp } = require('../util');
const { dividerColor } = require('../colors');
function formatDataDividerGraph(data, min, max) {
  const now = new Date();
  const time = getTimeFromTimestamp(now.getTime());
  return {series: [[
    {
      x: time,
      y: min
    },
    {
      x: time + 0.00001,
      y: max
    }
  ]]}
}

function divider(data, options, graphDiv) {
  const {min, max, steps} = options.bounds;

  const div = document.createElement('div');
  for (const key in options.style) {
    div.style[key] = options.style[key];
  }
  div.id = 'divider';
  div.style.zIndex = 1;
  graphDiv.appendChild(div);

  const lineData = formatDataDividerGraph(data, min, max);
  const lineChart = new Chartist.Line('#divider',
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
