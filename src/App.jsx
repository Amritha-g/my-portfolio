import React, { useState, useEffect } from 'react';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { JellyfishBlob, InterestsOrbit, ProjectVisualizer, TechStackSphere, SonarDish3D } from './components/Section3D';
import { ArrowRight } from 'lucide-react';

function App() {
  const [depth, setDepth] = useState(0);

  // Scroll depth tracker for indicator HUD element
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const roundedDepth = Math.round(scrollY / 6);
      setDepth(roundedDepth);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Custom cursor position and hover state tracking hook
  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursor-ring');
    if (!cursor || !cursorRing) return;

    const moveCursor = (e) => {
      cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
      cursorRing.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.closest('a, button, .interest-pill, .clink, .btn, .stat-card, .proj-card, .term-topbar, .tl-item, .extra-card')) {
        cursor.classList.add('hover');
        cursorRing.classList.add('hover');
      } else {
        cursor.classList.remove('hover');
        cursorRing.classList.remove('hover');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);

    const handleMouseLeaveWindow = () => {
      cursor.style.opacity = '0';
      cursorRing.style.opacity = '0';
    };
    const handleMouseEnterWindow = () => {
      cursor.style.opacity = '1';
      cursorRing.style.opacity = '1';
    };
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
    };
  }, []);

  return (
    <div className="scroll-container">
      {/* 1. Background WebGL Caustics & 3D Three.js Scene Background */}
      <BackgroundCanvas />

      {/* 2. Top Navigation Bar */}
      <nav>
        <a href="#hero" className="nav-logo">
          AG<span style={{ color: 'var(--muted)' }}>.</span>
        </a>
        <ul className="nav-links">
          <li><a href="#about">about</a></li>
          <li><a href="#projects">projects</a></li>
          <li><a href="#skills">stack</a></li>
          <li><a href="#experience">timeline</a></li>
          <li><a href="#extracurricular">clubs</a></li>
          <li><a href="#contact">contact</a></li>
        </ul>
        <div className="depth-display">
          DEPTH: -{depth}m
        </div>
      </nav>

      {/* 3. Hero Section */}
      <section id="hero">
        <div className="hero-content">
          <div>
            <div className="hero-depth">surface · bioluminescent zone · signal active</div>
            <div className="hero-badges">
              <span className="hbadge live">🟢 shipping live</span>
              <span className="hbadge">3rd year CS @ SNUC</span>
              <span className="hbadge">open to internships</span>
            </div>
            <h1 className="hero-name">
              Amritha G<span>.</span>
            </h1>
            <div className="hero-subtitles">
              <div className="hero-sub">
                <span className="hs-accent">Building agents that act, not just predict</span>
              </div>
              <div className="hero-sub">
                ◈ Shipping real-world products with precision, intelligence &amp; velocity ◈
              </div>
              <div className="hero-sub" style={{ color: 'var(--teal)' }}>
                Full-stack · ML · Agentic AI · FinTech
              </div>
            </div>
            <div className="hero-btns">
              <a className="btn btn-primary" href="#projects">Explore Projects</a>
              <a className="btn btn-ghost" href="#contact">Ping Me</a>
            </div>
          </div>
          {/* Embedded 3D Organic morpher crystal */}
          <JellyfishBlob />
        </div>
      </section>

      {/* 4. About Section */}
      <section id="about">
        <div className="sec-eyebrow">about_me</div>
        <h2 className="sec-title">Who's behind the screen.</h2>
        <div className="about-grid">
          <div>
            <div className="about-text">
              <p>
                Hey — I'm <strong>Amritha G</strong>, a 3rd year Computer Science student at <strong>Shiv Nadar University, Chennai</strong>. I build with purpose — <strong>real architecture, real problems, real impact.</strong>
              </p>
              <p>
                My edge? I think of myself as the <strong>customer first</strong>. Before I write a line of code, I ask: does this actually work for the person who needs it? That lens makes my projects better optimized, more functional, and more humane.
              </p>
              <p>
                Currently specializing in <strong>agentic AI</strong>, full-stack, and fintech systems — always reaching for whatever tech the current problem demands.
              </p>
            </div>
            <div className="about-interests">
              <span className="interest-pill">🎤 quizzing</span>
              <span className="interest-pill">🎸 jamming</span>
              <span className="interest-pill">💃 dance</span>
              <span className="interest-pill">🏓 pickleball</span>
              <span className="interest-pill">♟️ chess</span>
              <span className="interest-pill">🎯 carrom</span>
              <span className="interest-pill">🌅 sunrise &amp; sunset coffee</span>
            </div>
          </div>
          <div className="about-right">
            <div className="stat-cards">
              <div className="stat-card">
                <div className="stat-num">8.8</div>
                <div className="stat-label">CGPA</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">3rd</div>
                <div className="stat-label">year student</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">05+</div>
                <div className="stat-label">projects shipped</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">Top 50</div>
                <div className="stat-label">SIH University Rd</div>
              </div>
            </div>
            {/* Embedded 3D interests Orbit */}
            <InterestsOrbit />
          </div>
        </div>
      </section>

      {/* 5. Projects Section */}
      <section id="projects">
        <div className="sec-eyebrow">deep sea discoveries</div>
        <h2 className="sec-title">Recent Projects.</h2>
        <div className="proj-list">
          
          {/* Project 1: ForensIQ */}
          <div className="proj-card">
            <div>
              <span className="proj-type">AI · Forensics · Agentic</span>
              <h3 className="proj-title">ForensIQ - Multi-Agent Financial Fraud Investigator</h3>
              <p className="proj-desc">
                AI-driven forensic financial intelligence platform — autonomous agents that analyze digital evidence, map corporate relationships, surface suspicious transactions, and compile structured legal audit reports.
              </p>
              <ul className="proj-bullets">
                <li>Built a 3-agent LangGraph pipeline pulling SEC, BSE, and NSE filings directly via REST.</li>
                <li>Implemented semantic search (RAG) and Benford's Law tests to flag manipulated figures.</li>
                <li>Streams real-time analysis progress logs directly to clients via WebSockets.</li>
              </ul>
              <div className="proj-chips">
                <span className="chip">Agentic AI</span>
                <span className="chip">LangGraph</span>
                <span className="chip">FastAPI</span>
                <span className="chip">PostgreSQL</span>
                <span className="chip">pgvector</span>
                <span className="chip">WebSockets</span>
              </div>
              <span className="proj-link" style={{ color: 'var(--bio)' }}>🔬 in active development</span>
            </div>
            <ProjectVisualizer type="forensiq" />
          </div>

          {/* Project 2: ThavanAI */}
          <div className="proj-card">
            <div>
              <span className="proj-type">AI · FinTech · Full Stack</span>
              <h3 className="proj-title">ThavanAI - Financial Decision Intelligence</h3>
              <p className="proj-desc">
                AI-powered financial scoring and cash runway planning tools for SMEs to stress-test major operational decisions.
              </p>
              <ul className="proj-bullets">
                <li>Predicts days until a business runs out of cash using historical cashflow logs.</li>
                <li>Analyzes 30-day runway cycles to alert owners of high-risk payment periods.</li>
                <li>Integrated a what-if simulator letting owners test obligation strategy modifications.</li>
              </ul>
              <div className="proj-chips">
                <span className="chip">Python</span>
                <span className="chip">FastAPI</span>
                <span className="chip">React.js</span>
                <span className="chip">Gemini AI</span>
                <span className="chip">Risk Scoring</span>
              </div>
              <a href="https://github.com/Amritha-g/ThavanAI" target="_blank" rel="noreferrer" className="proj-link">
                View Project <ArrowRight size={14} />
              </a>
            </div>
            <ProjectVisualizer type="thavanai" />
          </div>

          {/* Project 3: VeloCache */}
          <div className="proj-card">
            <div>
              <span className="proj-type">Java · NIO · Systems</span>
              <h3 className="proj-title">VeloCache - Distributed In-Memory Cache</h3>
              <p className="proj-desc">
                Redis-compatible distributed cache engine structured in Java, optimized for ultra-low latency reads and writes.
              </p>
              <ul className="proj-bullets">
                <li>Architected with Java 17, NIO socket channels, and RESP protocol.</li>
                <li>Benchmarked at 41M+ ops/sec at 192ns latency under multithreaded stress.</li>
                <li>Fixed concurrency data corruptions in LRU cache map pointers via exclusive write-locking.</li>
              </ul>
              <div className="proj-chips">
                <span className="chip">Java 17</span>
                <span className="chip">NIO Channels</span>
                <span className="chip">RESP Protocol</span>
                <span className="chip">Consistent Hashing</span>
              </div>
              <span className="proj-link" style={{ color: 'var(--bio)' }}>⚙️ system optimization verified</span>
            </div>
            <ProjectVisualizer type="velocache" />
          </div>

          {/* Project 4: FlowSentry */}
          <div className="proj-card">
            <div>
              <span className="proj-type">ML · SOC · Security</span>
              <h3 className="proj-title">FlowSentry - Real-Time Network Intrusion Detection</h3>
              <p className="proj-desc">
                Asynchronous network threat analysis and security orchestration dashboard built with Machine Learning.
              </p>
              <ul className="proj-bullets">
                <li>Designed queue-based Scapy inspection pipeline processing 10,000+ packets/sec.</li>
                <li>Maintains low 5–10ms flow inspection and scoring latency.</li>
                <li>Built a two-stage pipeline (IsolationForest {"->"} XGBoost) achieving 92.5% accuracy.</li>
                <li>Deploys an autonomous LangGraph agent auto-generating firewall mitigation rule logs.</li>
              </ul>
              <div className="proj-chips">
                <span className="chip">Python</span>
                <span className="chip">Scapy</span>
                <span className="chip">AsyncIO</span>
                <span className="chip">XGBoost</span>
                <span className="chip">SHAP</span>
                <span className="chip">LangGraph</span>
              </div>
              <span className="proj-link" style={{ color: 'var(--teal)' }}>🛡️ intrusion defense active</span>
            </div>
            <ProjectVisualizer type="flowsentry" />
          </div>

        </div>
      </section>

      {/* 6. Skills Section */}
      <section id="skills">
        <div className="sec-eyebrow">tech stack</div>
        <h2 className="sec-title">Tools &amp; Arsenal.</h2>
        <div className="skills-grid">
          <div className="skills-left">
            <div className="skills-terminal">
              <div className="term-topbar">
                <div className="term-dot" style={{ backgroundColor: '#ff5f57' }}></div>
                <div className="term-dot" style={{ backgroundColor: '#febc2e' }}></div>
                <div className="term-dot" style={{ backgroundColor: '#28c840' }}></div>
                <div className="term-title">amritha@snuc:~/stack $ scan --verbose</div>
              </div>
              <div className="term-body">
                <div className="skill-row">
                  <span className="skill-name">Python</span>
                  <div className="skill-bar-bg"><div className="skill-bar-fill" style={{ width: '90%' }}></div></div>
                </div>
                <div className="skill-row">
                  <span className="skill-name">SQL</span>
                  <div className="skill-bar-bg"><div className="skill-bar-fill" style={{ width: '85%' }}></div></div>
                </div>
                <div className="skill-row">
                  <span className="skill-name">Problem Solving</span>
                  <div className="skill-bar-bg"><div className="skill-bar-fill" style={{ width: '85%' }}></div></div>
                </div>
                <div className="skill-row">
                  <span className="skill-name">Machine Learning</span>
                  <div className="skill-bar-bg"><div className="skill-bar-fill" style={{ width: '82%' }}></div></div>
                </div>
                <div className="skill-row">
                  <span className="skill-name">FastAPI</span>
                  <div className="skill-bar-bg"><div className="skill-bar-fill" style={{ width: '80%' }}></div></div>
                </div>
                <div className="skill-row">
                  <span className="skill-name">Public Speaking</span>
                  <div className="skill-bar-bg"><div className="skill-bar-fill" style={{ width: '80%' }}></div></div>
                </div>
                <div className="skill-row">
                  <span className="skill-name">React.js</span>
                  <div className="skill-bar-bg"><div className="skill-bar-fill" style={{ width: '78%' }}></div></div>
                </div>
                <div className="skill-row">
                  <span className="skill-name">Java</span>
                  <div className="skill-bar-bg"><div className="skill-bar-fill" style={{ width: '65%' }}></div></div>
                </div>
              </div>
            </div>

            <div className="skills-cats">
              <div className="skill-cat">
                <div className="skill-cat-title">🧠 AI / ML &amp; Data</div>
                <div className="skill-cat-items">
                  Scikit-learn · TensorFlow · LangChain · LangGraph · Gemini API · Prompt Engineering · pgvector · RAG
                </div>
              </div>
              <div className="skill-cat">
                <div className="skill-cat-title">⚡ Full Stack &amp; Backend</div>
                <div className="skill-cat-items">
                  FastAPI · React.js · Node.js · Express · REST APIs · JWT Authentication · SQLAlchemy · PostgreSQL · MongoDB
                </div>
              </div>
              <div className="skill-cat">
                <div className="skill-cat-title">🧩 Problem Solving &amp; Soft Skills</div>
                <div className="skill-cat-items">
                Public Speaking · Critical Thinking · Technical Mentoring · Agile Collaboration · Customer-First Design
              </div>
              </div>
              <div className="skill-cat">
                <div className="skill-cat-title">🛠️ Tools &amp; Infra</div>
                <div className="skill-cat-items">
                  Git · Docker · AWS (EC2, IAM) · Linux · Postman · Streamlit
                </div>
              </div>
            </div>
          </div>
          {/* Embedded 3D Point Sphere */}
          <TechStackSphere />
        </div>
      </section>

      {/* 7. Experience Timeline Section */}
      <section id="experience">
        <div className="sec-eyebrow">mission log</div>
        <h2 className="sec-title">Timeline.</h2>
        <div className="timeline">
          <div className="timeline-line"></div>

          {/* 1. First Year (2024) */}
          <div className="tl-item">
            <div className="tl-ping"></div>
            <div className="tl-date">2024 · 1st YEAR</div>
            <div className="tl-role">Started Computer Science</div>
            <div className="tl-org">Shiv Nadar University · Chennai</div>
            <div className="tl-desc">
              Fell into the rabbit hole of solving real-world problems with code. Selected for the Smart India Hackathon University Round (Top 50). Organized workshops as Coding Club ML Vertical Core Committee Member, hosted quiz rounds as Cognition Quiz Club Core Member, and volunteered with NSS.
            </div>
            <div className="proj-chips">
              <span className="chip">C</span>
              <span className="chip">Python</span>
              <span className="chip">Java</span>
              <span className="chip">Hackathons</span>
            </div>
          </div>

          {/* 2. TNPL Internship (June 2025) */}
          <div className="tl-item">
            <div className="tl-ping"></div>
            <div className="tl-date">JUNE 2025</div>
            <div className="tl-role">Data Analytics Intern (On-site)</div>
            <div className="tl-org">Tamil Nadu Newsprint and Papers Limited (TNPL) · Karur, Tamil Nadu</div>
            <div className="tl-desc">
              Analyzed procurement, finance, and operations data across 6 modules in an Oracle ERP environment. Audited TNPL's 52-server data center architecture (automated 1–2 hr backup scheduler, redundancy, and disaster recovery workflows) and evaluated enterprise fiber topologies (P2P, P2MP).
            </div>
            <div className="proj-chips">
              <span className="chip">Oracle ERP</span>
              <span className="chip">Data Analysis</span>
              <span className="chip">Redundancy Auditing</span>
              <span className="chip">Enterprise Security</span>
            </div>
          </div>

          {/* 3. Second Year (2025 - 2026) */}
          <div className="tl-item">
            <div className="tl-ping"></div>
            <div className="tl-date">2025 - 2026 · 2nd YEAR</div>
            <div className="tl-role">2nd Year Computer Science Student</div>
            <div className="tl-org">Shiv Nadar University · Chennai</div>
            <div className="tl-desc">
              Dived deeper into core computer systems engineering: Data Structures &amp; Algorithms, Operating Systems, Database Management Systems, Computer Networks, and DAA. Active in tech events, competitive programming, and hackathon organization.
            </div>
            <div className="proj-chips">
              <span className="chip">DSA</span>
              <span className="chip">DBMS</span>
              <span className="chip">OS Kernels</span>
              <span className="chip">Computer Networks</span>
            </div>
          </div>

          {/* 4. Raminfo Internship (June 2026 - Present) */}
          <div className="tl-item">
            <div className="tl-ping"></div>
            <div className="tl-date">JUNE 2026 · PRESENT</div>
            <div className="tl-role">Software Engineering Intern (Remote)</div>
            <div className="tl-org">Raminfo Limited · Hyderabad</div>
            <div className="tl-desc">
              Building Golden Record citizen profiling and scheme-eligibility rule engine modules for UNNOTI (World Bank platform) unifying 30+ siloed database structures. Architected consent-logging and RBAC workflows under India's DPDP Act 2023.
            </div>
            <div className="proj-chips">
              <span className="chip">Rule Engines</span>
              <span className="chip">Database Unification</span>
              <span className="chip">DPDP Compliance</span>
              <span className="chip">RBAC</span>
            </div>
          </div>

        </div>
      </section>

      {/* 8. Clubs & Community Section */}
      <section id="extracurricular">
        <div className="sec-eyebrow">beyond the terminal</div>
        <h2 className="sec-title">Clubs &amp; Community.</h2>
        <div className="extra-grid">
          <div className="extra-card">
            <div className="extra-icon">💻</div>
            <div className="extra-tag">Technical Club</div>
            <div className="extra-name">Coding Club · SNUC</div>
            <div className="extra-desc">
              Competing, building, and growing alongside people who stay up for the same reasons I do. Hackathons, competitive programming, peer sessions.
            </div>
          </div>
          <div className="extra-card">
            <div className="extra-icon">🧠</div>
            <div className="extra-tag">Intellectual Club</div>
            <div className="extra-name">Cognition Quiz Club</div>
            <div className="extra-desc">
              The place where trivia becomes sport. Open quiz, tech rounds, pop culture — if there's a mic and a buzzer, I'm in. Quizzing is how I stay curious about everything.
            </div>
          </div>
          <div className="extra-card">
            <div className="extra-icon">🤝</div>
            <div className="extra-tag">Social Volunteering</div>
            <div className="extra-name">NSS — National Service Scheme</div>
            <div className="extra-desc">
              Giving back beyond the campus bubble. Community outreach, cleanliness drives, social awareness initiatives. Being useful off-screen matters too.
            </div>
          </div>
          <div className="extra-card">
            <div className="extra-icon">🎪</div>
            <div className="extra-tag">Event Volunteering</div>
            <div className="extra-name">Invente · Annual Tech Fest</div>
            <div className="extra-desc">
              Volunteered at SNUC's annual technical symposium — Invente. Coordinating events, managing participants, and making sure the chaos runs smoothly behind the scenes.
            </div>
          </div>
        </div>
      </section>

      {/* 9. Contact Section */}
      <section id="contact">
        <div className="sec-eyebrow">contact</div>
        <h2 className="sec-title">Let's build something.</h2>
        <div className="contact-grid">
          <div className="contact-left">
            <p className="contact-text">
              Always down to talk about distributed systems, agentic AI architectures, quiz trivia, or new collaborative builds. Reach out directly.
            </p>
            <div className="clinks">
              <a className="clink" href="mailto:amrithagopal3027@gmail.com">
                <span className="clink-label">email</span> amrithagopal3027@gmail.com
              </a>
              <a className="clink" href="https://www.linkedin.com/in/amritha-g-a5822832a/" target="_blank" rel="noreferrer">
                <span className="clink-label">linkedin</span> /in/amritha-g-a5822832a/
              </a>
              <a className="clink" href="https://github.com/Amritha-g" target="_blank" rel="noreferrer">
                <span className="clink-label">github</span> /Amritha-g
              </a>
              <a className="clink" href="https://drive.google.com/file/d/1RHxLS9_T-8Z7xiIOQM3jI81YPfcq4zMy/view?usp=sharing" target="_blank" rel="noreferrer">
                <span className="clink-label">resume</span> download PDF ↓
              </a>
            </div>
          </div>
          {/* Embedded 3D Sonar dish scan indicator */}
          <SonarDish3D />
        </div>
      </section>

      {/* 9. Footer */}
      <footer>
        <div>© 2026 <span>Amritha G</span> · shipping solutions</div>
        <div>12.8406°N · 80.1534°E · <span>SNUC</span></div>
      </footer>

      {/* Custom Cursor Elements */}
      <div id="cursor" />
      <div id="cursor-ring" />
    </div>
  );
}

export default App;
