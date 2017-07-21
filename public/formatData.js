function getTimeFromTimestamp(timestamp){
  const date = new Date(timestamp);
  const hour = date.getUTCHours()
  const minutes = date.getUTCMinutes();
  const minutesScaled = (minutes * (100/60)) / 100;
  const time = hour + minutesScaled;
  return time;
}

function formatDataScatterPlot(data) {
  return data.reduce((obj, stats, i) => {
    const time = getTimeFromTimestamp(stats.date);
    const then = new Date(stats.date);

    const now = new Date();
    function getOpacity(date) {
      const nowHours = now.getUTCHours();
      const nowMinutes = now.getUTCMinutes();
      const thenHours = date.getUTCHours();
      const thenMinutes = date.getUTCMinutes();
      const hoursDiff = nowHours - thenHours;
      const minuteDiff = nowMinutes - thenMinutes;
      const minuteDiffScaled = (minuteDiff * (100/60)) / 100;
      const diff = hoursDiff + minuteDiffScaled;
      const opacity = (24 - diff) / 24;
      return opacity;
    }

    // Series
    obj.series[0] = obj.series[0].concat(stats.data.EUROPE.map((mmr) => {
      return {
        x: time,
        y: mmr,
        meta: getOpacity(then).toFixed(2)
      }
    }));
    return obj;
  }, {series: [[]]});
}

function formatDataLineGraph(data) {
  return data.reduce((obj, stats, i) => {
    const time = getTimeFromTimestamp(stats.date);

    // Series
    const games = stats.data.EUROPE;
    const sum = games.reduce((sum, mmr) => {
      return sum + mmr;
    });
    const avg = sum / games.length;
    obj.series[0] = obj.series[0].concat({
      x: time,
      y: avg
    });
    return obj;
  }, {series: [[]]});
}

module.exports = {
  formatDataLineGraph,
  formatDataScatterPlot
}
