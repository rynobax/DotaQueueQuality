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
function mix (color_1, color_2, weight) {
  if(color_1.substr(0, 1) === '#') color_1 = color_1.substr(1);
  if(color_2.substr(0, 1) === '#') color_2 = color_2.substr(1);
  function d2h(d) { return d.toString(16); }  // convert a decimal value to hex
  function h2d(h) { return parseInt(h, 16); } // convert a hex value to decimal 

  weight = (typeof(weight) !== 'undefined') ? weight : 50; // set the weight to 50%, if that argument is omitted

  var color = "#";

  for(var i = 0; i <= 5; i += 2) { // loop through each of the 3 hex pairs—red, green, and blue
    var v1 = h2d(color_1.substr(i, 2)), // extract the current pairs
        v2 = h2d(color_2.substr(i, 2)),
        
        // combine the current pairs from each source color, according to the specified weight
        val = d2h(Math.floor(v2 + (v1 - v2) * (weight / 100.0))); 

    while(val.length < 2) { val = '0' + val; } // prepend a '0' if val results in a single digit
    
    color += val; // concatenate val to our new color string
  }
    
  return color; // PROFIT!
};
/*eslint-enable*/

function getOpacity(date) {
  const now = new Date();
  const nowHours = now.getHours();
  const nowMinutes = now.getMinutes();
  const thenHours = date.getHours();
  const thenMinutes = date.getMinutes();

  let hoursDiff = nowHours - thenHours;
  let minutesDiff = nowMinutes - thenMinutes;
  if (minutesDiff < 0) {
    hoursDiff--;
    minutesDiff += 60;
  }
  if (hoursDiff < 0) hoursDiff += 24;

  const minuteDiffScaled = (minutesDiff * (100 / 60)) / 100;
  const diff = hoursDiff + minuteDiffScaled;
  let opacity = ((24 - diff) / 24);
  const squeezeFactor = 0.4;
  opacity *= (1 - squeezeFactor);
  opacity += squeezeFactor;
  return opacity * 100;
}

function getTimeFromTimestamp(timestamp) {
  if (typeof timestamp !== 'number') timestamp = Number(timestamp);
  const date = new Date(timestamp);
  const now = new Date();
  const nowDay = now.getDay();
  const nowHour = now.getHours();
  const nowMinute = now.getMinutes();
  const day = date.getDay();
  const hour = date.getHours()
  const minute = date.getMinutes();
  const minuteScaled = (minute * (100 / 60)) / 100;
  const time = hour + minuteScaled;
  const diff = Math.abs(nowDay - day);
  if (diff === 1 && nowHour >= hour && nowMinute > minute) {
    return null;
  } else if (diff > 1) {
    return null;
  }
  return time;
}

export { getGraphBounds, mix, getOpacity, getTimeFromTimestamp };
