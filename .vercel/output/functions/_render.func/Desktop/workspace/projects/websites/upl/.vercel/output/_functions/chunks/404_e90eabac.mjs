export { renderers } from '../renderers.mjs';
export { onRequest } from '../_empty-middleware.mjs';

const page = () => import('./prerender_e60eba08.mjs').then(n => n.b);

export { page };
