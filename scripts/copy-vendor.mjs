import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NODE_MODULES = path.join(APP_DIR, 'node_modules');
const VENDOR_DIR = path.join(APP_DIR, 'public', 'vendor');

const COPIES = [
  { from: path.join(NODE_MODULES, 'marked', 'lib', 'marked.umd.js'), to: path.join(VENDOR_DIR, 'marked.umd.js') },
  { from: path.join(NODE_MODULES, 'dompurify', 'dist', 'purify.min.js'), to: path.join(VENDOR_DIR, 'purify.min.js') },
  { from: path.join(NODE_MODULES, 'katex', 'dist'), to: path.join(VENDOR_DIR, 'katex') },
  // Only loaded when a reply actually contains a Mermaid diagram (see public/figures.js).
  { from: path.join(NODE_MODULES, 'mermaid', 'dist', 'mermaid.min.js'), to: path.join(VENDOR_DIR, 'mermaid.min.js') },
];

export function vendorReady() {
  return [
    path.join(VENDOR_DIR, 'marked.umd.js'),
    path.join(VENDOR_DIR, 'purify.min.js'),
    path.join(VENDOR_DIR, 'katex', 'katex.min.js'),
    path.join(VENDOR_DIR, 'katex', 'katex.min.css'),
  ].every((f) => fs.existsSync(f));
}

export function copyVendor() {
  for (const { from } of COPIES) {
    if (!fs.existsSync(from)) {
      throw new Error(`Missing ${path.relative(APP_DIR, from)} - run npm install first`);
    }
  }
  fs.mkdirSync(VENDOR_DIR, { recursive: true });
  for (const { from, to } of COPIES) {
    fs.cpSync(from, to, { recursive: true, force: true });
  }
  return COPIES.map(({ to }) => path.relative(APP_DIR, to));
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const copied = copyVendor();
    console.log(`Copied vendor assets: ${copied.join(', ')}`);
  } catch (e) {
    console.error(`copy-vendor failed: ${e.message}`);
    process.exit(1);
  }
}
