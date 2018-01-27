// inferno module
import Inferno from 'inferno';

// app components
import Game from './Game';

window.onload = () => {
	Inferno.render(<Game page={ "splash" } />, document.getElementById('content'));
}