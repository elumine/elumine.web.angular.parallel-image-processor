import { EffectsLibrary } from "../effects-library";
import { ImageProcessorCanvasData } from "../image-processor-canvas";
import { Color, LerpColors } from "../math";

export class ImageEffect {
    static MetadataKey = 'ImageEffect';
    id = Math.floor((Math.random()*1000000));
    type: string;
    name: string;
    active = true;
    weight = 1;

    constructor() {
        this.type = EffectsLibrary.GetEffectNameByClass(this.constructor as any);
        this.name = `${this.type} Effect`;
    }

    static apply(self: ImageEffect, input: ImageProcessorCanvasData) {
        const output = input;
        output.index += 1;
        const effectClass = EffectsLibrary.GetEffectClassByName(self.type);
        for (let i = 0; i < input.data.length; i += 4) {
            const inputColor = effectClass._sampleInput1D(input, i);
            const outputColor = LerpColors(inputColor, effectClass._pixelShader(self, inputColor, i), self.weight);
            output.data[i]   = outputColor.r;
            output.data[i+1] = outputColor.g;
            output.data[i+2] = outputColor.b;
            output.data[i+3] = outputColor.a;
        }
        return output;
    }

    static _sampleInput1D(input: ImageProcessorCanvasData, i: number): Color {
        return {
            r: input.data[i],
            g: input.data[i+1],
            b: input.data[i+2],
            a: input.data[i+3]
        };
    }

    static _pixelShader(self: ImageEffect, input: Color, index: number): Color {
        return input;
    }
}