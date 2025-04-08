import { signal } from "@angular/core";

export class GameScore {
    points = signal<number>(0);

    setPoints(delta: number) {
        this.points.set(this.points() + delta);
    }
}