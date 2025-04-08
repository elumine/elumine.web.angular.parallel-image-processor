import { BehaviorSubject } from "rxjs";
import { EffectsLibrary, libraryEffect } from "./effects-library";
import { LerpColors, LerpFloat } from "./math";
import { ImageProcessorWorkerThreadFrontend } from "./worker-thread";


export type Color = { r: number, g: number, b: number, a: number };

export class ImageProcessor {
    effects = new Array<ImageEffect>();
    activeEffects = new Array<ImageEffect>();
    onInitialized = new BehaviorSubject<boolean>(false);
    onEffectsListChanged = new BehaviorSubject<void>(null);
    instanceList = new Array<ImageProcessorInstance>();

    constructor() {
        console.info(this);
    }

    init() {
        this.createEffect(TintImageEffect);
        this.createEffect(InverseImageEffect);
        this.createEffect(HueShiftImageEffect);
        this.createEffect(BrightnessImageEffect);
        this.createEffect(DesaturationImageEffect);
        this.updateActiveEffects();
        this.onInitialized.next(true);
    }

    createEffect(effectClass: typeof ImageEffect) {
        const effect = new effectClass();
        this.effects.push(effect);
        this._registerEffectsListChange();
        return effect;
    }

    deleteEffect(effect: ImageEffect) {
        const index = this.effects.indexOf(effect);
        if (index > -1) {
            this.effects.splice(index, 1);
            this._registerEffectsListChange();
        }
    }

    _registerEffectsListChange() {
        this.updateActiveEffects();
        this.onEffectsListChanged.next();
    }

    updateActiveEffects() {
        this.activeEffects = this.effects.filter(e => e.active);
    }

    apply() {
        for (const instance of this.instanceList) {
            instance.apply(this.activeEffects);
        }
    }
}

export type ImageProcessorInstanceStatus = 'idle' | 'active';
export class ImageProcessorInstance {
    input: ImageProcessorCanvasData = null;
    output: ImageProcessorCanvasData = null;
    thread = new ImageProcessorWorkerThreadFrontend();
    onInitialized = new BehaviorSubject<boolean>(false);
    onOutputChanged = new BehaviorSubject<ImageProcessorCanvasData>(null);
    onStatusChanged = new BehaviorSubject<ImageProcessorInstance>(this);
    status: ImageProcessorInstanceStatus = 'idle';
    lastExecutionDuration: number;

    constructor() {
        this.thread.onJobExecutionFinished.subscribe((output) => {
            this.output = output.outputCanvasData;
            this.onOutputChanged.next(this.output);
        });
    }

    init(data: Uint8ClampedArray, x: number, y: number, width: number, height: number) {
        this.input = {
            index: 0, data, width, height, x, y
        };
        this.onInitialized.next(true);
    }

    apply(effects: ImageEffect[]) {
        this.status = 'active';
        const t = performance.now();
        this.thread.executeJob({
            inputCanvasData: this.input,
            effectsList: effects
        });
        this.lastExecutionDuration = performance.now() - t;
        this.status = 'idle';
    }
}

export interface ImageProcessorCanvasData {
    index: number;
    data: Uint8ClampedArray;
    x: number;
    y: number;
    width: number;
    height: number;
}

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
        // const output: ImageProcessorCanvasData = {
        //     index: input.index + 1,
        //     width: input.width,
        //     height: input.height,
        //     x: input.x, 
        //     y: input.y,
        //     data: new Uint8ClampedArray(input.data.length)
        // };
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