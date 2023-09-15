import pino from 'pino';
import avvio from 'avvio';
import EventEmitter from 'node:events';

export default class Replug extends EventEmitter {
  private logger: pino.Logger = pino();

  constructor() {
    super();

    const boot = avvio(this);
  } 
}