import { libraryEffect } from "../effects-library";
import { Color } from "../math";
import { ImageEffect } from "./image-effect";

@libraryEffect()
export class HueShiftImageEffect extends ImageEffect {
    angle = 0;
    static override MetadataKey = 'HueShiftImageEffect';
    static override _pixelShader(self: HueShiftImageEffect, input: Color, index: number) {
        return {
            r: HueShiftImageEffect._addShift(input.r, self.angle),
            g: HueShiftImageEffect._addShift(input.g, self.angle),
            b: HueShiftImageEffect._addShift(input.b, self.angle),
            a: input.a
        }
    }
    static _addShift(a: number, b: number) {
        const c = a + b;
        return c > 255 ? c - 255 : c;
    }
}