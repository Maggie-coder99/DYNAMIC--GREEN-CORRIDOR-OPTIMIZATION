import { createApp } from '../server/app.js';
import { normalizeApiUrl } from '../server/vercelUrl.js';

const app = createApp();

export default function handler(req, res) {
  req.url = normalizeApiUrl(req.url);
  return app(req, res);
}
