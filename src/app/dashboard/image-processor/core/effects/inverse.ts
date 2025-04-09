import { libraryEffect } from "../effects-library";
import { Color } from "../math";
import { ImageEffect } from "./image-effect";

@libraryEffect()
export class InverseImageEffect extends ImageEffect {
    static override MetadataKey = 'Inverse';
    static override _pixelShader(self: ImageEffect, input: Color, index: number) {
        return {
            r: 255 - input.r,
            g: 255 - input.g,
            b: 255 - input.b,
            a: input.a
        }
    }
}