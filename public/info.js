const rawText = `
Data is collected from the Dota 2 Client every 10 minutes.
Game region is estimated by using the top region found in the player's recent games.
`;
const textArr = [];
rawText.split('\n').forEach((text) => {
  textArr.push(document.createTextNode(text));
  textArr.push(document.createElement('br'));
});
const infoModalContent = document.createElement('div');
infoModalContent.classList.add('modal-content');
infoModalContent.style.fontFamily = 'Roboto';
infoModalContent.style.textAlign = 'center';
const title = document.createElement('h2');
const titleText = document.createTextNode('Dota Queue Monitor');
title.appendChild(titleText);
infoModalContent.appendChild(title);
textArr.forEach((node) => {
  infoModalContent.appendChild(node);
});
module.exports = infoModalContent;
