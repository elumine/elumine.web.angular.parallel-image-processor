import { EffectsLibrary } from "./effects-library";
import { BrightnessImageEffect } from "./effects/brightness";
import { DesaturationImageEffect } from "./effects/desaturation";
import { HueShiftImageEffect } from "./effects/hue-shift";
import { InverseImageEffect } from "./effects/inverse";
import { TintImageEffect } from "./effects/tint";
import { ImageProcessorWorkerThreadJobInput, ImageProcessorWorkerThreadJobOutput, WorkerThreadMessage, WorkerThreadMessageType } from "./worker-fontend";


EffectsLibrary.RegisterEffects([
    TintImageEffect, InverseImageEffect, HueShiftImageEffect,
    DesaturationImageEffect, BrightnessImageEffect
])

export class ImageProcessorWorkerThreadBackend {

    constructor() {
        self.onmessage = (e) => {
            const type = e.data.type as WorkerThreadMessageType;
            try {
                this[type](e.data);
            } catch (e) {
                console.error('ImageProcessorWorkerThreadBackend: Error in request handler', e);
            }
        }
    }

    executeJob(message: WorkerThreadMessage<ImageProcessorWorkerThreadJobInput>) {
        const { inputCanvasData } = message.data;
        // console.group('Worker.executeJob');
        let previousEffectOutput = inputCanvasData;
        for (const effect of message.data.effectsList) {
            const effectClass = EffectsLibrary.GetEffectClassByName(effect.type);
            previousEffectOutput = effectClass.apply(effect, previousEffectOutput);
        }
        // console.log(previousEffectOutput);
        // console.groupEnd();
        this._send<ImageProcessorWorkerThreadJobOutput>({type: 'executeJob', data: { outputCanvasData: previousEffectOutput }});
    }

    _send<T>(message: WorkerThreadMessage<T>) {
        self.postMessage(message);
    }
}

const thread = new ImageProcessorWorkerThreadBackend();
