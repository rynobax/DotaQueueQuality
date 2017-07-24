function getGraphBounds(data) {
  const {min, max} = data.reduce((returnObj, {games}) => {
    for (const region in games) {
      const { regionMin, regionMax } = games[region].reduce(({regionMin, regionMax}, mmr, i) => {
        if (i === 0) {
          return { regionMin: mmr, regionMax: mmr }
        } else if (mmr < regionMin) {
          return { regionMin: mmr, regionMax: regionMax }
        } else if (mmr > regionMax) {
          return { regionMin: regionMin, regionMax: mmr }
        } else {
          return { regionMin: regionMin, regionMax: regionMax }
        }
      }, {});

      if (returnObj.min === null) {
        returnObj.min = regionMin;
        returnObj.max = regionMax;
      }

      if (regionMin < returnObj.min) {
        returnObj.min = regionMin;
      }

      if (regionMax > returnObj.max) {
        returnObj.max = regionMax;
      }
    }

    return returnObj;
  }, {min: null, max: null});
  const maxAdj = Math.ceil(max / 500) * 500;
  const minAdj = Math.floor(min / 500) * 500;
  return {
    max: maxAdj,
    min: minAdj,
    steps: (maxAdj - minAdj) / 500
  }
}

/*eslint-disable*/
function shadeBlend(p,c0,c1) {
    var n=p<0?p*-1:p,u=Math.round,w=parseInt;
    if(c0.length>7){
        var f=c0.split(","),t=(c1?c1:p<0?"rgb(0,0,0)":"rgb(255,255,255)").split(","),R=w(f[0].slice(4)),G=w(f[1]),B=w(f[2]);
        return "rgb("+(u((w(t[0].slice(4))-R)*n)+R)+","+(u((w(t[1])-G)*n)+G)+","+(u((w(t[2])-B)*n)+B)+")"
    }else{
        var f=w(c0.slice(1),16),t=w((c1?c1:p<0?"#000000":"#FFFFFF").slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF;
        return "#"+(0x1000000+(u(((t>>16)-R1)*n)+R1)*0x10000+(u(((t>>8&0x00FF)-G1)*n)+G1)*0x100+(u(((t&0x0000FF)-B1)*n)+B1)).toString(16).slice(1)
    }
}
/*eslint-enable*/

function getOpacity(date) {
  const now = new Date();
  const nowHours = now.getUTCHours();
  const nowMinutes = now.getUTCMinutes();
  const thenHours = date.getUTCHours();
  const thenMinutes = date.getUTCMinutes();
  const hoursDiff = nowHours - thenHours;
  const minuteDiff = nowMinutes - thenMinutes;
  const minuteDiffScaled = (minuteDiff * (100 / 60)) / 100;
  const diff = hoursDiff + minuteDiffScaled;
  const opacity = (24 - diff) / 24;
  return opacity;
}

function getTimeFromTimestamp(timestamp) {
  if (typeof timestamp !== 'number') timestamp = Number(timestamp);
  const date = new Date(timestamp);
  const hour = date.getHours()
  const minutes = date.getMinutes();
  const minutesScaled = (minutes * (100 / 60)) / 100;
  const time = hour + minutesScaled;
  return time;
}

export { getGraphBounds, shadeBlend, getOpacity, getTimeFromTimestamp };
