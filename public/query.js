const endpoint = 'https://5zemss3woc.execute-api.us-east-1.amazonaws.com/prod/matches';

function getMatches(cb) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      try {
        const json = JSON.parse(this.responseText);
        const items = json.Items;
        const data = items.map((match) => {
          const date = match.date.N
          const games = JSON.parse(match.games.S);
          return {
            date,
            games
          }
        });
        cb(null, data);
      } catch (err) {
        cb(err, null);
      }
    } else {
      if (this.readyState === 4) {
        cb(new Error('Status code ' + this.status), null);
      }
    }
  };
  xhttp.open('POST', endpoint, true);
  xhttp.send();
}

export { getMatches };
