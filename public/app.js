const Chartist = require('chartist');
const chartistCss = require('../node_modules/chartist/dist/chartist.css');
const customCss = require('./custom.scss');
const sampleData = require('./sampleData');
const { formatDataLineGraph, formatDataScatterPlot } = require('./formatData');

function styleApp() { 
  const body = document.body;
  body.style.background = 'grey';
  body.style.height = '100vh';
  body.style.margin = '0';
  body.style.overflow = 'hidden';
}

function addChart(data) {
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
        low: 5000,
        high: 8000,
        divisor: 6
      }
  });

  scatterPlot.on('draw', function(context) {
    if(context.type === 'point') {
      const styles = [
        'stroke: blue',
        `stroke-opacity: ${context.meta}`
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

  const lineChart = new Chartist.Line('#line-chart', 
  formatDataLineGraph(data),
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
      low: 5000,
      high: 8000,
      divisor: 6,
      showLabel: false,
      showGrid: false
    }
  });
  lineChart.on('draw', function(context) {
    if(context.type === 'line') {
      const styles = [
        'stroke: cyan',
        `stroke-opacity: ${context.meta}`
      ];
      context.element.attr({
        style: styles.join('; ')
      });
    }
  });
}

styleApp();
addChart(sampleData);