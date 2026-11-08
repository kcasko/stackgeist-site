import { chromium } from '@playwright/test';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { join, relative, dirname, sep } from 'node:path';

const root = process.cwd();
const output = join(root, 'reports', 'playwright-live-audit-2026-11-08');
await mkdir(join(output, 'screenshots'), { recursive: true });

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(p));
    else if (entry.name === 'index.html') out.push(p);
  }
  return out;
}
const files = await walk(join(root, 'dist'));
const routes = files.map(p => '/' + relative(join(root, 'dist'), dirname(p)).split(sep).filter(Boolean).join('/') + '/')
  .map(p => p === '//' ? '/' : p).sort();
const browser = await chromium.launch({ headless:true });
const base = 'https://stackgeist.dev';
const issues = [], rows = [];
const linkTargets = new Set();
let next = 0;
async function worker() {
  const context = await browser.newContext({ viewport:{width:1440,height:900}, serviceWorkers:'block' });
  await context.addInitScript(() => {
    try { sessionStorage.setItem('stackgeist:affiliate:audit', '1'); } catch {}
  });
  const page = await context.newPage();
  page.setDefaultTimeout(7000);
  while(next < routes.length) {
    const path = routes[next++];
    const errors=[];
    const onError=e=>errors.push(String(e.message||e).slice(0,170));
    page.on('pageerror',onError);
    try {
      const response = await page.goto(base+path,{waitUntil:'domcontentloaded',timeout:20000});
      const data = await page.evaluate(() => {
        const a=[...document.querySelectorAll('a[href]')];
        const imgs=[...document.images];
        const h1=[...document.querySelectorAll('h1')].map(x=>x.innerText.trim()).filter(Boolean);
        return {
          title:document.title,
          h1Count:h1.length,
          h1:h1[0]||'',
          canonical:document.querySelector('link[rel="canonical"]')?.href||'',
          desc:document.querySelector('meta[name="description"]')?.content||'',
          robots:document.querySelector('meta[name="robots"]')?.content||'',
          images:imgs.length,
          brokenImages:imgs.filter(i=>i.complete && i.naturalWidth===0).map(i=>i.currentSrc||i.src).slice(0,8),
          blankLinks:a.filter(x=>x.getAttribute('href')==='#'||!x.getAttribute('href')?.trim()).map(x=>x.outerHTML.slice(0,90)).slice(0,8),
          anonymousLinks:a.filter(x=>!x.innerText.trim()&&!x.getAttribute('aria-label')&&!x.querySelector('img[alt]')&&!x.getAttribute('title')).length,
          internalLinks:a.map(x=>x.href).filter(h=>h.startsWith(location.origin+'/')).map(h=>new URL(h).pathname),
          horizontalOverflow: document.documentElement.scrollWidth>innerWidth+3,
          htmlWidth: document.documentElement.scrollWidth,
          viewport:innerWidth,
          affiliateLinks:document.querySelectorAll('[data-affiliate-link]').length,
          disclosures:document.body.innerText.includes('may earn a commission')||document.body.innerText.includes('affiliate disclosure'),
        };
      });
      const finalPath=new URL(page.url()).pathname;
      const row={path, status:response?.status()??0,finalPath, errors:[...new Set(errors)],...data};
      rows.push(row);
      for(const link of row.internalLinks)linkTargets.add(link);
      if(row.status!==200)issues.push({type:'http-status',path,detail:row.status});
      if(finalPath!==path)issues.push({type:'redirect',path,detail:finalPath});
      if(!row.title)issues.push({type:'missing-title',path});
      if(row.h1Count!==1)issues.push({type:'heading-count',path,detail:row.h1Count});
      if(!row.desc)issues.push({type:'missing-description',path});
      if(row.brokenImages.length)issues.push({type:'broken-image',path,detail:row.brokenImages});
      if(row.horizontalOverflow)issues.push({type:'desktop-overflow',path,detail:row.htmlWidth});
      if(row.errors.length)issues.push({type:'js-error',path,detail:row.errors});
    }catch(e){rows.push({path,error:String(e.message||e).slice(0,230)});issues.push({type:'navigation-failed',path,detail:String(e.message||e).slice(0,200)});}
    page.off('pageerror',onError);
    if(rows.length%40===0)console.log('CRAWLED',rows.length,'/',routes.length);
  }
  await context.close();
}
await Promise.all(Array.from({length:5},()=>worker()));
const sample=['/','/guides/','/guides/usb-c-dock-only-one-monitor/','/guides/sennheiser-momentum-4-wont-pair/','/gear/','/gear/connectivity/anker-553-usb-c-hub/','/kits/','/kits/budget-video-call-kit/','/tools/usb-c-compatibility/','/labs/','/certs/','/contact/','/privacy/','/search/'];
const mobile=[];
for(const width of [320,390,768,1440]) {
 const context=await browser.newContext({viewport:{width,height:850}, deviceScaleFactor:1, isMobile:width<768,hasTouch:width<768});
 await context.addInitScript(() => {
   try { sessionStorage.setItem('stackgeist:affiliate:audit', '1'); } catch {}
 });
 const page=await context.newPage();
 for(const path of sample) {
   try {
    const resp=await page.goto(base+path,{waitUntil:'domcontentloaded',timeout:20000});
    await page.waitForTimeout(150);
    const result=await page.evaluate(()=>({doc:document.documentElement.scrollWidth,viewport:innerWidth,mainVisible:(()=>{const r=document.querySelector('main')?.getBoundingClientRect();return !!r&&r.width>10&&r.right>0;})(), navButtons:[...document.querySelectorAll('button')].filter(x=>x.getBoundingClientRect().width>0).map(x=>x.getAttribute('aria-label')||x.innerText.trim()).slice(0,10)}));
    const item={width,path,status:resp?.status(),overflow:result.doc>result.viewport+3,...result};
    mobile.push(item);
    if(item.overflow)issues.push({type:'responsive-overflow',path,detail:{width,doc:item.doc,viewport:item.viewport}});
    if((width===390||width===1440)&&['/','/tools/usb-c-compatibility/','/kits/budget-video-call-kit/','/guides/usb-c-dock-only-one-monitor/','/gear/connectivity/anker-553-usb-c-hub/'].includes(path)) {
      const slug=path==='/'?'home':path.split('/').filter(Boolean).join('-');
      await page.screenshot({path:join(output,'screenshots',slug+'-'+width+'.png'),fullPage:true,timeout:20000});
    }
   }catch(e){mobile.push({width,path,error:String(e.message||e).slice(0,200)});issues.push({type:'responsive-test-failed',path,detail:{width,error:String(e.message||e).slice(0,120)}});}
 }
 await context.close();
 console.log('VIEWPORT_DONE',width);
}
await browser.close();
const redirects=rows.filter(x=>x.finalPath&&x.finalPath!==x.path);
const counts={};
for(const i of issues)counts[i.type]=(counts[i.type]||0)+1;
const report={at:new Date().toISOString(),site:base,pagesExamined:rows.length,routeFiles:routes.length,uniqueInternalLinkTargets:linkTargets.size,redirects:redirects.length,issuesByType:counts,rows,mobile,issues};
await writeFile(join(output,'results.json'),JSON.stringify(report,null,2));
const sampleIssues=issues.slice(0,160).map(i=>'- '+i.type+' | '+i.path+' | '+JSON.stringify(i.detail??'')).join('\n');
await writeFile(join(output,'RAW-CRAWL.md'),[
 '# StackGeist live Playwright crawl and responsive audit',
 'Date: '+report.at,
 'Target: '+base,
 'Built HTML routes examined: '+rows.length,
 'Internal links discovered: '+linkTargets.size,
 'Responsive test cases: '+mobile.length,
 '',
 '## Issue counts',
 ...Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([k,v])=>'- '+k+': '+v),
 '',
 '## Findings (first 160)',
 sampleIssues||'No issues flagged',
 '',
 '## Method and limitations',
 'Live Chromium navigation to all built index.html routes, DOM checks, JS page errors and broken images (at DOMContentLoaded), plus 320/390/768/1440 responsive checks on 14 representative routes. Third-party merchant checkout and newsletter submission were not exercised. Screencaptures are in screenshots/.',
 'Full results in results.json.'
].join('\n'));
console.log('AUDIT_COMPLETE',JSON.stringify({pages:rows.length,counts,mobileCases:mobile.length,report:join(output,'RAW-CRAWL.md')}));
