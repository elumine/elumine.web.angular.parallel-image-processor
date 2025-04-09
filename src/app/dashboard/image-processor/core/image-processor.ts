import { BehaviorSubject } from "rxjs";
import { ImageEffect } from "./effects/image-effect";
import { ImageProcessorInstance } from "./image-processor-instance";
import { TintImageEffect } from "./effects/tint";
import { InverseImageEffect } from "./effects/inverse";
import { HueShiftImageEffect } from "./effects/hue-shift";
import { BrightnessImageEffect } from "./effects/brightness";
import { DesaturationImageEffect } from "./effects/desaturation";

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
