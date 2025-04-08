import { GameState, Tile } from "./game-state"
import { Vector2 } from "./math";
import { Physics } from "./physics";
import { WorkerThreadMessage, WorkerThreadMessageType } from "./worker-thread";

const state = new GameState();
const physics = new Physics();

export class WorkerThread {

    constructor() {
        self.onmessage = (e) => {
            const type = e.data.type as WorkerThreadMessageType;
            try {
                this[type](e);
            } catch (e) {
                console.error('WorkerThread: Error in request handler', e);
            }
        }
    }

    init(e) {
        setInterval(() => {
            physics.update(state, e.data.tickInterval);
            const s = state.serialize();
            this._send({type: 'update', state: s});
        }, e.data.tickInterval);
    }

    createTile(e) {
        const layer = state.layers.get(e.data.layer);
        const tile = layer.createTile(Tile.CreateUUID(), e.data.x, e.data.y, e.data.width, e.data.height,
            new Vector2(e.data.velocity.x, e.data.velocity.y));
        this._send({type: 'createTile', layer: e.data.layer, tile: tile.serialize()});
    }

    destroyTile(e) {
        //
    }

    _send(message: WorkerThreadMessage) {
        self.postMessage(message);
    }
}

const thread = new WorkerThread();
