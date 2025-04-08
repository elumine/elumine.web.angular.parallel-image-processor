import { GameState, Tile } from "./game-state";

export class Physics {

    update(state: GameState, dt: number) {
        dt = dt / 1000; // Convert
        for (const tile of state.layers.get('enemyTiles').tilesList) {
            tile.velocity.y += 100 * dt; // Gravity
        }
        main: for (const tile of state.layers.get('enemyTiles').tilesList) {
            const vN = tile.velocity.normalize();
            const vL = Math.floor( tile.velocity.length() );
            let dx = 0, dy = 0;
            substep: for (let i = 1; i <= vL; i++) {
                dx = vN.x * i * dt;
                dy = vN.y * i * dt;
                const c = this._traceTileCollision(state, tile, dx, dy);
                if (c) {
                    c.applyDamage(tile.velocity.y);
                    const nY = Math.min(tile.velocity.y, tile.velocity.y * -0.5)
                    tile.velocity.y = nY;
                    if (c.x !== tile.x) {
                        tile.velocity.x *= -0.5;
                    } else {
                        tile.velocity.x = 0;
                    }
                    break substep;
                }
            }
            tile.x += dx;
            tile.y += dy;
        }
    }

    _traceTileCollision(state: GameState, tile: Tile, dx = 0, dy = 0) {        
        for (const layer of state.layers.values()) {
            for (const layerTile of layer.tilesList) {
                if (layerTile !== tile) {
                    const t = this._coordsOverlapTile(tile, layerTile, dx, dy);
                    if (t) {
                        return t;
                    }
                }
            }
        }
        return null;
    }

    _coordsOverlapTile(a: Tile, b: Tile, x: number, y: number) {
        const aCenterX = a.x + x + a.width/2, aCenterY = a.y + y + a.height/2;
        const bCenterX = b.x + b.width/2, bCenterY = b.y + b.height/2;
        const dX = Math.abs(aCenterX - bCenterX), dY = Math.abs(aCenterY - bCenterY);
        if ((dX < (a.width + b.width) / 2 && dY < (a.height + b.height) / 2)) {
            return b;
        }
        return null;
    }
}