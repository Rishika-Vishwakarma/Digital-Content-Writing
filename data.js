/* ============================================
   Digital Content Writing - data.js
   All seed data: Users + 45 Posts
   ============================================ */

// ── Seed data on first load only ──────────────
(function seedDatabase() {

  // Check if already seeded
  if (localStorage.getItem('dcw_seeded')) return;

  const now = Date.now();
  const day = 86400000; // 1 day in ms

  // ── USERS ─────────────────────────────────
  const users = [
    {
      id: 'u1', username: 'admin', password: 'admin',
      role: 'admin', email: 'admin@dcw.com',
      bio: 'Platform Administrator.',
      blocked: false, followers: [], following: [],
      joined: now - day*180, avatar: null
    },
    {
      id: 'u2', username: 'writer1', password: 'pass',
      role: 'writer', email: 'writer1@dcw.com',
      bio: 'Tech & business writer. Writing about AI, startups and the future.',
      blocked: false, followers: ['u6'], following: [],
      joined: now - day*90, avatar: null
    },
    {
      id: 'u3', username: 'PriyaVerma', password: 'pass',
      role: 'writer', email: 'priya@dcw.com',
      bio: 'Travel blogger. 28 countries visited. Rajasthan is my favourite.',
      blocked: false, followers: ['u6'], following: [],
      joined: now - day*75, avatar: null
    },
    {
      id: 'u4', username: 'RishikaJoshi', password: 'pass',
      role: 'writer', email: 'rishika@dcw.com',
      bio: 'STEM educator & science communicator. Making complex topics simple.',
      blocked: false, followers: ['u6'], following: [],
      joined: now - day*60, avatar: null
    },
    {
      id: 'u5', username: 'NikitaMehta', password: 'pass',
      role: 'writer', email: 'nikita@dcw.com',
      bio: 'Health & wellness writer. Certified nutritionist.',
      blocked: false, followers: ['u6'], following: [],
      joined: now - day*45, avatar: null
    },
    {
      id: 'u6', username: 'client1', password: 'pass',
      role: 'client', email: 'client1@dcw.com',
      bio: 'Entrepreneur & startup founder looking for quality content.',
      blocked: false, followers: [],
      following: ['u2','u3','u4','u5'],
      joined: now - day*30, avatar: null
    },
    {
      id: 'u7', username: 'SnehaGupta', password: 'pass',
      role: 'writer', email: 'sneha@dcw.com',
      bio: 'Business strategist turned content writer. Finance & marketing expert.',
      blocked: false, followers: ['u6'], following: [],
      joined: now - day*50, avatar: null
    }
  ];

  // ── POSTS (45 total: 15 articles + 15 blogs + 15 contents) ──

  // Helper to make a comment object
  function cmt(id, userId, text, daysAgo) {
    return { id, userId, text, ts: now - day*daysAgo };
  }

  const posts = [

    // ════════════════════════════════
    // 15 ARTICLES
    // ════════════════════════════════
    {
      id:'a01', authorId:'u2', type:'article', category:'Technology',
      title:'The Rise of Generative AI: Reshaping Every Industry by 2030',
      excerpt:'Generative AI is not just a tech trend — it is a fundamental shift in how humans create, decide, and work.',
      content:'Generative AI has crossed the threshold from research curiosity to business necessity faster than anyone predicted.\n\nBy 2026, AI-generated content accounts for nearly 40% of all digital media produced globally.\n\nThe healthcare industry has felt the impact most profoundly. AI now assists radiologists in detecting cancers invisible to the human eye, with error rates falling by 60% in major clinical trials.\n\nIn education, personalised AI tutors adapt in real time to each student\'s learning pace. Schools report 35% improvements in test scores after introducing adaptive AI systems.\n\nThe creative industries tell a nuanced story. Music producers use AI to generate chord progressions then layer human emotional intelligence on top.\n\nThe most significant challenge is workforce transition. An estimated 85 million jobs will be transformed by AI by 2030 — but 97 million new roles will emerge that did not exist in 2020.\n\nThe organisations that thrive will be those that treat AI as a collaborator, not a replacement.',
      img:'🤖', likes:['u6'],
      comments:[cmt('c1','u6','Incredibly well-researched!',5)],
      shares:18, deleted:false, createdAt: now - day*15
    },
    {
      id:'a02', authorId:'u7', type:'article', category:'Business',
      title:'Why 90% of Startups Fail — And the 10% That Don\'t Do These 7 Things',
      excerpt:'Funding, product-market fit, timing — the myths and realities of startup success told through data.',
      content:'The statistics are brutal: 9 out of 10 startups fail within their first five years.\n\nAfter analysing 500 startup post-mortems and interviewing 200 founders, seven patterns consistently separate survivors from the statistics.\n\nFirst, product-market fit obsession. Successful founders treat PMF as a daily practice — talking to customers before writing a line of code.\n\nSecond, unit economics discipline. Burning cash to acquire customers who cost more to serve than they generate is the fastest path to failure.\n\nThird, team composition. The most common startup killer is co-founder conflict.\n\nFourth, timing intelligence. Being right but early is indistinguishable from being wrong.\n\nFifth, capital efficiency. The startups that last longest on the least capital have the highest survival rates.\n\nSixth, focus ruthlessness. Do one thing extraordinarily well first.\n\nSeventh, founder psychology. Resilience and learning velocity predict founder success better than intelligence.',
      img:'📈', likes:['u6','u3'],
      comments:[cmt('c2','u3','Strategy 6 saved my business!',2)],
      shares:32, deleted:false, createdAt: now - day*14
    },
    {
      id:'a03', authorId:'u4', type:'article', category:'Education',
      title:'The Future of Learning: How EdTech Is Democratising Education',
      excerpt:'Khan Academy, Coursera, and now AI tutors — education is being reimagined for 1.5 billion learners.',
      content:'For most of human history, access to quality education was determined by geography and wealth. EdTech is dismantling this inequity at unprecedented scale.\n\nKhan Academy now serves 140 million learners across 190 countries. Coursera has partnered with 325 universities to offer accredited degrees at a fraction of traditional cost.\n\nBut the real revolution is AI-powered personalisation. Traditional classrooms operate on the batch processing model — one teacher, 30 students, one pace.\n\nAI tutors break this model completely. They identify where each student is struggling and deliver targeted micro-lessons.\n\nResults from pilot programmes are striking. Students using AI-assisted learning in rural Maharashtra showed 40% higher comprehension scores after six months.\n\nThe most successful EdTech interventions complement rather than replace human teachers and design for low-bandwidth environments.',
      img:'📚', likes:['u6','u2'],
      comments:[cmt('c3','u2','The Maharashtra example is inspiring!',3)],
      shares:24, deleted:false, createdAt: now - day*13
    },
    {
      id:'a04', authorId:'u5', type:'article', category:'Health',
      title:'The Science of Sleep: Why 7-9 Hours Is Non-Negotiable',
      excerpt:'Sleep deprivation costs the global economy $411 billion annually. It is silently destroying your health.',
      content:'We live in a culture that romanticises sleep deprivation. The irony is that chronically sleeping less than 7 hours significantly increases the likelihood of dying sooner.\n\nSleep is not passive recovery. It is the most anabolically active period of your life — when your brain consolidates memories and your immune system mounts its defences.\n\nA landmark 2019 study found that sleeping 6 hours or fewer for 25 consecutive years was associated with a 30% increased risk of dementia.\n\nAfter 17 hours without sleep, reaction time matches that of someone with a blood alcohol level of 0.05%.\n\nWhat optimises sleep? Temperature is the most underrated lever. A bedroom of 18-19°C consistently produces the deepest sleep.\n\nCaffeine has a half-life of 5-7 hours. A coffee at 3pm means half is still in your system at 10pm.\n\nInvesting in sleep is the highest-return health investment available.',
      img:'🌙', likes:['u6','u3','u2'],
      comments:[cmt('c4','u3','Changed how I think about sleep!',1)],
      shares:45, deleted:false, createdAt: now - day*12
    },
    {
      id:'a05', authorId:'u2', type:'article', category:'Technology',
      title:'Web3 and the Decentralised Internet: Promise vs Reality',
      excerpt:'Blockchain, NFTs, DeFi — separating genuine innovation from hype in the most contested tech narrative.',
      content:'Web3 has been called everything from the future of the internet to the greatest financial scam in history.\n\nThe core promise is compelling: an internet where users own their data and creators capture the value they generate.\n\nDecentralised Finance has created financial services accessible to anyone with a smartphone — important for the 1.4 billion unbanked adults globally.\n\nSmart contracts are reducing settlement times in trade finance from days to seconds and cutting costs by up to 80%.\n\nBut the gap between promise and reality is substantial. Blockchain networks are slow and expensive during peak demand.\n\nThe more measured view is that distributed ledger technology will become infrastructure for specific high-value use cases: cross-border payments, supply chain verification, and digital identity.',
      img:'🔗', likes:['u6'],
      comments:[], shares:12, deleted:false, createdAt: now - day*11
    },
    {
      id:'a06', authorId:'u4', type:'article', category:'Education',
      title:'Critical Thinking in the Age of Misinformation',
      excerpt:'When anyone can publish anything, the ability to evaluate sources becomes the most important skill.',
      content:'In 1990, the challenge was finding enough information. Today, the challenge is navigating 300 million search results and algorithmically curated feeds designed to maximise engagement, not accuracy.\n\nA 2022 Stanford study found that 82% of middle school students could not distinguish between a native advertisement and a news story.\n\nCritical thinking has never been more urgent.\n\nThe most effective programmes teach lateral reading — opening multiple tabs to verify a source before reading it deeply.\n\nFinland has gone furthest. Its national curriculum explicitly teaches media literacy at every school level.\n\nThe goal is calibrated confidence: knowing when to trust and when to verify, proportional to the stakes involved.',
      img:'🧠', likes:['u6','u5'],
      comments:[cmt('c5','u5','Every teacher should read this!',2)],
      shares:28, deleted:false, createdAt: now - day*10
    },
    {
      id:'a07', authorId:'u7', type:'article', category:'Business',
      title:'Remote Work Revolution: Three Years On — What the Data Shows',
      excerpt:'Companies claimed remote work would destroy productivity. The data tells a far more complex story.',
      content:'When COVID-19 forced the largest work-from-home experiment in history, most executives predicted disaster. Three years of data later, the reality is considerably more nuanced.\n\nA Stanford study found that remote workers were 13% more productive on individual tasks, primarily due to eliminated commuting and reduced interruptions.\n\nBut productivity on collaborative tasks tells a different story. Research found that remote work significantly reduced the formation of new cross-team connections.\n\nThe mental health picture is mixed. Reduced commuting and greater flexibility are genuine wins. But loneliness and the blurring of work-life boundaries are equally documented problems.\n\nThe organisations that have navigated this transition most successfully share one characteristic: intentionality.',
      img:'💻', likes:['u6','u3'],
      comments:[cmt('c6','u6','Our company went hybrid and productivity is up.',4)],
      shares:35, deleted:false, createdAt: now - day*9
    },
    {
      id:'a08', authorId:'u5', type:'article', category:'Health',
      title:'Mental Health at Work: Breaking the Silence That Costs $1 Trillion',
      excerpt:'Depression and anxiety cost more than all cancers combined. Why are organisations still ignoring this?',
      content:'The World Health Organization estimates that depression and anxiety disorders cost the global economy $1 trillion in lost productivity annually.\n\nEvery dollar invested in workplace mental health programmes returns $4, according to WHO research. Yet 71% of employees report that mental health support at their organisation is inadequate.\n\nLeadership modelling is the most powerful intervention. When senior leaders speak openly about their mental health experiences, it reduces stigma more effectively than any campaign.\n\nFlexibility over working hours and location has a larger impact than formal mental health programmes in most studies. Autonomy is protective.\n\nThe systemic causes — overwork, toxic management, lack of control — must be addressed alongside individual support.',
      img:'🧘', likes:['u6','u2','u4'],
      comments:[cmt('c7','u4','Every HR department needs to read this.',1)],
      shares:52, deleted:false, createdAt: now - day*8
    },
    {
      id:'a09', authorId:'u2', type:'article', category:'Technology',
      title:'Cybersecurity in 2026: The Threats You Need to Know',
      excerpt:'Ransomware attacks increased 150% in 2025. AI-powered phishing is indistinguishable from real email.',
      content:'Cybersecurity is no longer an IT concern — it is a board-level risk and national security issue.\n\nAI-generated phishing emails now perfectly mimic the writing style of actual colleagues. Detection rates by traditional tools have dropped below 30%.\n\nRansomware attacks on critical infrastructure increased 150% between 2024 and 2025. The average ransom payment exceeded $4 million.\n\nFor individuals, the most significant new threat is AI-powered voice cloning. With 30 seconds of audio, criminals can generate convincing audio of any person.\n\nFor organisations, zero-trust architecture has moved from aspiration to operational necessity — no device or user is trusted by default, regardless of network location.',
      img:'🔐', likes:['u6'],
      comments:[], shares:19, deleted:false, createdAt: now - day*7
    },
    {
      id:'a10', authorId:'u4', type:'article', category:'Education',
      title:'STEM Crisis: Why India Produces Engineers But Not Innovators',
      excerpt:'India graduates 1.5 million engineers annually yet ranks 81st globally in innovation. Why?',
      content:'India has the largest engineering education system in the world. Yet India ranks 81st on the Global Innovation Index.\n\nIndian engineering education optimises for examination performance rather than problem-solving ability. Students memorise solutions rather than developing underlying intuition.\n\nOver 80% of engineering graduates are considered unemployable in their core discipline by industry standards, according to NASSCOM research.\n\nIn a country where a government job represents significant social mobility, risk-taking — the foundation of innovation — is economically punished.\n\nIIT alumni account for a disproportionate share of Indian innovation, not because IIT students are more talented, but because IIT creates an environment where intellectual curiosity is celebrated.',
      img:'🔬', likes:['u6','u7'],
      comments:[cmt('c8','u7','Having worked in Indian tech for 10 years, this is spot on.',2)],
      shares:41, deleted:false, createdAt: now - day*6
    },
    {
      id:'a11', authorId:'u7', type:'article', category:'Business',
      title:'Personal Finance Mastery: 5 Rules That Will Make You Wealthy',
      excerpt:'Wealth is about the gap between what you earn and what you spend, invested consistently.',
      content:'The path to wealth is boringly simple — and precisely because it is boring, most people do not follow it.\n\nRule one: Spend less than you earn. This requires confronting the social pressures that cause most people to spend exactly as much as they earn.\n\nRule two: Invest the difference automatically. Every month, move a fixed percentage to investment accounts. Start with 10%, target 20-30%.\n\nRule three: Diversify into low-cost index funds. 92% of actively managed funds underperform their benchmark over 15-year periods.\n\nRule four: Never interrupt compound growth. ₹10,000 invested monthly at 10% for 30 years grows to ₹2.3 crore. For 20 years, only ₹76 lakhs. Time is irreplaceable.\n\nRule five: Build an emergency fund first. Six months of living expenses prevents liquidating investments at the worst possible time.',
      img:'💰', likes:['u6','u4','u3'],
      comments:[cmt('c9','u4','Started an SIP after reading this!',1)],
      shares:67, deleted:false, createdAt: now - day*5
    },
    {
      id:'a12', authorId:'u5', type:'article', category:'Health',
      title:'The Gut-Brain Connection: How Your Microbiome Controls Your Mood',
      excerpt:'95% of your serotonin is produced in your gut, not your brain. This changes everything.',
      content:'The gut microbiome — the trillions of bacteria inhabiting your digestive tract — produces over 90% of the body\'s serotonin, critical for mood regulation and sleep.\n\nThe vagus nerve transmits signals between the brain and gut. Disruptions in gut microbiome composition send inflammatory signals to the brain, contributing to depression and cognitive decline.\n\nIndividuals with more diverse gut microbiomes consistently report lower rates of anxiety and depression.\n\nWhat builds microbiome diversity? Fibre from at least 30 different plant species weekly is the most evidence-supported intervention. Fermented foods introduce beneficial bacteria directly.\n\nWe are at the beginning of a revolution in how we understand both physical and mental illness.',
      img:'🦠', likes:['u6','u2'],
      comments:[], shares:38, deleted:false, createdAt: now - day*4
    },
    {
      id:'a13', authorId:'u2', type:'article', category:'Technology',
      title:'Electric Vehicles in India: The Infrastructure Gap',
      excerpt:'India has bold EV targets. But with fewer than 12,000 public charging stations, challenges are huge.',
      content:'India has set an ambitious EV target: 30% of all vehicle sales to be electric by 2030.\n\nAs of 2026, India has approximately 12,000 public EV charging stations. China has 1.8 million. The United States has 130,000.\n\nThe challenge is distributional. Urban centres have reasonable coverage. Tier 2 and 3 cities have virtually none.\n\nBattery swapping networks offer a faster alternative suited to high-density environments.\n\nRange anxiety remains the primary psychological barrier. Current infrastructure does not yet provide the redundancy needed for reliable long-distance travel.\n\nThe 2030 target is achievable — but requires treating charging infrastructure with the urgency India brought to building roads and mobile networks.',
      img:'⚡', likes:['u6','u5'],
      comments:[cmt('c10','u5','Great overview of this infrastructure problem.',3)],
      shares:29, deleted:false, createdAt: now - day*3
    },
    {
      id:'a14', authorId:'u4', type:'article', category:'Education',
      title:'Montessori to Mainstream: 100 Years of Research on How Children Learn',
      excerpt:'Maria Montessori developed her method in 1907. A century of research validates what she saw.',
      content:'Maria Montessori opened her first school in 1907 in a low-income housing project in Rome. Working with children others had written off, she developed a method based on careful observation.\n\nNeuroscience has largely validated her intuitions. Children in Montessori environments — where they choose activities and learn from doing — show stronger outcomes on executive function and mathematics.\n\nThe traditional classroom model is actually inconsistent with how the brain consolidates learning. Physical movement enhances memory formation. Intrinsic motivation activates the dopamine systems that make learning stick.\n\nYet Montessori education remains largely confined to private schools — a profound irony, given that Montessori designed her method for the poorest children.\n\nPublic school systems that have adopted Montessori principles report dramatic improvements, with the largest gains among disadvantaged students.',
      img:'🎓', likes:['u6','u5'],
      comments:[], shares:22, deleted:false, createdAt: now - day*2
    },
    {
      id:'a15', authorId:'u7', type:'article', category:'Business',
      title:'Creator Economy in India: How 50 Million Creators Are Building New Businesses',
      excerpt:'India\'s creator economy has crossed $1 billion. Here is how ordinary people build extraordinary income.',
      content:'Five years ago, "content creator" was not a career most Indian parents would recognise. Today, an estimated 50 million creators generate income from digital content in India.\n\nThe most successful Indian creators share characteristics: they occupy a specific niche, publish consistently, treat their audience as a community, and diversify revenue streams early.\n\nLanguage is a significant opportunity. Hindi, Tamil, Telugu, Bengali, and Marathi content markets are growing 3-4x faster than English in India.\n\nThe creator economy represents a fundamental shift. For the first time, extraordinary creative skills can translate directly into income without institutional gatekeepers.',
      img:'📱', likes:['u6','u2','u4'],
      comments:[cmt('c11','u2','The language opportunity point is key!',1)],
      shares:58, deleted:false, createdAt: now - day*1
    },

    // ════════════════════════════════
    // 15 BLOGS
    // ════════════════════════════════
    {
      id:'b01', authorId:'u3', type:'blog', category:'Travel',
      title:'48 Hours in Jaisalmer: The Desert City That Will Steal Your Heart',
      excerpt:'Golden sandstone forts, camel safaris at sunset, and chai with strangers — a Rajasthan story.',
      content:'The train from Jodhpur arrives in Jaisalmer just before dawn. I pressed my face against the window and stayed there until the station lights appeared.\n\nJaisalmer unfolds at the pace of the desert — unhurried and indifferent to the concept of efficiency.\n\nDay one begins before sunrise at the Sonar Qila — the Golden Fort. 3,000 people live inside in havelis that have been in families for generations. Narrow lanes lead to workshops where artisans produce silver jewellery using Mughal-era techniques.\n\nThe camel safari at sunset is the most photographed experience in Jaisalmer for a reason. Watching the Thar Desert turn from gold to crimson to violet, I understand why people describe deserts as spiritual experiences.\n\nDay two I spend almost entirely eating. Dal bhaati churma. The best chai of my life, served by a man who has been making it the same way for forty years.',
      img:'🏜️', likes:['u6','u2','u4'],
      comments:[cmt('c12','u2','Adding this to my travel list immediately!',3)],
      shares:41, deleted:false, createdAt: now - day*14
    },
    {
      id:'b02', authorId:'u5', type:'blog', category:'Health',
      title:'I Did a 30-Day Digital Detox and Here Is What Actually Happened',
      excerpt:'No social media, no news, limited email. One month without internet noise changed everything.',
      content:'The rules I set were specific: no social media, no news websites, no streaming beyond one hour per evening.\n\nWeek one was genuinely uncomfortable. My hands reached for my phone constantly. The phantom notification feeling was persistent.\n\nBy day ten, something shifted. Meals became longer — I was actually tasting food. Conversations became more complete.\n\nSleep improved dramatically. My sleep tracker showed deep sleep increasing from 47 minutes to 1 hour 23 minutes by the end of week two.\n\nCreativity increased in ways I had not expected. Ideas came during walks and showers.\n\nThe anxiety finding surprised me most. The absence of a constant stream of crises produced a baseline calm I had forgotten was possible.\n\nI have kept several habits: no phone for the first and last hours of each day, social media only on desktop, no news after 7pm.',
      img:'📵', likes:['u6','u7'],
      comments:[cmt('c13','u7','Starting my own version next Monday.',2)],
      shares:76, deleted:false, createdAt: now - day*13
    },
    {
      id:'b03', authorId:'u3', type:'blog', category:'Travel',
      title:'Solo Female Travel in India: The Honest Guide Nobody Writes',
      excerpt:'Eight years of solo travel across 22 Indian states — the beautiful, the challenging, and what works.',
      content:'I want to write the guide I wish existed when I first decided to travel India alone at 24. The honest version.\n\nThe best states for first-time solo female travellers: Kerala, Himachal Pradesh, Rajasthan, and Meghalaya.\n\nTransportation: overnight sleeper trains are generally safe in 2AC and 3AC berths. App-based cabs are dramatically safer than negotiating with random auto drivers.\n\nAccommodation: read the most recent reviews specifically from solo female travellers. Issues that matter are systematically noted by this reviewer group.\n\nThe harassment question: it exists and varies enormously by location. The most effective management strategy is confident, loud, public assertion — not shrinking.\n\nAnd the beauty: no form of travel has given me more access to India\'s genuine complexity — its hospitality, contradictions, food, and regional cultures — than moving alone.',
      img:'🌺', likes:['u4','u6'],
      comments:[cmt('c14','u6','Thank you for the honest perspective.',1)],
      shares:89, deleted:false, createdAt: now - day*12
    },
    {
      id:'b04', authorId:'u2', type:'blog', category:'Technology',
      title:'I Switched to Linux After 15 Years on Windows — My Honest Review',
      excerpt:'A software engineer\'s experience making the complete switch: what works and what breaks.',
      content:'After fifteen years of Windows, I made the switch to Ubuntu 24.04 in January 2026.\n\nThe motivation: Windows 11 forcing a Microsoft account for setup, aggressive advertising in the start menu, and professional curiosity.\n\nThe installation was the smoothest OS installation I have experienced. Thirty minutes and a working system.\n\nThe experience for a developer is excellent. The terminal is first-class, package management is faster, and Docker running natively makes a meaningful performance difference.\n\nThe challenges are real. About 15% of my Steam library simply does not run. Adobe software is not available — I switched to Affinity.\n\nMy verdict: for developers who do not depend on specific Windows-only software, Linux is genuinely excellent as a daily driver.',
      img:'🐧', likes:['u6'],
      comments:[cmt('c15','u6','The Adobe situation keeps me on Windows.',3)],
      shares:34, deleted:false, createdAt: now - day*11
    },
    {
      id:'b05', authorId:'u7', type:'blog', category:'Business',
      title:'My First Year as a Freelancer: The Financial Reality Nobody Talks About',
      excerpt:'₹2.5 lakhs in savings, zero clients, and a lot of confidence. Here is what actually happened.',
      content:'Everyone has a "I quit my corporate job" story. Mine starts with ₹2.5 lakhs in savings and the realisation that confidence is not the same as a client pipeline.\n\nMonth one: I sent 47 proposals. Received responses from 3. Converted 1, for a ₹15,000 project.\n\nMonths three and four were the turning point. I stopped sending cold proposals and invested in relationships. I wrote two pieces of useful content weekly on LinkedIn.\n\nBy month six, I had three retainer clients and income slightly below my former salary.\n\nAt twelve months, I earned more than my corporate salary for the first time. More significantly, I had control over my time.\n\nFinancial advice I wish I had: extend your savings runway estimate by 50%. Build the client pipeline six months before you quit.',
      img:'💼', likes:['u6','u4'],
      comments:[cmt('c16','u4','The pricing insight is worth a thousand posts.',2)],
      shares:93, deleted:false, createdAt: now - day*10
    },
    {
      id:'b06', authorId:'u3', type:'blog', category:'Travel',
      title:'Coorg in Monsoon: The Karnataka Instagram Won\'t Show You',
      excerpt:'Most visitors come in winter. I came in July for the rain and fog and found something extraordinary.',
      content:'Coorg in July is genuinely inadvisable by most practical measures. The roads flood. Leeches are a constant companion on any forest walk.\n\nI came anyway, because a friend told me Coorg in monsoon is like a completely different country.\n\nThe coffee estates in June-July are a specific shade of green that does not exist at any other time — luminous, deep, and slightly unreal.\n\nThe waterfalls are the obvious attraction. Abbey Falls, which in December is a pleasant cascade, becomes in July a roaring force that drenches you fifty metres away.\n\nBut the real reason to come in monsoon is the solitude. The crowds of peak season are entirely absent.\n\nPractical advice: stay in the hills rather than the valleys. Waterproof everything.',
      img:'☕', likes:['u6','u5'],
      comments:[], shares:27, deleted:false, createdAt: now - day*9
    },
    {
      id:'b07', authorId:'u5', type:'blog', category:'Health',
      title:'Learning to Cook at 32: How Six Months in the Kitchen Changed My Health',
      excerpt:'A nutritionist who never cooked discovers that knowing food science and cooking are two different skills.',
      content:'This is somewhat embarrassing to admit: I am a certified nutritionist who, until the age of 32, essentially did not cook.\n\nI understood food at a molecular level but did not make it myself.\n\nThe catalyst was moving to a city where my usual restaurants were not available. I bought Salt, Fat, Acid, Heat and committed to cooking every dinner for six months.\n\nConfirmed: ultra-processed food tastes the way it does because of extraordinary quantities of salt, fat, and sugar. The palatability is manufactured.\n\nComplicated: the relationship between "healthy" and "delicious" is far more achievable with fresh ingredients than my clients believed.\n\nBy month three, I was hosting dinner parties. By month six, I had twenty dishes I could make confidently in under forty-five minutes.',
      img:'🥗', likes:['u6','u2','u7'],
      comments:[cmt('c17','u7','Salt Fat Acid Heat is the perfect first cookbook.',1)],
      shares:54, deleted:false, createdAt: now - day*8
    },
    {
      id:'b08', authorId:'u2', type:'blog', category:'Technology',
      title:'Building My First SaaS: 6 Months, ₹80,000, and 200 Paying Customers',
      excerpt:'A software engineer\'s honest account of building a bootstrapped SaaS — every mistake included.',
      content:'In July 2025, I had an idea for a tool solving a specific problem: tracking reading lists without friction. Six months later, ReadStack had 200 paying subscribers at ₹499/month.\n\nValidation took three weeks. I posted in communities asking if this problem was real. 47 people said they would pay. I built nothing except a landing page with a waitlist.\n\nThe MVP took six weeks of evenings and weekends. Infrastructure cost in month one: ₹3,200.\n\nLaunch was underwhelming. Product Hunt gave me 50 signups in two days, then nothing.\n\nGrowth came from content. I wrote weekly posts about reading habits. Organic search became my largest acquisition channel by month four.\n\nChurn in months one and two was my most useful teacher. I fixed the top issues. Churn dropped from 18% to 6%.',
      img:'🚀', likes:['u6','u7'],
      comments:[cmt('c18','u7','The churn interview insight is gold.',2)],
      shares:112, deleted:false, createdAt: now - day*7
    },
    {
      id:'b09', authorId:'u7', type:'blog', category:'Business',
      title:'What Working Under India\'s Best Startup Founder Taught Me About Leadership',
      excerpt:'Three years as Chief of Staff to a unicorn founder — counterintuitive lessons no MBA teaches.',
      content:'Between 2022 and 2025, I worked directly for the founder of a company that grew from ₹50 crore to ₹2,000 crore valuation.\n\nLesson one: great leaders make decisions faster than feels comfortable. A good decision today beats a perfect decision next month.\n\nLesson two: the most important skill is not strategy — it is prioritisation. When every problem is urgent, none can be addressed well.\n\nLesson three: trust is built in small moments. Following up on commitments. Remembering context from previous conversations.\n\nLesson four: the founder was not the smartest person in every room, and knew it. Deliberately hiring people more capable than yourself is harder than it sounds.\n\nLesson five: the real cost of leadership is carried quietly.',
      img:'🎯', likes:['u6','u4','u5'],
      comments:[cmt('c19','u4','Lesson 3 changed how I manage.',1)],
      shares:78, deleted:false, createdAt: now - day*6
    },
    {
      id:'b10', authorId:'u3', type:'blog', category:'Travel',
      title:'Two Weeks in Meghalaya: India\'s Most Underrated State',
      excerpt:'Living root bridges, waterfalls that fall into clouds, and a matrilineal culture unlike anything in India.',
      content:'I arrived in Shillong in fog so dense the landscape appeared and disappeared like a slow hallucination.\n\nMeghalaya — "the abode of clouds" — receives more rainfall than almost anywhere on Earth. The landscape is prehistoric in its lushness.\n\nThe living root bridges of the Khasi people are among the greatest examples of ecological engineering in history. Over 500 years, communities have trained the roots of rubber trees across streams, creating bridges that grow stronger with time.\n\nMeghalaya is the only matrilineal society in modern India. Property passes through the female line. Meeting women who lead their communities with matter-of-fact confidence was quietly profound.\n\nThe food is the most distinctive in India. Jadoh — rice cooked with ginger — is the staple.',
      img:'🌿', likes:['u6','u2'],
      comments:[cmt('c20','u2','The root bridges are on my list.',4)],
      shares:63, deleted:false, createdAt: now - day*5
    },
    {
      id:'b11', authorId:'u5', type:'blog', category:'Health',
      title:'Running My First Marathon at 38: Training, Tears, and What I Learned',
      excerpt:'From couch to 42.2 kilometres in fourteen months. The physical training is the easy part.',
      content:'Fourteen months ago, I could not run for twenty minutes without stopping. On Sunday, I crossed the finish line of the Mumbai Marathon in 4 hours 42 minutes, sobbing.\n\nThe training programme was an 18-week plan with a 12-month base-building phase.\n\nWeek eight: a knee injury from increasing mileage too quickly. Three weeks of rest. This is where most new runners quit.\n\nWeek fifteen: the twenty-two mile long run. At mile seventeen, something breaks down that is not physical. It is a negotiation with yourself about whether you actually want to do this.\n\nHealth changes over fourteen months: 8 kg weight loss, blood pressure normalising, resting heart rate dropping from 74 to 54 BPM.\n\nThe unexpected change was psychological. Running long distances teaches you that you are capable of significantly more than you believe.',
      img:'🏃', likes:['u6','u7'],
      comments:[], shares:82, deleted:false, createdAt: now - day*4
    },
    {
      id:'b12', authorId:'u2', type:'blog', category:'Technology',
      title:'My Honest Review of 6 AI Coding Assistants After 3 Months',
      excerpt:'GitHub Copilot, Cursor, Claude, ChatGPT, Gemini, Tabnine — which one actually makes you better?',
      content:'I spent three months systematically using six AI coding assistants. Here is my unsponsored assessment.\n\nGitHub Copilot: most seamlessly integrated. Best for routine code completion and boilerplate reduction.\n\nCursor: the biggest surprise. Full-codebase context awareness is qualitatively better than anything else I tested. Best for complex multi-file work.\n\nClaude: the best at explaining code and architectural reasoning. Best for code review and debugging.\n\nChatGPT: impressive breadth but inconsistent depth. Best for learning new technologies.\n\nGemini: strongest at reading large documents. Best for documentation-heavy work.\n\nTabnine: most privacy-respecting option. Best for organisations with strict data compliance requirements.',
      img:'🤖', likes:['u6','u4'],
      comments:[cmt('c21','u4','Trying Cursor this week.',2)],
      shares:147, deleted:false, createdAt: now - day*3
    },
    {
      id:'b13', authorId:'u7', type:'blog', category:'Business',
      title:'The Art of Saying No: How Declining Requests Transformed My Career',
      excerpt:'Three years ago I could not say no to anything professional. Here is how systematic practice changed me.',
      content:'I said yes to everything for the first six years of my career. I was reliably described as a team player. I was also chronically overcommitted.\n\nThe shift began with a simple exercise: listing every commitment from the previous month and categorising each as moving towards or away from my most important goals. 70% fell in the second category.\n\nI started with small noes: declining meeting invitations where my presence was not necessary. Then medium noes. Then hard noes.\n\nThe consequences I feared did not materialise. The opposite happened. Senior colleagues respected the transparency. I was promoted within six months of establishing boundaries.\n\nThe formula: acknowledge the request, explain briefly why you cannot help, offer an alternative if one exists.',
      img:'🚫', likes:['u6','u4','u5'],
      comments:[cmt('c22','u5','The meeting decline point is worth implementing today.',1)],
      shares:95, deleted:false, createdAt: now - day*2
    },
    {
      id:'b14', authorId:'u3', type:'blog', category:'Travel',
      title:'Budget Travel in Leh-Ladakh: A Complete Guide for Under ₹25,000',
      excerpt:'High-altitude adventure does not require a luxury tour. 12 days in Ladakh for less than most spend in 3.',
      content:'Ladakh has developed a reputation as expensive. The reality is it can be done beautifully on a modest budget.\n\nGetting there: the state transport bus from Manali (₹700, 22 hours, spectacular road journey) or the Leh-Delhi flight booked 60+ days in advance.\n\nAccommodation in Leh: the old town has family guesthouses at ₹500-800 per night with home-cooked food.\n\nFor Nubra and Pangong: village homestays at ₹600-1000 including meals. The money goes directly to rural families.\n\nFood: momos, thukpa, and Ladakhi butter tea at local dhabas cost ₹100-200 per meal.\n\nShared jeeps cost 20-30% of private hire and put you next to local people.\n\nMy 12-day total including all transport from Delhi: ₹23,400.',
      img:'🏔️', likes:['u6','u2'],
      comments:[cmt('c23','u2','This is exactly the guide I needed.',3)],
      shares:137, deleted:false, createdAt: now - day*1
    },
    {
      id:'b15', authorId:'u4', type:'blog', category:'Education',
      title:'What 5 Years of Teaching in Dharavi Taught Me About Learning',
      excerpt:'After five years teaching mathematics in Mumbai\'s Dharavi, I understand education differently.',
      content:'I started teaching in Dharavi in 2020, as a 23-year-old with the certainty about "making a difference" that only accompanies the inexperienced.\n\nThe first thing Dharavi taught me: intelligence is evenly distributed across economic classes, while opportunity is not.\n\nThe second: hunger is the most powerful disruption to learning. Providing a mid-morning snack produced more improvement than any pedagogical intervention I implemented.\n\nThe third: parent aspiration is not the barrier. The barriers are practical — cost of materials and the need for older children to contribute economically.\n\nThe fourth: education flows in both directions. The children of Dharavi have taught me more about resilience and community than anything in my formal education.',
      img:'🌟', likes:['u6','u5','u7'],
      comments:[cmt('c24','u7','The hunger point is so underappreciated in policy.',2)],
      shares:104, deleted:false, createdAt: now - day*0
    },

    // ════════════════════════════════
    // 15 CONTENTS
    // ════════════════════════════════
    {
      id:'ct01', authorId:'u2', type:'content', category:'Technology',
      title:'Python for Data Science: From Beginner to Job-Ready in 90 Days',
      excerpt:'A structured 90-day curriculum with projects, resources, and the exact skills employers need in 2026.',
      content:'Python is the lingua franca of data science. Here is a realistic 90-day path to employable skills.\n\nDays 1-20: Python Fundamentals. Variables, data types, control flow, functions, OOP basics. Resources: Python.org tutorial, CS50P on edX. Practice: 30 minutes daily on LeetCode Easy.\n\nDays 21-45: Data Manipulation. NumPy for numerical computing, Pandas for structured data, Matplotlib and Seaborn for visualisation. Project: Analyse a Kaggle dataset and write a report.\n\nDays 46-70: Machine Learning. Scikit-learn for classical ML: regression, classification, clustering. Project: Build a predictive model and deploy as a FastAPI endpoint.\n\nDays 71-90: Specialisation. Choose one: computer vision (PyTorch), NLP (HuggingFace), or time series (Prophet).\n\nJob-readiness: you can take a raw dataset, clean it, explore it, build a model, evaluate it honestly, and communicate findings to a non-technical audience.',
      img:'🐍', likes:['u6','u4','u5'],
      comments:[cmt('c25','u4','This roadmap is exactly what I needed.',5)],
      shares:203, deleted:false, createdAt: now - day*15
    },
    {
      id:'ct02', authorId:'u7', type:'content', category:'Business',
      title:'Content Marketing Playbook 2026: The Complete Strategy Guide',
      excerpt:'Algorithm changes, AI content flood — the complete playbook that actually works in 2026.',
      content:'Content marketing in 2026 operates in a fundamentally different environment. The brands winning share five commitments.\n\nFirst: original research. Surveys and first-party data produce content AI cannot replicate.\n\nSecond: specific, helpful, expert content. Google\'s EEAT framework rewards content where a real expert answers a specific question better than any alternative.\n\nThird: community building over broadcasting. Engaged communities have distribution algorithm changes cannot affect.\n\nFourth: video with intention. YouTube remains the second largest search engine. Educational video finds audiences harder to reach through text.\n\nFifth: content operations. The infrastructure enabling consistent, high-quality production determines whether a strategy compounds over time.\n\nThe content audit is the most neglected starting point.',
      img:'📋', likes:['u6','u4'],
      comments:[], shares:88, deleted:false, createdAt: now - day*14
    },
    {
      id:'ct03', authorId:'u4', type:'content', category:'Education',
      title:'How to Study for Competitive Exams: A Science-Based Guide',
      excerpt:'Spaced repetition, active recall — the neuroscience of exam preparation that top scorers actually use.',
      content:'Most students study by re-reading notes and highlighting textbooks. This is among the least effective study strategies.\n\nSpaced repetition exploits the Ebbinghaus Forgetting Curve. Reviewing at intervals of 1 day, 3 days, 7 days, 21 days, and 60 days produces roughly five times better retention than massed sessions.\n\nAnki is the free, research-validated software implementation of spaced repetition. It is equally applicable to UPSC, JEE, NEET, or CAT.\n\nActive recall — testing yourself on material rather than reviewing it — is the most evidence-supported study method. Close your notes and write everything you remember. Do past papers before you feel ready.\n\nInterleaving — mixing different topics within a single session — produces worse immediate performance but better exam-day performance.\n\nSleep is not optional. Memory consolidation happens during sleep.',
      img:'📖', likes:['u6','u2','u5'],
      comments:[cmt('c26','u5','Sharing this with every student I work with.',3)],
      shares:178, deleted:false, createdAt: now - day*13
    },
    {
      id:'ct04', authorId:'u5', type:'content', category:'Health',
      title:'Nutrition for Busy Professionals: Eating Well When You Have No Time',
      excerpt:'Practical, evidence-based nutrition for people who work long hours and cannot cook every night.',
      content:'Strategy one: anchor on protein. If every meal has an adequate protein source — eggs, legumes, fish, paneer — the rest is forgiving.\n\nStrategy two: batch cook one ingredient, not full meals. Cooking chickpeas or a tray of roasted vegetables takes twenty minutes and provides the backbone of multiple meals.\n\nStrategy three: simplify breakfast. The breakfast actually eaten every day is vastly superior to the optimal breakfast skipped three times per week. Greek yoghurt with fruit takes two minutes.\n\nStrategy four: understand airport food. Greek yoghurt, nuts, fruit, eggs, and sushi are almost universally available. The mistake is arriving hungry.\n\nStrategy five: reframe "healthy eating" as choosing minimally processed foods most of the time. One unhealthy meal does not derail anything.',
      img:'🥑', likes:['u6','u7'],
      comments:[cmt('c27','u7','The protein anchor strategy is so simple and effective.',2)],
      shares:124, deleted:false, createdAt: now - day*12
    },
    {
      id:'ct05', authorId:'u2', type:'content', category:'Technology',
      title:'React in 2026: What Still Matters and What You Can Safely Ignore',
      excerpt:'The React ecosystem has evolved dramatically. Here is what to actually learn and build with.',
      content:'React\'s core API has remained remarkably stable while the ecosystem has evolved. Here is what matters for production applications in 2026.\n\nEssential: React 19 hooks — useState, useEffect, useContext, useReducer, and the new use() hook. Server Components — understanding when to use server versus client components is now fundamental.\n\nFor state management: React\'s built-in state with useContext is sufficient for most applications. When it is not, Zustand for simple global state and TanStack Query for server state handle 95% of requirements.\n\nFor full-stack React: Next.js 15 is the production-ready choice. The App Router architecture is the current standard.\n\nFor styling: Tailwind CSS has become the dominant approach in production codebases.\n\nSafely ignorable in 2026: most state management libraries beyond Zustand, class components, PropTypes, Create React App.',
      img:'⚛️', likes:['u6','u4'],
      comments:[], shares:156, deleted:false, createdAt: now - day*11
    },
    {
      id:'ct06', authorId:'u7', type:'content', category:'Business',
      title:'How to Write a Business Plan That Actually Gets Funded',
      excerpt:'Most plans fail not because the idea is bad, but because they don\'t answer what investors actually care about.',
      content:'Investors receive hundreds of business plans monthly and fund fewer than 1%.\n\nThe fundamental problem: most plans are written from the entrepreneur\'s perspective rather than the investor\'s.\n\nExecutive Summary (one page): the problem, solution, market size, business model, team, and ask.\n\nProblem and Solution (two pages): demonstrate the problem is real, significant, and currently inadequately solved.\n\nMarket Analysis (two pages): TAM, SAM, SOM. Bottom-up calculations are more credible than top-down percentages.\n\nBusiness Model (one page): exactly how money enters the business. Show unit economics: CAC, LTV, gross margin.\n\nFinancials (three pages): Three-year projections. The assumptions behind every line item are what investors scrutinise.\n\nTeam (one page): Why these specific people are uniquely qualified to execute on this specific opportunity.',
      img:'📊', likes:['u6','u3'],
      comments:[cmt('c28','u3','The TAM/SAM/SOM framing is exactly what I needed.',4)],
      shares:167, deleted:false, createdAt: now - day*10
    },
    {
      id:'ct07', authorId:'u3', type:'content', category:'Travel',
      title:'Planning Your First International Solo Trip: A Step-by-Step Guide',
      excerpt:'Everything you need before, during, and after your first solo trip abroad.',
      content:'Choosing your destination: pick a country with good tourism infrastructure and low language barrier. For Indian travellers: Thailand, Sri Lanka, Malaysia, Japan, and Portugal are excellent first choices.\n\nDocuments: passport validity, visa requirements, travel insurance (non-negotiable), and international driving permit if needed.\n\nMoney management: notify your bank before travel. Carry two cards from different networks. Keep local currency for immediate needs. Wise offers excellent exchange rates.\n\nAccommodation: book the first two nights in advance. Arriving without accommodation is unnecessary stress.\n\nSafety: share your itinerary with someone at home. Screenshot all bookings. Know your country\'s emergency numbers.\n\nPacking: lay everything out, then remove 30%. A well-packed carry-on is always preferable to checked baggage.\n\nThe most important preparation: accept that things will go wrong and that this is part of the experience.',
      img:'✈️', likes:['u6','u2','u4'],
      comments:[cmt('c29','u4','The money management section is so helpful.',1)],
      shares:231, deleted:false, createdAt: now - day*9
    },
    {
      id:'ct08', authorId:'u4', type:'content', category:'Education',
      title:'The Complete UPSC Preparation Guide: Strategy and the Mental Game',
      excerpt:'Based on interviews with 50 successful candidates from AIR 1 to AIR 500 — what they all did differently.',
      content:'UPSC is among the most demanding examinations in the world — approximately 1 million candidates compete for 1,000 positions annually.\n\nTimeline: serious preparation requires 14-18 months. Successful candidates allocate time: months 1-4 (NCERT foundation), months 5-10 (standard references and optional subject), months 11-14 (daily answer writing and previous year papers).\n\nThe newspaper reading trap: aspirants consistently over-invest in newspaper coverage and under-invest in answer writing. Limit news to one hour daily from month five.\n\nOptional subject selection: choose based on genuine interest, not perceived scoring potential.\n\nAnswer writing is the most underpractised skill. Begin daily 30-minute answer writing from month 3 — not month 11.\n\nThe mental game: UPSC selects for persistence as much as intelligence. Normalise the long timeline.',
      img:'🏛️', likes:['u6','u7','u5'],
      comments:[cmt('c30','u7','The newspaper reading trap point is accurate.',3)],
      shares:289, deleted:false, createdAt: now - day*8
    },
    {
      id:'ct09', authorId:'u5', type:'content', category:'Health',
      title:'The Complete Beginner\'s Guide to Meditation: 8 Weeks to a Sustainable Practice',
      excerpt:'Every technique, every obstacle, and a day-by-day programme from beginner to consistent practitioner.',
      content:'Weeks 1-2: Breath Awareness (5 minutes daily). Focus on the physical sensation of breathing. When the mind wanders — and it will — gently return. The wandering is not failure; the noticing and returning is the practice.\n\nWeeks 3-4: Extended Breath Awareness + Body Scan (10 minutes). Add a five-minute body scan to identify and release physical tension.\n\nWeeks 5-6: Open Awareness Meditation (15 minutes). Practice being aware of all sensory experience without directing attention.\n\nWeeks 7-8: Loving-Kindness Meditation (20 minutes). Direct phrases of goodwill towards yourself, then people you love, then neutral people, then difficult people.\n\nCommon obstacles: restlessness (try walking meditation), sleepiness (meditate seated, earlier in day), missed days (the practice continues from wherever you left it).',
      img:'🧘', likes:['u6','u2'],
      comments:[cmt('c31','u2','The loving-kindness technique explained so well.',2)],
      shares:143, deleted:false, createdAt: now - day*7
    },
    {
      id:'ct10', authorId:'u2', type:'content', category:'Technology',
      title:'DevOps for Developers: CI/CD, Docker, Kubernetes Explained Simply',
      excerpt:'The DevOps skills that make developers 10x more valuable — no jargon, practical examples.',
      content:'The developer who understands deployment is worth significantly more than one who only writes code.\n\nCI/CD: automatically building, testing, and deploying code changes. Start with GitHub Actions — free for public repositories. A basic pipeline running tests on every pull request can be configured in under an hour.\n\nDocker: packaging your application with all its dependencies into a container that runs identically anywhere. Master: Dockerfile, docker-compose, and image registries.\n\nKubernetes: manages Docker containers at scale. For most developers, understanding concepts and interacting with an existing cluster is sufficient. Master: Deployments, Services, Pods, and ConfigMaps.\n\nCloud fundamentals: one of AWS, GCP, or Azure at a basic level is sufficient. Core concepts: compute, storage, networking, and IAM.\n\nThe most important step: deploy something real to the internet.',
      img:'🐳', likes:['u6','u5'],
      comments:[], shares:198, deleted:false, createdAt: now - day*6
    },
    {
      id:'ct11', authorId:'u7', type:'content', category:'Business',
      title:'Social Media Marketing in 2026: Platform-by-Platform Strategy',
      excerpt:'LinkedIn, Instagram, YouTube, X — where to invest time and budget, and what content works this year.',
      content:'LinkedIn: the highest-value B2B platform. Text posts with genuine insight consistently outperform image or video content. Optimal posting cadence: 3-4 times weekly.\n\nInstagram: reels receive 2-3x the organic reach of static posts. Consistency matters more than on any other platform.\n\nYouTube: the platform with the longest content half-life. A well-optimised educational video continues receiving views for years. Titles and thumbnails determine click-through rate.\n\nX (formerly Twitter): reach has declined since 2023. Still valuable for real-time engagement with specific communities.\n\nPinterest: consistently undervalued. The highest purchase-intent social platform. Essential for travel, home, fashion, food, and wellness brands.\n\nThe universal strategy: own at least one platform deeply before spreading thin across all of them.',
      img:'📲', likes:['u6','u4','u5'],
      comments:[cmt('c32','u4','The Pinterest point is something so many brands miss.',1)],
      shares:176, deleted:false, createdAt: now - day*5
    },
    {
      id:'ct12', authorId:'u3', type:'content', category:'Travel',
      title:'Northeast India: 7 States, 30 Days, Under ₹50,000 — Complete Guide',
      excerpt:'Assam, Meghalaya, Nagaland, Manipur, Mizoram, Tripura, Arunachal Pradesh — the practical circuit guide.',
      content:'Flight entry: Guwahati is the primary hub. Budget ₹8,000-12,000 for entry and exit flights.\n\nPermits: Arunachal Pradesh requires an Inner Line Permit (free for Indian citizens, issued within 48 hours). Nagaland requires a Nagaland Area Entry Permit.\n\nSuggested 30-day circuit: Guwahati (2 days) → Shillong and Cherrapunji (3 days, living root bridges) → Kaziranga National Park (2 days) → Jorhat and Majuli Island (2 days) → Kohima (3 days, WWII sites) → Imphal (2 days) → Aizawl (2 days) → Agartala (2 days) → Gangtok (3 days) → return via Bagdogra.\n\nBudget: Flights ₹10,000, Accommodation ₹15,000, Food ₹9,000, Transport ₹12,000, Permits ₹2,000. Total: ₹48,000.\n\nBest season: October to April.',
      img:'🌄', likes:['u6','u2'],
      comments:[cmt('c33','u2','The permit section is what everyone forgets.',4)],
      shares:194, deleted:false, createdAt: now - day*4
    },
    {
      id:'ct13', authorId:'u5', type:'content', category:'Health',
      title:'Strength Training for Women: Science, Myths, and a 12-Week Programme',
      excerpt:'Women\'s strength training is surrounded by myths. Here is what research shows.',
      content:'The most persistent myth: heavy strength training will make women bulky. Women have 15-20 times less testosterone than men. Building significant muscle mass represents a desirable body composition change.\n\nBenefits: builds bone density, improves insulin sensitivity, increases resting metabolic rate, and consistently improves anxiety and self-efficacy.\n\nFor beginners: three full-body sessions per week. Progressive overload — gradually increasing the demand — is the mechanism of all strength gain.\n\nWeeks 1-4: learning movement patterns with very light loads. Three sets of 10-12 repetitions. Focus is form, not intensity.\n\nWeeks 5-8: adding meaningful load. The target is where the last two repetitions are genuinely difficult but technically controlled.\n\nWeeks 9-12: add one set to compound movements.\n\nFive movement patterns: squat, hinge, push, pull, and carry/core stability.',
      img:'💪', likes:['u6','u3'],
      comments:[cmt('c34','u3','Finally a guide that addresses the myths properly.',3)],
      shares:218, deleted:false, createdAt: now - day*3
    },
    {
      id:'ct14', authorId:'u2', type:'content', category:'Technology',
      title:'Machine Learning Interview Prep: Questions and the Intuition Behind Them',
      excerpt:'The ML interview at Google, Amazon, Microsoft — the technical questions and the thinking they test.',
      content:'ML roles at top-tier companies are among the most competitive positions in technology.\n\nFour domains: ML theory and algorithms, practical ML, ML system design, and general software engineering.\n\nML Theory: every interviewer tests gradient descent, regularisation (L1 vs L2), bias-variance tradeoff, and at least one of: decision trees, neural network architectures, or probabilistic models.\n\nThe questions look for intuition, not memorised answers. "Why does L2 regularisation produce small weights while L1 produces sparse weights?" requires understanding the geometry of the loss surface.\n\nPractical ML: "Your model performs well offline but poorly in production — what would you investigate?" Answer: data distribution shift, feature engineering inconsistencies, class imbalance, model calibration.\n\nML System Design framework: problem formulation, data collection, feature engineering, model choice, evaluation metrics, deployment, monitoring.',
      img:'🤖', likes:['u6','u4','u5'],
      comments:[cmt('c35','u4','The practical ML section is gold for anyone preparing.',2)],
      shares:267, deleted:false, createdAt: now - day*2
    },
    {
      id:'ct15', authorId:'u7', type:'content', category:'Business',
      title:'The Complete Freelancer\'s Toolkit: Contracts, Pricing, and Essential Tools',
      excerpt:'Everything a freelancer needs to run a professional, profitable business.',
      content:'Freelancing without the right infrastructure means working hard for less money than you should earn.\n\nLegal protection: every project needs a contract, every time. Essential clauses: scope of work (defined precisely), payment terms (net 15 or net 30 maximum), IP ownership, kill fee (50% of remaining project value if client terminates), and revision limit.\n\nPricing: three tiers for every service. Basic (productised, narrowly scoped), Core (your most common delivery), and Premium (your best work bundled). Most clients choose the middle option.\n\nRate calculation: (desired annual income + 30% taxes + 20% business expenses + 15% buffer) ÷ 200 billable days.\n\nEssential tools: FreshBooks or Wave for accounting, DocuSign for contracts, Notion or ClickUp for project management, a professional email domain.\n\nThe goal of every project: be so valuable the client returns without advertising.',
      img:'🛠️', likes:['u6','u4','u2'],
      comments:[cmt('c36','u4','The kill fee clause alone just saved my next project.',1)],
      shares:312, deleted:false, createdAt: now - day*1
    }

  ]; // end posts array

  // Save to localStorage
  localStorage.setItem('dcw_users',    JSON.stringify(users));
  localStorage.setItem('dcw_posts',    JSON.stringify(posts));
  localStorage.setItem('dcw_chats',    JSON.stringify({}));
  localStorage.setItem('dcw_requests', JSON.stringify([]));
  localStorage.setItem('dcw_seeded',   'true');

})(); // end seedDatabase
