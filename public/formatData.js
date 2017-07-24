const regions = require('./regions');
const { getOpacity, shadeBlend } = require('./util');
const { backgroundColor } = require('./colors');

function getTimeFromTimestamp(timestamp){
  if(typeof timestamp !== Number) timestamp = Number(timestamp);
  const date = new Date(timestamp);
  const hour = date.getHours()
  const minutes = date.getMinutes();
  const minutesScaled = (minutes * (100/60)) / 100;
  const time = hour + minutesScaled;
  return time;
}

function formatDataScatterPlot(data) {
  const seriesData =  data.reduce((regionData, stats, i) => {
    const time = getTimeFromTimestamp(stats.date);
    const then = new Date(Number(stats.date));

    // Series
    for(const region in stats.games) {
      const regionInfo = regions[region];
      if(!regionInfo || regionInfo.enabled === false) continue;
      const games = stats.games[region];
      const i = regionInfo.index;
      if(regionData[i] === undefined) regionData[i] = [];

      regionData[i] = regionData[i].concat(games.map((mmr) => {
        return {
          x: time,
          y: mmr,
          meta: shadeBlend(getOpacity(then).toFixed(2), backgroundColor, regionInfo.dotColor)
        }
      }));
      return regionData;
    }
  }, []);
  return {series: seriesData};
}

function formatDataLineGraph(data) {
  const seriesData = data.reduce((regionData, stats, i) => {
    const time = getTimeFromTimestamp(stats.date);

    // Series
    for(const region in stats.games) {
      const regionInfo = regions[region];
      if(!regionInfo || regionInfo.enabled === false) continue;
      const games = stats.games[region];
      const i = regionInfo.index;
      if(regionData[i] === undefined) regionData[i] = [];

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

module.exports = {
  formatDataLineGraph,
  formatDataScatterPlot
}
