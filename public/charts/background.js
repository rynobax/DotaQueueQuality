const Chartist = require('chartist');

function background(data, options) {
  const {min, max, steps} = options.bounds;

  const body = document.body;
  const div = document.createElement('div');
  div.style.height = '100vh';
  div.id = 'chart-background';
  body.appendChild(div);

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
