const Chartist = require('chartist');

function background(data, options, graphDiv) {
  const {min, max, steps} = options.bounds;

  const div = document.createElement('div');
  for (const key in options.style) {
    div.style[key] = options.style[key];
  }
  div.id = 'chart-background';
  graphDiv.appendChild(div);

  Chartist.Line('#chart-background',
    // Data
    {},
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
        divisor: 24
      },
      axisY: {
        type: Chartist.FixedScaleAxis,
        low: min,
        high: max,
        divisor: steps
      }
    }
  );
}

export { background };
