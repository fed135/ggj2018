import Inferno from 'inferno';
import Component from 'inferno-component';

import Splash from './components/Splash';
import Lobby from './components/Lobby';
import Controller from './components/Controller';

class Game extends Component {

	constructor(props) {
		super(props);

		this.currentPage = null;
		this.nav();
	}

	nav(page) {
		this.props.page = page || this.props.page;

		switch(this.props.page) {
			case 'splash':
				this.currentPage = <Splash nav={ this.nav.bind(this) } />;
				break;
			case 'lobby':
				this.currentPage = <Lobby nav={ this.nav.bind(this) } />;
				break;
			case 'controller':
				this.currentPage = <Controller nav={ this.nav.bind(this) } />;
				break;
		}
		if (page) this.setState(this.state);
	}

	render() {
		return (
	    	<div class="container-fluid">
	    		{ this.currentPage } 
			</div>
		);
	}
}

export default Game;