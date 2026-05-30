const fs = require("fs");
const p = "d:/Documents/New project/workbench.html";
let s = fs.readFileSync(p, "utf8");

const filterRe =
  /<section class="r"><motion class="rhead"><h3>历史样本筛选<\/h3><p>筛选会同时影响左侧图谱和右侧报告<\/p><\/motion><motion class="filters">[\s\S]*?<\/section>/;
