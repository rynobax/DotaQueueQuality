const Chartist = require('chartist');
const chartistCss = require('../node_modules/chartist/dist/chartist.css');
const { formatDataLineGraph, formatDataScatterPlot } = require('./formatData');
const { getMatches } = require('./query');
const { getGraphBounds } = require('./util');
const { backgroundColor } = require('./colors');

function styleApp() { 
  const body = document.body;
  body.style.background = backgroundColor;
  body.style.height = '100vh';
  body.style.margin = '0';
  body.style.overflow = 'hidden';
}

function addChart(data, options) {
  const {min, max, steps} = options.bounds;

  const body = document.body;
  const chartDiv = document.createElement("div");
  chartDiv.style.height = '100vh';
  chartDiv.id = 'scatter-plot';
  body.appendChild(chartDiv);

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
        divisor: 24
      },
      axisY: {
        type: Chartist.FixedScaleAxis,
        low: min,
        high: max,
        divisor: steps
      }
  });

  scatterPlot.on('draw', function(context) {
    if(context.type === 'point') {
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

  const lineChartDiv = document.createElement("div");
  lineChartDiv.style.top = 0;
  lineChartDiv.style.left = 0;
  lineChartDiv.style.position = 'fixed';
  lineChartDiv.style.height = '100vh';
  lineChartDiv.style.width = '100vw';
  lineChartDiv.id = 'line-chart';
  body.appendChild(lineChartDiv);

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
  });
  lineChart.on('draw', function(context) {
    if(context.type === 'line') {
      console.log(context);
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

styleApp();
getMatches(function(err, data) {
  if(err) {
    console.error(err);
  } else {
    const options = {
      bounds: getGraphBounds(data)
    };
    addChart(data, options);
  }
});