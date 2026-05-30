const fs = require("fs");
const p = "d:/Documents/New project/workbench.html";
let s = fs.readFileSync(p, "utf8");

const dup =
  '<section class="r"><motion class="rhead"><h3>历史样本筛选</h3><p>筛选会同时影响左侧图谱和右侧报告</p></motion><motion class="filters"><motion class="frow"><select id="yearStart"></select><select id="yearEnd"></select></motion><motion class="frow triple"><input id="expertSearch" type="text" placeholder="检索负责人姓名"><select id="titleFilter"></select><select id="resultFilter"></select></motion><motion class="checks" id="typeFilters"></motion></motion></section>';

// exact from file (all div)
const dupExact =
  '<section class="r"><div class="rhead"><h3>历史样本筛选</h3><p>筛选会同时影响左侧图谱和右侧报告</p></div><div class="filters"><div class="frow"><select id="yearStart"></select><select id="yearEnd"></select></div><div class="frow triple"><input id="expertSearch" type="text" placeholder="检索负责人姓名"><select id="titleFilter"></select><select id="resultFilter"></select></div><motion class="checks" id="typeFilters"></motion></motion></section>';

const dupExact2 =
  '<section class="r"><div class="rhead"><h3>历史样本筛选</h3><p>筛选会同时影响左侧图谱和右侧报告</p></div><div class="filters"><div class="frow"><select id="yearStart"></select><select id="yearEnd"></select></div><div class="frow triple"><input id="expertSearch" type="text" placeholder="检索负责人姓名"><select id="titleFilter"></select><select id="resultFilter"></select></div><div class="checks" id="typeFilters"></div></div></section>';

if (!s.includes(dupExact2)) {
  console.error("duplicate block not found");
  process.exit(1);
}
s = s.replace(dupExact2, "");

const broken =
  '<aside class="report"><div class="report-head"><div class="report-copy"><h2>报告生成内容</h2>\n<div class="stack">';
const fixed =
  '<aside class="report"><div class="report-head"><div class="report-copy"><h2>报告生成内容</h2></motion></motion><motion class="stack">';

const fixedDiv =
  '<aside class="report"><div class="report-head"><div class="report-copy"><h2>报告生成内容</h2></div></div><div class="stack">';

if (s.includes(broken)) {
  s = s.replace(broken, fixedDiv);
} else {
  console.warn("report head already fixed or different newline");
  const alt =
    '<aside class="report"><div class="report-head"><div class="report-copy"><h2>报告生成内容</h2></div></motion><motion class="stack">';
  if (!s.includes(alt) && !s.includes(fixedDiv.replace(/\n/g, ""))) {
    const idx = s.indexOf("报告生成内容");
    console.log(JSON.stringify(s.slice(idx - 30, idx + 80)));
  }
}

fs.writeFileSync(p, s);
console.log("done");
