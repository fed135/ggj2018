
// -- lobby

import Net from '../extras/system/Net';

function init() {
  this.label = window.isMobileDevice?'Play':'Spectate';
		this.locked = false;

		this.fullScreen = false;

		const urlMatch = window.location.href.split('#');
		if (urlMatch[1]) {
			setTimeout(() => {
				document.getElementById('lobby_name').value = urlMatch[1];
			}, 10);
		}
}

function handleClick(param) {
  if (!this.locked) {
    this.locked = true;
    const tag = document.body;
    const fsEvent = (tag.requestFullScreen)?"requestFullScreen":(tag.mozRequestFullScreen)?"mozRequestFullScreen":(tag.webkitRequestFullScreenWithKeys)?"webkitRequestFullScreenWithKeys":(tag.webkitRequestFullScreen)?"webkitRequestFullScreen":"FullscreenError";

    // Enter full screen
    tag[fsEvent]();	

    const match = '' + document.getElementById('lobby_name').value.toLowerCase();

    if (match === '') {
      this.locked = false;
      return false;
    }

    Net.subscribe('lobby.join', this.handleReply.bind(this));
    Net.send('lobby.join', { match, role: this.label.toLowerCase() });
  }
}

function handleReply(packet) {
  this.locked = false;
  Net.unsubscribe('lobby.join', this.handleReply.bind(this));
  if (packet.state) {
    Net.match = packet;
    this.props.nav('lobby');
  }
  else {
    alert('Match unavailable');
  }

}

function enterLobby() {
  this.role = window.isMobileDevice?'play':'spectate';
  this.locked = false;
  Net.subscribe('lobby.update', this.handleUpdate.bind(this));
}

function handleClick() {
  if (!this.locked) {
    this.locked = true;
    Net.send('lobby.update', { state: 'game', match: Net.match.name });
    setTimeout(() => { this.locked = false }, 2000);
  }
}

function handleUpdate(packet) {
  Net.match = packet;
  if (Net.match.state === 'game') {
    this.props.nav('controller');
  }
  else this.setState(this.state);
}

function buildHeads() {
  return Array.from(new Array(MAX_PLAYERS))
    .map((i, count) => {
      const label = 'player_' + count;
      const state = label + ' head ' + ((count < Net.match.players)? 'activated' : 'deactivated');
      return <div class={ state }>{ this.isYou(count) }</div> 
    })
}

function isYou(index) {
  if (Net.match.color === index) {
    return <div class="you">You</div>;
  }
  else {
    return <div/>;
  }
}

function handleQuit() {
  window.location = '/';
}