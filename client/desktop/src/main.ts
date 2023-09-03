import Replug from './replug';
import AppEntrypoint from './vue';

const entrypoint: AppEntrypoint = AppEntrypoint.construct();

export const replug: Replug = new Replug(entrypoint);