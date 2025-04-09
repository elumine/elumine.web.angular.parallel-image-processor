import { libraryEffect } from "../effects-library";
import { Color, LerpFloat } from "../math";
import { ImageEffect } from "./image-effect";

@libraryEffect()
export class DesaturationImageEffect extends ImageEffect {
    value = 0;
    static override MetadataKey = 'Desaturation';
    static override _pixelShader(self: DesaturationImageEffect, input: Color, index: number) {
        const avg = (input.r + input.g + input.b) / 3;
        return {
            r: LerpFloat(input.r, avg, self.value),
            g: LerpFloat(input.g, avg, self.value),
            b: LerpFloat(input.b, avg, self.value),
            a: input.a
        }
    }
}