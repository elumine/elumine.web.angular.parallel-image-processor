import { BehaviorSubject } from "rxjs";
import { ImageProcessorCanvasData } from "./image-processor-canvas";
import { ImageProcessorWorkerThreadFrontend } from "./worker-fontend";
import { ImageEffect } from "./effects/image-effect";

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