import { Listener } from "@/types";

export default class Emitter<T extends any[]> {
  private listeners: { [eventName: string]: Set<Listener<T>> } = {};

  public on(eventName: string, listener: Listener<T>): void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = new Set();
    }
    this.listeners[eventName].add(listener);
  }

  public off(eventName: string, listener: Listener<T>): void {
    const Listeners = this.listeners[eventName];
    if (Listeners) {
      Listeners.delete(listener);
      if (Listeners.size === 0) {
        delete this.listeners[eventName];
      }
    }
  }

  public emit(eventName: string, ...args: T): void {
    const Listeners = this.listeners[eventName];
    if (Listeners) {
      Listeners.forEach((listener) => {
        listener(...args);
      });
    }
  }

  public removeAllListeners(eventName?: string): void {
    if (eventName) {
      delete this.listeners[eventName];
    } else {
      this.listeners = {};
    }
  }
}