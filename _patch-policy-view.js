const fs = require("fs");
const path = "d:/Documents/New project/workbench.html";
let s = fs.readFileSync(path, "utf8");

// 1. Import POLICY_CATALOG and analyzePolicyCoverage
s = s.replace(
  "const {TOPICS,EXPERTS,tokenize,findSimilarTopics,findRelatedPolicies,inferDirectionFromTitle}=window.ResearchPlatformData;",
  "const {TOPICS,EXPERTS,tokenize,findSimilarTopics,findRelatedPolicies,inferDirectionFromTitle,POLICY_CATALOG,analyzePolicyCoverage}=window.ResearchPlatformData;"
);

// 2. CSS
const cssInsert =
  ".viz.policy-mode{background:radial-gradient(circle at top,rgba(34,197,94,.12),transparent 28%),linear-gradient(180deg,#0b1728,#102033 54%,#152840)}.viz.policy-mode .viz-hint-semantic{display:none}.policy-axis{stroke:rgba(255,255,255,.28);stroke-width:1.2}.policy-axis-label{fill:rgba(255,255,255,.65);font-size:12px}.policy-node{cursor:pointer}.policy-node rect{transition:stroke-width .12s,filter .12s}.policy-node.active rect{stroke:#fff;stroke-width:2.4;filter:drop-shadow(0 0 10px rgba(255,255,255,.45))}.policy-node-title{fill:#fff;font-size:11px;font-weight:700}.policy-node-meta{fill:rgba(255,255,255,.78);font-size:10px}.chip.done{background:rgba(34,197,94,.14);color:#166534}.chip.pending{background:rgba(239,68,68,.12);color:#b91c1c}.policy-dir-card{padding:12px 14px;border-radius:14px;border:1px solid rgba(148,163,184,.16);background:#f8fbff;margin-bottom:10px}.policy-dir-card h4{margin:0 0 8px;font-size:15px}.policy-dir-card.done{border-color:rgba(34,197,94,.28);background:linear-gradient(180deg,#f6fdf8,#fff)}.policy-dir-card.pending{border-color:rgba(239,68,68,.22);background:linear-gradient(180deg,#fff7f7,#fff)}";
if (!s.includes(".viz.policy-mode{background")) {
  s = s.replace(
    ".viz.timeline-mode .badge.viz-hint-semantic{display:none}",
    ".viz.timeline-mode .badge.viz-hint-semantic{display:none}" + cssInsert
  );
}

// 3. Nav button
s = s.replace(
  '<button class="view-btn" id="viewTimeline" type="button">\u65f6\u95f4\u5173\u8054\u89c6\u56fe</button></motion></nav>',
  '<button class="view-btn" id="viewTimeline" type="button">\u65f6\u95f4\u5173\u8054\u89c6\u56fe</button><button class="view-btn" id="viewPolicy" type="button">\u653f\u7b56\u6f14\u8fdb\u89c6\u56fe</button></div></nav>'
);
s = s.replace(
  '<button class="view-btn" id="viewTimeline" type="button">\u65f6\u95f4\u5173\u8054\u89c6\u56fe</button></motion></nav>',
  '<button class="view-btn" id="viewTimeline" type="button">\u65f6\u95f4\u5173\u8054\u89c6\u56fe</button><button class="view-btn" id="viewPolicy" type="button">\u653f\u7b56\u6f14\u8fdb\u89c6\u56fe</button></motion></nav>'
);

// fix if motion typo
s = s.replace(
  '<button class="view-btn" id="viewTimeline" type="button">\u65f6\u95f4\u5173\u8054\u89c6\u56fe</button></motion></nav>',
  '<button class="view-btn" id="viewTimeline" type="button">\u65f6\u95f4\u5173\u8054\u89c6\u56fe</button><button class="view-btn" id="viewPolicy" type="button">\u653f\u7b56\u6f14\u8fdb\u89c6\u56fe</button></div></nav>'
);

// 4. viewPolicy in const list
s = s.replace(
  "viewTimeline=document.getElementById(\"viewTimeline\"),",
  "viewTimeline=document.getElementById(\"viewTimeline\"),viewPolicy=document.getElementById(\"viewPolicy\"),"
);

// 5. state
s = s.replace(
  "timelineKeywordPins:[],mapDragging:false",
  "timelineKeywordPins:[],selectedPolicyName:null,mapDragging:false"
);

// 6. Helper functions before renderReport
const helpers = `
function policyShortLabel(name,max){const t=String(name||"");return t.length>max?t.slice(0,max)+"\u2026":t}
function policyNodeColor(direction){const map={"\u6570\u5b57\u6cd5\u6cbb":"#38bdf8","\u5211\u4e8b\u6cd5\u6cbb":"#f87171","\u6c11\u商\u6cd5\u6cbb":"#fb923c","\u77e5\u8bc6\u4ea7\u6743\u6cd5":"#c084fc","\u56fd\u9645\u6cd5\u6cbb":"#2dd4bf","\u884c\u653f\u6cd5\u6cbb":"#4ade80","\u53f8\u6cd5\u5236\u5ea6":"#60a5fa","\u793e\u4f1a\u6cbb\u7406\u6cd5":"#fbbf24"};return map[direction]||"#94a3b8"}
function buildPolicyTimelineLayout(catalog){const years=catalog.map(p=>p.year),minY=Math.min(...years),maxY=Math.max(...years),plotW=CV.w-CV.l-CV.r-40,baseY=CV.t+48,rowH=58,byYear=new Map();catalog.forEach((policy,idx)=>{if(!byYear.has(policy.year))byYear.set(policy.year,[]);byYear.get(policy.year).push(Object.assign({},policy,{_idx:idx}))});const nodes=[];[...byYear.entries()].sort((a,b)=>a[0]-b[0]).forEach(([year,items])=>{const x=CV.l+20+((year-minY)/Math.max(1,maxY-minY))*plotW;items.forEach((policy,i)=>{const y=baseY+i*rowH+(items.length>1?0:18);nodes.push(Object.assign({},policy,{x,y,w:Math.min(168,Math.max(108,policy.name.length*7.2)),h:44}))})});return{nodes,minY,maxY}}
function renderPolicyTimelineMarkup(catalog,selectedName){const layout=buildPolicyTimelineLayout(catalog),lines="";let m="";for(let y=layout.minY;y<=layout.maxY;y+=1){const gx=CV.l+20+((y-layout.minY)/Math.max(1,layout.maxY-layout.minY))*(CV.w-CV.l-CV.r-40);m+=\`<line class="policy-axis" x1="\${gx}" y1="\${CV.t+28}" x2="\${gx}" y2="\${CV.h-CV.b-24}"></line><text class="policy-axis-label" x="\${gx}" y="\${CV.t+18}" text-anchor="middle">\${y}</text>\`;m+=\`<line class="policy-axis" x1="\${CV.l}" y1="\${CV.h-CV.b-32}" x2="\${CV.w-CV.r}" y2="\${CV.h-CV.b-32}" stroke-dasharray="4 6"></line><text class="policy-axis-label" x="\${CV.w/2}" y="\${CV.h-12}" text-anchor="middle">\u653f\u7b56\u53d1\u5e03\u65f6\u95f4\u8f74\uff08\u5e74\uff09</text>\`;layout.nodes.forEach(policy=>{const active=selectedName===policy.name,color=policyNodeColor(policy.directions[0]||"");m+=\`<g class="policy-node \${active?"active":""}" data-name="\${policy.name.replace(/"/g,"&quot;")}"><rect x="\${policy.x-policy.w/2}" y="\${policy.y-policy.h/2}" width="\${policy.w}" height="\${policy.h}" rx="10" fill="rgba(15,23,42,.55)" stroke="\${color}" stroke-width="1.6"></rect><text class="policy-node-title" x="\${policy.x}" y="\${policy.y-4}" text-anchor="middle">\${policyShortLabel(policy.name,14)}</text><text class="policy-node-meta" x="\${policy.x}" y="\${policy.y+12}" text-anchor="middle">\${policy.year} \u00b7 \${policyShortLabel(policy.issuer,10)}</text></g>\`});return m}
function policyOverviewReport(){setApprovalWeightsVisible(false);const catalog=POLICY_CATALOG;reportHeading.textContent="\u653f\u7b56\u6f14\u8fdb\u6982\u89c8";reportMode.textContent="\u70b9\u51fb\u65f6\u95f4\u8f74\u4e0a\u7684\u653f\u7b56\u8282\u70b9\uff0c\u67e5\u770b\u5176\u5173\u6ce8\u65b9\u5411\u4e0e\u5386\u53f2\u8bfe\u9898\u8986\u76d6\u60c5\u51b5";distTitle.textContent="\u653f\u7b56\u5e74\u4efd\u5206\u5e03";kwTitle.textContent="\u653f\u7b56\u4e3b\u9898\u805a\u7126";detailTitle.textContent="\u4f7f\u7528\u8bf4\u660e";if(kwDesc)kwDesc.textContent="\u6309\u65f6\u95f4\u5c55\u793a\u4e3b\u6d41\u653f\u7b56\u53d8\u5316";summary.className="sum";summary.innerHTML=\`<div class="i"><span>\u653f\u7b56\u6587\u4ef6</span><strong>\${catalog.length}</strong></div><motion class="i"><span>\u65f6\u95f4\u8de8\u5ea6</span><strong>\${catalog.length?catalog[0].year+"\u2014"+catalog[catalog.length-1].year:"\u2014"}</strong></div><div class="i"><span>\u8986\u76d6\u65b9\u5411</span><strong>\${uniq(catalog.flatMap(p=>p.directions)).length}</strong></div><div class="i"><span>\u5df2\u9009\u653f\u7b56</span><strong>\u2014</strong></div>\`;const yearMap=new Map();catalog.forEach(p=>yearMap.set(p.year,(yearMap.get(p.year)||0)+1));const max=Math.max(1,...yearMap.values());bars.innerHTML=[...yearMap.entries()].sort((a,b)=>a[0]-b[0]).map(([year,count])=>\`<div class="bar"><span>\${year}</span><div class="track"><span class="fill" style="width:\${Math.round(count/max*100)}%"></span></div><strong>\${count}</strong></div>\`).join("");kwIntro.textContent="\u7eff\u8272\u6807\u7b7e\u4e3a\u653f\u7b56\u805a\u7126\u7684\u7814\u7a76\u65b9\u5411\uff08\u6570\u5b57\u6cd5\u6cbb\u3001\u5211\u4e8b\u6cd5\u6cbb\u7b49\uff09\u3002";kwCloud.className="cloud";kwCloud.style.display="";kwCloud.innerHTML=uniq(catalog.flatMap(p=>p.tags)).slice(0,12).map(t=>\`<span class="chip ov">\${t}</span>\`).join("");ctxCloud.className="ctx";ctxCloud.style.display="";ctxCloud.innerHTML="";detail.innerHTML=\`<motion class="ritem"><h4>\u5982\u4f55\u9605\u8bfb\u653f\u7b56\u6f14\u8fdb\u89c6\u56fe</h4><p>\u6a2a\u8f74\u4e3a\u653f\u7b56\u53d1\u5e03\u5e74\u4efd\uff0c\u6bcf\u4e2a\u8282\u70b9\u4ee3\u8868\u4e00\u9879\u56fd\u5bb6\u7ea7\u653f\u7b56\u6216\u89c4\u5212\u3002\u70b9\u51fb\u540e\uff0c\u53f3\u4fa7\u62a5\u544a\u5c06\u5217\u51fa\u8be5\u653f\u7b56\u5f3a\u8c03\u7684\u7814\u7a76\u65b9\u5411\uff0c\u5e76\u5bf9\u6bd4\u5f53\u524d\u7b5b\u9009\u8303\u56f4\u5185\u7684\u5386\u53f2\u8bfe\u9898\uff0c\u6807\u8bb0\u54ea\u4e9b\u65b9\u5411\u5df2\u6709\u7814\u7a76\u57fa\u7840\u3001\u54ea\u4e9b\u65b9\u5411\u4ecd\u5c5e\u7a7a\u767d\u3002</p></div>\`}
function policyReport(policyName){setApprovalWeightsVisible(false);const hist=visibleHistory(),analysis=analyzePolicyCoverage(policyName,hist);reportHeading.textContent="\u653f\u7b56\u65b9\u5411\u8986\u76d6\u5206\u6790";reportMode.textContent=\`\u300a\${policyName}\u300b\uff08\${analysis.date||analysis.year+"\u5e74"}\uff09\`;distTitle.textContent="\u65b9\u5411\u8986\u76d6\u7edf\u8ba1";kwTitle.textContent="\u653f\u7b56\u5173\u6ce8\u65b9\u5411";detailTitle.textContent="\u65b9\u5411\u660e\u7ec6\u5206\u6790";if(kwDesc)kwDesc.textContent="\u7eff\u8272\u5df2\u505a\u3001\u7ea2\u8272\u5f85\u505a";summary.className="sum";summary.innerHTML=\`<div class="i"><span>\u5173\u6ce8\u65b9\u5411</span><strong>\${analysis.focusAreas.length}</strong></div><div class="i"><span>\u5df2\u505a</span><strong>\${analysis.done.length}</strong></div><div class="i"><span>\u5f85\u505a</span><strong>\${analysis.pending.length}</strong></motion><div class="i"><span>\u5386\u53f2\u6837\u672c</span><strong>\${hist.length}</strong></div>\`;const max=Math.max(1,analysis.done.length,analysis.pending.length);bars.innerHTML=\`<motion class="bar"><span>\u5df2\u505a\u65b9\u5411</span><div class="track"><span class="fill" style="width:\${Math.round(analysis.done.length/max*100)}%;background:linear-gradient(90deg,#22c55e,#4ade80)"></span></div><strong>\${analysis.done.length}</strong></div><div class="bar"><span>\u5f85\u505a\u65b9\u5411</span><motion class="track"><span class="fill" style="width:\${Math.round(analysis.pending.length/max*100)}%;background:linear-gradient(90deg,#ef4444,#f87171)"></span></div><strong>\${analysis.pending.length}</strong></motion>\`;kwIntro.textContent=analysis.summary||"\u8be5\u653f\u7b56\u5df2\u6839\u636e\u6761\u6587\u6458\u8981\u5339\u914d\u7814\u7a76\u65b9\u5411\u3002";kwCloud.className="cloud";kwCloud.style.display="";kwCloud.innerHTML=analysis.focusAreas.map(area=>\`<span class="chip \${area.status==="done"?"done":"pending"}">\${area.direction}</span>\`).join("");ctxCloud.className="ctx policy-stack";ctxCloud.style.display="";ctxCloud.innerHTML=analysis.focusAreas.map(area=>\`<article class="policy-dir-card \${area.status}"><h4>\${area.direction} \u00b7 \${area.status==="done"?"\u5df2\u6709\u7814\u7a76\u57fa\u7840":"\u5c1a\u5c5e\u7a7a\u767d"}</h4><p>\u5173\u952e\u8bcd\uff1a\${area.tags.length?area.tags.join("\u3001"):"\u5b8f\u89c2\u65b9\u5411"}</p>\${area.sources.slice(0,1).map(src=>\`<p><strong>\${src.label}</strong>\${src.text}</p>\`).join("")}\${area.samples.length?`<p>\u4ee3\u8868\u8bfe\u9898\uff1a\${area.samples.map(t=>t.title).join("\uff1b")}</p>`:"<p>\u5f53\u524d\u7b5b\u9009\u8303\u56f4\u5185\u6682\u65e0\u8db3\u591f\u5339\u914d\u7684\u5386\u53f2\u8bfe\u9898\u3002</p>"}</article>\`).join("");detail.innerHTML=\`<div class="ritem"><h4>\u653f\u7b56\u8981\u70b9</h4><p><strong>\u300a\${policyName}\u300b</strong></p><p>\u53d1\u5e03\u4e3b\u4f53\uff1a\${analysis.issuer||"\u2014"} \u00b7 \u65f6\u95f4\uff1a\${analysis.date||analysis.year+"\u5e74"}</p><p>\${analysis.summary||""}</p><p>\u7cfb\u7edf\u5df2\u5bf9\u6bd4\u7b5b\u9009\u8303\u56f4\u5185 \${hist.length} \u9879\u5386\u53f2\u8bfe\u9898\uff1a\u5df2\u505a \${analysis.done.length} \u4e2a\u65b9\u5411\uff0c\u5f85\u505a \${analysis.pending.length} \u4e2a\u65b9\u5411\u3002\u5f85\u505a\u65b9\u5411\u53ef\u4f5c\u4e3a\u65b0\u4e00\u8f6e\u5019\u9009\u8bfe\u9898\u7684\u91cd\u70b9\u5207\u5165\u3002</p></div>\`+analysis.focusAreas.map(area=>\`<div class="ritem"><h4>\${area.direction}</h4><p>\u72b6\u6001\uff1a<strong>\${area.status==="done"?"\u5df2\u505a\uff08\u5386\u53f2\u8bfe\u9898 "+area.topicCount+" \u9879\uff09":"\u5f85\u505a\uff08\u7a7a\u767d\u6216\u57fa\u7840\u8584\u5f31\uff09"}</strong></p><p>\u653f\u7b56\u4f9d\u636e\uff1a\${area.sources.map(s=>s.label).join("\u3001")}</p>\${area.samples.map(t=>\`<p>\u00b7 \${t.title}\uff08\${t.year}\u5e74\uff09</p>\`).join("")||"<p>\u6682\u65e0\u5339\u914d\u5386\u53f2\u8bfe\u9898\u3002</p>"}</div>\`).join("")}
`;

// Fix typos in helpers - 民商法治 had wrong char
const helpersFixed = helpers
  .replace(/民商\u6cd5\u6cbb/g, "民商法治")
  .replace(/<motion /g, "<motion ")
  .replace(/<\/motion>/g, "</motion>");

// Actually fix all motion to div in helpers string
const helpersClean = helpers
  .replace(/"\u6c11\u5546\u6cd5\u6cbb"/g, '"民商法治"')
  .replace(/<motion /g, "<div ")
  .replace(/<\/motion>/g, "</div>");

if (!s.includes("function policyOverviewReport")) {
  s = s.replace("function renderReport(){", helpersClean + "function renderReport(){");
}

// 7. renderReport body
s = s.replace(
  "function renderReport(){if(!state.candidates.length){historyReport();return}",
  "function renderReport(){if(state.view===\"policy\"){if(state.selectedPolicyName)policyReport(state.selectedPolicyName);else policyOverviewReport();return}if(!state.candidates.length){historyReport();return}"
);

// 8. renderMap - add policy branch before timeline
const renderMapNeedle = "viewSemantic.classList.toggle(\"active\",state.view===\"semantic\");viewTimeline.classList.toggle(\"active\",state.view===\"timeline\");vizPanel.classList.toggle(\"timeline-mode\",state.view===\"timeline\");if(state.view===\"timeline\")";
const policyBranch = `viewSemantic.classList.toggle("active",state.view==="semantic");viewTimeline.classList.toggle("active",state.view==="timeline");viewPolicy.classList.toggle("active",state.view==="policy");vizPanel.classList.toggle("timeline-mode",state.view==="timeline");vizPanel.classList.toggle("policy-mode",state.view==="policy");if(state.view==="policy"){state.timelineKeywordPins=[];hideMapTooltip();renderTimelineLegend([]);vizTitle.textContent="政策演进视图";vizIntro.textContent="横轴为政策发布时间，点击任一政策节点可在右侧查看其强调的研究方向，以及历史课题覆盖情况（已做/待做）。";zoomHint.textContent="当前显示：政策时间轴";clusterMetric.textContent="政策文件："+POLICY_CATALOG.length;state.zoom=1;state.panX=0;state.panY=0;const catalog=POLICY_CATALOG;svg.innerHTML=renderPolicyTimelineMarkup(catalog,state.selectedPolicyName);renderMapZoomBadge();return}if(state.view==="timeline")`;

if (s.includes(renderMapNeedle)) {
  s = s.replace(renderMapNeedle, policyBranch);
} else {
  console.error("renderMap needle not found");
  process.exit(1);
}

// 9. renderMapZoomBadge
s = s.replace(
  'if(state.view!=="semantic"&&state.view!=="timeline")',
  'if(state.view!=="semantic"&&state.view!=="timeline"&&state.view!=="policy")'
);

// 10. initPan policy click
s = s.replace(
  "if(e.target.closest(\".timeline-kw\"))return;",
  'if(state.view==="policy"&&e.target.closest(".policy-node")){mapPress={kind:"policy",name:e.target.closest(".policy-node").dataset.name,x:e.clientX,y:e.clientY,pointerId:e.pointerId};return}if(e.target.closest(".timeline-kw"))return;'
);

s = s.replace(
  "if(mapPress&&mapPress.pointerId===e.pointerId){if(Math.hypot(e.clientX-mapPress.x,e.clientY-mapPress.y)<8){if(mapPress.kind===\"bubble\")addBubbleTopicsToMap(mapPress.bubble,e.clientX,e.clientY);else selectTopicFromMap(mapPress.topic,e.clientX,e.clientY)}mapPress=null}",
  'if(mapPress&&mapPress.pointerId===e.pointerId){if(Math.hypot(e.clientX-mapPress.x,e.clientY-mapPress.y)<8){if(mapPress.kind==="policy"){state.selectedPolicyName=mapPress.name;renderReport();renderMap()}else if(mapPress.kind==="bubble")addBubbleTopicsToMap(mapPress.bubble,e.clientX,e.clientY);else selectTopicFromMap(mapPress.topic,e.clientX,e.clientY)}mapPress=null}'
);

// 11. wheel - policy view no zoom or allow - disable zoom change in policy
s = s.replace(
  'svg.addEventListener("wheel",e=>{e.preventDefault();state.zoom=clamp(state.zoom+(e.deltaY<0?0.18:-0.18),1,3.8);renderMap()},{passive:false});',
  'svg.addEventListener("wheel",e=>{e.preventDefault();if(state.view==="policy")return;state.zoom=clamp(state.zoom+(e.deltaY<0?0.18:-0.18),1,3.8);renderMap()},{passive:false});'
);

// 12. view handlers
s = s.replace(
  'viewSemantic.addEventListener("click",()=>{state.view="semantic";renderMap()});',
  'viewSemantic.addEventListener("click",()=>{state.view="semantic";state.selectedPolicyName=null;renderMap();renderReport()});'
);
s = s.replace(
  'viewTimeline.addEventListener("click",()=>{state.view="timeline";state.zoom=1;state.panX=0;state.panY=0;renderMap()});',
  'viewTimeline.addEventListener("click",()=>{state.view="timeline";state.selectedPolicyName=null;state.zoom=1;state.panX=0;state.panY=0;renderMap();renderReport()});\nviewPolicy.addEventListener("click",()=>{state.view="policy";state.zoom=1;state.panX=0;state.panY=0;renderMap();renderReport()});'
);

// 13. init load policy overview when no candidates - also call policy overview if policy view
// filters already call renderReport

// 14. Nav button if still missing
if (!s.includes('id="viewPolicy"')) {
  s = s.replace(
    'id="viewTimeline" type="button">\u65f6\u95f4\u5173\u8054\u89c6\u56fe</button></div></nav>',
    'id="viewTimeline" type="button">\u65f6\u95f4\u5173\u8054\u89c6\u56fe</button><button class="view-btn" id="viewPolicy" type="button">\u653f\u7b56\u6f14\u8fdb\u89c6\u56fe</button></div></nav>'
  );
}

fs.writeFileSync(path, s);
console.log("patch done");
