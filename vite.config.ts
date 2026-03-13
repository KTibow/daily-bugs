import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'marked';
import { defineConfig } from 'vite';

const rootDir = resolve(__dirname, 'frontend');
const outDir = resolve(__dirname, 'dist');
const readmeMarker = '<!-- README.md -->';

export default defineConfig({
  root: rootDir,
  base: './',
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        'index-loggedin': resolve(rootDir, 'index-loggedin.html'),
        'index-loggedout': resolve(rootDir, 'index-loggedout.html'),
      },
    },
  },
  plugins: [
    {
      name: 'inject-readme-html',
      transformIndexHtml(html, ctx) {
        const readme = readFileSync(resolve(__dirname, 'README.md'), 'utf8');
        let readmeHtml = parse(readme) as string;

        if (ctx.path === '/index-loggedout.html' || html.includes('daily-bugs')) {
          readmeHtml = readmeHtml
            .replace('<h1 align="center">', '<h1>')
            .replace('<div align="center">', '')
            .replace('</div>\n\n<p>Daily Bugs', '<p>Daily Bugs');
        }

        return html.split(readmeMarker).join(readmeHtml);
      },
    },
  ],
});
