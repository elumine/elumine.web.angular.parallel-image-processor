import { BehaviorSubject, Subject } from "rxjs";
import { ImageEffect, ImageProcessorCanvasData } from "./image-processor";

export class ImageProcessorWorkerThreadFrontend {
    worker = new Worker(new URL('./worker.ts', import.meta.url));
    onJobExecutionFinished = new Subject<ImageProcessorWorkerThreadJobOutput>();

    constructor() {
        this.worker.onmessage = (e) => {
            const type = e.data.type as WorkerThreadMessageType;
            try {
                this[type+'_response'](e.data);
            } catch (e) {
                console.error('ImageProcessorWorkerThreadFrontend: Error in response handler', e);
            }
        }
    }

    executeJob(data: ImageProcessorWorkerThreadJobInput) {
        this._send<ImageProcessorWorkerThreadJobInput>({ type: 'executeJob', data: data });
        return this.onJobExecutionFinished;
    }
    executeJob_response(message: WorkerThreadMessage<ImageProcessorWorkerThreadJobOutput>) {
        this.onJobExecutionFinished.next(message.data);
    }

    _send<T>(message: WorkerThreadMessage<T>) {
        this.worker.postMessage(message);
    }
}

export type WorkerThreadMessageType = 'executeJob';
export interface WorkerThreadMessage<T> {
    type: WorkerThreadMessageType;
    data: T
}
export interface ImageProcessorWorkerThreadJobInput {
    inputCanvasData: ImageProcessorCanvasData;
    effectsList: ImageEffect[];
}
export interface ImageProcessorWorkerThreadJobOutput {
    outputCanvasData: ImageProcessorCanvasData;
}