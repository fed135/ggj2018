import Inferno from 'inferno';
import Component from 'inferno-component';
import Net from '../system/Net';

class Knob extends Component {
	constructor(props) {
		super(props);

		this.lastMove = Date.now();

		this.origin = {
			x: null,
			y: null,
			touch: null
		};

		this.force = {
			x: 0,
			y: 0
		};

		this.pressed = false;

		this.updateTimer = null;

		this.maxTilt = (window.innerWidth * 0.1);

		window.addEventListener('mouseup', this.handleRelease.bind(this));
		window.addEventListener('mouseleave', this.handleRelease.bind(this));
		setTimeout(() => {
			document.getElementById('joystick-wrapper')
				.addEventListener('mouseleave', this.handleRelease.bind(this));
			document.getElementById('joystick-wrapper')
				.addEventListener('mousemove', this.handleMove.bind(this));
			document.getElementById('joystick-wrapper')
				.addEventListener('touchend', this.handleRelease.bind(this));
			document.getElementById('joystick-wrapper')
				.addEventListener('touchcancel', this.handleRelease.bind(this));
			document.getElementById('joystick-wrapper')
				.addEventListener('touchmove', this.handleMove.bind(this));
			document.getElementById('knob')
				.addEventListener('touchstart', this.handlePress.bind(this));
		}, 1000);
		this.refreshSize();
		window.addEventListener('resize', this.refreshSize.bind(this));
	}

	refreshSize(re) {
		this.knob = {
			size: window.innerHeight * 0.25,
			x: (window.innerWidth * 0.25) - ((window.innerHeight * 0.25) * 0.5),
			y: window.innerHeight * 0.225,
			rX: (window.innerWidth * 0.25) - ((window.innerHeight * 0.25) * 0.5),
			rY: window.innerHeight * 0.225
		};
		if (re) this.setState(this.state);
	}

	dist(x1, y1, x2, y2) {
		return Math.sqrt(Math.pow((x2 - x1),2) + Math.pow((y2 - y1),2));
	}

	handlePress(evt) {
		this.updateTimer = setTimeout(this.refreshStick.bind(this), config.maxRegPerSec);
		this.pressed = true;
		if (evt.touches) {
			const loc = this.getTouchLocation(evt.touches);
			if (loc.x > -1) {
				this.origin = { x: loc.x, y: loc.y, touch: loc.touch }
			}
		}
		else {
			this.origin.x = evt.x;
			this.origin.y = evt.y;
		}
		
	}

	handleRelease(evt) {
		this.pressed = false;
		this.origin.x = null;
		this.origin.y = null;
	}

	getTouchLocation(touches) {
		const ret = {
			x: -1,
			y: -1,
			touch: 0
		};

		for (let i = 0; i < touches.length; i++) {
			if (touches[i].clientX >= 1 && touches[i].clientX < window.innerWidth * 0.5) {
				ret.x = touches[i].clientX;
				ret.y = touches[i].clientY;
				ret.touch = i;
				break;
			}
		}

		return ret;
	}

	refreshStick() {
		this.force.x = Math.min(1, Math.max(-1, (this.knob.x - this.knob.rX)/this.maxTilt));
		this.force.y = Math.min(1, Math.max(-1, (this.knob.y - this.knob.rY)/this.maxTilt));

		Net.send('player.move', {
			x: this.force.x,
			y: this.force.y,
			ts: Date.now(),
			color: Net.match.color,
			match: Net.match.name
		});

		if (this.pressed) {
			this.updateTimer = setTimeout(this.refreshStick.bind(this), config.maxRegPerSec);
		}
		else {
			this.knob.x = this.knob.rX;
			this.knob.y = this.knob.rY;
		}

		const now = Date.now();
		if (now - this.lastMove < config.maxRegPerSec) return false;
		this.lastMove = now;
		// re-render joystick
		this.setState(this.state);
	}

	handleMove(evt) {
		// Update force
		if (this.pressed) {
			if (evt.touches) {
				this.knob.x = this.knob.rX + (evt.touches[this.origin.touch || 0].clientX - this.origin.x);
				this.knob.y = this.knob.rY + (evt.touches[this.origin.touch || 0].clientY - this.origin.y);
			}
			else {
				this.knob.x = this.knob.rX + (evt.x - this.origin.x);
				this.knob.y = this.knob.rY + (evt.y - this.origin.y);
			}
		}
		evt.preventDefault();
		return false;
	}

	render() {
		return (
			<div class="joystick-knob" id="knob" style={{
					width: this.knob.size +'px',
					height: this.knob.size + 'px',
					top: this.knob.y + 'px',
					left: this.knob.x + 'px'
				}} 
				onMouseDown={ this.handlePress.bind(this) } 
			/>
		);
	}
}

export default Knob;