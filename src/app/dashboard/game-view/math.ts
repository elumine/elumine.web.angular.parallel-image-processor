export class Vector2 {
    constructor(public x: number, public y: number) {}

    length() {
        return Math.sqrt(this.x*this.x + this.y*this.y)
    }

    normalize(): Vector2 {
        const l = this.length();
        return new Vector2(this.x/l, this.y/l);
    }
}