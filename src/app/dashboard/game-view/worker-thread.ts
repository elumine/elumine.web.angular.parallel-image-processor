import { GameManager } from "./game-manager";
import { Vector2 } from "./math";

export class WorkerThread {
    worker = new Worker(new URL('./worker.ts', import.meta.url));

    constructor(public game: GameManager) {
        this.worker.onmessage = (e) => {
            const type = e.data.type as WorkerThreadMessageType;
            try {
                this[type+'Response'](e);
            } catch (e) {
                console.error('WorkerThread: Error in response handler', e);
            }
        }
    }

    initRequest(tickInterval: number) {
        this._send({ type: 'init', tickInterval });
    }
    initResponse(e) { console.log('WorkerThread: initResponse', e); }

    updateResponse(e) {
        this.game.state.onUpdatePacket(e.data.state);
    }

    createTileRequest(layer: string, x: number, y: number, width: number, height: number, velocity: Vector2) {
        this._send({
            type: 'createTile',
            layer,
            x, y,
            width,
            height, velocity
        });
    }
    createTileResponse(e) {
        const tile = e.data.tile;
        this.game.state.layers.get(e.data.layer).createTile(
            tile.uuid, tile.x, tile.y, tile.width, tile.height, tile.velocity
        );
    }

    _send(message: WorkerThreadMessage) {
        this.worker.postMessage(message);
    }
}

export type WorkerThreadMessageType = 'init' | 'update' | 'createTile' | 'destroyTile';

export interface WorkerThreadMessage {
    type: WorkerThreadMessageType;
    [key: string]: any;
}
