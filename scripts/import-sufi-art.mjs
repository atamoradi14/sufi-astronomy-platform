// Preserve original, unmodified CC BY-ND assets with upstream attribution.
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { expandStars } from '../src/lib/sky/catalog.ts';
const base='https://raw.githubusercontent.com/Stellarium/stellarium/master/skycultures/arabic_al-sufi/';
const folder='public/sky/sufi';
await mkdir(folder,{recursive:true});
const source=await fetch(base+'index.json').then(r=>r.json());
const stars=expandStars(JSON.parse(await readFile('public/data/stars-mag7.json','utf8'))).stars;
const byId=new Map(stars.map(s=>[s.id,s]));
const plates=[];
for(const c of source.constellations){
  if(!c.image || !c.image.anchors.every(a=>byId.has(a.hip)))continue;
  const file=c.image.file.split('/').pop();
  const response=await fetch(base+c.image.file);
  if(!response.ok)throw Error('Asset unavailable '+file);
  await writeFile(folder+'/'+file,Buffer.from(await response.arrayBuffer()));
  plates.push({id:c.id,name:c.common_name.english,native:c.common_name.native,file:'/sky/sufi/'+file,size:c.image.size,anchors:c.image.anchors.map(a=>({pos:a.pos,ra:byId.get(a.hip).ra,dec:byId.get(a.hip).dec}))});
}
await writeFile(folder+'/catalog.json',JSON.stringify(plates));
await writeFile(folder+'/ATTRIBUTION.md',await fetch(base+'description.md').then(r=>r.text()));
console.log('Imported unchanged al-Sufi illustrations:',plates.length);
