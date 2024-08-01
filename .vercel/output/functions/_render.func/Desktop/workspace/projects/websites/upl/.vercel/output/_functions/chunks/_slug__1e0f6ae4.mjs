export { renderers } from '../renderers.mjs';
export { onRequest } from '../_empty-middleware.mjs';

const page = () => import('./prerender_3ac7313e.mjs').then(n => n._);

export { page };
