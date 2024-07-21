import { TinyEmitter } from 'tiny-emitter';

const emitter = new TinyEmitter();

export function onEvent<T>(event: string, callback: (data: T) => void) {
  emitter.on(event, callback);
  return () => {
    emitter.off(event, callback);
  };
}

export function emitEvent<T>(event: string, data: T) {
  emitter.emit(event, data);
}
