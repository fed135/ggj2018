import NetworkWorker from 'worker-loader!../workers/NetworkWorker.js';
import { EventEmitter } from 'events';

class NetworkClient extends EventEmitter {
  constructor() {
    super();

    this.clockSync = 0;

    this.worker = new NetworkWorker();
    this.worker.addEventListener('message', this.handleMessage.bind(this));
  }

  handleMessage(evt) {
    this.emit(evt.data.target, evt.data.body);
  }

  subscribe(model, handler, single) {
    if (this.listenerCount(model) === 0) {
      this.worker.postMessage({ action: 'subscribe', target: model });
    }

    if (single) this.once(model, handler);
    else this.on(model, handler);
  }

  unsubscribe(model, handler) {
    this.removeListener(model, handler);
    if (this.listenerCount(model) === 0) {
      this.worker.postMessage({ action: 'unsubscribe', target: model });
    }
  }

  send(model, payload) {
    this.worker.postMessage({ action: 'write', target: model, body: payload });
  }
}

export default NetworkClient;