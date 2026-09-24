'use strict';
const content = window.meetingContent;
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pair = ([zh,en]) => `<div class="pair"><p class="en" lang="en-GB">${escapeHTML(en)}</p><p class="zh" lang="zh-Hant">${escapeHTML(zh)}</p></div>`;
document.querySelector('#question-index').innerHTML = content.questions.map((q,i)=>`<a class="question-link" href="#q${i+1}" aria-label="問題 ${i+1}：${escapeHTML(q.zh)}"><span class="number">${String(i+1).padStart(2,'0')}</span><span class="label">${escapeHTML(q.short)}</span></a>`).join('');
document.querySelector('#answers').innerHTML = content.questions.map((q,i)=>`<article class="answer" id="q${i+1}" tabindex="-1"><div class="answer-head"><span>QUESTION ${String(i+1).padStart(2,'0')}</span><a href="#index">返回 10 題索引 ↑</a></div><h3>${escapeHTML(q.zh)}</h3><p class="question-en" lang="en-GB">${escapeHTML(q.en)}</p><ul>${q.answers.map(a=>`<li>${pair(a)}</li>`).join('')}</ul><p class="cue"><strong>回答提醒：</strong>${escapeHTML(q.cue)}</p></article>`).join('');
for (const type of ['opening','closing']) document.querySelector(`#${type}-text`).innerHTML=content[type].map(pair).join('');
document.querySelector('#strategy-text').innerHTML=content.strategy.map(s=>`<article class="strategy-card"><h3>${escapeHTML(s.title)}</h3>${pair([s.zh,s.en])}</article>`).join('');
document.querySelector('#source-note').textContent=content.sourceNote||'';
function preference(key, value) { try { if(value===undefined) return localStorage.getItem(key); localStorage.setItem(key,value); } catch {} }
function setLanguage(language) {document.body.dataset.language=language;document.querySelectorAll('[data-language]').forEach(b=>{if(b.tagName==='BUTTON')b.setAttribute('aria-pressed',String(b.dataset.language===language));});preference('meeting-language',language);}
document.querySelectorAll('button[data-language]').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.language)));
setLanguage(['both','en','zh'].includes(preference('meeting-language'))?preference('meeting-language'):'both');
function setLarge(large){document.body.classList.toggle('large',large);document.querySelector('#font-size').setAttribute('aria-pressed',String(large));document.querySelector('#font-size').setAttribute('aria-label',large?'恢復標準文字':'放大文字');preference('meeting-large',String(large));}
setLarge(preference('meeting-large')==='true');
document.querySelector('#font-size').addEventListener('click',()=>setLarge(!document.body.classList.contains('large')));
function jump(hash){const target=document.getElementById(hash.slice(1));if(!target)return;target.scrollIntoView({behavior:'instant',block:'start'});if(target.matches('.answer'))target.focus({preventScroll:true});document.querySelectorAll('.question-link,.bottom-nav a').forEach(a=>a.setAttribute('aria-current',String(a.getAttribute('href')===hash)));}
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;e.preventDefault();history.replaceState(null,'',a.getAttribute('href'));jump(a.getAttribute('href'));});
window.addEventListener('hashchange',()=>jump(location.hash));
if(location.hash)requestAnimationFrame(()=>jump(location.hash));
if('serviceWorker' in navigator && location.protocol==='https:'){
 navigator.serviceWorker.register('./sw.js').then(()=>navigator.serviceWorker.ready).then(()=>{const s=document.querySelector('#offline-status');s.textContent='已準備好離線閱讀 · 保留此頁或加入主畫面';s.classList.add('ready');}).catch(()=>{document.querySelector('#offline-status').textContent='請保持此頁開啟；離線儲存暫未完成。';});
}else document.querySelector('#offline-status').textContent='會議前先在手機開啟網頁，確認內容已載入。';
