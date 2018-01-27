import Inferno from 'inferno';
import Component from 'inferno-component';

import Knob from './Knob';

class Joystick extends Component {
	constructor(props) {
		super(props);

		this.protector = {
			size: window.innerHeight * 0.7,
			x: (window.innerWidth * 0.25) - ((window.innerHeight * 0.7) * 0.5),
			y: window.innerHeight * 0.15
		};

		this.root = {
			size: window.innerHeight * 0.1,
			x: (window.innerWidth * 0.25) - ((window.innerHeight * 0.1) * 0.5),
			y: window.innerHeight * 0.45
		};
	}

	render() {
		return (
			<div id="joystick-wrapper">
				<div class="joystick-protector" style={{
					width: this.protector.size +'px',
					height: this.protector.size + 'px',
					top: this.protector.y + 'px',
					left: this.protector.x + 'px'
				}}></div>
				<div class="joystick-root" style={{
					width: this.root.size +'px',
					height: this.root.size + 'px',
					top: this.root.y + 'px',
					left: this.root.x + 'px'
				}}></div>
				<Knob /> 
			</div>
		);
	}
}

export default Joystick;