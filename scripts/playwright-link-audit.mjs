import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const out=join(process.cwd(),'reports','playwright-live-audit-2026-11-08');
const report=JSON.parse(await readFile(join(out,'results.json'),'utf8'));
const paths=[...new Set(report.rows.flatMap(r=>r.internalLinks||[]).map(p=>p.replace(/#.*$/,'')))].sort();
let index=0;const results=[];
async function worker(){
 while(index<paths.length){
  const path=paths[index++];
  try{
   const r=await fetch('https://stackgeist.dev'+path,{method:'GET',redirect:'follow',signal:AbortSignal.timeout(15000)});
   results.push({path,status:r.status,finalPath:new URL(r.url).pathname,contentType:r.headers.get('content-type')});
  }catch(e){results.push({path,error:String(e.message||e)})}
  if(results.length%75===0)console.log('LINKS_DONE',results.length,'/',paths.length);
 }
}
await Promise.all(Array.from({length:10},()=>worker()));
const bad=results.filter(r=>r.error||r.status>=400);
const indirect=results.filter(r=>r.finalPath&&r.finalPath!==r.path);
const browser=await chromium.launch();
const checks=[];
for (const width of [390,1440]){
 const context=await browser.newContext({viewport:{width,height:850},isMobile:width<768,hasTouch:width<768});
 await context.addInitScript(() => {
   try { sessionStorage.setItem('stackgeist:affiliate:audit', '1'); } catch {}
 });
 const page=await context.newPage();
 for (const path of ['/','/gear/connectivity/anker-553-usb-c-hub/','/kits/budget-video-call-kit/','/tools/usb-c-compatibility/']){
  const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
  try{
   await page.goto('https://stackgeist.dev'+path,{waitUntil:'networkidle',timeout:22000});
   const img=await page.evaluate(async()=>{
     const images=[...document.querySelectorAll('img')];
     for (const image of images) if(image.loading==='lazy')image.scrollIntoView({block:'center'});
     await Promise.all(images.map(i=>i.decode().catch(()=>null)));
     return images.filter(i=>!i.naturalWidth).map(i=>i.src);
   });
   const external=await page.evaluate(()=>[...document.querySelectorAll('a[data-affiliate-link]')].map(a=>({url:a.href,rel:a.rel,target:a.target})));
   checks.push({width,path,imagesBroken:img,pageErrors,affiliateLinks:external.length,affiliateIssues:external.filter(a=>!a.rel.includes('sponsored')||!a.rel.includes('noopener')),scrollWidth:await page.evaluate(()=>document.documentElement.scrollWidth)});
  }catch(e){checks.push({width,path,error:String(e.message||e).slice(0,200)})}
 }
 await context.close();
}
await browser.close();
await writeFile(join(out,'link-and-interaction-results.json'),JSON.stringify({at:new Date().toISOString(),links:results,bad,indirect,checks},null,2));
console.log('LINK_AUDIT',JSON.stringify({checked:results.length,bad:bad.length,indirect:indirect.length,firstBad:bad.slice(0,25),sampleIndirect:indirect.slice(0,20),checks}));
