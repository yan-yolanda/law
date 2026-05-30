
    (function () {
      var rp = window.ResearchPlatformData || {};
      var summaryEl = document.getElementById("summary");
      if (!rp.getTopicByTitle || !rp.findSimilarTopics || !rp.recommendExperts || !rp.inferDirectionFromTitle) {
        summaryEl.textContent = "数据未正常加载，请返回工作台重试。";
        return;
      }

      var POLICY = [["数据",["数字中国建设整体布局规划","“十四五”数字经济发展规划","网络数据安全管理条例"]],["算法",["互联网信息服务算法推荐管理规定","新一代人工智能发展规划","生成式人工智能服务管理暂行办法"]],["人工智能",["生成式人工智能服务管理暂行办法","新一代人工智能发展规划"]],["平台",["关于平台经济领域的反垄断指南","“十四五”市场监管现代化规划"]],["认罪认罚",["关于适用认罪认罚从宽制度的指导意见","法治中国建设规划（2020-2025年）"]],["刑事",["法治中国建设规划（2020-2025年）","“八五”普法规划"]],["证据",["关于加强新时代检察机关法律监督工作的意见","法治中国建设规划（2020-2025年）"]],["著作权",["知识产权强国建设纲要（2021-2035年）","“十四五”国家知识产权保护和运用规划"]],["专利",["知识产权强国建设纲要（2021-2035年）","“十四五”国家知识产权保护和运用规划"]],["涉外",["关于加强新时代涉外法治工作的意见","法治中国建设规划（2020-2025年）"]],["行政",["法治政府建设实施纲要（2021-2025年）","“十四五”推进国家政务信息化规划"]],["劳动",["“十四五”就业促进规划","关于维护新就业形态劳动者劳动保障权益的指导意见"]]];
      var DISC = {"数字法治":["法学","网络空间安全","公共管理","信息资源管理"],"刑事法治":["法学","公安学","社会学","国家安全学"],"民商法治":["法学","应用经济学","工商管理"],"知识产权法":["法学","管理科学与工程","新闻传播学"],"国际法治":["法学","国际关系","区域国别学","应用经济学"],"行政法治":["法学","公共管理","政治学"],"司法制度":["法学","纪检监察学","公共管理"],"社会治理法":["法学","社会学","劳动经济学","公共管理"]};
      var TECH = [["数据",["大数据治理","数据确权","隐私计算"]],["算法",["算法推荐系统","模型可解释性","算法审计"]],["人工智能",["生成式人工智能","大语言模型","内容审核"]],["平台",["平台治理系统","交易风控","用户画像"]],["证据",["电子取证","司法区块链","证据存证"]],["跨境",["跨境数据流转","合规审计系统","数据分类分级"]],["专利",["专利信息分析","知识图谱","技术情报挖掘"]],["著作权",["数字水印","内容识别","版权追踪"]],["劳动",["平台调度算法","职业伤害监测","灵活用工管理"]],["审判",["类案检索","裁判文书分析","智慧法院"]],["行政",["政务数据开放","数字政府平台","智能审批"]]];

      function getParam(name) {
        var match = new RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
        return match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : "";
      }
      function unique(arr) {
        var map = {};
        var out = [];
        for (var i = 0; i < arr.length; i += 1) {
          if (!map[arr[i]]) {
            map[arr[i]] = true;
            out.push(arr[i]);
          }
        }
        return out;
      }
      function renderTags(items, cls) {
        var html = "";
        for (var i = 0; i < items.length; i += 1) {
          html += '<span class="tag ' + cls + '">' + items[i] + "</span>";
        }
        return html;
      }
      function policies(topic) {
        var out = [];
        for (var i = 0; i < POLICY.length; i += 1) {
          var key = POLICY[i][0];
          var vals = POLICY[i][1];
          var hit = topic.title.indexOf(key) !== -1 || topic.direction.indexOf(key) !== -1;
          if (!hit && topic.keywords) {
            for (var j = 0; j < topic.keywords.length; j += 1) {
              if (String(topic.keywords[j]).indexOf(key) !== -1) {
                hit = true;
                break;
              }
            }
          }
          if (hit) out = out.concat(vals);
        }
        out = unique(out);
        if (!out.length) out = ["法治中国建设规划（2020-2025年）"];
        return out.slice(0, 6);
      }
      function disciplines(topic) { return DISC[topic.direction] || ["法学", "公共管理"]; }
      function technologies(topic) {
        var out = [];
        for (var i = 0; i < TECH.length; i += 1) {
          var key = TECH[i][0];
          var vals = TECH[i][1];
          var hit = topic.title.indexOf(key) !== -1;
          if (!hit && topic.keywords) {
            for (var j = 0; j < topic.keywords.length; j += 1) {
              if (String(topic.keywords[j]).indexOf(key) !== -1) {
                hit = true;
                break;
              }
            }
          }
          if (hit) out = out.concat(vals);
        }
        out = unique(out);
        if (!out.length) out = ["案例数据库分析", "法律文本挖掘"];
        return out.slice(0, 6);
      }

      var title = getParam("title") || "平台算法歧视的司法救济研究";
      var existingTopic = rp.getTopicByTitle(title);
      var direction = existingTopic ? existingTopic.direction : rp.inferDirectionFromTitle(title);
      var queryTopic = existingTopic || { title: title, direction: direction, keywords: [direction, "法学研究", "制度完善"] };
      var similarTopics = rp.findSimilarTopics(queryTopic, 5).filter(function (topic) { return topic.title !== title; });
      var experts = rp.recommendExperts(queryTopic, 5);
      var selectedLeadName = getParam("lead") || "";

      var leadPanel = document.getElementById("leadPanel");
      var reviewPanel = document.getElementById("reviewPanel");
      var stepLead = document.getElementById("stepLead");
      var stepReview = document.getElementById("stepReview");
      var chosenLead = document.getElementById("chosenLead");

      var topicPolicies = policies(queryTopic);
      var topicDisciplines = disciplines(queryTopic);
      var topicTechnologies = technologies(queryTopic);
      var topSimilarity = similarTopics.length ? Math.round(similarTopics[0].similarity * 100) : 0;
      var policyScore = Math.min(96, 46 + topicPolicies.length * 8 + Math.round(topSimilarity * 0.22));
      var supportScore = Math.min(95, 42 + topicDisciplines.length * 7 + topicTechnologies.length * 5);
      var decisionItems = [
        "与“" + queryTopic.direction + "”方向高度相关",
        topSimilarity >= 70 ? "历史样本充分，适合做深化型申报" : "历史样本交叉适中，适合突出新切口",
        topicPolicies.length >= 3 ? "政策映射充分，可支撑立项必要性" : "建议补足国家政策对接表述",
        topicTechnologies.length >= 3 ? "方法与技术支撑较完整" : "建议补充方法论或数据来源"
      ];
      var riskItems = [
        topSimilarity >= 80 ? "与既有课题较近，需强化差异化表达" : "与既有课题重复风险可控",
        topicPolicies.length <= 2 ? "政策锚点偏少，立项必要性需进一步增强" : "政策依据较扎实",
        experts.length < 3 ? "负责人候选梯队偏薄，建议扩大备选范围" : "负责人备选较稳定",
        topicTechnologies.length <= 2 ? "技术或方法支撑偏弱" : "技术与方法支撑较完整"
      ];

      function renderLeftReport() {
        document.getElementById("title").textContent = title;
        document.getElementById("crumb").textContent = queryTopic.direction + " / 课题详情";
        summaryEl.textContent = "系统已根据“" + queryTopic.direction + "”方向完成历史课题、负责人和评审专家的分步匹配，可用于立项论证与团队配置演示。";
        document.getElementById("reportMetrics").innerHTML =
          '<div class="metric"><span>最高历史相似度</span><strong>' + topSimilarity + '%</strong></div>' +
          '<div class="metric"><span>政策匹配度</span><strong>' + policyScore + '%</strong></div>' +
          '<div class="metric"><span>支撑完备度</span><strong>' + supportScore + '%</strong></div>' +
          '<div class="metric"><span>负责人候选</span><strong>' + Math.min(experts.length, 3) + ' 位</strong></div>';
        document.getElementById("policySummary").textContent = "当前题目可映射到 " + topicPolicies.length + " 项政策依据，适合从国家战略、治理场景和制度回应三个层面展开论证。";
        document.getElementById("policyTags").innerHTML = renderTags(topicPolicies, "policy");
        document.getElementById("supportSummary").textContent = "该题目主要涉及 " + topicDisciplines.join("、") + " 等学科，并可结合 " + topicTechnologies.slice(0, 3).join("、") + " 等技术或方法形成支撑。";
        document.getElementById("supportTags").innerHTML = renderTags(topicDisciplines, "discipline") + renderTags(topicTechnologies, "tech");
        document.getElementById("decisionTags").innerHTML = renderTags(decisionItems, "decision");
        document.getElementById("riskTags").innerHTML = renderTags(riskItems, "risk");
        var similarHtml = "";
        for (var i = 0; i < similarTopics.length; i += 1) {
          var topic = similarTopics[i];
          similarHtml += '<article class="item"><h3>' + topic.title + '</h3><div class="meta"><span class="pill">' + topic.year + ' 年</span><span class="pill">' + topic.type + '</span><span class="pill">' + topic.direction + '</span><span class="pill score">相似度 ' + Math.round(topic.similarity * 100) + '%</span></div><div>关键词：' + topic.keywords.slice(0, 4).join(" / ") + '</div><div class="bar"><span style="width:' + Math.round(topic.similarity * 100) + '%"></span></div></article>';
        }
        document.getElementById("similarList").innerHTML = similarHtml || '<div class="empty">暂无高相似历史课题。</div>';
      }

      function renderSteps() {
        var hasLead = !!selectedLeadName;
        leadPanel.className = hasLead ? "panel" : "panel active";
        reviewPanel.className = hasLead ? "panel active" : "panel";
        stepLead.className = hasLead ? "step done" : "step active";
        stepReview.className = hasLead ? "step active" : "step";
        chosenLead.className = hasLead ? "chosen active" : "chosen";
        if (!hasLead) {
          chosenLead.innerHTML = "";
          return;
        }
        var lead = null;
        for (var i = 0; i < experts.length; i += 1) {
          if (experts[i].name === selectedLeadName) { lead = experts[i]; break; }
        }
        if (!lead) { chosenLead.innerHTML = ""; return; }
        chosenLead.innerHTML = '<h3>已选负责人：' + lead.name + '</h3><p>' + lead.institution + ' · ' + lead.title + '。当前评审专家推荐已自动避开负责人本人，并优先补足方向覆盖与评议独立性。</p><div class="step-actions"><button class="ghost" type="button" id="backToLead">重新选择负责人</button><a href="./expert.html?name=' + encodeURIComponent(lead.name) + '">查看负责人画像</a></div>';
        document.getElementById("backToLead").onclick = function () {
          selectedLeadName = "";
          renderSteps();
          renderReviewers();
        };
      }

      function renderLeads() {
        var html = "";
        for (var i = 0; i < Math.min(experts.length, 3); i += 1) {
          var expert = experts[i];
          var dirHtml = "";
          for (var j = 0; j < expert.directions.length; j += 1) {
            dirHtml += '<span class="pill">' + expert.directions[j] + '</span>';
          }
          html += '<article class="item expert"><div class="avatar">' + expert.name.slice(0, 1) + '</div><div><h3>' + expert.name + '</h3><div>' + expert.institution + ' · ' + expert.title + '</div><div class="meta">' + dirHtml + '<span class="pill score">匹配度 ' + Math.round(expert.score * 100) + '%</span></div><div>匹配说明：与本课题方向重合度高，并参与过多个相关法学项目。</div><div class="bar"><span style="width:' + Math.round(expert.score * 100) + '%"></span></div><div class="step-actions"><button type="button" data-lead="' + expert.name + '">确定为负责人</button><a href="./expert.html?name=' + encodeURIComponent(expert.name) + '">查看专家画像</a></div></div></article>';
        }
        document.getElementById("leadList").innerHTML = html || '<div class="empty">暂无负责人推荐。</div>';
        var buttons = document.querySelectorAll("[data-lead]");
        for (var k = 0; k < buttons.length; k += 1) {
          buttons[k].onclick = function () {
            selectedLeadName = this.getAttribute("data-lead");
            renderSteps();
            renderReviewers();
          };
        }
      }

      function renderReviewers() {
        if (!selectedLeadName) {
          document.getElementById("reviewerList").innerHTML = '<div class="empty">请先确定项目负责人。</div>';
          return;
        }
        var lead = null;
        var reviewers = [];
        for (var i = 0; i < experts.length; i += 1) {
          if (experts[i].name === selectedLeadName) lead = experts[i];
          else reviewers.push(experts[i]);
        }
        reviewers = reviewers.slice(0, 4);
        var html = "";
        for (var j = 0; j < reviewers.length; j += 1) {
          var expert = reviewers[j];
          var dirHtml = "";
          var complement = false;
          for (var d = 0; d < expert.directions.length; d += 1) {
            dirHtml += '<span class="pill">' + expert.directions[d] + '</span>';
            if (lead && lead.directions.indexOf(expert.directions[d]) !== -1) complement = true;
          }
          if (complement) dirHtml += '<span class="pill score">方向互补</span>';
          html += '<article class="item expert"><div class="avatar">' + expert.name.slice(0, 1) + '</div><div><h3>' + expert.name + '</h3><div>' + expert.institution + '</div><div class="meta">' + dirHtml + '</div><div>评审建议：重点关注其在' + (expert.directions[0] || "法学交叉研究") + '方向的规范研究与实践评估经验，并与负责人' + (lead ? '“' + lead.name + '”' : '') + '形成互补。</div><div class="step-actions"><a href="./expert.html?name=' + encodeURIComponent(expert.name) + '">查看专家画像</a></div></div></article>';
        }
        document.getElementById("reviewerList").innerHTML = html || '<div class="empty">暂无评审专家推荐。</div>';
      }

      function buildExportHtml() {
        var leadText = selectedLeadName ? "已选负责人：" + selectedLeadName : "尚未确定负责人";
        var policyHtml = renderTags(topicPolicies, "");
        var supportHtml = renderTags(unique(topicDisciplines.concat(topicTechnologies)), "");
        var decisionHtml = "<li>" + decisionItems.join("</li><li>") + "</li>";
        var riskHtml = "<li>" + riskItems.join("</li><li>") + "</li>";
        var similarHtml = "";
        for (var i = 0; i < similarTopics.length; i += 1) {
          similarHtml += "<li>" + similarTopics[i].title + "（" + Math.round(similarTopics[i].similarity * 100) + "%）</li>";
        }
        return '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>' + title + '-分析报告</title><style>body{font-family:"Microsoft YaHei",sans-serif;padding:32px;color:#10213c;line-height:1.8}h1,h2{color:#16365f}section{margin-top:24px}ul{padding-left:18px}li{margin:6px 0}.tag{display:inline-block;margin:0 8px 8px 0;padding:4px 10px;border-radius:999px;background:#eef4ff}</style></head><body><h1>' + title + '</h1><p>' + queryTopic.direction + ' / ' + leadText + '</p><section><h2>核心指标</h2><ul><li>最高历史相似度：' + topSimilarity + '%</li><li>政策匹配度：' + policyScore + '%</li><li>支撑完备度：' + supportScore + '%</li></ul></section><section><h2>政策匹配度</h2><p>' + policyHtml + '</p></section><section><h2>支撑基础</h2><p>' + supportHtml + '</p></section><section><h2>是否值得做</h2><ul>' + decisionHtml + '</ul></section><section><h2>风险提示</h2><ul>' + riskHtml + '</ul></section><section><h2>相似历史课题</h2><ul>' + similarHtml + '</ul></section></body></html>';
      }

      document.getElementById("exportReport").onclick = function () {
        var blob = new Blob([buildExportHtml()], { type: "text/html;charset=utf-8" });
        var url = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        link.download = title + "-分析报告.html";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      };

      try {
        renderLeftReport();
        renderLeads();
        renderSteps();
        renderReviewers();
      } catch (err) {
        summaryEl.textContent = "页面渲染出错：" + err.message;
      }
    }());
  
