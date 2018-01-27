import Game from './Game';

import Net from '../extras/system/Net';

// Local vars

let locked = false;
let fullScreen = false;
let match = {
    name: null,
    state: 'splash',
    players: 0,
    color: null
};

function init() {
    const urlMatch = window.location.href.split('#');
	if (urlMatch[1]) {
		setTimeout(() => {
			(document.getElementById('lobby_name') as HTMLInputElement).value = urlMatch[1];
		}, 10);
    }

    // Bind UI controls
    document.getElementById('lobby_btn').onclick = handleJoin;
}

function handleJoin(param) {
  if (!locked) {
    locked = true;
    const tag = document.getElementById('game');

    // Enter full screen
    if (tag.hasOwnProperty('requestFullscreen')) tag.requestFullscreen();
    else if (tag.hasOwnProperty('webkitRequestFullscreen')) tag.webkitRequestFullscreen();

    const matchName = '' + (document.getElementById('lobby_name') as HTMLInputElement).value.toLowerCase();

    if (matchName === '') {
      locked = false;
      return false;
    }

    match.name = matchName;
    Net.subscribe('lobby.join', handleReply, true);
    Net.send('lobby.join', {
        match: matchName
    });
  }
}

function handleReply(packet) {
  locked = false;
  if (packet.state) {
    Net.subscribe('lobby.update', handleMatchUpdate);
    match.state = packet.state;
    // Show lobby
    enterLobby();
  }
  else {
    alert('Match unavailable');
  }

}

function enterLobby() {
  document.getElementById('lobby').style.display = 'block';
  document.getElementById('splash').style.display = 'none';
  document.getElementById('lobby_name_label').innerHTML = match.name;

}

function handleReady() {
  if (!locked) {
    locked = true;
    Net.send('lobby.update', { state: 'game', match: match.name });
    setTimeout(() => { locked = false }, 2000);
  }
}

function handleMatchUpdate(packet) {
  match = packet;
  if (match.state === 'game') {
    new Game(document.getElementById('game') as HTMLDivElement);
    document.getElementById('lobby').style.display = 'none';
  }
  else {
    for(let i =0; i< 8; i++) {
        if (match.color === i) {
            document.getElementById(`player${i + 1}`).innerHTML = 'ME';
        }
        document.getElementById(`player${i + 1}`).className = (i < match.players)?'player':'player none';
    }
  }
}

function handleQuit() {
  window.location.href = '/';
}

init();
