import { GameScore } from "./game-score";
import { Vector2 } from "./math";

export type TilesLayerType = 'userTiles' | 'enemyTiles';

export class GameState {
    score = new GameScore();
    layers = new Map<TilesLayerType, TilesLayer>();
    tiles = new Map<string, Tile>();

    constructor() {
        this.layers.set('userTiles', new TilesLayer(this, UserTile));
        this.layers.set('enemyTiles', new TilesLayer(this, EnemyTile));
    }

    serialize(): GameStateUpdatePacket {
        const tiles = {};
        for (const tile of this.tiles.values()) {
            tiles[tile.uuid] = tile.serialize();
        }
        return { tiles };
    }

    onUpdatePacket(packet: GameStateUpdatePacket) {
        for (const tile of this.tiles.values()) {
            const tilePacket = packet.tiles[tile.uuid];
            if (tilePacket) {
                tile.onUpdatePacket(tilePacket);
            }
        }
    }
}
export interface GameStateUpdatePacket {
    tiles: {
        [key: string]: TileUpdatePacket;
    }
}

export class TilesLayer {
    tilesList = new Array<Tile>();

    constructor(public state: GameState, public tileClass: new(...args) => Tile) {};

    createTile(uuid: string, x: number, y: number, w: number, h: number, 
        velocity: Vector2) {
            const tileX = Math.floor(x);
            const tileY = Math.floor(y);
            const tile = new this.tileClass(uuid, tileX, tileY, w, h, velocity);
            this.tilesList.push(tile);
            this.state.tiles.set(tile.uuid, tile);
            return tile;
        }

    destroyTile(tile: Tile) {
        const index = this.tilesList.indexOf(tile);
        if (index !== -1) {
            this.tilesList.splice(index, 1);
            return true;
        }
        return false;
    }
}

export abstract class Tile {
    health = 100;

    constructor(
        public uuid: string,
        public x: number,
        public y: number,
        public width: number,
        public height: number,
        public velocity: Vector2) {}

    abstract get color(): string;

    applyDamage(damage: number) {
        this.health -= damage;
    }

    serialize(): TileUpdatePacket {
        return {
            uuid: this.uuid,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            health: this.health,
            velocity: this.velocity
        }
    }

    onUpdatePacket(packet: TileUpdatePacket) {
        this.x = packet.x;
        this.y = packet.y;
        this.width = packet.width;
        this.height = packet.height;
        this.health = packet.health;
        this.velocity.x = packet.velocity.x;
        this.velocity.y = packet.velocity.y;
    }

    static CreateUUID () { return Math.random().toString(36).substring(2, 15) }
}
export interface TileUpdatePacket {
    uuid: string;
    x: number;
    y: number;
    width: number;
    height: number;
    health: number;
    velocity: {x: number, y: number};
}

export class UserTile extends Tile {
    get color() { return `rgb(0,0,${this.health * 2.55})`}
}

export class EnemyTile extends Tile {
    get color() { return `rgb(${this.health * 2.55},0,0)`}
}
