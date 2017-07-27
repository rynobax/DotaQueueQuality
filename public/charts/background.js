const Chartist = require('chartist');

function background(data, options, graphDiv) {
  const {vmin, vmax, vsteps} = options.verticalBounds;
  const {hmin, hmax, hsteps} = options.horizontalBounds;

  const div = document.createElement('div');
  for (const key in options.style) {
    div.style[key] = options.style[key];
  }
  div.id = 'chart-background';
  graphDiv.appendChild(div);

  const bg = Chartist.Line('#chart-background',
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
        low: hmin,
        high: hmax,
        divisor: hsteps
      },
      axisY: {
        type: Chartist.FixedScaleAxis,
        low: vmin,
        high: vmax,
        divisor: vsteps
      }
    }
  );

  // Fix labels
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  if (options.timeframe === 'week') {
    bg.on('draw', function(context) {
      if (context.type === 'label') {
        if (context.text >= 0 && context.text < 7) {
          context.element._node.childNodes[0].textContent = days[context.text];
        }
      }
    });
  }
}

export { background };
