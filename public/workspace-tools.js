// Workspace references share one pane. Live figures and narration are never cloned or remounted.
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const workspace=$('studioWorkspace'), board=$('studioBoardScroll'), content=$('studioBoardContent');
  const thread=$('thread'), dock=$('propertyTableDock'), toggle=$('workspaceToggle');
  if (!workspace || !board || !content || !thread || !dock || !toggle) return;
  const header=workspace.querySelector('.studio-workspace-heading');
  const toggleHome=document.createComment('Workspace toggle home'); toggle.before(toggleHome);
  const toolbar=document.createElement('div'); toolbar.className='workspace-tools-toolbar';
  const tablist=document.createElement('div'); tablist.className='workspace-tabs'; tablist.setAttribute('role','tablist'); tablist.setAttribute('aria-label','Workspace references');
  toolbar.append(tablist); header.after(toolbar);
  const equations=document.createElement('section'); equations.id='workspaceEquations'; equations.className='workspace-equations';
  const graph=document.createElement('section'); graph.id='workspaceGrapher'; graph.className='workspace-grapher';
  const graphLink=document.createElement('a'); graphLink.href='/grapher.html'; graphLink.target='_blank'; graphLink.rel='noopener'; graphLink.textContent='Open Grapher in a separate tab ↗';
  const graphFrame=document.createElement('iframe'); graphFrame.title='Thermodynamics Grapher'; graph.append(graphLink,graphFrame);
  workspace.append(dock,equations,graph); $('app').classList.remove('tables-open');
  workspace.classList.add('has-workspace-tools');
  const definitions=[['drawing','Drawing',board],['tables','Property tables',dock],['equations','Important equations',equations],['grapher','Grapher',graph]];
  const tabs=new Map(), panels=new Map(definitions.map(([key,,panel])=>[key,panel]));
  let selected='drawing', conversation=null, queued=false, items=[], signature='';
  const pins=new Map();
  function standalone(url) { window.open(url,'_blank','noopener'); }
  function select(key,{focus=false}={}) {
    if (!panels.has(key)) return;
    selected=key;
    for (const [id,panel] of panels) { panel.hidden=id!==key; tabs.get(id).setAttribute('aria-selected',String(id===key)); tabs.get(id).tabIndex=id===key?0:-1; }
    $('propertyTablesBtn').setAttribute('aria-expanded',String(key==='tables' && !workspace.hidden));
    if (key!=='drawing') window.KelvinNarration?.pauseAll();
    if (key==='tables' && !$('propertyTableFrame').hasAttribute('src')) $('propertyTableFrame').src=$('propertyTableFrame').dataset.src;
    if (key==='grapher' && !graphFrame.hasAttribute('src')) graphFrame.src='/grapher.html';
    if (key==='equations') refresh();
    if (focus) tabs.get(key).focus();
  }
  for (const [key,label,panel] of definitions) {
    const tab=document.createElement('button'); tab.type='button'; tab.id='workspaceTab-'+key; tab.textContent=label;
    tab.setAttribute('role','tab'); tab.setAttribute('aria-controls',panel.id); panel.setAttribute('role','tabpanel'); panel.setAttribute('aria-labelledby',tab.id);
    tab.onclick=()=>select(key); tabs.set(key,tab); tablist.append(tab);
    tab.onkeydown=event=>{
      const all=[...tabs.values()],index=all.indexOf(tab);
      const target=event.key==='ArrowRight'?all[(index+1)%all.length]:event.key==='ArrowLeft'?all[(index+all.length-1)%all.length]:event.key==='Home'?all[0]:event.key==='End'?all.at(-1):null;
      if (target) { event.preventDefault(); target.focus(); target.click(); }
    };
  }
  function syncVisibility() {
    if (workspace.hidden) toggleHome.after(toggle); else header.append(toggle);
    $('propertyTablesBtn').setAttribute('aria-expanded',String(selected==='tables' && !workspace.hidden));
  }
  new MutationObserver(syncVisibility).observe(workspace,{attributes:true,attributeFilter:['hidden']});
  syncVisibility();
  const equationsShortcut=document.createElement('button'); equationsShortcut.type='button'; equationsShortcut.id='importantEquationsBtn'; equationsShortcut.className='topbar-link'; equationsShortcut.textContent='Important equations';
  equationsShortcut.setAttribute('aria-controls',equations.id);
  $('propertyTablesBtn').after(equationsShortcut);
  equationsShortcut.onclick=()=>{ if (workspace.hidden) popoutEquations(); else select('equations',{focus:true}); };
  const grapherShortcut=document.querySelector('.topbar-right a[href="/grapher.html"]');
  if (grapherShortcut) {
    grapherShortcut.target='_blank'; grapherShortcut.rel='noopener';
    grapherShortcut.addEventListener('click',event=>{ if (!workspace.hidden) { event.preventDefault(); select('grapher',{focus:true}); } });
  }
  // Opening a message's workspace link returns to its live drawing, not the last reference tab.
  thread.addEventListener('click',event=>{ if(event.target.closest('.studio-figure-link,.studio-reopen')) select('drawing'); });
  for (const id of ['studioDemo','workspaceDemo']) $(id)?.addEventListener('click',()=>select('drawing'));
  function collect() {
    const roots=[]; const latest=thread.querySelector('.msg.assistant:last-of-type .md') || [...thread.querySelectorAll('.msg.assistant .md')].at(-1);
    if (latest) roots.push([latest,'Latest explanation']);
    const current=content.querySelector('figure[data-kfig]');
    if (current) roots.push([current,current.querySelector('.kboard-title')?.textContent || 'Current workspace explanation']);
    const found=new Map();
    for (const [root,source] of roots) for (const annotation of root.querySelectorAll('.katex-display annotation[encoding="application/x-tex"]')) {
      const tex=annotation.textContent.trim(); if (!tex || tex.length>3000) continue;
      const step=annotation.closest('.kboard-step');
      const block=annotation.closest('p,li,blockquote');
      const preceding=block?.previousElementSibling;
      const note=step?.querySelector('.kboard-note')?.textContent || (preceding && /assum|steady|adiabatic|neglect|constant|closed system/i.test(preceding.textContent) ? preceding.textContent.slice(0,360) : '');
      const label=step?.querySelector('strong')?.textContent || 'Equation from the explanation';
      const item={tex,label,note,source,element:annotation.closest('.katex-display')};
      // Prefer a board's explicit label and assumption note when the same equation appears twice.
      if (!found.has(tex) || step) found.set(tex,item);
    }
    return [...found.values()];
  }
  function equationNode(item,doc=document) {
    const node=doc.createElement('div'); node.className='workspace-equation-math';
    if (window.katex) window.katex.render(item.tex,node,{displayMode:true,throwOnError:false,trust:false,strict:'ignore'});
    else node.textContent=item.tex;
    return node;
  }
  function refresh() {
    queued=false; items=collect();
    for (const item of items) if(pins.has(item.tex)) pins.set(item.tex,item);
    const display=[...pins.values(),...items.filter(item=>!pins.has(item.tex))];
    const next=JSON.stringify(display.map(({tex,label,note,source,element})=>[tex,label,note,source,pins.has(tex),!!element?.isConnected]));
    if (next===signature) return; signature=next;
    equations.replaceChildren();
    const heading=document.createElement('div'); heading.className='workspace-equations-heading';
    const title=document.createElement('h3'); title.textContent='Important equations';
    const pop=document.createElement('button'); pop.type='button'; pop.textContent='Open reference in a new tab ↗'; pop.onclick=popoutEquations; heading.append(title,pop);
    const intro=document.createElement('p'); intro.className='workspace-equations-intro'; intro.textContent='From the current explanation and board. Pin equations to keep them for this conversation. Check their stated assumptions and units.';
    equations.append(heading,intro);
    if(!display.length) { const empty=document.createElement('p'); empty.className='workspace-equations-empty'; empty.textContent='Equations appear here when Kelvin includes displayed math in the explanation. Your pinned equations stay here as the conversation continues.'; equations.append(empty); }
    for (const item of display) {
      const card=document.createElement('article'); card.className='workspace-equation-card';
      const label=document.createElement('strong'); label.textContent=item.label;
      const source=document.createElement('p'); source.className='workspace-equation-source'; source.textContent=item.source;
      card.append(label,equationNode(item),source);
      if(item.note) { const note=document.createElement('p'); note.className='workspace-equation-note'; note.textContent=item.note; card.append(note); }
      const actions=document.createElement('div'); actions.className='workspace-equation-actions';
      const pin=document.createElement('button'); pin.type='button'; pin.textContent=pins.has(item.tex)?'Unpin':'Pin equation'; pin.setAttribute('aria-pressed',String(pins.has(item.tex)));
      pin.onclick=()=>{if(pins.has(item.tex)) pins.delete(item.tex); else pins.set(item.tex,item); signature='';refresh();};
      const show=document.createElement('button'); show.type='button'; show.textContent='Show source'; show.disabled=!item.element?.isConnected;
      show.onclick=()=>{ if(!item.element?.isConnected)return; if(content.contains(item.element))select('drawing'); item.element.scrollIntoView({block:'center',behavior:'auto'}); };
      actions.append(pin,show);card.append(actions);equations.append(card);
    }
  }
  function popoutEquations() {
    refresh();
    const popup=window.open('about:blank','_blank'); if(!popup)return; popup.opener=null;
    const doc=popup.document; doc.title='KELVIN — Important equations';
    const meta=doc.createElement('meta');meta.name='viewport';meta.content='width=device-width, initial-scale=1';
    const css=doc.createElement('link');css.rel='stylesheet';css.href=new URL('/vendor/katex/katex.min.css',location.href).href;
    const style=doc.createElement('style');style.textContent='body{font:16px/1.6 system-ui;background:#f3f7fd;color:#001e44;max-width:900px;margin:32px auto;padding:20px}article{background:white;border:1px solid #cddced;border-radius:12px;padding:20px;margin:18px 0}.katex-display{overflow:auto}p{color:#526782}';
    doc.head.append(meta,css,style); const title=doc.createElement('h1');title.textContent='Important equations';
    const note=doc.createElement('p');note.textContent='Read-only snapshot from your KELVIN conversation. This tab does not update or play narration.';doc.body.append(title,note);
    const display=[...pins.values(),...items.filter(item=>!pins.has(item.tex))];
    if(!display.length) {const empty=doc.createElement('p');empty.textContent='No displayed equations are available in the current explanation yet.';doc.body.append(empty);}
    for(const item of display){const card=doc.createElement('article');const label=doc.createElement('strong');label.textContent=item.label;const source=doc.createElement('p');source.textContent=item.source;card.append(label,equationNode(item,doc),source);if(item.note){const n=doc.createElement('p');n.textContent=item.note;card.append(n);}doc.body.append(card);}
  }
  function setConversation(id) {
    const key=id || null;if(key===conversation)return;conversation=key;pins.clear();items=[];signature='';equations.replaceChildren();select('drawing');schedule();
  }
  function schedule() {if(!queued){queued=true;requestAnimationFrame(refresh);}}
  const observer=new MutationObserver(schedule);observer.observe(thread,{childList:true,subtree:true});observer.observe(content,{childList:true,subtree:true});
  function routeConversation(){const match=location.hash.match(/^#\/c\/([^/?#]+)/);if(match)setConversation(decodeURIComponent(match[1]));else if(!location.hash || location.hash==='#/')setConversation(null);}
  window.addEventListener('hashchange',routeConversation);
  $('newChatBtn').addEventListener('click',()=>setConversation(null));$('topNewChat').addEventListener('click',()=>setConversation(null));
  window.KelvinWorkspaceTools={refresh:schedule,setConversation,showTables(open){if(!open){select('drawing');$('propertyTablesBtn').focus();return;}if(workspace.hidden)standalone('/property-tables.html');else select('tables',{focus:true});}};
  select('drawing');routeConversation();refresh();
})();
