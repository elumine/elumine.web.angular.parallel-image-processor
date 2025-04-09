import { libraryEffect } from "../effects-library";
import { Color } from "../math";
import { ImageEffect } from "./image-effect";

@libraryEffect()
export class TintImageEffect extends ImageEffect {
    tint: Color = { r: 1, g: 1, b: 1, a: 1 };
    static override MetadataKey = 'Tint';
    static override _pixelShader(self: TintImageEffect, input: Color, index: number) {
        return {
            r: input.r * self.tint.r,
            g: input.g * self.tint.g,
            b: input.b * self.tint.b,
            a: input.a * self.tint.a
        }
    }
}