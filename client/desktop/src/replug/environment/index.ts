import production from './stages/production';
import development from './stages/development';

const stage = process.env.NODE_ENV === 'production' ? production : development;

export default stage;