export { renderers } from '../renderers.mjs';
export { onRequest } from '../_empty-middleware.mjs';

const page = () => import('./pages/generic_c21f53f1.mjs').then(n => n.b);

export { page };
