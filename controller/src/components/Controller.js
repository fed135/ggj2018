import Inferno from 'inferno';
import Component from 'inferno-component';
import Net from '../system/Net';

import Joystick from './Joystick';

class Controller extends Component {
	constructor(props) {
		super(props);

		this.action = {
			size: window.innerHeight * 0.3,
			x: (window.innerWidth * 0.25) - ((window.innerHeight * 0.3) * 0.5),
			y: window.innerHeight * 0.425
		};

		Net.subscribe('player.vibrate', this.handleVibrate.bind(this));
		setTimeout(() => {
			document.getElementById('action-btn')
				.addEventListener('touchend', this.handleButtonPress.bind(this));
		}, 1000);
	}

	handleVibrate(pattern) {
		navigator.vibrate([pattern.duration]);
	}

	handleButtonPress() {
		navigator.vibrate([150]);
		Net.send('player.punch', { player: Net.match.color, match: Net.match.name, ts: Date.now() });
	}

	render() {
		const btnClass = 'action-button player_' + Net.match.color;
		const controllerClass = 'controller row player_' + Net.match.color;

		return (
			<div class={ controllerClass }>
				<div class="whiteboard">
					<div class="texture" />
				</div>
				<div class="sec col-xs-6 col-sm-6">
					<Joystick />
				</div>
				<div class="sec col-xs-6 col-sm-6">
					<div 
						id="action-btn"
						class={ btnClass }
						style={{
							width: this.action.size +'px',
							height: this.action.size + 'px',
							top: this.action.y + 'px',
							left: this.action.x + 'px'
						}}>
						<span>Action</span>
					</div>
				</div>
			</div>
		);
	}
}

export default Controller;