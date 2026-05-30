function escapeHtml(value) {
      return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    function showBootError(message) {
      const note = `<div class="boot-error" role="alert"><strong>页面数据未能加载</strong>${escapeHtml(message)}<br><br>请确认 <code>data.js</code> 与 <code>detail.html</code> 位于同一目录，并从 <a href="./index.html">首页</a> 或 <a href="./workbench.html">工作台</a> 进入；若直接双击打开无效，请使用本地服务器访问。</div>`;
      ["similarList", "policyList", "leadList"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = note;
      });
      const summary = document.getElementById("summary");
      if (summary) summary.textContent = "数据模块加载失败，无法展示推荐结果。";
    }

    function initDetailPage() {
    if (window.__platformDataLoadFailed) {
      throw new Error("data.js 加载失败，请确认文件路径正确。");
    }
    const data = window.ResearchPlatformData;
    if (!data) {
      throw new Error("未找到 ResearchPlatformData，请检查 data.js 是否加载成功。");
    }
    const { getTopicByTitle, findSimilarTopics, findRelatedPolicies, recommendExperts, buildExpertNetwork, inferDirectionFromTitle, buildTopicAnalysisReport } = data;

    function renderPolicyClauses(clauses) {
      if (!clauses || !clauses.length) return "";
      return `<div class="policy-clauses">${clauses.map((clause) => `
        <blockquote class="policy-clause">
          <cite>${escapeHtml(clause.label)}</cite>
          <p>${escapeHtml(clause.text)}</p>
        </blockquote>
      `).join("")}</div>`;
    }

    function renderMatchDetail(detail) {
      if (!detail || !detail.sections || !detail.sections.length) {
        return '<div class="match-detail"><p><strong>综合判断：</strong>系统根据方向、关键词与历史立项记录完成匹配，建议结合专家画像进一步核验。</p></div>';
      }
      return `<div class="match-detail">${detail.sections.map((section) => `<p><strong>${section.title}</strong>${section.text}</p>`).join("")}</div>`;
    }
    const params = new URLSearchParams(window.location.search);
    const title = params.get("title") || "平台算法歧视的司法救济研究";
    const leadParam = params.get("lead") || "";
    const reviewerParam = params.get("reviewers") || "";
    const selectedReviewerNames = reviewerParam.split(",").map((name) => name.trim()).filter(Boolean);
    const existingTopic = getTopicByTitle(title);
    const queryTopic = existingTopic || { title, direction: inferDirectionFromTitle(title), keywords:[inferDirectionFromTitle(title), "法学研究", "制度完善"] };
    const similarTopics = findSimilarTopics(queryTopic, 8).filter((topic) => topic.title !== title);
    const relatedPolicies = findRelatedPolicies(queryTopic, 8);
    const experts = recommendExperts(queryTopic, 6);

    const stepLead = document.getElementById("stepLead");
    const stepReview = document.getElementById("stepReview");
    const leadPanel = document.getElementById("leadPanel");
    const reviewPanel = document.getElementById("reviewPanel");
    const chosenLead = document.getElementById("chosenLead");
    const chosenReviewers = document.getElementById("chosenReviewers");

    function buildDetailUrl(nextLead, nextReviewers) {
      const query = new URLSearchParams();
      query.set("title", title);
      if (nextLead) query.set("lead", nextLead);
      if (nextReviewers && nextReviewers.length) query.set("reviewers", nextReviewers.join(","));
      return `./detail.html?${query.toString()}`;
    }

    document.getElementById("title").textContent = title;
    document.getElementById("crumb").textContent = queryTopic.direction + " / 课题详情";
    document.getElementById("summary").textContent = `系统已根据“${queryTopic.direction}”方向完成相似历史课题、相关政策、负责人与评审专家的顺序匹配，可用于立项论证与团队配置演示。`;

    document.getElementById("similarList").innerHTML = similarTopics.map((topic) => `
      <article class="item">
        <h3>${topic.title}</h3>
        <div class="meta">
          <span class="pill">${topic.year} 年</span>
          <span class="pill">${topic.type}</span>
          <span class="pill">${topic.direction}</span>
          <span class="pill score">相似度 ${Math.round(topic.similarity * 100)}%</span>
        </div>
        <div>关键词：${topic.keywords.slice(0,4).join(" / ")}</div>
        <div class="bar"><span style="width:${Math.round(topic.similarity * 100)}%"></span></div>
      </article>
    `).join("") || '<div class="empty">暂无高相似历史课题。</div>';

    document.getElementById("policyList").innerHTML = relatedPolicies.map((policy) => `
      <article class="item">
        <h3>${escapeHtml(policy.name)}</h3>
        <div class="meta">
          <span class="pill policy">政策文件</span>
          <span class="pill">${escapeHtml(policy.reason)}</span>
          <span class="pill">触发词：${escapeHtml(policy.keyword)}</span>
        </div>
        ${policy.issuer || policy.effectiveDate ? `<p class="policy-meta">${[policy.issuer, policy.effectiveDate].filter(Boolean).map(escapeHtml).join(" · ")}</p>` : ""}
        ${policy.summary ? `<p class="policy-summary">${escapeHtml(policy.summary)}</p>` : ""}
        ${renderPolicyClauses(policy.clauses)}
        <p class="policy-note">以上条文与当前课题“${escapeHtml(policy.keyword)}”议题直接相关，可用于立项背景、问题界定或制度设计论证。</p>
      </article>
    `).join("") || '<div class="empty">暂无匹配政策，请补充课题关键词后重新匹配。</div>';

    document.getElementById("leadList").innerHTML = experts.slice(0,4).map((expert) => `
      <article class="item expert">
        <div class="avatar">${expert.name.slice(0,1)}</div>
        <div>
          <h3>${expert.name}</h3>
          <div>${expert.institution} · ${expert.title}</div>
          <div class="meta">
            ${expert.directions.map((direction) => `<span class="pill">${direction}</span>`).join("")}
            <span class="pill score">匹配度 ${Math.round(expert.score * 100)}%</span>
          </div>
          ${renderMatchDetail(expert.matchDetail)}
          <div class="bar"><span style="width:${Math.round(expert.score * 100)}%"></span></div>
          <div class="actions">
            <a class="btn" href="${buildDetailUrl(expert.name, selectedReviewerNames)}">确定为负责人</a>
            <a class="ghost" href="./expert.html?name=${encodeURIComponent(expert.name)}">查看专家画像</a>
          </div>
        </div>
      </article>
    `).join("") || '<div class="empty">暂无负责人推荐。</div>';

    const reportModal = document.getElementById("reportModal");
    const reportEditor = document.getElementById("reportEditor");
    const reportStatus = document.getElementById("reportStatus");
    const reportCharts = document.getElementById("reportCharts");
    const downloadReportBtn = document.getElementById("downloadReportBtn");
    let reportDownloadName = "课题-立项分析报告.pdf";
    let pendingExportBundle = null;
    const HTML2PDF_CDN = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";

    function loadHtml2Pdf() {
      if (window.html2pdf) return Promise.resolve(window.html2pdf);
      return new Promise((resolve, reject) => {
        const existing = document.querySelector("script[data-html2pdf]");
        if (existing) {
          existing.addEventListener("load", () => (window.html2pdf ? resolve(window.html2pdf) : reject(new Error("PDF 库不可用"))));
          existing.addEventListener("error", () => reject(new Error("PDF 库加载失败")));
          return;
        }
        const script = document.createElement("script");
        script.src = HTML2PDF_CDN;
        script.dataset.html2pdf = "1";
        script.onload = () => (window.html2pdf ? resolve(window.html2pdf) : reject(new Error("PDF 库不可用")));
        script.onerror = () => reject(new Error("PDF 库加载失败，请检查网络后重试"));
        document.head.appendChild(script);
      });
    }

    function reportPdfStyles() {
      return `
.pdf-report-root{font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;color:#10213c;line-height:1.75;background:#f4f7fb;padding:8px}
.pdf-report-root h1{margin:0 0 8px;font-size:22px;color:#123055}
.pdf-report-root .meta{margin:0 0 20px;font-size:12px;color:#64748b}
.pdf-report-root .report-section{margin-bottom:24px;padding:18px 20px;background:#fff;border-radius:12px;page-break-inside:avoid}
.pdf-report-root .report-section h2{margin:0 0 10px;font-size:16px;color:#123055}
.pdf-report-root .note{margin:0 0 12px;font-size:12px;color:#64748b}
.pdf-report-root .chart-wrap{border-radius:8px;overflow:hidden;background:#0b1728;margin-bottom:12px}
.pdf-report-root .chart-wrap svg,.pdf-report-root .chart-wrap img{display:block;width:100%;max-width:100%;height:auto}
.pdf-report-root .analysis h3{margin:14px 0 6px;font-size:14px;color:#16365f}
.pdf-report-root .analysis h4{margin:10px 0 4px;font-size:13px;color:#334155}
.pdf-report-root .analysis p{margin:0 0 6px;font-size:12px;color:#334155}
.pdf-report-root .body-text{margin:0;white-space:pre-wrap;font-family:inherit;font-size:12px;line-height:1.75;color:#334155;background:#f8fbff;padding:12px;border-radius:8px;border:1px solid rgba(148,163,184,.2)}
`;
    }

    function rasterizeReportSvgs(root) {
      const tasks = [];
      root.querySelectorAll(".chart-wrap svg").forEach((svg) => {
        tasks.push(new Promise((resolve) => {
          try {
            const clone = svg.cloneNode(true);
            if (!clone.getAttribute("xmlns")) clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            const xml = new XMLSerializer().serializeToString(clone);
            const dataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
            const img = document.createElement("img");
            img.alt = "图谱";
            img.style.width = "100%";
            img.onload = () => {
              svg.replaceWith(img);
              resolve();
            };
            img.onerror = () => resolve();
            img.src = dataUrl;
          } catch (error) {
            resolve();
          }
        }));
      });
      return Promise.all(tasks);
    }

    function buildDetailReportMarkup(baseText, bundle) {
      const generatedAt = new Date().toLocaleString("zh-CN");
      const chartSections = bundle ? `
        <section class="report-section">
          <h2>一、语义图谱</h2>
          <p class="note">下图橙色圆点为当前候选课题「${escapeHtml(bundle.candidateTitle || title)}」，冷—暖色区域为历史课题聚类。</p>
          <div class="chart-wrap">${bundle.semanticSvg}</div>
          <div class="analysis">${formatAnalysisHtml(bundle.semanticAnalysis)}</div>
        </section>
        <section class="report-section">
          <h2>二、时间关联视图</h2>
          <p class="note">下图展示各领域关键词的时间演进网络；橙色圆点为候选课题在对应领域中的落点。</p>
          <div class="chart-wrap">${bundle.timelineSvg}</div>
          <div class="analysis">${formatAnalysisHtml(bundle.timelineAnalysis)}</div>
        </section>
        <section class="report-section">
          <h2>三、立项论证与团队配置</h2>
          <pre class="body-text">${escapeHtml(baseText)}</pre>
        </section>
      ` : `
        <section class="report-section">
          <h2>立项论证与团队配置</h2>
          <pre class="body-text">${escapeHtml(baseText)}</pre>
        </section>
      `;
      return `<style>${reportPdfStyles()}</style>
<div class="pdf-report-root">
  <header>
    <h1>${escapeHtml(title)}</h1>
    <p class="meta">法学研究选题平台 · 立项分析报告 · 生成时间 ${escapeHtml(generatedAt)}</p>
  </header>
  ${chartSections}
</div>`;
    }

    function createReportPdfElement(baseText, bundle) {
      const host = document.createElement("div");
      host.style.cssText = "position:fixed;left:-10000px;top:0;width:794px;z-index:-1";
      host.innerHTML = buildDetailReportMarkup(baseText, bundle);
      document.body.appendChild(host);
      return host;
    }

    function buildDetailReportText(lead, selectedReviewers) {
      const recommendedReviewers = experts.filter((expert) => !lead || expert.name !== lead.name);
      let approvalPolicyWeight = 45;
      try {
        const saved = localStorage.getItem("approvalPolicyWeight");
        if (saved != null && !Number.isNaN(Number(saved))) {
          approvalPolicyWeight = Math.min(100, Math.max(0, Math.round(Number(saved))));
        }
      } catch (error) {
        approvalPolicyWeight = 45;
      }
      return buildTopicAnalysisReport(queryTopic, {
        lead: lead,
        selectedReviewers: selectedReviewers,
        recommendedReviewers: recommendedReviewers,
        approvalPolicyWeight: approvalPolicyWeight
      });
    }

    function fetchWorkbenchExportBundle(topicTitle) {
      return new Promise((resolve, reject) => {
        const iframe = document.createElement("iframe");
        iframe.setAttribute("aria-hidden", "true");
        iframe.style.cssText = "position:fixed;left:-9999px;width:1px;height:1px;border:0;opacity:0";
        const captureUrl = new URL("./workbench.html", window.location.href);
        captureUrl.searchParams.set("exportCapture", "1");
        captureUrl.searchParams.set("title", topicTitle);
        const timeout = window.setTimeout(() => {
          cleanup();
          reject(new Error("图谱生成超时，请稍后重试"));
        }, 22000);
        function cleanup() {
          window.clearTimeout(timeout);
          window.removeEventListener("message", onMessage);
          iframe.remove();
        }
        function onMessage(event) {
          if (event.source !== iframe.contentWindow) return;
          if (!event.data || event.data.type !== "workbench-export-ready") return;
          cleanup();
          if (event.data.error) reject(new Error(event.data.error));
          else resolve(event.data.payload);
        }
        window.addEventListener("message", onMessage);
        iframe.addEventListener("error", () => {
          cleanup();
          reject(new Error("无法加载工作台页面"));
        });
        iframe.src = captureUrl.toString();
        document.body.appendChild(iframe);
      });
    }

    function formatAnalysisHtml(text) {
      return String(text || "").split("\n").map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return "";
        if (/^【.+】$/.test(trimmed)) return `<h3>${escapeHtml(trimmed)}</h3>`;
        if (/^（\d+）/.test(trimmed)) return `<h4>${escapeHtml(trimmed)}</h4>`;
        if (/^\d+\.\s/.test(trimmed)) return `<p class="numbered">${escapeHtml(trimmed)}</p>`;
        return `<p>${escapeHtml(trimmed)}</p>`;
      }).join("");
    }

    function renderChartPreview(bundle) {
      if (!bundle) {
        reportCharts.innerHTML = "";
        return;
      }
      reportCharts.innerHTML = `
        <section class="report-chart-block">
          <h4>语义图谱（橙色圆点：候选课题「${escapeHtml(bundle.candidateTitle || title)}」）</h4>
          <div class="chart-svg-wrap">${bundle.semanticSvg}</div>
          <div class="report-chart-caption">${escapeHtml(bundle.semanticAnalysis || "")}</div>
        </section>
        <section class="report-chart-block">
          <h4>时间关联视图（橙色圆点：候选课题落点）</h4>
          <div class="chart-svg-wrap">${bundle.timelineSvg}</div>
          <div class="report-chart-caption">${escapeHtml(bundle.timelineAnalysis || "")}</div>
        </section>
      `;
    }

    function buildDetailReportHtml(baseText, bundle) {
      return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)} — 立项分析报告</title>
</head>
<body>
${buildDetailReportMarkup(baseText, bundle)}
</body>
</html>`;
    }

    async function downloadDetailReport() {
      const prevLabel = downloadReportBtn.textContent;
      downloadReportBtn.disabled = true;
      reportEditor.disabled = true;
      downloadReportBtn.textContent = "正在生成 PDF…";
      reportStatus.textContent = "正在生成 PDF，请稍候…";
      const host = createReportPdfElement(reportEditor.value, pendingExportBundle);
      try {
        await rasterizeReportSvgs(host);
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const html2pdf = await loadHtml2Pdf();
        const pdfName = reportDownloadName.replace(/\.(html?|pdf)$/i, "") + ".pdf";
        const target = host.querySelector(".pdf-report-root") || host;
        await html2pdf().set({
          margin: [10, 10, 10, 10],
          filename: pdfName,
          image: { type: "jpeg", quality: 0.92 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: "#f4f7fb", logging: false },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["css", "legacy"] }
        }).from(target).save();
        reportDownloadName = pdfName;
        reportStatus.textContent = "PDF 已导出。";
        return true;
      } catch (error) {
        reportStatus.textContent = `PDF 导出失败（${error.message}）。已打开打印窗口，可选择「另存为 PDF」。`;
        const html = buildDetailReportHtml(reportEditor.value, pendingExportBundle);
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(html);
          printWindow.document.close();
          setTimeout(() => printWindow.print(), 400);
        }
        return false;
      } finally {
        host.remove();
        downloadReportBtn.disabled = false;
        reportEditor.disabled = false;
        downloadReportBtn.textContent = prevLabel;
      }
    }

    function closeReportEditor() {
      reportModal.hidden = true;
      document.body.style.overflow = "";
      pendingExportBundle = null;
      reportCharts.innerHTML = "";
      reportStatus.textContent = "";
      reportEditor.disabled = false;
      downloadReportBtn.disabled = false;
    }

    async function openReportEditor(lead, selectedReviewers) {
      const safeName = title.replace(/[\\/:*?"<>|]/g, "_").slice(0, 40);
      reportDownloadName = `${safeName || "课题"}-立项分析报告.pdf`;
      pendingExportBundle = null;
      reportCharts.innerHTML = "";
      reportEditor.value = "";
      reportEditor.disabled = true;
      downloadReportBtn.disabled = true;
      reportStatus.textContent = "正在渲染语义图谱与时间关联视图（含候选课题标注）…";
      reportModal.hidden = false;
      document.body.style.overflow = "hidden";
      try {
        pendingExportBundle = await fetchWorkbenchExportBundle(title);
        renderChartPreview(pendingExportBundle);
        reportStatus.textContent = "图谱与分析已生成。可编辑下方立项论证正文，确认后导出 PDF。";
      } catch (error) {
        reportStatus.textContent = `图谱未能加载（${error.message}），将仅导出立项论证正文。`;
      }
      reportEditor.value = buildDetailReportText(lead, selectedReviewers);
      reportEditor.disabled = false;
      downloadReportBtn.disabled = false;
      reportEditor.focus();
    }

    reportModal.querySelectorAll("[data-close-report]").forEach((el) => {
      el.addEventListener("click", closeReportEditor);
    });
    downloadReportBtn.addEventListener("click", async () => {
      const ok = await downloadDetailReport();
      if (ok) closeReportEditor();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !reportModal.hidden) closeReportEditor();
    });

    function relationshipScore(leadName, reviewerName) {
      const network = buildExpertNetwork(leadName);
      const link = network.links.find((item) => {
        return (item.source === leadName && item.target === reviewerName) || (item.source === reviewerName && item.target === leadName);
      });
      const times = link ? link.value : 0;
      const closeness = times >= 5 ? "高" : times >= 3 ? "中" : times >= 1 ? "低" : "弱";
      const percent = Math.min(100, times * 18 + (times ? 22 : 8));
      return { times, closeness, percent };
    }

    function syncPanels() {
      const lead = experts.find((expert) => expert.name === leadParam);

      if (!leadParam || !lead) {
        stepLead.className = "step active";
        stepReview.className = "step";
        leadPanel.className = "panel active";
        reviewPanel.className = "panel";
        document.getElementById("reviewerList").innerHTML = '<div class="empty">请先在上一步确定项目负责人。</div>';
        chosenLead.className = "chosen";
        chosenLead.innerHTML = "";
        if (chosenReviewers) {
          chosenReviewers.className = "chosen chosen-reviewers";
          chosenReviewers.innerHTML = "";
        }
        return;
      }
      const reviewers = experts.filter((expert) => expert.name !== leadParam);
      const selectedReviewers = selectedReviewerNames.map((name) => reviewers.find((expert) => expert.name === name)).filter(Boolean);
      stepLead.className = "step done";
      stepReview.className = "step active";
      leadPanel.className = "panel";
      reviewPanel.className = "panel active";
      chosenLead.className = "chosen active";
      chosenLead.innerHTML = `
        <h3>已选负责人：${lead.name}</h3>
        <p>${lead.institution} · ${lead.title}。评审专家推荐已自动避开负责人本人，并优先补足方向覆盖与评议独立性。</p>
        <div class="actions">
          <a class="ghost" href="${buildDetailUrl("", [])}">重新选择负责人</a>
          <a class="btn" href="./expert.html?name=${encodeURIComponent(lead.name)}">查看负责人画像</a>
          <button type="button" class="btn-outline" data-export-report>导出报告</button>
        </div>
      `;
      const exportBtn = chosenLead.querySelector("[data-export-report]");
      if (exportBtn) {
        exportBtn.addEventListener("click", () => openReportEditor(lead, selectedReviewers));
      }

      if (chosenReviewers) {
        if (selectedReviewers.length) {
          chosenReviewers.className = "chosen chosen-reviewers active";
          chosenReviewers.innerHTML = `
            <h3>已确定评审专家（${selectedReviewers.length} 人）</h3>
            <p>以下专家已纳入评审组配置，可继续从推荐列表中增补或调整。</p>
            <ul>${selectedReviewers.map((expert) => `<li>${expert.name} · ${expert.institution}</li>`).join("")}</ul>
            <div class="actions">
              <a class="ghost" href="${buildDetailUrl(leadParam, [])}">清空评审专家</a>
            </div>
          `;
        } else {
          chosenReviewers.className = "chosen chosen-reviewers";
          chosenReviewers.innerHTML = "";
        }
      }

      document.getElementById("reviewerList").innerHTML = reviewers.map((expert) => {
        const relation = relationshipScore(lead.name, expert.name);
        const isSelected = selectedReviewerNames.includes(expert.name);
        const nextReviewers = isSelected
          ? selectedReviewerNames.filter((name) => name !== expert.name)
          : selectedReviewerNames.concat([expert.name]);
        return `
        <article class="item expert${isSelected ? " confirmed" : ""}">
          <div class="avatar">${expert.name.slice(0,1)}</div>
          <div>
            <h3>${expert.name}</h3>
            <div>${expert.institution}</div>
            <div class="meta">
              ${expert.directions.map((direction) => `<span class="pill">${direction}</span>`).join("")}
              <span class="pill score">关系亲密度 ${relation.closeness}</span>
              <span class="pill">共同讲座 ${relation.times} 次</span>
              ${isSelected ? '<span class="pill score">已确定</span>' : ""}
            </div>
            <div>评审建议：重点关注其在${expert.directions[0] || "法学交叉研究"}方向的规范研究与实践评估经验，与负责人形成互补。</div>
            <div>关系说明：该亲密度根据两人在学术合作网络中的共同讲座次数计算，用于辅助判断合作熟悉程度。</div>
            <div class="bar"><span style="width:${relation.percent}%"></span></div>
            <div class="actions">
              ${isSelected
                ? `<a class="ghost" href="${buildDetailUrl(leadParam, nextReviewers)}">取消确定</a>`
                : `<a class="btn" href="${buildDetailUrl(leadParam, nextReviewers)}">确定为评审专家</a>`}
              <a class="ghost" href="./expert.html?name=${encodeURIComponent(expert.name)}">查看专家画像</a>
            </div>
          </div>
        </article>
      `;}).join("") || '<div class="empty">暂无评审专家推荐。</div>';
    }

    syncPanels();
    }

    function boot() {
      try {
        initDetailPage();
      } catch (error) {
        console.error(error);
        showBootError(error && error.message ? error.message : String(error));
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", boot);
    } else {
      boot();
    }
