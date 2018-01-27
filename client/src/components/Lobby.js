import Inferno from 'inferno';
import Component from 'inferno-component';
import Net from '../system/Net';

const MAX_PLAYERS = 8;

class Lobby extends Component {
	constructor(props) {
		super(props);

		this.role = window.isMobileDevice?'play':'spectate';
		this.locked = false;
		Net.subscribe('lobby.update', this.handleUpdate.bind(this));
	}

	handleClick() {
		if (!this.locked) {
			this.locked = true;
			Net.send('lobby.update', { state: 'game', match: Net.match.name });
			setTimeout(() => { this.locked = false }, 2000);
		}
	}

	handleUpdate(packet) {
		Net.match = packet;
		if (Net.match.state === 'game') {
			this.props.nav('controller');
		}
		else this.setState(this.state);
	}

	buildHeads() {
		return Array.from(new Array(MAX_PLAYERS))
			.map((i, count) => {
				const label = 'player_' + count;
				const state = label + ' head ' + ((count < Net.match.players)? 'activated' : 'deactivated');
				return <div class={ state }>{ this.isYou(count) }</div> 
			})
	}

	isYou(index) {
		if (Net.match.color === index) {
			return <div class="you">You</div>;
		}
		else {
			return <div/>;
		}
	}

	handleQuit() {
		window.location = '/';
	}

	render() {
		const bgClass = 'lobby player_' + Net.match.color;
		return (
			<div class={ bgClass }>
				<div class="whiteboard">
					<div class="texture" />
					<h2>Lobby</h2>
					<div class="row">
						<h3>{ Net.match.name }</h3>
					</div>
					<div class="back-button" onClick={ this.handleQuit }>X</div>
					<div class="row">
						<div class="col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 headroom">
							<div>{ this.buildHeads() }</div>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-4 col-sm-offset-4 col-xs-6 col-xs-offset-3">
							{ this.role === 'play' && Net.match.color === 0 ? <button class="btn btn-success" label="Start game" onClick={this.handleClick.bind(this)}>Start game</button> : <div class="notice">Waiting for match to start</div> }
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Lobby;