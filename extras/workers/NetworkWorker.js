import Kalm from 'kalm';
import ws from 'kalm-websocket';

class NetworkWorker {
	constructor(scope) {
		this.socket = Kalm.connect({
			hostname: '54.209.253.88',
			port: 9000,
			transport: ws,
			profile: { tick: 0 }
		});

		this.socket.on('connect', () => console.log('Connected'))

		this.emit = scope.postMessage.bind(scope);

		scope.addEventListener('message', this.handleAction.bind(this));
	}

	handleAction(evt) {
		this[evt.data.action](evt.data.target, evt.data.body);
	}

	subscribe(model) {
		this.socket.subscribe(model, packet => {
			this.emit({
				target: model,
				body: NetworkWorker.decode(model, packet.body)
			});
		});
	}

	unsubscribe(model) {
		this.socket.unsubscribe(model);
	}

	write(model, body) {
		this.socket.write(model, NetworkWorker.encode(model, body));
	}

	static decode(model, packet) {
		return packet;
		// Compactr -> return Models[model].readContent(packet);
	}

	static encode(model, payload) {
		return payload;
		// Compactr -> return Models[model].write(payload).contentArray();
	}
}

export default new NetworkWorker(self);