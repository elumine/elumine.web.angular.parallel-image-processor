import { ImageEffect, InverseImageEffect } from "./image-processor";

export class EffectsLibraryMetadata {
    effectsByName = new Map<string, typeof ImageEffect>();
}

export class EffectsLibrary {
    static readonly Metadata = new EffectsLibraryMetadata();
    static RegisterEffects(effectClassList: any[]) {
        for (const e of effectClassList) {
            EffectsLibrary.RegisterEffect(e);
        }
    }
    static RegisterEffect(effectClass) {
        EffectsLibrary.Metadata.effectsByName.set(effectClass.MetadataKey, effectClass);
    }
    static GetEffectNamesList() {
        return Array.from(EffectsLibrary.Metadata.effectsByName.keys());
    }
    static GetEffectNameByClass(c: typeof ImageEffect) {
        for (const [name, effectClass] of EffectsLibrary.Metadata.effectsByName.entries()) {
            if (effectClass === c) {
                return name;
            }
        }
        return 'Effect not found';
    }
    static GetEffectClassByName(name: string) {
        return EffectsLibrary.Metadata.effectsByName.get(name);
    }
}

export function libraryEffect() {
    return (target) => {
        EffectsLibrary.RegisterEffect(target);
        return target;
    }
}