export { renderers } from '../renderers.mjs';
export { onRequest } from '../_empty-middleware.mjs';

const page = () => import('./pages/generic_7b35b255.mjs').then(n => n.b);

export { page };
