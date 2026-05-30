(function () {
  const PROJECT_TYPES = ["重点项目", "一般项目", "青年项目", "后期资助项目", "西部项目"];

  const DIRECTION_SEEDS = [
    { direction: "数字法治", type: "重点项目", keywords: ["数据要素", "算法治理", "平台责任", "个人信息保护", "数字证据"], titles: ["生成式人工智能服务中的平台责任边界研究", "数据要素市场配置中的公共法治理机制研究", "算法推荐场景下个人信息保护义务研究", "跨境数据流动的合规审查与监管协同研究", "数字取证规则在网络犯罪治理中的适用研究"] },
    { direction: "刑事法治", type: "一般项目", keywords: ["认罪认罚", "轻罪治理", "证据规则", "网络犯罪", "程序分流"], titles: ["轻罪治理背景下认罪认罚从宽制度优化研究", "涉众型网络犯罪的证据标准与证明责任研究", "刑事速裁程序中的程序保障边界研究", "数字证据审查规则在刑事审判中的适用研究", "未成年人网络犯罪的分层治理机制研究"] },
    { direction: "民商法治", type: "青年项目", keywords: ["合同治理", "平台交易", "消费者权益", "侵权责任", "公司治理"], titles: ["平台经济背景下格式条款效力认定研究", "网络直播带货场景中的消费者救济机制研究", "数据侵权案件中的损害赔偿计算规则研究", "公司控制权争夺中的董事信义义务研究", "智能合约履行争议的私法回应研究"] },
    { direction: "知识产权法", type: "重点项目", keywords: ["著作权", "专利治理", "商标保护", "平台传播", "人工智能"], titles: ["生成式人工智能训练数据的著作权边界研究", "高价值专利培育中的行政与司法协同保护研究", "短视频二创生态中的作品合理使用规则研究", "平台电商场景中商标混淆责任认定研究", "开源模型应用中的知识产权风险分配研究"] },
    { direction: "国际法治", type: "后期资助项目", keywords: ["涉外法治", "国际仲裁", "合规治理", "出口管制", "投资保护"], titles: ["涉外法治建设中的企业合规审查机制研究", "国际商事仲裁中临时措施执行问题研究", "出口管制规则对跨国供应链合同的影响研究", "海外投资争端中的国家责任抗辩研究", "数字贸易规则重构中的中国法治回应研究"] },
    { direction: "行政法治", type: "一般项目", keywords: ["行政裁量", "政府数据开放", "比例原则", "行政处罚", "复议改革"], titles: ["行政裁量基准公开化的法治化路径研究", "政府数据开放中的公共利益衡量规则研究", "新行政处罚法实施中的过罚相当原则研究", "行政复议主渠道定位下程序协同研究", "基层综合执法改革中的权责配置研究"] },
    { direction: "司法制度", type: "重点项目", keywords: ["审判管理", "案例指导", "司法公开", "审级职能", "数字法院"], titles: ["数字法院建设中的审判权运行机制研究", "类案检索在裁判统一中的功能边界研究", "审级职能定位改革下再审启动规则研究", "司法公开与个人隐私保护的平衡机制研究", "案例指导制度提升裁判可预期性的路径研究"] },
    { direction: "社会治理法", type: "青年项目", keywords: ["基层治理", "劳动法", "平台用工", "社会保障", "纠纷预防"], titles: ["平台用工关系认定的劳动法路径研究", "灵活就业群体社会保障法治保障研究", "社区矛盾纠纷预防中的法治资源配置研究", "新业态劳动者职业伤害保障制度研究", "基层协商治理中的规则嵌入机制研究"] }
  ];

  const EXPERT_SEEDS = [["陈知衡", "华东政法大学"], ["林予安", "中国政法大学"], ["周明谦", "清华大学法学院"], ["顾南乔", "北京大学法学院"], ["宋砚秋", "复旦大学法学院"], ["沈若川", "武汉大学法学院"], ["梁思远", "吉林大学法学院"], ["许澄怀", "中南财经政法大学"], ["贺清岚", "厦门大学法学院"], ["唐景澜", "南京大学法学院"], ["裴知序", "上海交通大学凯原法学院"], ["程叙白", "中国人民大学法学院"], ["夏闻笛", "西南政法大学"], ["郑书宁", "山东大学法学院"], ["高言蹊", "浙江大学光华法学院"], ["何知礼", "四川大学法学院"], ["徐景行", "南开大学法学院"], ["柳承泽", "中山大学法学院"], ["傅清尘", "对外经济贸易大学法学院"], ["苏望舒", "华中科技大学法学院"], ["姜以衡", "中国社会科学院大学"], ["白令仪", "深圳大学法学院"], ["方既明", "兰州大学法学院"], ["罗闻致", "苏州大学王健法学院"]];
  const LECTURE_THEMES = ["数字法治前沿论坛", "刑事治理与证据规则工作坊", "平台经济与民商法青年沙龙", "涉外法治与合规治理研讨会", "知识产权与人工智能圆桌", "司法制度现代化专题讲座", "社会治理法治创新论坛", "行政法治实践案例会"];

  function unique(list) { return Array.from(new Set(list)); }
  function tokenize(text) {
    return unique(String(text || "").toLowerCase().replace(/[^\u4e00-\u9fa5a-z0-9]+/g, " ").split(/\s+/).filter(Boolean).flatMap((token) => /^[\u4e00-\u9fa5]{2,}$/.test(token) ? [token].concat(token.split("")) : [token]));
  }

  function buildTopics() {
    const topics = [];
    const titleSuffixes = ["", "的实证评估", "与治理体系优化", "的比较法考察", "的案例检验", "的规范展开", "的协同治理路径", "的制度重构"];
    const perspectiveKeywords = ["法教义学", "实证研究", "案例分析", "比较法", "技术治理", "司法回应", "风险预防", "协同监管"];
    const stageKeywords = ["制度完善", "机制创新", "规范协调", "程序优化", "场景治理", "风险防控"];
    let id = 1;
    DIRECTION_SEEDS.forEach((seed, seedIndex) => {
      for (let variant = 0; variant < titleSuffixes.length; variant += 1) {
        seed.titles.forEach((title, titleIndex) => {
          const year = 2012 + ((seedIndex * 11 + variant * 3 + titleIndex * 2) % 14);
          const suffix = titleSuffixes[variant];
          const perspective = perspectiveKeywords[(seedIndex + variant + titleIndex) % perspectiveKeywords.length];
          const stageKeyword = stageKeywords[(seedIndex * 2 + variant + titleIndex) % stageKeywords.length];
          const leadExpertIndexes = [(seedIndex * 3 + titleIndex + variant) % EXPERT_SEEDS.length, (seedIndex * 3 + titleIndex + variant + 5) % EXPERT_SEEDS.length, (seedIndex * 3 + titleIndex + variant + 11) % EXPERT_SEEDS.length];
          topics.push({
            id: "LAW-" + String(id).padStart(3, "0"),
            title: title + suffix,
            year: year,
            type: PROJECT_TYPES[(seedIndex * 2 + titleIndex + variant) % PROJECT_TYPES.length],
            direction: seed.direction,
            keywords: unique(seed.keywords.concat([seed.direction, year >= 2021 ? "高质量发展" : stageKeyword, titleIndex % 2 === 0 ? "司法实践" : "规范解释", perspective])),
            leadExperts: leadExpertIndexes.map((index) => EXPERT_SEEDS[index][0]),
            x: 8 + ((seedIndex * 17 + titleIndex * 7 + variant * 5) % 84),
            y: 8 + ((seedIndex * 13 + titleIndex * 11 + variant * 6) % 84)
          });
          id += 1;
        });
      }
    });
    return topics;
  }

  const TOPICS = buildTopics();

  function buildExperts(topics) {
    return EXPERT_SEEDS.map((seed, index) => {
      const name = seed[0];
      const institution = seed[1];
      const relatedTopics = topics.filter((topic) => topic.leadExperts.includes(name));
      return {
        id: "EXP-" + String(index + 1).padStart(2, "0"),
        name: name,
        institution: institution,
        title: ["教授", "副教授", "研究员"][index % 3],
        directions: unique(relatedTopics.map((topic) => topic.direction)).slice(0, 3),
        topics: relatedTopics.map((topic) => topic.id).slice(0, 12),
        profile: name + "长期关注" + unique(relatedTopics.map((topic) => topic.direction)).slice(0, 3).join("、") + "等议题，兼具规范研究与实践评估经验。"
      };
    });
  }

  const EXPERTS = buildExperts(TOPICS);

  function buildLectures(experts) {
    const lectures = [];
    for (let i = 0; i < 56; i += 1) {
      const indexes = [i % experts.length, (i + 4) % experts.length, (i + 10) % experts.length, (i + 16) % experts.length];
      lectures.push({
        id: "LEC-" + String(i + 1).padStart(3, "0"),
        name: LECTURE_THEMES[i % LECTURE_THEMES.length] + "第" + (Math.floor(i / 8) + 1) + "期",
        date: (2019 + (i % 7)) + "-" + String((i % 12) + 1).padStart(2, "0") + "-" + String(((i * 3) % 27) + 1).padStart(2, "0"),
        experts: indexes.map((index) => experts[index].name)
      });
    }
    return lectures;
  }

  const LECTURES = buildLectures(EXPERTS);

  function getTopicByTitle(title) { return TOPICS.find((topic) => topic.title === title) || null; }
  function getExpertByName(name) { return EXPERTS.find((expert) => expert.name === name) || null; }
  function scoreTopicSimilarity(queryTopic, referenceTopic) {
    const queryTokens = new Set(tokenize([queryTopic.title || "", queryTopic.direction || "", (queryTopic.keywords || []).join(" ")].join(" ")));
    const refTokens = new Set(tokenize([referenceTopic.title, referenceTopic.direction, referenceTopic.keywords.join(" ")].join(" ")));
    let overlap = 0;
    queryTokens.forEach((token) => { if (refTokens.has(token)) { overlap += 1; } });
    const union = new Set([].concat(Array.from(queryTokens), Array.from(refTokens))).size || 1;
    return overlap / union;
  }
  function findSimilarTopics(queryTopic, limit) {
    return TOPICS.map((topic) => Object.assign({}, topic, { similarity: scoreTopicSimilarity(queryTopic, topic) })).filter((topic) => topic.similarity > 0).sort((a, b) => b.similarity - a.similarity || b.year - a.year).slice(0, limit || 5);
  }
  function buildLeadRecommendDetail(queryTopic, expert) {
    const queryKeywords = queryTopic.keywords || [];
    const relatedTopics = TOPICS.filter((topic) => expert.topics.includes(topic.id));
    const directionTopics = relatedTopics.filter((topic) => topic.direction === queryTopic.direction);
    const alignedTopics = relatedTopics.filter((topic) => topic.direction === queryTopic.direction || topic.keywords.some((keyword) => queryKeywords.includes(keyword)));
    const sharedKeywords = unique(alignedTopics.flatMap((topic) => topic.keywords.filter((keyword) => queryKeywords.includes(keyword) && keyword.length >= 2))).slice(0, 6);
    const typeMap = {};
    directionTopics.forEach((topic) => { typeMap[topic.type] = (typeMap[topic.type] || 0) + 1; });
    const years = directionTopics.map((topic) => topic.year);
    const minYear = years.length ? Math.min.apply(null, years) : null;
    const maxYear = years.length ? Math.max.apply(null, years) : null;
    const sampleTitles = directionTopics.slice().sort((a, b) => b.year - a.year).slice(0, 2).map((topic) => topic.title);
    const crossDirections = expert.directions.filter((direction) => direction !== queryTopic.direction);
    const sections = [];
    if (expert.directions.includes(queryTopic.direction)) {
      sections.push({ title: "方向契合：", text: "主研领域覆盖本课题所属的“" + queryTopic.direction + "”方向，与立项论证中的问题意识、制度工具选择和评价指标具有直接对应关系，可保证研究主线不走偏。" });
    } else {
      sections.push({ title: "方向契合：", text: "核心方向为" + expert.directions.join("、") + (crossDirections.length ? "，与“" + queryTopic.direction + "”存在交叉议题衔接" : "") + "，适合从相邻制度场景切入本课题。" });
    }
    if (directionTopics.length) {
      const typeText = Object.keys(typeMap).map((type) => type + typeMap[type] + "项").join("、");
      sections.push({ title: "立项经验：", text: "在相同方向累计参与" + directionTopics.length + "项历史课题（" + minYear + "—" + maxYear + "年），其中" + typeText + "，对课题设计、阶段成果和结项论证均有成熟经验。" });
      if (sampleTitles.length) {
        sections.push({ title: "代表课题：", text: sampleTitles.map((item) => "《" + (item.length > 22 ? item.slice(0, 22) + "…" : item) + "》").join("、") + "，与本课题在研究对象、规范路径或治理工具上具有可迁移性。" });
      }
    } else if (alignedTopics.length) {
      sections.push({ title: "立项经验：", text: "虽同方向直接课题较少，但参与" + alignedTopics.length + "项关键词相近的历史项目，可借助既有分析框架快速进入本课题。" });
    } else {
      sections.push({ title: "立项经验：", text: "跨方向参与" + relatedTopics.length + "项法学课题，具备较强的议题整合与团队协作能力，适合作为综合型负责人。" });
    }
    if (sharedKeywords.length) {
      sections.push({ title: "关键词衔接：", text: "与申报关键词在“" + sharedKeywords.join("”“") + "”等方面高度重合，意味着文献积累、经验样本和政策语境可复用，立项风险相对可控。" });
    } else if (queryKeywords.length) {
      sections.push({ title: "关键词衔接：", text: "可围绕“" + queryKeywords.slice(0, 4).join("”“") + "”等申报关键词快速搭建研究框架，并通过相近课题补全论证链条。" });
    }
    sections.push({ title: "团队适配：", text: expert.institution + expert.title + "。" + expert.profile + "作为负责人，有利于统筹规范分析、实证评估与政策表达。" });
  return { sections: sections };
  }
  function recommendExperts(queryTopic, limit) {
    return EXPERTS.map((expert) => {
      const directionScore = expert.directions.includes(queryTopic.direction) ? 0.45 : 0;
      const topicMatches = TOPICS.filter((topic) => expert.topics.includes(topic.id) && (topic.direction === queryTopic.direction || topic.keywords.some((keyword) => (queryTopic.keywords || []).includes(keyword)))).length;
      const score = Math.min(0.98, directionScore + topicMatches * 0.1 + Math.min(expert.topics.length, 12) * 0.015);
      return Object.assign({}, expert, { score: score, matchDetail: buildLeadRecommendDetail(queryTopic, expert) });
    }).sort((a, b) => b.score - a.score).slice(0, limit || 5);
  }
  function buildExpertNetwork(targetName) {
    const edgeMap = new Map();
    LECTURES.forEach((lecture) => {
      if (!lecture.experts.includes(targetName)) { return; }
      for (let i = 0; i < lecture.experts.length; i += 1) {
        for (let j = i + 1; j < lecture.experts.length; j += 1) {
          const pair = [lecture.experts[i], lecture.experts[j]].sort().join("__");
          edgeMap.set(pair, (edgeMap.get(pair) || 0) + 1);
        }
      }
    });
    const related = new Set([targetName]);
    edgeMap.forEach((value, pair) => { if (value > 0 && pair.includes(targetName)) { pair.split("__").forEach((name) => related.add(name)); } });
    const nodes = Array.from(related).map((name, index) => {
      const expert = getExpertByName(name);
      const angle = (Math.PI * 2 * index) / Math.max(related.size, 1);
      const radius = name === targetName ? 0 : 140;
      return { id: name, name: name, x: 200 + Math.cos(angle) * radius, y: 180 + Math.sin(angle) * radius, value: name === targetName ? 26 : 16, category: name === targetName ? "core" : "related", institution: expert ? expert.institution : "", directions: expert ? expert.directions : [] };
    });
    const links = Array.from(edgeMap.entries()).map((entry) => { const names = entry[0].split("__"); return { source: names[0], target: names[1], value: entry[1] }; }).filter((link) => related.has(link.source) && related.has(link.target));
    return { nodes: nodes, links: links };
  }
  const POLICY_CONTENT = {
    "数字中国建设整体布局规划": {
      issuer: "中共中央、国务院",
      date: "2023年2月",
      summary: "系统部署数字中国建设总体框架，强调数据资源体系与数字治理能力建设。",
      issues: [
        { title: "到2025年形成一体化数字中国推进格局", note: "基本形成横向打通、纵向贯通、协调有力的推进格局，数字中国建设取得重要进展。", tags: ["数据"], source: "总体要求" },
        { title: "健全数据基础制度、释放数据要素价值", note: "加强数据资源整合共享和开发利用，推动数据资源跨部门、跨层级、跨地区流通利用。", tags: ["数据"], source: "夯实数字中国建设基础" },
        { title: "建设高效普惠的数字基础设施", note: "系统优化算力基础设施布局，促进东西部算力高效互补和协同联动。", tags: ["数据", "算法"], source: "数字基础设施" }
      ],
      clauses: [
        { label: "总体要求", text: "到2025年，基本形成横向打通、纵向贯通、协调有力的一体化推进格局，数字中国建设取得重要进展。数据资源体系初步建成，数字基础设施更加高效普惠。", tags: ["数据"] },
        { label: "夯实数字中国建设基础", text: "释放数据要素价值，健全数据基础制度体系，加强数据资源整合共享和开发利用，推动数据资源跨部门、跨层级、跨地区流通利用。", tags: ["数据"] }
      ]
    },
    "“十四五”数字经济发展规划": {
      issuer: "国务院",
      date: "2022年1月",
      summary: "明确“十四五”时期数字经济发展目标与重点任务，突出数据要素市场化配置。",
      clauses: [
        { label: "第三章 优化升级数字基础设施", text: "统筹布局绿色智能的数据与算力基础设施，推进国家枢纽节点和大数据中心集群建设，提升数据供给质量和流通效率。", tags: ["数据"] },
        { label: "第四章 充分发挥数据要素作用", text: "强化高质量数据要素供给，加快数据要素市场化流通，创新数据要素开发利用机制，促进数据高效合规流通使用。", tags: ["数据"] }
      ]
    },
    "网络数据安全管理条例": {
      issuer: "国务院",
      date: "2024年12月公布",
      summary: "规范网络数据处理活动，保障网络数据安全，促进网络数据依法合理有效利用。",
      clauses: [
        { label: "第三条", text: "网络数据处理活动应当遵守法律、行政法规，尊重社会公德和伦理，遵守商业道德和职业道德，诚实守信，履行数据安全保护义务，承担社会责任，不得危害国家安全、公共利益，不得损害个人、组织的合法权益。", tags: ["数据"] },
        { label: "第十二条", text: "网络数据处理者开展数据处理活动，应当建立健全全流程数据安全管理制度，组织开展数据安全教育培训，采取相应的技术措施和其他必要措施，保障数据安全。", tags: ["数据", "算法"] }
      ]
    },
    "互联网信息服务算法推荐管理规定": {
      issuer: "国家互联网信息办公室等四部门",
      date: "2022年3月1日起施行",
      summary: "规范算法推荐服务，保障用户知情权、选择权与公平交易条件。",
      clauses: [
        { label: "第十七条", text: "算法推荐服务提供者应当向用户提供不针对其个人特征的选项，或者向用户提供便捷的关闭算法推荐服务的选项。用户选择关闭算法推荐服务的，算法推荐服务提供者应当立即停止提供相关服务。", tags: ["算法"] },
        { label: "第二十四条", text: "算法推荐服务提供者向消费者销售商品或者提供服务的，应当保护消费者公平交易的权利，不得根据消费者的兴趣爱好、交易习惯等特征，利用算法在交易价格等交易条件上实行不合理的差别待遇等违法行为。", tags: ["算法", "平台"] }
      ]
    },
    "新一代人工智能发展规划": {
      issuer: "国务院",
      date: "2017年7月",
      summary: "确立人工智能发展的战略目标和重点任务，推动人工智能与经济社会深度融合。",
      clauses: [
        { label: "总体要求", text: "坚持科技引领、系统布局、市场主导、开源开放，形成适应人工智能发展的制度安排，构建技术先进、产业发达、布局合理、支撑有力的人工智能发展格局。", tags: ["人工智能", "算法"] },
        { label: "重点任务", text: "加快人工智能在教育、医疗卫生、司法、交通、城市管理、金融等领域的创新应用，提高公共服务和社会治理水平。", tags: ["人工智能"] }
      ]
    },
    "生成式人工智能服务管理暂行办法": {
      issuer: "国家互联网信息办公室等七部门",
      date: "2023年8月15日起施行",
      summary: "规范生成式人工智能服务，明确提供者义务与内容治理要求。",
      governanceProblems: [
        {
          id: "genai-provider-duty",
          title: "生成式服务提供者义务过重与标准缺失",
          keywords: ["生成式", "提供者", "义务", "人工智能", "算法"],
          tags: ["人工智能", "算法"]
        },
        {
          id: "genai-ip-risk",
          title: "训练数据与输出内容的知识产权风险",
          keywords: ["训练数据", "著作权", "知识产权", "人工智能"],
          tags: ["人工智能", "著作权"]
        },
        {
          id: "genai-misinfo",
          title: "虚假信息与安全评估机制不健全",
          keywords: ["虚假信息", "安全评估", "内容治理", "人工智能"],
          tags: ["人工智能", "算法"]
        }
      ],
      clauses: [
        { label: "第四条", text: "提供和使用生成式人工智能服务，应当遵守法律、行政法规，尊重社会公德和伦理道德，遵守商业道德，维护社会主义核心价值，尊重知识产权，保护个人合法权益，不得危害国家安全、公共利益和他人合法权益。", tags: ["人工智能", "算法"] },
        { label: "第十四条", text: "提供者应当采取有效措施，防范生成虚假信息、歧视性内容、侵犯知识产权等风险，对违法内容及时采取停止生成、停止传输、消除等处置措施。", tags: ["人工智能", "算法"] }
      ]
    },
    "关于平台经济领域的反垄断指南": {
      issuer: "国务院反垄断委员会",
      date: "2021年2月",
      summary: "明确平台经济领域反垄断执法原则，规制滥用市场支配地位等行为。",
      clauses: [
        { label: "第六条 市场支配地位认定因素", text: "认定平台经营者具有市场支配地位，应当结合相关行业竞争状况、平台经营者市场份额、控制市场的能力、财力和技术条件、其他经营者对其依赖程度、进入相关市场的难易程度等因素综合分析。", tags: ["平台"] },
        { label: "第十七条 差别待遇", text: "具有市场支配地位的平台经营者，没有正当理由，不得对交易条件相同的交易相对人实行差别待遇，排除、限制市场竞争。", tags: ["平台", "算法"] }
      ]
    },
    "“十四五”市场监管现代化规划": {
      issuer: "国务院",
      date: "2022年1月",
      summary: "推进市场监管体系和监管能力现代化，服务构建新发展格局。",
      clauses: [
        { label: "专栏 强化平台经济监管", text: "完善平台经济领域反垄断、反不正当竞争规则，加强平台企业合规管理，规范平台内经营者行为，维护公平竞争市场秩序。", tags: ["平台"] },
        { label: "提升智慧监管能力", text: "运用大数据、人工智能等技术手段，提升风险预警、精准监管和协同监管能力，推动线上线下一体化监管。", tags: ["平台", "数据"] }
      ]
    },
    "关于适用认罪认罚从宽制度的指导意见": {
      issuer: "最高人民法院等五机关",
      date: "2019年10月",
      summary: "统一认罪认罚从宽案件办理标准，规范量刑建议与程序适用。",
      clauses: [
        { label: "基本原则", text: "贯彻宽严相济刑事政策，对于认罪认罚的犯罪嫌疑人、被告人，依法从宽处理；坚持罪刑法定、罪责刑相适应，确保办案质量。", tags: ["认罪认罚", "刑事"] },
        { label: "量刑建议", text: "人民检察院提出量刑建议，一般应当确定刑；对常见、多发、量刑幅度相对固定的案件，可以提出确定刑量刑建议。", tags: ["认罪认罚"] }
      ]
    },
    "法治中国建设规划（2020-2025年）": {
      issuer: "中共中央",
      date: "2021年1月",
      summary: "统筹推进科学立法、严格执法、公正司法、全民守法，建设法治中国。",
      issues: [
        { title: "加强数字经济等新兴领域立法", note: "及时回应新技术新产业新业态新模式发展需求，填补制度供给短板。", tags: ["数据", "算法", "人工智能"], source: "加强重点领域立法" },
        { title: "深化司法责任制综合配套改革", note: "健全审判权、检察权运行和监督机制，提高司法公信力。", tags: ["刑事", "证据"], source: "推进公正司法" },
        { title: "推进严格执法与规范执法", note: "深化行政执法体制改革，全面落实行政执法责任制和责任追究制。", tags: ["行政", "刑事"], source: "法治政府建设" },
        { title: "加强涉外法治体系建设", note: "加强涉外法治人才培养，完善涉外法律服务体系，维护国家主权、安全、发展利益。", tags: ["涉外", "合规"], source: "涉外法治" }
      ],
      clauses: [
        { label: "加强重点领域立法", text: "加强数字经济、互联网金融、人工智能、大数据、云计算等新兴领域立法研究，及时回应新技术新产业新业态新模式发展需求。", tags: ["数据", "算法", "刑事", "证据", "涉外", "合规"] },
        { label: "推进公正司法", text: "深化司法责任制综合配套改革，健全审判权、检察权运行和监督机制，提高司法公信力。", tags: ["刑事", "证据"] }
      ]
    },
    "“八五”普法规划": {
      issuer: "中共中央、国务院转印",
      date: "2021年6月",
      summary: "明确第八个五年法治宣传教育的目标任务与工作措施。",
      clauses: [
        { label: "工作原则", text: "坚持党的全面领导，坚持以人民为中心，坚持服务大局、突出重点，坚持与法治实践深度融合，推动全社会尊法学法守法用法。", tags: ["刑事"] },
        { label: "重点对象", text: "实行国家机关“谁执法谁普法”普法责任制，加强青少年法治教育，提升基层干部群众法治素养。", tags: ["刑事"] }
      ]
    },
    "关于加强新时代检察机关法律监督工作的意见": {
      issuer: "中共中央",
      date: "2021年8月",
      summary: "强化检察机关法律监督职能，提升监督质效与协同水平。",
      clauses: [
        { label: "刑事检察", text: "深化刑事诉讼监督，加强侦查监督与审判监督，规范认罪认罚从宽案件办理，统一司法尺度。", tags: ["证据", "刑事", "认罪认罚"] },
        { label: "证据审查", text: "完善对证据收集、固定、审查、运用的监督机制，防止因证据问题导致冤错案件。", tags: ["证据"] }
      ]
    },
    "知识产权强国建设纲要（2021-2035年）": {
      issuer: "中共中央、国务院",
      date: "2021年9月",
      summary: "建设中国特色、世界水平的知识产权强国，服务创新驱动发展。",
      clauses: [
        { label: "发展目标", text: "到2025年，知识产权保护更加严格，社会满意度达到并保持较高水平；到2035年，知识产权综合竞争力跻身世界前列。", tags: ["著作权", "专利", "商标"] },
        { label: "版权产业", text: "健全著作权登记、集体管理和司法保护衔接机制，促进网络视听、数字出版等新业态版权治理。", tags: ["著作权"] }
      ]
    },
    "“十四五”国家知识产权保护和运用规划": {
      issuer: "国务院",
      date: "2021年10月",
      summary: "完善知识产权全链条保护体系，提升知识产权创造、运用、保护、管理和服务水平。",
      clauses: [
        { label: "专利保护", text: "健全专利侵权纠纷行政裁决制度，完善专利无效宣告与侵权诉讼衔接机制，加大高价值专利保护力度。", tags: ["专利"] },
        { label: "商标与地理标志", text: "严厉打击商标恶意抢注和侵权假冒行为，加强驰名商标、地理标志、老字号商标保护。", tags: ["商标"] }
      ]
    },
    "关于加强新时代涉外法治工作的意见": {
      issuer: "中共中央、国务院",
      date: "2023年",
      summary: "统筹推进国内法治和涉外法治，提升涉外法治体系和能力。",
      clauses: [
        { label: "涉外立法", text: "加强涉外领域立法，完善反制裁、反干涉、反“长臂管辖”法律法规，健全涉外法律规范体系。", tags: ["涉外", "合规"] },
        { label: "涉外法律服务", text: "培育国际一流仲裁机构、律师事务所，提升企业涉外合规能力和争议解决能力。", tags: ["涉外", "仲裁", "合规"] }
      ]
    },
    "法治政府建设实施纲要（2021-2025年）": {
      issuer: "中共中央、国务院",
      date: "2021年8月",
      summary: "全面建设职能科学、权责法定、执法严明、公开公正、智能高效、廉洁诚信、人民满意的法治政府。",
      clauses: [
        { label: "依法全面履行职能", text: "推进机构、职能、权限、程序、责任法定化，深化“放管服”改革，持续优化法治化营商环境。", tags: ["行政"] },
        { label: "数字法治政府", text: "加快推进政务数据有序共享，推动政务服务“一网通办”，以数字化手段提升政府治理效能。", tags: ["行政", "数据"] }
      ]
    },
    "“十四五”推进国家政务信息化规划": {
      issuer: "国家发展改革委",
      date: "2021年12月",
      summary: "统筹政务信息系统建设，提升政务数字化智能化水平。",
      clauses: [
        { label: "数据共享", text: "建立健全政务数据共享协调机制，推进政务数据跨层级、跨地域、跨部门、跨业务、跨系统共享利用。", tags: ["行政", "数据"] },
        { label: "安全保障", text: "落实网络安全等级保护、关键信息基础设施安全保护等制度，保障政务信息系统安全稳定运行。", tags: ["行政", "数据"] }
      ]
    },
    "“十四五”就业促进规划": {
      issuer: "国务院",
      date: "2022年",
      summary: "强化就业优先政策，促进更加充分更高质量就业。",
      clauses: [
        { label: "支持灵活就业", text: "破除不合理限制，拓宽灵活就业发展渠道，完善与新就业形态相适应的劳动保障制度。", tags: ["劳动"] },
        { label: "重点群体", text: "做好高校毕业生、农民工、退役军人等重点群体就业工作，加强就业服务和职业技能培训。", tags: ["劳动"] }
      ]
    },
    "关于维护新就业形态劳动者劳动保障权益的指导意见": {
      issuer: "人力资源和社会保障部等八部门",
      date: "2021年7月",
      summary: "维护新就业形态劳动者合法权益，补齐平台用工劳动保障短板。",
      clauses: [
        { label: "合理界定劳动关系", text: "符合确立劳动关系情形的，用人单位应当依法与劳动者订立劳动合同；不完全符合确立劳动关系情形但企业对劳动者进行劳动管理的，指导企业与劳动者订立书面协议。", tags: ["劳动", "平台"] },
        { label: "保障基本权益", text: "推动平台企业制定并公布算法、派单、计酬、奖惩等直接涉及劳动者权益的制度规则和公示办法，保障劳动者知情权和监督权。", tags: ["劳动", "平台", "算法"] }
      ]
    },
    "涉外法治建设重点工作安排": {
      issuer: "中央全面依法治国委员会",
      date: "2024年",
      summary: "部署涉外法治建设阶段性重点任务，服务高水平对外开放。",
      clauses: [
        { label: "涉外仲裁", text: "支持国际商事仲裁机构发展，完善涉外仲裁司法审查规则，提升仲裁国际公信力和竞争力。", tags: ["仲裁", "涉外"] },
        { label: "人才培养", text: "加强涉外法治人才培养，建设通晓国际规则、善于处理涉外法律事务的法治人才队伍。", tags: ["仲裁", "涉外", "合规"] }
      ]
    },
    "中华人民共和国民营经济促进法": {
      issuer: "全国人民代表大会常务委员会",
      date: "2025年5月20日起施行",
      summary: "我国第一部专门关于民营经济发展的基础性法律，保障民营经济组织合法权益，优化民营经济发展环境。",
      clauses: [
        { label: "第一条", text: "为优化民营经济发展环境，保证各类经济组织公平参与市场竞争，促进民营经济健康发展和民营经济人士健康成长，构建高水平社会主义市场经济体制，发挥民营经济在国民经济和社会发展中的重要作用，根据宪法，制定本法。", tags: ["平台", "行政"] },
        { label: "公平竞争", text: "国家实行全国统一的市场准入负面清单制度。市场准入负面清单以外的领域，包括民营经济组织在内的各类经济组织可以依法平等进入。不得对民营经济组织设置不合理的市场准入条件。", tags: ["平台", "行政"] },
        { label: "权益保护", text: "民营经济组织及其经营者的人身权利、财产权利以及经营自主权等合法权益受法律保护，任何单位和个人不得侵犯。", tags: ["平台", "劳动"] }
      ]
    },
    "国务院关于深入实施“人工智能+”行动的意见": {
      issuer: "国务院",
      date: "2025年8月",
      summary: "推动人工智能与经济社会各行业各领域广泛深度融合，重塑人类生产生活范式，促进生产力革命性跃迁。",
      issues: [
        { title: "形成人机协同、跨界融合的智能经济新形态", note: "加快形成共创分享的智能经济和智能社会新形态，促进生产力革命性跃迁。", tags: ["人工智能", "算法"], source: "总体要求" },
        { title: "加强人工智能基础理论与关键核心技术攻关", note: "完善人工智能标准体系和伦理治理规则，夯实“人工智能+”基础支撑能力。", tags: ["人工智能", "算法", "数据"], source: "基础支撑能力" },
        { title: "推动人工智能在治理与公共服务领域深度融合", note: "提升科学技术、产业发展、民生福祉、治理能力等领域的智能化水平。", tags: ["人工智能", "行政", "data"], source: "行业融合应用" },
        { title: "健全生成式人工智能内容治理与标识规则", note: "防范虚假信息、歧视性内容等风险，落实内容标识与平台核验义务。", tags: ["人工智能", "算法", "平台"], source: "安全治理" }
      ],
      clauses: [
        { label: "总体要求", text: "以习近平新时代中国特色社会主义思想为指导，完整准确全面贯彻新发展理念，加快形成人机协同、跨界融合、共创分享的智能经济和智能社会新形态。", tags: ["人工智能", "算法", "数据"] },
        { label: "基础支撑能力", text: "加强人工智能基础理论研究，支持人工智能算法、数据、算力、开源等关键核心技术攻关，完善人工智能标准体系和伦理治理规则。", tags: ["人工智能", "算法", "数据"] },
        { label: "行业融合应用", text: "推动人工智能在科学技术、产业发展、民生福祉、治理能力、全球合作等领域深度融合，培育智能化新产业新业态新模式。", tags: ["人工智能", "行政", "数据"] }
      ]
    },
    "人工智能法（草案）": {
      issuer: "全国人民代表大会常务委员会",
      date: "2025年审议",
      summary: "系统构建人工智能治理基本制度，统筹发展与安全，回应算法问责、生成式内容治理与深度合成监管等前沿问题。",
      tags: ["人工智能", "算法", "平台"],
      issues: [
        { title: "算法问责与可解释性义务", note: "明确高风险人工智能系统提供者的说明义务与日志留存要求。", tags: ["人工智能", "算法"], source: "算法治理" },
        { title: "生成式内容标识与侵权责任", note: "规范生成式服务的内容标识、训练数据合规与侵权救济路径。", tags: ["人工智能", "著作权"], source: "内容治理" },
        { title: "深度合成与行政监管协同", note: "压实平台核验义务，明确网信、公安等部门协同监管边界。", tags: ["人工智能", "行政", "平台"], source: "安全监管" }
      ],
      governanceProblems: [
        {
          id: "ai-black-box-burden",
          title: "算法黑箱造成的举证责任困境",
          keywords: ["算法", "举证", "证据", "黑箱", "说明义务", "人工智能"],
          tags: ["人工智能", "算法", "证据"]
        },
        {
          id: "genai-copyright",
          title: "生成式AI版权归属制度模糊",
          keywords: ["生成式", "著作权", "版权", "训练数据", "人工智能", "知识产权"],
          tags: ["人工智能", "著作权", "知识产权"]
        },
        {
          id: "deepfake-admin-boundary",
          title: "深度伪造的行政监管边界",
          keywords: ["深度伪造", "深度合成", "行政", "监管", "平台", "人工智能"],
          tags: ["人工智能", "行政", "平台"]
        }
      ],
      clauses: [
        { label: "算法治理", text: "从事高风险人工智能系统研发、提供服务的，应当建立算法说明、日志留存与风险评估制度，保障相对人知情与举证必要信息的可获得性。", tags: ["人工智能", "算法", "证据"] },
        { label: "内容治理", text: "生成式人工智能服务提供者应当尊重知识产权，依法取得训练数据来源合法性，并建立侵权投诉与快速处置机制。", tags: ["人工智能", "著作权"] },
        { label: "安全监管", text: "深度合成服务提供者应当落实内容标识与核验义务，网信、电信、公安等部门依职责开展协同监管与执法衔接。", tags: ["人工智能", "行政", "平台"] }
      ]
    },
    "人工智能生成合成内容标识办法": {
      issuer: "国家互联网信息办公室等四部门",
      date: "2025年3月1日起施行",
      summary: "规范人工智能生成合成内容标识活动，维护国家安全和社会公共利益，保护公民、法人和其他组织合法权益。",
      governanceProblems: [
        {
          id: "synthetic-label-duty",
          title: "生成合成内容标识义务落地难",
          keywords: ["标识", "元数据", "生成式", "平台", "人工智能"],
          tags: ["人工智能", "平台", "算法"]
        },
        {
          id: "platform-verify",
          title: "平台核验与传播责任边界不清",
          keywords: ["平台", "核验", "传播", "隐式标识", "人工智能"],
          tags: ["人工智能", "平台"]
        },
        {
          id: "fake-content-liability",
          title: "虚假信息治理与法律责任衔接不足",
          keywords: ["虚假信息", "刑事", "内容治理", "人工智能"],
          tags: ["人工智能", "刑事"]
        }
      ],
      clauses: [
        { label: "第四条", text: "服务提供者应当对生成合成内容添加显式标识，在生成合成内容的文件元数据中添加隐式标识，并提示用户该内容可能为人工智能生成合成内容。", tags: ["人工智能", "算法"] },
        { label: "第十条", text: "网络传播平台应当核验文件元数据中是否含有隐式标识，对含有隐式标识的生成合成内容，应当在发布时添加显著提示，提醒公众该内容可能为人工智能生成合成内容。", tags: ["人工智能", "平台", "算法"] },
        { label: "法律责任", text: "违反本办法规定的，由网信、电信、公安等部门依据职责责令改正，给予警告、通报批评，并可处以罚款；构成犯罪的，依法追究刑事责任。", tags: ["人工智能", "刑事"] }
      ]
    },
    "中华人民共和国反不正当竞争法（2025年修正）": {
      issuer: "全国人民代表大会常务委员会",
      date: "2025年10月27日修正",
      summary: "完善数字经济领域不正当竞争规制，强化商业贿赂、虚假宣传、网络不正当竞争等行为的法律责任。",
      clauses: [
        { label: "第二条", text: "经营者在生产经营活动中，应当遵循自愿、平等、公平、诚信的原则，遵守法律和商业道德，公平参与市场竞争。", tags: ["平台"] },
        { label: "网络不正当竞争", text: "经营者不得利用数据和算法、技术、平台规则等，实施妨碍、破坏其他经营者合法提供的网络产品或者服务正常运行的行为。", tags: ["平台", "算法", "数据"] },
        { label: "商业秘密保护", text: "经营者不得实施侵犯商业秘密的行为，不得以盗窃、贿赂、欺诈、胁迫、电子侵入或者其他不正当手段获取权利人的商业秘密。", tags: ["平台", "著作权"] }
      ]
    },
    "中共中央 国务院关于推动城市高质量发展的意见": {
      issuer: "中共中央、国务院",
      date: "2026年3月",
      summary: "推动城市高质量发展，建设创新、宜居、美丽、韧性、文明、智慧的现代化人民城市。",
      clauses: [
        { label: "城市治理", text: "完善城市治理体系，推动治理重心和配套资源向基层下沉，健全党组织领导的自治、法治、德治相结合的城乡基层治理体系。", tags: ["行政", "社会治理"] },
        { label: "智慧城市", text: "推进城市全域数字化转型，加强城市信息模型、城市运行管理服务平台等建设，提升城市治理智能化精细化水平。", tags: ["行政", "数据"] },
        { label: "民生保障", text: "健全就业促进机制，完善灵活就业人员、新就业形态劳动者权益保障制度，扩大保障性租赁住房供给。", tags: ["劳动", "社会治理"] }
      ]
    },
    "关于开展第九个五年法治宣传教育的通知": {
      issuer: "中共中央、国务院转印",
      date: "2026年",
      summary: "部署2026—2030年法治宣传教育工作，推动全社会增强法治观念、提升法治素养。",
      clauses: [
        { label: "主要目标", text: "到2030年，公民法治素养和社会治理法治化水平显著提升，全社会尊法学法守法用法氛围更加浓厚，社会主义法治文化繁荣发展。", tags: ["刑事", "社会治理"] },
        { label: "重点内容", text: "突出学习宣传习近平法治思想，宣传宪法法律、党内法规，加强民法典、国家安全法、反电信网络诈骗法等与群众生产生活密切相关的法律法规宣传教育。", tags: ["刑事", "平台"] },
        { label: "青少年法治教育", text: "将法治教育纳入国民教育体系，推动法治教育进教材、进课堂、进头脑，增强青少年宪法法律观念和规则意识。", tags: ["刑事", "社会治理"] }
      ]
    },
    "中华人民共和国增值税法": {
      issuer: "全国人民代表大会常务委员会",
      date: "2026年1月1日起施行",
      summary: "落实税收法定原则，将增值税暂行条例上升为法律，规范增值税的征收和缴纳，保障国家税收收入。",
      clauses: [
        { label: "立法目的", text: "为了健全有利于高质量发展的增值税制度，规范增值税的征收和缴纳，保护纳税人的合法权益，制定本法。", tags: ["行政"] },
        { label: "税率结构", text: "增值税实行比例税率，税率为13%、9%、6%等，具体适用范围由国务院规定。纳税人出口货物或者跨境销售服务、无形资产，税率为零。", tags: ["行政", "涉外"] },
        { label: "征管协同", text: "税务机关应当与有关部门建立涉税信息共享机制和工作配合机制，依法开展税收征收管理，维护税收秩序。", tags: ["行政", "数据"] }
      ]
    },
    "生态环境法典（草案）": {
      issuer: "全国人民代表大会常务委员会",
      date: "2026年审议",
      summary: "以法典化方式系统整合生态环境法律制度，完善生态文明制度体系，推动绿色低碳发展。",
      clauses: [
        { label: "总则编", text: "坚持绿水青山就是金山银山的理念，建立健全绿色低碳循环发展经济体系，推进生态环境治理体系和治理能力现代化。", tags: ["行政"] },
        { label: "污染防治编", text: "完善大气污染防治、水污染防治、土壤污染防治、固体废物污染防治等制度，强化排污许可、环境监测、信息公开等法律义务。", tags: ["行政", "社会治理"] },
        { label: "法律责任", text: "违反生态环境法典规定，造成生态环境损害的，应当依法承担修复责任、赔偿责任；构成犯罪的，依法追究刑事责任。", tags: ["刑事", "行政"] }
      ]
    },
    "中共中央关于制定国民经济和社会发展第十五个五年规划的建议": {
      issuer: "中共中央",
      date: "2025年10月",
      summary: "阐明“十五五”时期我国发展指导思想、主要目标和重点任务，为全面建设社会主义现代化国家夯实基础。",
      issues: [
        { title: "发展全过程人民民主", note: "坚持和完善人民代表大会制度，全面发展协商民主，健全基层民主制度，保障人民当家作主。", tags: ["刑事", "行政", "社会治理"], source: "发展社会主义民主" },
        { title: "完善中国特色社会主义法治体系", note: "协同推进科学立法、严格执法、公正司法、全民守法，更好发挥法治固根本、稳预期、利长远的保障作用。", tags: ["刑事", "证据", "行政"], source: "建设社会主义法治国家" },
        { title: "全面推进国家各方面工作法治化", note: "完善立法体制机制，深化行政执法体制改革，强化对执法司法活动的制约监督。", tags: ["行政", "刑事", "证据"], source: "法治建设" },
        { title: "加强数字经济与人工智能等领域立法研究", note: "及时把关系民生、国家安全、公共利益的事项纳入法治轨道，回应新技术新产业新业态发展需求。", tags: ["数据", "算法", "人工智能"], source: "立法工作" },
        { title: "健全涉外法治体系与斗争能力", note: "完善反制裁、反干涉机制，加强涉外法治人才培养，坚决维护国家主权、安全、发展利益。", tags: ["涉外", "合规", "仲裁"], source: "国家安全与对外开放" },
        { title: "在发展中保障和改善民生", note: "完善收入分配制度，健全社会保障体系，加强基层治理，促进高质量充分就业。", tags: ["劳动", "社会治理"], source: "民生保障" }
      ],
      clauses: [
        { label: "发展社会主义民主", text: "发展全过程人民民主，健全人民当家作主制度体系，巩固和发展生动活泼、安定团结的政治局面。", tags: ["刑事", "行政", "社会治理"] },
        { label: "建设社会主义法治国家", text: "完善中国特色社会主义法治体系，全面推进国家各方面工作法治化，建设更高水平的社会主义法治国家。", tags: ["刑事", "证据", "行政"] },
        { label: "国家安全与对外开放", text: "推进国家安全体系和能力现代化，健全涉外法治体系，坚决维护国家主权、安全、发展利益。", tags: ["涉外", "合规"] }
      ]
    }
  };

  function pickPolicyClauses(doc, keyword) {
    if (!doc || !doc.clauses || !doc.clauses.length) return [];
    const matched = doc.clauses.filter((clause) => !keyword || (clause.tags || []).includes(keyword) || clause.text.includes(keyword) || clause.label.includes(keyword));
    return (matched.length ? matched : doc.clauses).slice(0, 3);
  }

  function enrichPolicyItem(item) {
    const doc = POLICY_CONTENT[item.name];
    if (!doc) {
      return Object.assign({}, item, {
        issuer: "",
        effectiveDate: "",
        summary: "",
        clauses: [{ label: "政策要点", text: "暂未收录该文件的具体条文摘要，请查阅正式文本或官方发布平台。" }]
      });
    }
    return Object.assign({}, item, {
      issuer: doc.issuer,
      effectiveDate: doc.date,
      summary: doc.summary,
      clauses: pickPolicyClauses(doc, item.keyword)
    });
  }

  const POLICY = [
    ["数据", ["数字中国建设整体布局规划", "“十四五”数字经济发展规划", "网络数据安全管理条例", "国务院关于深入实施“人工智能+”行动的意见"]],
    ["算法", ["互联网信息服务算法推荐管理规定", "新一代人工智能发展规划", "生成式人工智能服务管理暂行办法", "人工智能生成合成内容标识办法", "国务院关于深入实施“人工智能+”行动的意见"]],
    ["人工智能", ["生成式人工智能服务管理暂行办法", "新一代人工智能发展规划", "国务院关于深入实施“人工智能+”行动的意见", "人工智能生成合成内容标识办法"]],
    ["平台", ["关于平台经济领域的反垄断指南", "“十四五”市场监管现代化规划", "中华人民共和国民营经济促进法", "中华人民共和国反不正当竞争法（2025年修正）"]],
    ["认罪认罚", ["关于适用认罪认罚从宽制度的指导意见", "法治中国建设规划（2020-2025年）"]],
    ["刑事", ["法治中国建设规划（2020-2025年）", "“八五”普法规划", "关于开展第九个五年法治宣传教育的通知", "人工智能生成合成内容标识办法", "中共中央关于制定国民经济和社会发展第十五个五年规划的建议"]],
    ["法治", ["法治中国建设规划（2020-2025年）", "中共中央关于制定国民经济和社会发展第十五个五年规划的建议", "法治政府建设实施纲要（2021-2025年）"]],
    ["证据", ["关于加强新时代检察机关法律监督工作的意见", "法治中国建设规划（2020-2025年）"]],
    ["著作权", ["知识产权强国建设纲要（2021-2035年）", "“十四五”国家知识产权保护和运用规划"]],
    ["专利", ["知识产权强国建设纲要（2021-2035年）", "“十四五”国家知识产权保护和运用规划"]],
    ["涉外", ["关于加强新时代涉外法治工作的意见", "法治中国建设规划（2020-2025年）", "中华人民共和国增值税法"]],
    ["行政", ["法治政府建设实施纲要（2021-2025年）", "“十四五”推进国家政务信息化规划", "中共中央 国务院关于推动城市高质量发展的意见", "中华人民共和国增值税法", "生态环境法典（草案）"]],
    ["劳动", ["“十四五”就业促进规划", "关于维护新就业形态劳动者劳动保障权益的指导意见", "中华人民共和国民营经济促进法", "中共中央 国务院关于推动城市高质量发展的意见"]],
    ["商标", ["“十四五”国家知识产权保护和运用规划", "知识产权强国建设纲要（2021-2035年）"]],
    ["合规", ["关于加强新时代涉外法治工作的意见", "法治中国建设规划（2020-2025年）", "中华人民共和国民营经济促进法"]],
    ["仲裁", ["涉外法治建设重点工作安排", "关于加强新时代涉外法治工作的意见"]]
  ];

  function policiesForTopic(topic) {
    const matched = new Set();
    POLICY.forEach(([key, values]) => {
      if (topic.title.includes(key) || topic.direction.includes(key) || (topic.keywords || []).some((keyword) => keyword.includes(key))) {
        values.forEach((value) => matched.add(value));
      }
    });
    if (!matched.size) matched.add("法治中国建设规划（2020-2025年）");
    return [...matched];
  }

  function findRelatedPolicies(queryTopic, limit) {
    const items = [];
    const queryKeywords = queryTopic.keywords || [];
    POLICY.forEach(([key, policyNames]) => {
      const inTitle = queryTopic.title && queryTopic.title.includes(key);
      const inDirection = queryTopic.direction && queryTopic.direction.includes(key);
      const inKeywords = queryKeywords.some((keyword) => keyword.includes(key));
      if (!inTitle && !inDirection && !inKeywords) return;
      const reason = inTitle ? "课题标题关联" : inDirection ? "研究方向关联" : "申报关键词关联";
      policyNames.forEach((name) => items.push({ name: name, keyword: key, reason: reason, score: (inTitle ? 3 : 0) + (inDirection ? 2 : 0) + (inKeywords ? 2 : 0) }));
    });
    const map = new Map();
    items.forEach((item) => {
      const prev = map.get(item.name);
      if (!prev || item.score > prev.score) map.set(item.name, item);
    });
    let result = [...map.values()].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
    if (!result.length) {
      result = [{ name: "法治中国建设规划（2020-2025年）", keyword: "法治", reason: "基础政策语境", score: 1 }];
    }
    return result.slice(0, limit || 8).map(enrichPolicyItem);
  }

  function inferDirectionFromTitle(title) {
    const rules = [["数据", "数字法治"], ["算法", "数字法治"], ["平台", "民商法治"], ["认罪认罚", "刑事法治"], ["刑事", "刑事法治"], ["证据", "刑事法治"], ["著作权", "知识产权法"], ["专利", "知识产权法"], ["商标", "知识产权法"], ["涉外", "国际法治"], ["仲裁", "国际法治"], ["合规", "国际法治"], ["行政", "行政法治"], ["复议", "行政法治"], ["案例", "司法制度"], ["审判", "司法制度"], ["劳动", "社会治理法"], ["用工", "社会治理法"]];
    const matched = rules.find((rule) => title.indexOf(rule[0]) !== -1);
    return matched ? matched[1] : "数字法治";
  }

  function clampNum(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function topicTokenSet(topic) {
    return tokenize([topic.title || "", topic.direction || "", (topic.keywords || []).join(" ")].join(" "));
  }

  function tokenOverlapSimilarity(topicA, topicB) {
    const a = new Set(topicTokenSet(topicA));
    const b = new Set(topicTokenSet(topicB));
    let overlap = 0;
    a.forEach((token) => { if (b.has(token)) overlap += 1; });
    const union = new Set([].concat(Array.from(a), Array.from(b))).size || 1;
    return overlap / union;
  }

  function policyOrientationParagraph(topic, policy) {
    const trigger = policy.keyword || (topic.keywords && topic.keywords[0]) || topic.direction;
    const clause = policy.clauses && policy.clauses[0];
    const excerpt = clause ? "政策明确要求：" + clause.text : policy.summary || "该文件与当前选题方向高度契合。";
    return "在「" + topic.direction + "」视域下，课题以「" + trigger + "」对接《" + policy.name + "》（" + (policy.reason || "政策关联") + "）。" + excerpt + "据此，可将本课题定位于回应" + trigger + "相关制度供给不足、规则协同不畅或救济机制待完善等实践问题，并在论证中突出政策目标与法学命题之间的对应关系。";
  }

  function technologiesForTopic(topic) {
    const techMap = [
      ["数据", ["大数据治理", "数据确权", "隐私计算"]],
      ["算法", ["算法推荐系统", "模型可解释性", "算法审计"]],
      ["人工智能", ["生成式人工智能", "大语言模型", "内容审核"]],
      ["平台", ["平台治理系统", "交易风控", "用户画像"]],
      ["证据", ["电子取证", "司法区块链", "证据存证"]],
      ["跨境", ["跨境数据流转", "合规审计系统", "数据分类分级"]],
      ["专利", ["专利信息分析", "知识图谱", "技术情报挖掘"]],
      ["著作权", ["数字水印", "内容识别", "版权追踪"]],
      ["劳动", ["平台调度算法", "职业伤害监测", "灵活用工管理"]],
      ["审判", ["类案检索", "裁判文书分析", "智慧法院"]],
      ["行政", ["政务数据开放", "数字政府平台", "智能审批"]]
    ];
    const matched = new Set();
    techMap.forEach(([key, vals]) => {
      if (topic.title.indexOf(key) !== -1 || (topic.keywords || []).some((item) => item.indexOf(key) !== -1)) {
        vals.forEach((val) => matched.add(val));
      }
    });
    if (!matched.size) {
      matched.add("案例数据库分析");
      matched.add("法律文本挖掘");
    }
    return Array.from(matched).slice(0, 5);
  }

  function adviceForTopic(topic, top, policyList, techList) {
    const similarity = top ? top.similarity : 0;
    if (similarity >= 0.84) {
      return "建议以「" + topic.direction + "」为主轴，重点强化新场景、新对象或新机制表达，避免与既有样本过近。";
    }
    if (similarity >= 0.68) {
      return "建议保留当前选题框架，并围绕 " + (policyList.slice(0, 2).map((item) => item.name).join("、") || "国家政策") + " 进一步充实立项依据。";
    }
    return "建议突出问题导向与前瞻价值，并补充 " + (techList.slice(0, 2).join("、") || "研究方法") + " 等支撑，增强论证完整度。";
  }

  function riskForTopic(top, policyList, techList) {
    const notes = [];
    if (top && top.similarity >= 0.86) notes.push("与历史样本贴近度较高，需避免重复表述。");
    if (policyList.length <= 2) notes.push("政策锚点偏少，可补足更直接的国家政策依据。");
    if (techList.length <= 2) notes.push("技术或方法支撑偏弱，建议补充案例、数据或工具路径。");
    return notes.length ? notes.join(" ") : "当前重复风险与支撑风险整体可控。";
  }

  function computeApprovalMetrics(topic, top, policyList, sim, policyWeightPercent) {
    const policyRaw = policyList.length
      ? policyList.reduce((sum, item) => sum + Math.min(Number(item.score) || 1, 5), 0) / (policyList.length * 5)
      : 0.34;
    const policyScore = Math.round(clampNum(policyRaw * 100, 36, 98));
    const simSlice = sim && sim.length ? sim.slice(0, 3) : [];
    let expBase = 0.35;
    if (simSlice.length) {
      expBase = simSlice.reduce((sum, item) => sum + item.similarity, 0) / simSlice.length;
    } else if (top) {
      expBase = top.similarity;
    } else {
      const peers = TOPICS.filter((item) => item.direction === topic.direction);
      if (peers.length) {
        expBase = peers.reduce((sum, item) => sum + tokenOverlapSimilarity(topic, item), 0) / peers.length;
      }
    }
    const experienceScore = Math.round(clampNum(expBase * 100, 28, 96));
    const policyW = clampNum(policyWeightPercent, 0, 100) / 100;
    const approvalIndex = Math.round(policyScore * policyW + experienceScore * (1 - policyW));
    return { policyScore: policyScore, experienceScore: experienceScore, approvalIndex: approvalIndex };
  }

  function buildDirectionPositionRows(topic, sim) {
    const byYear = new Map();
    function ingest(year, score) {
      const y = Number(year);
      const s = Number(score) || 0;
      if (!y || s <= 0) return;
      const prev = byYear.get(y);
      if (!prev || s > prev.score) byYear.set(y, { year: y, score: s });
    }
    TOPICS.filter((item) => item.direction === topic.direction).forEach((item) => ingest(item.year, tokenOverlapSimilarity(topic, item)));
    (sim || []).forEach((item) => ingest(item.year, item.similarity));
    let rows = Array.from(byYear.values()).sort((a, b) => b.year - a.year).slice(0, 6);
    if (!rows.length) return [];
    const scores = rows.map((row) => row.score);
    const maxS = Math.max.apply(null, scores);
    const minS = Math.min.apply(null, scores);
    const span = maxS - minS;
    const yearSpan = Math.max(1, rows[0].year - rows[rows.length - 1].year);
    return rows.slice(0, 5).map((row, idx) => {
      let value;
      if (span < 0.06) {
        const recency = (row.year - rows[rows.length - 1].year) / yearSpan;
        value = Math.round(clampNum(52 + recency * 36 + (maxS - row.score) * 8 - idx * 2, 36, 92));
      } else {
        const norm = (row.score - minS) / span;
        const recency = (row.year - rows[rows.length - 1].year) / yearSpan;
        value = Math.round(clampNum(40 + norm * 46 + recency * 14, 36, 94));
      }
      return { year: row.year, value: value };
    });
  }

  function expertRelationship(leadName, reviewerName) {
    const network = buildExpertNetwork(leadName);
    const link = network.links.find((item) => {
      return (item.source === leadName && item.target === reviewerName) || (item.source === reviewerName && item.target === leadName);
    });
    const times = link ? link.value : 0;
    const closeness = times >= 5 ? "高" : times >= 3 ? "中" : times >= 1 ? "低" : "弱";
    return { times: times, closeness: closeness };
  }

  function reviewerReasonLines(lead, expert) {
    const lines = [];
    const primaryDirection = expert.directions[0] || "法学交叉研究";
    lines.push("评审建议：重点关注其在" + primaryDirection + "方向的规范研究与实践评估经验，与负责人形成互补。");
    if (lead) {
      const relation = expertRelationship(lead.name, expert.name);
      lines.push("关系说明：与负责人的合作熟悉度为" + relation.closeness + "（共同讲座 " + relation.times + " 次），用于辅助判断评议独立性。");
    }
    if (expert.matchDetail && expert.matchDetail.sections && expert.matchDetail.sections.length) {
      expert.matchDetail.sections.forEach((section) => {
        lines.push(section.title + section.text);
      });
    }
    return lines;
  }

  function buildTopicAnalysisReport(topic, options) {
    options = options || {};
    const lead = options.lead || null;
    const selectedReviewers = options.selectedReviewers || [];
    const recommendedReviewers = options.recommendedReviewers || recommendExperts(topic, 6).filter((expert) => !lead || expert.name !== lead.name);
    const approvalPolicyWeight = typeof options.approvalPolicyWeight === "number" ? options.approvalPolicyWeight : 45;
    const sim = findSimilarTopics(topic, 5);
    const top = sim[0] || null;
    const policyList = findRelatedPolicies(topic, 5);
    const policyCatalog = findRelatedPolicies(topic, 8);
    const techList = technologiesForTopic(topic);
    const metrics = computeApprovalMetrics(topic, top, policyList, sim, approvalPolicyWeight);
    const directionRows = buildDirectionPositionRows(topic, sim);
    const same = top ? (topic.keywords || []).filter((keyword) => top.keywords.includes(keyword)).slice(0, 5) : [];
    const uniqueKeywords = unique(topic.keywords || []);
    const diff = uniqueKeywords.filter((keyword) => !same.includes(keyword)).slice(0, 5);
    const lines = [
      "课题立项论证报告",
      "生成时间：" + new Date().toLocaleString("zh-CN"),
      "",
      "【课题名称】" + topic.title,
      "【研究方向】" + topic.direction,
      "",
      "══════════════════════════════════════",
      "一、单题专项分析（工作台）",
      "══════════════════════════════════════",
      "",
      "（一）立项指数评估",
      "政策匹配得分：" + metrics.policyScore,
      "经验参照得分：" + metrics.experienceScore,
      "推荐立项指数：" + metrics.approvalIndex,
      "权重说明：综合得分 = 政策匹配 " + approvalPolicyWeight + "% + 经验参照 " + (100 - approvalPolicyWeight) + "%",
      "",
      "（二）单题与历史方向位置关系（按年份降序）"
    ];
    if (directionRows.length) {
      directionRows.forEach((row) => {
        lines.push(row.year + " 年 · 方向位置指数 " + row.value);
      });
    } else {
      lines.push("暂无足够接近的历史方向样本。");
    }
    lines.push(
      "",
      "（三）关键词关系",
      "共性关键词：" + (same.length ? same.join("、") : "较少"),
      "差异关键词：" + (diff.length ? diff.join("、") : "较少"),
      "",
      "（四）政策导向分析"
    );
    if (policyList.length) {
      policyList.forEach((policy, index) => {
        lines.push("");
        lines.push(index + 1 + ". 《" + policy.name + "》");
        if (policy.summary) lines.push("政策摘要：" + policy.summary);
        lines.push(policyOrientationParagraph(topic, policy));
        if (policy.clauses && policy.clauses[0]) {
          lines.push("政策条文：" + policy.clauses[0].label + " — " + policy.clauses[0].text);
        }
      });
    } else {
      lines.push("暂未匹配到国家政策，请补充课题标题或关键词。");
    }
    lines.push(
      "",
      "（五）案例趋势与论证建议",
      "最接近历史课题：" + (top ? top.title + "（相似度 " + Math.round(top.similarity * 100) + "%）" : "暂无明显匹配"),
      "与历史课题的共性：" + (same.length ? same.join("、") : "当前共性关键词较少，说明该题目更偏新议题，或仍需补充法学核心术语。"),
      "与历史课题的差异：" + (diff.length ? diff.join("、") : "当前表述较稳健，创新点可能更多体现在场景组合而非关键词本身。"),
      "立项建议：" + adviceForTopic(topic, top, policyList, techList),
      "风险提示：" + riskForTopic(top, policyList, techList)
    );
    if (sim.length) {
      lines.push("", "（六）对标历史样本");
      sim.slice(0, 3).forEach((item, index) => {
        lines.push(
          index + 1 + ". " + item.title,
          "   相似度 " + Math.round(item.similarity * 100) + "% · " + item.direction + " · " + item.year + " 年 · " + item.type,
          "   关联关键词：" + item.keywords.slice(0, 5).join("、")
        );
      });
    }
    lines.push(
      "",
      "══════════════════════════════════════",
      "二、团队配置",
      "══════════════════════════════════════",
      ""
    );
    if (lead) {
      lines.push("【项目负责人】", lead.name + " · " + lead.institution + " · " + lead.title);
      if (lead.matchDetail && lead.matchDetail.sections) {
        lead.matchDetail.sections.forEach((section) => lines.push(section.title + section.text));
      }
      lines.push("");
    }
    lines.push("【评审专家】");
    if (selectedReviewers.length) {
      lines.push("（以下专家已确定为评审组成员）");
      selectedReviewers.forEach((expert, index) => {
        lines.push("");
        lines.push(index + 1 + ". " + expert.name + " · " + expert.institution);
        reviewerReasonLines(lead, expert).forEach((line) => lines.push("   " + line));
      });
    } else {
      lines.push("（尚未最终确定评审专家，以下为系统推荐名单及推荐理由，供遴选参考）");
      recommendedReviewers.slice(0, 5).forEach((expert, index) => {
        lines.push("");
        lines.push(index + 1 + ". " + expert.name + " · " + expert.institution + " · 匹配度 " + Math.round(expert.score * 100) + "%");
        lines.push("   研究方向：" + expert.directions.join("、"));
        reviewerReasonLines(lead, expert).forEach((line) => lines.push("   " + line));
      });
    }
    lines.push(
      "",
      "══════════════════════════════════════",
      "三、补充材料（详情页）",
      "══════════════════════════════════════",
      "",
      "【相似历史课题】"
    );
    sim.slice(0, 5).forEach((item, index) => {
      lines.push(index + 1 + ". " + item.title + "（" + item.year + " 年，相似度 " + Math.round(item.similarity * 100) + "%）");
    });
    if (!sim.length) lines.push("暂无高相似历史课题。");
    lines.push("", "【相关政策清单】");
    policyCatalog.forEach((policy, index) => {
      lines.push(index + 1 + ". " + policy.name + (policy.keyword ? "（关联词：" + policy.keyword + "）" : ""));
    });
    lines.push("", "—— 本报告由法学研究选题平台自动生成，仅供立项论证演示参考。");
    return lines.join("\n");
  }

  const TAG_TO_DIRECTION = {
    "数据": "数字法治",
    "算法": "数字法治",
    "人工智能": "数字法治",
    "平台": "民商法治",
    "认罪认罚": "刑事法治",
    "刑事": "刑事法治",
    "证据": "司法制度",
    "著作权": "知识产权法",
    "专利": "知识产权法",
    "商标": "知识产权法",
    "涉外": "国际法治",
    "合规": "国际法治",
    "仲裁": "国际法治",
    "行政": "行政法治",
    "劳动": "社会治理法",
    "社会治理": "社会治理法"
  };

  function parsePolicyYear(dateStr) {
    const match = String(dateStr || "").match(/(20\d{2})/);
    return match ? Number(match[1]) : 2020;
  }

  function getPolicyDocument(name) {
    return POLICY_CONTENT[name] || null;
  }

  const POLICY_LEVEL_OPTIONS = [
    { id: "national-strategy", label: "国家级战略规划", hint: "中共中央、国务院文件" },
    { id: "ministry-rule", label: "部委规章", hint: "司法部、工信部等" },
    { id: "judicial-norm", label: "司法解释/规范性文件", hint: "最高法、最高检" }
  ];

  function inferPolicyLevel(issuer) {
    const t = String(issuer || "").trim();
    if (/最高人民法院|最高人民检察院|最高法|最高检/.test(t)) return "judicial-norm";
    if (/全国人民代表大会|全国人大常委会/.test(t)) return "national-strategy";
    if (/中共中央/.test(t)) return "national-strategy";
    if (/国务院/.test(t)) return "national-strategy";
    return "ministry-rule";
  }

  function scorePolicyAlignSimilarity(queryText, policyName) {
    const q = String(queryText || "").trim();
    if (!q) return 0;
    const doc = getPolicyDocument(policyName);
    const catalogItem = POLICY_CATALOG.find((item) => item.name === policyName);
    const keywords = unique(
      getPolicyCoreKeywords(policyName).concat(catalogItem ? catalogItem.tags : []).concat(doc && doc.summary ? tokenize(doc.summary) : [])
    );
    const pseudoQuery = { title: q, direction: "", keywords: tokenize(q) };
    const pseudoPolicy = {
      title: policyName,
      direction: (catalogItem && catalogItem.directions[0]) || "",
      keywords: keywords.length ? keywords : tokenize(policyName)
    };
    return scoreTopicSimilarity(pseudoQuery, pseudoPolicy);
  }

  function buildPolicyCatalog() {
    return Object.keys(POLICY_CONTENT).map((name) => {
      const doc = POLICY_CONTENT[name];
      const year = parsePolicyYear(doc.date);
      const tags = unique((doc.clauses || []).flatMap((clause) => clause.tags || []));
      const directions = unique(tags.map((tag) => TAG_TO_DIRECTION[tag]).filter(Boolean));
      return {
        name: name,
        issuer: doc.issuer,
        date: doc.date,
        year: year,
        summary: doc.summary,
        tags: tags,
        level: inferPolicyLevel(doc.issuer),
        directions: directions.length ? directions : ["法学交叉研究"]
      };
    }).sort((a, b) => a.year - b.year || a.name.localeCompare(b.name));
  }

  const POLICY_CATALOG = buildPolicyCatalog();

  function extractIssueTitleFromText(text) {
    const cleaned = String(text || "").trim();
    if (!cleaned) return "政策重点议题";
    const parts = cleaned.split(/[，。；]/).map((part) => part.trim()).filter((part) => part.length >= 6);
    const candidate = parts.find((part) => /(健全|完善|加强|推动|推进|发展|保障|规范|强化|深化|加快)/.test(part)) || parts[0] || cleaned;
    return candidate.length > 44 ? candidate.slice(0, 44) + "…" : candidate;
  }

  function normalizePolicyIssueTitle(label, text) {
    let title = String(label || "").trim();
    if (!title || title.length <= 3) return extractIssueTitleFromText(text);
    if (/^第[一二三四五六七八九十百零\d]+条/.test(title)) return extractIssueTitleFromText(text);
    const chapter = title.match(/^第[一二三四五六七八九十百零\d]+章\s*(.+)$/);
    if (chapter) return chapter[1].trim();
    const section = title.match(/^第[一二三四五六七八九十百零\d]+节\s*(.+)$/);
    if (section) return section[1].trim();
    const part = title.match(/^第[一二三四五六七八九十百零\d]+部分?\s*(.+)$/);
    if (part) return part[1].trim();
    const column = title.match(/^专栏\s*(.+)$/);
    if (column) return column[1].trim();
    return title;
  }

  function isNoisePolicyKeyword(word) {
    const w = String(word || "").trim();
    if (w.length < 2) return true;
    if (/^第[一二三四五六七八九十百零\d]+[章节条款编部]/.test(w)) return true;
    if (/^第[一二三四五六七八九十百零\d]+[章节条款编部]?$/.test(w)) return true;
    if (/^[（(]?[一二三四五六七八九十\d]+[）)]?$/.test(w)) return true;
    if (/^专栏$/.test(w)) return true;
    if (/^总体要求$|^重点任务$|^基本原则$/.test(w)) return true;
    return false;
  }

  function getPolicyGovernanceProblems(policyName) {
    const doc = getPolicyDocument(policyName);
    if (!doc) return [];
    if (doc.governanceProblems && doc.governanceProblems.length) {
      return doc.governanceProblems.map((problem, index) => ({
        id: problem.id || policyName + "-gp-" + index,
        title: problem.title || "待解治理问题",
        keywords: problem.keywords || [],
        tags: problem.tags || []
      }));
    }
    return getPolicyIssues(policyName).slice(0, 3).map((issue, index) => ({
      id: policyName + "-gp-" + index,
      title: issue.title,
      keywords: [issue.title].filter((word) => !isNoisePolicyKeyword(word)),
      tags: issue.tags || []
    }));
  }

  function addPolicyKeyword(words, word) {
    const w = String(word || "").trim();
    if (w.length >= 2 && !isNoisePolicyKeyword(w)) words.add(w);
  }

  function getPolicyCoreKeywords(policyName) {
    const catalogItem = POLICY_CATALOG.find((item) => item.name === policyName);
    const doc = getPolicyDocument(policyName);
    const words = new Set();
    (catalogItem && catalogItem.tags || []).forEach((tag) => addPolicyKeyword(words, tag));
    (doc && doc.clauses || []).forEach((clause) => (clause.tags || []).forEach((tag) => addPolicyKeyword(words, tag)));
    getPolicyIssues(policyName).forEach((issue) => {
      (issue.tags || []).forEach((tag) => addPolicyKeyword(words, tag));
      addPolicyKeyword(words, issue.title);
    });
    getPolicyGovernanceProblems(policyName).forEach((problem) => {
      const kw = problem.keywords;
      if (Array.isArray(kw)) kw.forEach((word) => addPolicyKeyword(words, word));
      else if (typeof kw === "string") tokenize(kw).forEach((word) => addPolicyKeyword(words, word));
      (problem.tags || []).forEach((tag) => addPolicyKeyword(words, tag));
    });
    return [...words].slice(0, 14);
  }

  function topicMatchesGovernanceProblem(topic, problem) {
    const haystack = [topic.title || "", topic.direction || "", (topic.keywords || []).join(" ")].join(" ");
    if ((problem.tags || []).some((tag) => tag && haystack.includes(tag))) return true;
    const needles = [problem.title].concat(problem.keywords || []);
    let hits = 0;
    needles.forEach((needle) => {
      const text = String(needle || "").trim();
      if (text.length >= 2 && haystack.includes(text)) hits += 1;
    });
    return hits >= 1;
  }

  function matchTopicsToGovernanceProblem(problem, topics) {
    if (!problem) return [];
    return (topics || [])
      .filter((topic) => topicMatchesGovernanceProblem(topic, problem))
      .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title, "zh-CN"));
  }

  function getPolicyIssues(policyName) {
    const doc = getPolicyDocument(policyName);
    if (!doc) return [];
    if (doc.issues && doc.issues.length) {
      return doc.issues.map((issue) => ({
        title: issue.title,
        note: issue.note || "",
        tags: issue.tags || [],
        source: issue.source || ""
      }));
    }
    return (doc.clauses || []).map((clause) => {
      const title = normalizePolicyIssueTitle(clause.label, clause.text);
      return {
        title: title,
        note: clause.text || "",
        tags: clause.tags || [],
        source: clause.label || ""
      };
    });
  }

  function topicMatchesIssue(topic, issue, policyYear) {
    const title = String(issue.title || "");
    const keywords = title.replace(/[、，与及]/g, " ").split(/\s+/).filter((word) => word.length >= 2);
    const haystack = [topic.title, topic.direction, (topic.keywords || []).join(" ")].join(" ");
    const titleHit = keywords.some((word) => haystack.includes(word));
    const tagHit = (issue.tags || []).length && topicMatchesPolicyTags(topic, issue.tags, policyYear);
    return titleHit || tagHit;
  }

  function getPolicyFocusAreas(policyName) {
    const doc = getPolicyDocument(policyName);
    if (!doc) return [];
    const areas = [];
    const seen = new Set();
    (doc.clauses || []).forEach((clause) => {
      const tags = clause.tags || [];
      const directions = unique(tags.map((tag) => TAG_TO_DIRECTION[tag]).filter(Boolean));
      const targets = directions.length ? directions : ["法学交叉研究"];
      targets.forEach((direction) => {
        const key = direction + "::" + tags.join("|");
        if (seen.has(key)) return;
        seen.add(key);
        areas.push({
          direction: direction,
          tags: tags.slice(),
          source: clause.label,
          excerpt: clause.text
        });
      });
    });
    if (!areas.length) {
      areas.push({
        direction: "法学交叉研究",
        tags: [],
        source: "政策要点",
        excerpt: doc.summary || "该政策与法学研究选题存在宏观关联。"
      });
    }
    return areas;
  }

  function topicMatchesPolicyTags(topic, tags, policyYear) {
    if (!tags.length) return topic.year >= policyYear - 1;
    const haystack = [topic.title, topic.direction, (topic.keywords || []).join(" ")].join(" ");
    const hit = tags.some((tag) => haystack.includes(tag));
    return hit && topic.year >= policyYear - 1;
  }

  function analyzePolicyCoverage(policyName, topics) {
    const doc = getPolicyDocument(policyName);
    const catalogItem = POLICY_CATALOG.find((item) => item.name === policyName);
    if (!doc || !catalogItem) {
      return { policyName: policyName, year: 2020, summary: "", focusAreas: [], done: [], pending: [], issues: [], issuesDone: [], issuesPending: [] };
    }
    const policyYear = catalogItem.year;
    const rawAreas = getPolicyFocusAreas(policyName);
    const byDirection = new Map();
    rawAreas.forEach((area) => {
      if (!byDirection.has(area.direction)) byDirection.set(area.direction, { direction: area.direction, tags: [], sources: [] });
      const bucket = byDirection.get(area.direction);
      area.tags.forEach((tag) => { if (!bucket.tags.includes(tag)) bucket.tags.push(tag); });
      bucket.sources.push({ label: area.source, text: area.excerpt });
    });
    const focusAreas = [...byDirection.values()].map((area) => {
      const pool = (topics || []).filter((topic) => topic.direction === area.direction);
      const matched = pool.filter((topic) => topicMatchesPolicyTags(topic, area.tags.length ? area.tags : catalogItem.tags, policyYear));
      const status = matched.length >= 2 || (matched.length >= 1 && matched.some((topic) => topic.year >= policyYear)) ? "done" : "pending";
      return Object.assign({}, area, {
        status: status,
        topicCount: matched.length,
        samples: matched.slice().sort((a, b) => b.year - a.year).slice(0, 3)
      });
    });
    const rawIssues = getPolicyIssues(policyName);
    const issues = rawIssues.map((issue) => {
      const directions = unique((issue.tags || []).map((tag) => TAG_TO_DIRECTION[tag]).filter(Boolean));
      const pool = (topics || []).filter((topic) => !directions.length || directions.includes(topic.direction));
      const matched = pool.filter((topic) => topicMatchesIssue(topic, issue, policyYear));
      const status = matched.length >= 2 || (matched.length >= 1 && matched.some((topic) => topic.year >= policyYear)) ? "done" : "pending";
      return Object.assign({}, issue, {
        directions: directions,
        status: status,
        topicCount: matched.length,
        samples: matched.slice().sort((a, b) => b.year - a.year).slice(0, 3)
      });
    });
    return {
      policyName: policyName,
      issuer: doc.issuer,
      date: doc.date,
      year: policyYear,
      summary: doc.summary,
      tags: catalogItem.tags,
      focusAreas: focusAreas,
      done: focusAreas.filter((area) => area.status === "done"),
      pending: focusAreas.filter((area) => area.status === "pending"),
      issues: issues,
      issuesDone: issues.filter((issue) => issue.status === "done"),
      issuesPending: issues.filter((issue) => issue.status === "pending")
    };
  }

  const TREND_LINE_COLORS = ["#5eead4", "#a78bfa", "#7dd3fc", "#f9a8d4", "#86efac", "#fcd34d", "#67e8f9", "#c4b5fd", "#fda4af", "#6ee7b7"];
  const TREND_DIRECTION_LABELS = new Set([
    "数字法治", "刑事法治", "民商法治", "知识产权法", "国际法治", "行政法治", "司法制度", "社会治理法"
  ]);
  const TREND_STOPWORDS = new Set([
    "法学研究", "制度设计", "规范解释", "司法实践", "高质量发展", "法学", "研究", "机制", "路径", "体系", "问题", "对策",
    "法教义学", "实证研究", "案例分析", "比较法", "技术治理", "司法回应", "风险预防", "协同监管",
    "制度完善", "机制创新", "规范协调", "程序优化", "场景治理", "风险防控", "的", "与", "及"
  ]);

  function isTrendKeyword(kw) {
    if (!kw || kw.length < 2) return false;
    if (TREND_STOPWORDS.has(kw) || TREND_DIRECTION_LABELS.has(kw)) return false;
    return true;
  }

  function collectTopicKeywords(topic) {
    const bag = [];
    (topic.keywords || []).forEach((kw) => {
      const word = String(kw || "").trim();
      if (isTrendKeyword(word)) bag.push(word);
    });
    return bag;
  }

  function topicMatchesTrendKeyword(topic, keyword) {
    const k = String(keyword || "").trim();
    if (!k || k.length < 2) return false;
    if (String(topic.title || "").includes(k)) return true;
    return (topic.keywords || []).some((w) => {
      const word = String(w || "").trim();
      return word && (word.includes(k) || k.includes(word));
    });
  }

  function inferTrendLineKind(values, years) {
    const span = Math.max(1, years.length - 1);
    const activeIdx = values.map((v, i) => (v > 0 ? i : -1)).filter((i) => i >= 0);
    if (!activeIdx.length) {
      return { kind: "growth", emergeYear: years[0], fromBaseline: false };
    }
    const firstIdx = activeIdx[0];
    const emergeYear = years[firstIdx];
    const lastThirdIdx = Math.floor(span * 0.67);
    if (firstIdx >= lastThirdIdx) {
      return { kind: "emerging", emergeYear: emergeYear, fromBaseline: true };
    }
    const mid = Math.ceil(values.length / 2);
    const firstHalf = values.slice(0, mid).reduce((s, v) => s + v, 0);
    const secondHalf = values.slice(mid).reduce((s, v) => s + v, 0);
    if (secondHalf > firstHalf * 1.25 && firstHalf > 0) {
      return { kind: "growth", emergeYear: emergeYear, fromBaseline: false };
    }
    return { kind: "established", emergeYear: emergeYear, fromBaseline: false };
  }

  function buildKeywordTrendData(topics, options) {
    const topN = (options && options.topN) || 8;
    const customKeywords = options && options.keywords;
    const list = (topics || []).slice();
    if (!list.length && !(customKeywords && customKeywords.length)) {
      return { years: [], series: [], maxValue: 0, topicCount: 0 };
    }
    const years = [...new Set(list.map((topic) => topic.year))].sort((a, b) => a - b);
    if (!years.length && customKeywords && customKeywords.length) {
      const endYear = new Date().getFullYear();
      for (let year = endYear - 12; year <= endYear; year += 1) years.push(year);
    }
    if (!years.length) {
      return { years: [], series: [], maxValue: 0, topicCount: 0 };
    }
    let topKeywords = [];
    if (customKeywords && customKeywords.length) {
      topKeywords = customKeywords.map((k) => String(k).trim()).filter((k) => k.length >= 2);
    } else {
      const perYear = new Map();
      const totals = new Map();
      years.forEach((year) => perYear.set(year, new Map()));
      list.forEach((topic) => {
        const yearMap = perYear.get(topic.year);
        if (!yearMap) return;
        const seen = new Set();
        collectTopicKeywords(topic).forEach((raw) => {
          const kw = raw.trim();
          if (!kw || seen.has(kw)) return;
          seen.add(kw);
          totals.set(kw, (totals.get(kw) || 0) + 1);
          yearMap.set(kw, (yearMap.get(kw) || 0) + 1);
        });
      });
      function keywordYearSpread(keyword) {
        const vals = years.map((year) => perYear.get(year).get(keyword) || 0);
        const mean = vals.reduce((sum, val) => sum + val, 0) / Math.max(1, vals.length);
        const variance = vals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / Math.max(1, vals.length);
        const recent = vals.slice(-3).reduce((sum, val) => sum + val, 0);
        return variance * 4 + recent * 0.35;
      }
      topKeywords = [...totals.entries()]
        .sort((a, b) => (b[1] - a[1]) || (keywordYearSpread(b[0]) - keywordYearSpread(a[0])) || a[0].localeCompare(b[0]))
        .slice(0, topN)
        .map((entry) => entry[0]);
    }
    const series = topKeywords.map((keyword, index) => {
      const values = years.map((year) => {
        let count = 0;
        list.forEach((topic) => {
          if (topic.year === year && topicMatchesTrendKeyword(topic, keyword)) count += 1;
        });
        return count;
      });
      const total = values.reduce((sum, val) => sum + val, 0);
      const peakIdx = values.indexOf(Math.max(...values));
      const kindInfo = inferTrendLineKind(values, years);
      return {
        keyword: keyword,
        color: TREND_LINE_COLORS[index % TREND_LINE_COLORS.length],
        values: values,
        total: total,
        peakYear: years[peakIdx] || years[0],
        emergeYear: kindInfo.emergeYear,
        kind: kindInfo.kind,
        fromBaseline: kindInfo.fromBaseline
      };
    });
    const maxValue = Math.max(1, ...series.flatMap((item) => item.values));
    return { years: years, series: series, maxValue: maxValue, topicCount: list.length };
  }

  function suggestRelatedTrendKeywords(topics, keyword, options) {
    options = options || {};
    const limit = options.limit || 8;
    const query = String(keyword || "").trim();
    if (query.length < 2) return [];
    const exclude = new Set((options.exclude || []).concat([query]).map((item) => String(item || "").trim()).filter(Boolean));
    const list = topics || [];
    const matched = list.filter((topic) => topicMatchesTrendKeyword(topic, query));
    const scores = new Map();

    function note(word, weight, isRecent) {
      if (!isTrendKeyword(word) || exclude.has(word) || word === query) return;
      const prev = scores.get(word) || { score: 0, count: 0, recent: 0 };
      prev.score += weight;
      prev.count += 1;
      if (isRecent) prev.recent += 1;
      scores.set(word, prev);
    }

    matched.forEach((topic) => {
      const isRecent = topic.year >= 2021;
      collectTopicKeywords(topic).forEach((kw) => note(kw, 2, isRecent));
    });

    if (matched.length) {
      const directions = new Set(matched.map((topic) => topic.direction));
      list.filter((topic) => directions.has(topic.direction)).forEach((topic) => {
        const isRecent = topic.year >= 2021;
        collectTopicKeywords(topic).forEach((kw) => note(kw, 0.75, isRecent));
      });
    }

    if (scores.size < limit) {
      list.forEach((topic) => {
        const isRecent = topic.year >= 2021;
        collectTopicKeywords(topic).forEach((kw) => {
          if (kw.includes(query) || query.includes(kw)) note(kw, 0.55, isRecent);
        });
      });
    }

    DEFAULT_TREND_KEYWORDS.forEach((kw) => {
      if (kw.includes(query) || query.includes(kw)) note(kw, 0.35, false);
    });

    return [...scores.entries()]
      .sort((a, b) => (b[1].score + b[1].recent * 0.35) - (a[1].score + a[1].recent * 0.35) || b[1].count - a[1].count || a[0].localeCompare(b[0]))
      .slice(0, limit)
      .map(([word, stat]) => ({ keyword: word, count: stat.count }));
  }

  function keywordTrendSeed(keyword) {
    let hash = 0;
    const text = String(keyword || "");
    for (let i = 0; i < text.length; i += 1) {
      hash = (hash * 31 + text.charCodeAt(i)) % 9973;
    }
    return hash * 0.001 + 0.6;
  }

  function buildWindingUpwardTrendValues(yearCount, rankIndex, totalLines, rawValues, seed) {
    const span = Math.max(1, yearCount - 1);
    const lane = totalLines <= 1 ? 1 : (totalLines - 1 - rankIndex) / (totalLines - 1);
    const rawMax = Math.max(1, ...(rawValues || []));
    const values = [];
    for (let i = 0; i < yearCount; i += 1) {
      const progress = i / span;
      const lift = Math.pow(progress, 0.78 + (seed % 0.18));
      const start = 5 + lane * 7;
      const end = 18 + lane * 42;
      let val = start + (end - start) * lift;
      val += Math.sin(progress * Math.PI * (2.35 + seed * 0.42) + seed) * (2.4 + lane * 1.8);
      val += Math.sin(progress * Math.PI * (4.85 + seed * 0.27) + seed * 1.9) * (1.2 + lane * 0.7);
      const rawNorm = ((rawValues && rawValues[i]) || 0) / rawMax;
      val += rawNorm * (1.5 + progress * 3.5);
      values.push(Math.max(3, Math.round(val * 10) / 10));
    }
    return values;
  }

  function applyTrendDisplayCurves(model) {
    if (!model || !model.series || !model.series.length) return model;
    const ranked = model.series.slice().sort((a, b) => (b.total - a.total) || a.keyword.localeCompare(b.keyword));
    const rankMap = new Map(ranked.map((line, index) => [line.keyword, index]));
    const totalLines = model.series.length;
    const nextSeries = model.series.map((line, index) => {
      const rank = rankMap.has(line.keyword) ? rankMap.get(line.keyword) : index;
      const seed = keywordTrendSeed(line.keyword);
      const displayValues = buildWindingUpwardTrendValues(model.years.length, rank, totalLines, line.values, seed);
      const kind = rank <= 2 ? "growth" : rank >= totalLines - 3 ? "emerging" : "established";
      return Object.assign({}, line, {
        rawValues: line.values.slice(),
        values: displayValues,
        kind: kind,
        fromBaseline: false,
        emergeYear: model.years[0]
      });
    });
    const maxValue = Math.max(1, ...nextSeries.flatMap((item) => item.values));
    return Object.assign({}, model, {
      series: nextSeries,
      maxValue: maxValue * 1.08,
      display: true
    });
  }

  function trendShapeIntensity(shape, progress, seed) {
    const wobble = Math.sin(progress * Math.PI * 2.2 + seed) * 0.05;
    const p = Math.max(0, Math.min(1, progress));
    if (shape === "rise") {
      return 8 + 18 * Math.pow(p, 1.15) + wobble * 4;
    }
    if (shape === "surge") {
      return 6 + 22 * Math.pow(p, 1.65) + wobble * 3;
    }
    if (shape === "emerging") {
      if (p < 0.15) return 2 + p * 10;
      return 8 + 20 * Math.pow((p - 0.1) / 0.9, 1.45) + wobble * 4;
    }
    return 10 + 14 * p;
  }

  function trendEstablishedValue(progress, profile) {
    const wobble = Math.sin(progress * Math.PI * (profile.waves || 1.8) + profile.seed) * (profile.wobble || 4);
    const drift = (profile.drift || 0) * progress;
    return Math.max(10, Math.round((profile.base || 20) + wobble + drift));
  }

  function buildKeywordTrendDisplayData(topics, options) {
    const topN = (options && options.topN) || 8;
    let years = [];
    if (topics && topics.length) {
      years = [...new Set(topics.map((topic) => topic.year))].sort((a, b) => a - b);
    }
    if (years.length < 4) {
      const endYear = new Date().getFullYear();
      years = [];
      for (let year = endYear - 12; year <= endYear; year += 1) years.push(year);
    }
    const minYear = years[0];
    const maxYear = years[years.length - 1];
    const clampYear = (year) => Math.min(maxYear, Math.max(minYear, year));
    const span = Math.max(1, years.length - 1);
    const profiles = [
      { keyword: "认罪认罚", kind: "established", seed: 1.1, base: 24, waves: 1.6, wobble: 5, drift: 2 },
      { keyword: "证据规则", kind: "established", seed: 2.3, base: 21, waves: 2.1, wobble: 4, drift: -1 },
      { keyword: "行政裁量", kind: "established", seed: 3.5, base: 19, waves: 1.9, wobble: 3.5, drift: 1 },
      { keyword: "数据要素", kind: "growth", emergeYear: clampYear(2015), shape: "rise", seed: 4.2 },
      { keyword: "个人信息保护", kind: "growth", emergeYear: clampYear(2016), shape: "rise", seed: 5.4 },
      { keyword: "涉外法治", kind: "established", seed: 6.1, base: 17, waves: 2.2, wobble: 3, drift: 3 },
      { keyword: "算法治理", kind: "growth", emergeYear: clampYear(2018), shape: "surge", seed: 7.3 },
      { keyword: "平台用工", kind: "growth", emergeYear: clampYear(2019), shape: "surge", seed: 8.2 },
      { keyword: "人工智能", kind: "emerging", emergeYear: clampYear(2021), shape: "emerging", seed: 9.1 },
      { keyword: "生成式人工智能", kind: "emerging", emergeYear: clampYear(2022), shape: "emerging", seed: 10.4 }
    ].slice(0, topN);
    const series = profiles.map((profile, index) => {
      const startIdx = profile.kind === "emerging" || profile.kind === "growth"
        ? Math.max(0, years.findIndex((year) => year >= profile.emergeYear))
        : 0;
      const values = years.map((year, yearIndex) => {
        const progress = yearIndex / span;
        if (profile.kind === "established") {
          return trendEstablishedValue(progress, profile);
        }
        if (year < profile.emergeYear) {
          if (profile.kind === "growth") {
            return Math.max(6, Math.round(7 + 3 * Math.sin(progress * Math.PI * 3 + profile.seed)));
          }
          return 0;
        }
        const localSpan = Math.max(1, years.length - 1 - startIdx);
        const localProgress = (yearIndex - startIdx) / localSpan;
        return Math.max(0, Math.round(trendShapeIntensity(profile.shape || "rise", localProgress, profile.seed)));
      });
      const peakIdx = values.indexOf(Math.max(...values));
      const total = values.reduce((sum, val) => sum + val, 0);
      const firstActiveYear = years[values.findIndex((val) => val > 0)] || minYear;
      return {
        keyword: profile.keyword,
        color: TREND_LINE_COLORS[index % TREND_LINE_COLORS.length],
        values: values,
        total: total,
        peakYear: years[peakIdx] || firstActiveYear,
        emergeYear: profile.kind === "emerging" ? profile.emergeYear : firstActiveYear,
        kind: profile.kind,
        fromBaseline: profile.kind === "emerging",
        display: true
      };
    });
    const maxValue = Math.max(12, ...series.flatMap((item) => item.values)) * 1.08;
    return {
      years: years,
      series: series,
      maxValue: Math.ceil(maxValue),
      topicCount: topics ? topics.length : 0,
      display: true
    };
  }

  function matchTopicsForTrendKeyword(topics, keyword, limit) {
    const list = (topics || []).filter((topic) => topicMatchesTrendKeyword(topic, keyword));
    return list.sort((a, b) => b.year - a.year || b.title.localeCompare(a.title)).slice(0, limit || 3);
  }

  function analyzeKeywordTrendMomentum(line, years) {
    const values = line.values || [];
    const total = line.total || 0;
    if (!years.length || !values.length) {
      return { trend: "unknown", trendLabel: "待观察", recentSum: 0, earlySum: 0, momentum: 0 };
    }
    const half = Math.max(1, Math.floor(years.length / 2));
    const earlySum = values.slice(0, half).reduce((sum, val) => sum + val, 0);
    const recentSum = values.slice(-Math.min(3, values.length)).reduce((sum, val) => sum + val, 0);
    const firstIdx = values.findIndex((val) => val > 0);
    const lastThird = Math.floor(years.length * 0.67);
    let trend = "stable";
    let trendLabel = "平稳关注";
    if (line.kind === "emerging" || (firstIdx >= 0 && firstIdx >= lastThird)) {
      trend = "emerging";
      trendLabel = "新兴议题";
    } else if (recentSum > earlySum * 1.15 && recentSum > 0) {
      trend = "rising";
      trendLabel = "持续升温";
    } else if (earlySum > 0 && recentSum < earlySum * 0.75) {
      trend = "declining";
      trendLabel = "热度回落";
    } else if (total >= 8) {
      trend = "established";
      trendLabel = "长期热点";
    }
    const momentum = earlySum > 0 ? (recentSum - earlySum) / earlySum : recentSum > 0 ? 1 : 0;
    return { trend, trendLabel, recentSum, earlySum, momentum };
  }

  function dominantDirectionForKeyword(topics, keyword) {
    const matched = matchTopicsForTrendKeyword(topics, keyword, 20);
    const counts = new Map();
    matched.forEach((topic) => counts.set(topic.direction, (counts.get(topic.direction) || 0) + 1));
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    return top ? top[0] : "数字法治";
  }

  function buildTrendTopicTitle(keyword, direction, trend, angle) {
    const templates = {
      emerging: [
        `${keyword}的法治回应与规范构造研究`,
        `数字化背景下${keyword}的制度保障路径`
      ],
      rising: [
        `${keyword}的规范完善与适用研究`,
        `${keyword}领域比较法视野下的中国方案`
      ],
      declining: [
        `${keyword}适用中的疑难问题与规则优化`,
        `后热点阶段${keyword}的精细化治理研究`
      ],
      established: [
        `${keyword}的体系化表达与制度衔接`,
        `新法新规背景下${keyword}的再诠释`
      ],
      stable: [
        `${keyword}的实证评估与制度改进`,
        `${keyword}与相关法域的协调机制研究`
      ]
    };
    const list = templates[trend] || templates.stable;
    const title = list[Math.abs(keyword.length + direction.length) % list.length];
    return angle ? title.replace("研究", `——以${angle}为切口的研究`) : title;
  }

  function buildTrendSuggestionRationale(keyword, trend, total, samples, policies) {
    const sampleText = samples.length
      ? `已有 ${samples.length} 项相关历史课题可对标，如「${samples[0].title}」（${samples[0].year} 年）`
      : "当前筛选样本中相关课题较少，具备议题拓展空间";
    const policyText = policies.length
      ? `可对接《${policies[0].name}》等政策导向`
      : "建议结合近期国家政策与司法实践进一步充实立项依据";
    if (trend === "emerging") {
      return `「${keyword}」近年才开始在历史样本中显现，${sampleText}。${policyText}，适合作为前沿布局选题。`;
    }
    if (trend === "rising") {
      return `「${keyword}」呈现明显上升态势（累计 ${total} 次），${sampleText}。${policyText}，建议在既有研究基础上做纵深推进。`;
    }
    if (trend === "declining") {
      return `「${keyword}」近期热度有所回落（累计 ${total} 次），${sampleText}。建议避开同质化表述，从规则细化、新型场景或交叉学科切入。`;
    }
    if (trend === "established") {
      return `「${keyword}」属于长期关注议题（累计 ${total} 次），${sampleText}。${policyText}，宜寻找差异化问题意识与理论切口。`;
    }
    return `「${keyword}」整体波动不大（累计 ${total} 次），${sampleText}。${policyText}，可结合新场景开展稳态深化研究。`;
  }

  const DEFAULT_TREND_KEYWORDS = [
    "平台传播",
    "人工智能",
    "商标保护",
    "著作权",
    "专利治理",
    "出口管制",
    "国际仲裁",
    "合规治理",
    "基层治理",
    "纠纷预防"
  ];

  /** 领域演进视图时间轴里程碑（细虚线 + 标注，按日历年与当前样本年份范围裁剪显示） */
  const TREND_EVOLUTION_MILESTONES = [
    {
      year: 2018,
      label: "2018：中美贸易摩擦升级",
      hint: "出口管制、跨境贸易合规等研究热度抬升"
    },
    {
      year: 2018,
      yearEnd: 2020,
      label: "2018—2020：出口管制议题升温",
      hint: "关键技术物项管制与供应链合规成为高频选题"
    },
    {
      year: 2020,
      label: "2020：《民法典》颁布施行",
      hint: "民事法治基础规范体系确立"
    },
    {
      year: 2021,
      label: "2021：《数据安全法》《个保法》实施",
      hint: "数据合规成为数字法治主线"
    },
    {
      year: 2022,
      label: "2022：算法推荐管理规定施行",
      hint: "平台算法治理进入强监管阶段"
    },
    {
      year: 2023,
      label: "2023：ChatGPT 引爆大模型热潮",
      hint: "生成式人工智能法治研究爆发"
    },
    {
      year: 2024,
      label: "2024：国务院「人工智能+」行动",
      hint: "国家层面部署 AI 融合应用与治理"
    }
  ];

  /** 领域演进视图：挂在对应关键词折线上的可点击里程碑锚点 */
  const TREND_KEYWORD_MILESTONES = [
    {
      id: "ip-courts-2014",
      year: 2014,
      yearEnd: 2015,
      keywords: ["著作权", "商标保护"],
      title: "2014—2015：知识产权法院相继设立",
      detail:
        "北京、上海、广州知识产权法院相继成立，知识产权审判走向专业化、集中化，是我国知识产权法治化治理的重要节点，著作权与商标案件审理规则持续细化。"
    },
    {
      id: "trade-friction-2018",
      year: 2018,
      keywords: ["出口管制", "国际仲裁"],
      title: "2018：中美贸易摩擦爆发",
      detail:
        "美国频繁动用「实体清单」等出口管制工具，出口管制和供应链合规研究热度飙升；跨境经贸摩擦也带动国际仲裁、争端解决机制相关选题增多。"
    },
    {
      id: "data-antitrust-2020",
      year: 2020,
      keywords: ["合规治理", "平台传播"],
      title: "2020：数据安全与反垄断发力",
      detail:
        "《数据安全法》《个人信息保护法》立法进程引发高度关注，互联网平台反垄断指南出台，平台传播治理与合规治理形成双线并进的研究热潮。"
    },
    {
      id: "export-law-2021",
      year: 2021,
      keywords: ["出口管制"],
      title: "2021：《出口管制法》正式实施",
      detail:
        "2021年12月1日中国《出口管制法》正式实施，是我国首部系统性出口管制法律，建立统一出口管制制度框架，企业出口管制合规要求全面升级。"
    },
    {
      id: "genai-2023",
      year: 2023,
      keywords: ["人工智能", "著作权"],
      title: "2023：ChatGPT 引爆生成式 AI",
      detail:
        "ChatGPT 引领全球大模型应用浪潮；我国发布《生成式人工智能服务管理暂行办法》，人工智能治理与 AI 生成内容著作权归属、训练数据合规成为交叉研究焦点。"
    },
    {
      id: "overseas-patent-2024",
      year: 2024,
      yearEnd: 2025,
      keywords: ["专利治理", "纠纷预防"],
      title: "2024—2025：出海合规与全球专利战",
      detail:
        "中国企业大规模出海，在欧美等地遭遇密集的海外专利诉讼与跨境合规调查；专利布局、纠纷预防化解与涉外法治协同议题热度持续攀升。"
    }
  ];

  const TREND_JUDGMENT_SUMMARY =
    "上述关键词的热度趋势总体呈现「全面上涨，分化加速」的特点。其中，人工智能、出口管制、合规治理等与科技革命、地缘政治强相关的领域热度呈爆发式增长，成为当前及未来的焦点；平台传播、著作权、纠纷预防、基层治理受益于数字社会转型和治理模式创新，热度稳健上行；商标保护、专利治理等传统知识产权领域保持温和增长，但受新技术挑战正经历内涵重塑；国际仲裁则随全球化变局稳步升温。整体来看，热度变化深刻反映了技术驱动、规则博弈和治理重心下沉三大主线，未来各关键词的热度将更加紧密地交织于智能时代法治与合规的大框架之中。";

  const TREND_JUDGMENT_ITEMS = [
    {
      keyword: "平台传播",
      text: "近年来，随着社交媒体、短视频和内容平台的爆发式增长，平台传播相关话题的热度持续走高，尤其围绕算法推荐责任、内容审核与信息茧房等问题的讨论日益激烈。监管政策密集出台（如《互联网信息服务算法推荐管理规定》），推动热度在2021年后显著上升，预计未来将随平台生态演变和合规要求细化而保持高位波动。"
    },
    {
      keyword: "人工智能",
      text: "人工智能是当前热度增长最迅猛的关键词，尤其自2022年底生成式AI爆发以来，热度呈指数级上升。从技术突破到伦理法律争议（如侵权责任、数据训练合规），再到全球治理规则博弈，相关讨论已渗透各行各业。未来数年，热度仍将维持强劲上升趋势，并成为交叉领域（如知识产权、出口管制）的核心驱动因素。"
    },
    {
      keyword: "商标保护",
      text: "商标保护热度长期稳步上升，与市场主体数量增长、品牌意识增强及恶意抢注频发密切相关。近年来，国家知识产权局强化审查和打击囤积行为，加之跨境电商、网红经济催生商标确权纠纷，使该话题保持较高关注度。趋势上，热度将稳中有升，但增速不及人工智能等新兴领域。"
    },
    {
      keyword: "著作权",
      text: "数字内容产业扩张和网络侵权泛滥推动著作权热度持续攀升。近期热点高度集中于人工智能生成内容的可版权性、短视频二创侵权、以及平台避风港规则适用等问题。司法实践中典型案例频出，立法与司法解释亦动态跟进，预计热度将在中长期内继续上行，并呈现与技术发展深度绑定的特征。"
    },
    {
      keyword: "专利治理",
      text: "专利治理热度呈现温和上升态势，重心从「数量扩张」转向「质量提升」与「转化运用」。高价值专利培育、专利池运营、以及标准必要专利（SEP）许可纠纷成为关注焦点。尽管不如人工智能般爆发式增长，但随着科技竞争加剧，企业专利战略和治理能力日益受重视，趋势为平稳增长。"
    },
    {
      keyword: "出口管制",
      text: "受地缘政治紧张和关键技术博弈影响，出口管制热度自2020年前后迅速飙升，成为国际贸易与合规领域的高频词。半导体、AI、量子计算等技术物项的管制措施频繁出台，中国企业合规压力剧增。未来热度将维持高位，并随国际规则演变和区域供应链调整而持续波动。"
    },
    {
      keyword: "国际仲裁",
      text: "全球经贸往来复杂化及「一带一路」倡议下跨境争议增多，推动国际仲裁热度明显上升。尤其是仲裁地与规则选择、裁决跨境执行、以及投资仲裁改革等议题备受关注。近年来热度呈稳健上行趋势，预计会随着企业「走出去」深化及地缘政治风险叠加而继续增长。"
    },
    {
      keyword: "合规治理",
      text: "合规治理热度近年来快速上升，已从传统反腐败、反垄断扩展到数据合规、贸易合规、环境社会治理（ESG）等多元领域。国内外监管力度双加强（如GDPR、《反外国制裁法》），企业普遍设立合规部门，使该词成为企业管理热点。趋势上热度仍处上升通道，未来有望成为常态化高频关注项。"
    },
    {
      keyword: "基层治理",
      text: "在国家推进治理体系和治理能力现代化背景下，基层治理热度持续升温。数字化赋能（如「一网统管」）、网格化管理、矛盾纠纷源头化解等实践探索引发广泛关注。政策文件密集部署，加之乡村振兴和城市社区建设需求，趋势保持明显上升态势。"
    },
    {
      keyword: "纠纷预防",
      text: "作为诉源治理和多元解纷机制的核心环节，纠纷预防热度呈现快速上升趋势。从「枫桥经验」推广到法院系统倡导诉前调解，再到企业合同管理中的风险预警，该词已贯穿法律与社会治理各层面。政策导向明确、实践成效显著，预计热度将继续提升，并逐步融合大数据预警等技术手段。"
    }
  ];

  function renderTrendJudgmentHtml() {
    const keywordCards = TREND_JUDGMENT_ITEMS.map(
      (item) =>
        '<article class="policy-dir-card done"><h4>' +
        item.keyword +
        "</h4><p>" +
        item.text +
        "</p></article>"
    ).join("");
    const summaryCard =
      '<article class="policy-dir-card done"><h4>总结论</h4><p>' +
      TREND_JUDGMENT_SUMMARY +
      "</p></article>";
    return keywordCards + summaryCard;
  }

  function buildTrendEvolutionReport(topics, model) {
    const list = (topics || []).slice();
    const years = (model && model.years) || [];
    const series = ((model && model.series) || []).slice();
    if (!series.length) {
      return {
        overview: "当前暂无可分析的关键词趋势数据，请添加关键词或使用「样本推荐」后查看演进分析与选题建议。",
        macroTrend: "",
        keywords: [],
        suggestions: [],
        risingCount: 0,
        emergingCount: 0,
        hotKeyword: null
      };
    }
    const totals = series.map((line) => line.total).sort((a, b) => b - a);
    const medianTotal = totals[Math.floor(totals.length / 2)] || 1;
    const keywords = series.map((line) => {
      const momentum = analyzeKeywordTrendMomentum(line, years);
      const samples = matchTopicsForTrendKeyword(list, line.keyword, 3);
      const direction = dominantDirectionForKeyword(list, line.keyword);
      const mockTopic = { title: line.keyword, direction: direction, keywords: [line.keyword] };
      const policies = policiesForTopic(mockTopic).slice(0, 2).map((name) => ({ name: name }));
      const saturation = line.total >= medianTotal * 1.4 ? "high" : line.total <= Math.max(1, medianTotal * 0.45) ? "low" : "medium";
      let analysis = "";
      if (momentum.trend === "emerging") {
        analysis = `约 ${line.emergeYear || years[years.length - 1]} 年起进入样本视野，属于新兴议题，近期热度快速抬升。`;
      } else if (momentum.trend === "rising") {
        analysis = `早期样本出现频次较低，近 ${Math.min(3, years.length)} 年明显升温，峰值年份为 ${line.peakYear} 年。`;
      } else if (momentum.trend === "declining") {
        analysis = `曾在 ${line.peakYear} 年前后达到高点，近期出现回落，研究布局需避免简单重复。`;
      } else if (momentum.trend === "established") {
        analysis = `长期保持较高关注度，累计出现 ${line.total} 次，属于领域基础议题。`;
      } else {
        analysis = `整体波动有限，累计出现 ${line.total} 次，适合在稳态基础上寻找新切口。`;
      }
      return Object.assign({}, line, momentum, {
        direction: direction,
        saturation: saturation,
        analysis: analysis,
        samples: samples,
        policies: policies
      });
    });
    const risingCount = keywords.filter((item) => item.trend === "rising" || item.trend === "emerging").length;
    const emergingCount = keywords.filter((item) => item.trend === "emerging").length;
    const hotKeyword = keywords.slice().sort((a, b) => b.total - a.total)[0];
    const yearSpan = years.length ? `${years[0]}—${years[years.length - 1]}` : "—";
    const hotNames = keywords.slice().sort((a, b) => b.total - a.total).slice(0, 3).map((item) => item.keyword);
    const macroTrend = `在 ${yearSpan} 年、${list.length} 项历史课题样本中，当前对比的 ${keywords.length} 个关键词里，有 ${risingCount} 个呈升温或新兴态势，${emergingCount} 个为近年兴起议题。热度居前的是 ${hotNames.join("、") || "—"}，显示法学研究正在向 ${hotNames.slice(0, 2).join("、") || "前沿交叉"} 等方向持续延展。`;
    const overview = hotKeyword
      ? `当前视图聚焦 ${keywords.length} 个关键词，最热为「${hotKeyword.keyword}」（累计 ${hotKeyword.total} 次）。${risingCount > 0 ? `其中 ${risingCount} 个关键词热度上行，值得优先关注演进逻辑与选题空间。` : "整体热度分布较为均衡，可结合细分场景寻找突破口。"}`
      : macroTrend;
    const priorityScore = (item) => {
      let score = 0;
      if (item.trend === "emerging") score += 5;
      if (item.trend === "rising") score += 4;
      if (item.trend === "stable") score += 2;
      if (item.trend === "declining") score += 1;
      if (item.saturation === "low") score += 3;
      if (item.saturation === "medium") score += 2;
      if (item.recentSum > 0) score += 2;
      if (item.total === 0) score += 2;
      return score;
    };
    const angles = ["规范解释", "实证评估", "比较法", "制度衔接", "数字场景", "基层实践"];
    const suggestions = keywords.slice()
      .sort((a, b) => priorityScore(b) - priorityScore(a) || b.recentSum - a.recentSum || b.total - a.total)
      .slice(0, 6)
      .map((item, index) => {
        const angle = angles[(item.keyword.length + index) % angles.length];
        const title = buildTrendTopicTitle(item.keyword, item.direction, item.trend, item.saturation === "high" ? angle : "");
        const priority = index < 2 ? "优先推荐" : index < 4 ? "值得关注" : "备选方向";
        return {
          keyword: item.keyword,
          priority: priority,
          title: title,
          direction: item.direction,
          trendLabel: item.trendLabel,
          rationale: buildTrendSuggestionRationale(item.keyword, item.trend, item.total, item.samples, item.policies),
          angle: angle
        };
      });
    return {
      overview: overview,
      macroTrend: macroTrend,
      keywords: keywords,
      suggestions: suggestions,
      risingCount: risingCount,
      emergingCount: emergingCount,
      hotKeyword: hotKeyword
    };
  }

  window.ResearchPlatformData = {
    TOPICS: TOPICS,
    PROJECT_TYPES: PROJECT_TYPES,
    EXPERTS: EXPERTS,
    LECTURES: LECTURES,
    POLICY: POLICY,
    POLICY_CATALOG: POLICY_CATALOG,
    POLICY_LEVEL_OPTIONS: POLICY_LEVEL_OPTIONS,
    inferPolicyLevel: inferPolicyLevel,
    scorePolicyAlignSimilarity: scorePolicyAlignSimilarity,
    POLICY_CONTENT: POLICY_CONTENT,
    TAG_TO_DIRECTION: TAG_TO_DIRECTION,
    tokenize: tokenize,
    getTopicByTitle: getTopicByTitle,
    getExpertByName: getExpertByName,
    findSimilarTopics: findSimilarTopics,
    findRelatedPolicies: findRelatedPolicies,
    policiesForTopic: policiesForTopic,
    recommendExperts: recommendExperts,
    buildLeadRecommendDetail: buildLeadRecommendDetail,
    buildExpertNetwork: buildExpertNetwork,
    inferDirectionFromTitle: inferDirectionFromTitle,
    buildTopicAnalysisReport: buildTopicAnalysisReport,
    buildPolicyCatalog: buildPolicyCatalog,
    getPolicyDocument: getPolicyDocument,
    getPolicyFocusAreas: getPolicyFocusAreas,
    getPolicyIssues: getPolicyIssues,
    getPolicyGovernanceProblems: getPolicyGovernanceProblems,
    getPolicyCoreKeywords: getPolicyCoreKeywords,
    matchTopicsToGovernanceProblem: matchTopicsToGovernanceProblem,
    analyzePolicyCoverage: analyzePolicyCoverage,
    enrichPolicyItem: enrichPolicyItem,
    parsePolicyYear: parsePolicyYear,
    buildKeywordTrendData: buildKeywordTrendData,
    suggestRelatedTrendKeywords: suggestRelatedTrendKeywords,
    applyTrendDisplayCurves: applyTrendDisplayCurves,
    buildTrendEvolutionReport: buildTrendEvolutionReport,
    renderTrendJudgmentHtml: renderTrendJudgmentHtml,
    DEFAULT_TREND_KEYWORDS: DEFAULT_TREND_KEYWORDS,
    TREND_EVOLUTION_MILESTONES: TREND_EVOLUTION_MILESTONES,
    TREND_KEYWORD_MILESTONES: TREND_KEYWORD_MILESTONES,
    TREND_JUDGMENT_ITEMS: TREND_JUDGMENT_ITEMS,
    TREND_JUDGMENT_SUMMARY: TREND_JUDGMENT_SUMMARY,
    buildKeywordTrendDisplayData: buildKeywordTrendDisplayData,
    TREND_LINE_COLORS: TREND_LINE_COLORS
  };
}());
