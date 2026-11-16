import {build} from 'esbuild';
await build({entryPoints:['server.mjs'],outfile:'dist/server.cjs',bundle:true,platform:'node',target:'node22',format:'cjs'});
