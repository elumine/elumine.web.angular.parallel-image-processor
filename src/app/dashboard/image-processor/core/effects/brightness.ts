import { libraryEffect } from "../effects-library";
import { Color } from "../math";
import { ImageEffect } from "./image-effect";

@libraryEffect()
export class BrightnessImageEffect extends ImageEffect {
    value = 1;
    static override MetadataKey = 'Brightness';
    static override _pixelShader(self: BrightnessImageEffect, input: Color, index: number) {
        return {
            r: input.r * self.value,
            g: input.g * self.value,
            b: input.b * self.value,
            a: input.a
        }
    }
}