import * as THREE from "three";
import "./style.css";

const app = document.querySelector("#site");
const page = document.body.dataset.page;

const navItems = [
  ["Home", "/"],
  ["Work", "/work.html"],
  ["Services", "/services.html"],
  ["About", "/about.html"],
  ["Contact", "/contact.html"]
];

function navigation() {
  return `
    <header class="navbar">
      <a class="logo" href="./">
        <span class="logo-mark">V</span>
        <span class="logo-word">VIVEK</span>
        <small>AI DIGITAL STUDIO</small>
      </a>

      <nav class="nav-links">
        ${navItems.map(([label,href]) => `
          <a href="${href}" class="${page === label.toLowerCase() ? "active" : ""}">
            ${label}
          </a>
        `).join("")}
      </nav>

      <a href="./contact.html" class="nav-button">
        Let's Talk <span>↗</span>
      </a>

      <button class="mobile-menu-button" id="mobileMenuButton">☰</button>
    </header>

    <div class="mobile-menu" id="mobileMenu">
      <button id="closeMobile">×</button>

      ${navItems.map(([label,href]) => `
        <a href="${href}">${label}</a>
      `).join("")}
    </div>
  `;
}

function footer() {
  return `
    <footer class="footer">
      <div>
        <strong>VIVEK</strong>
        <span>AI • WEB • AUTOMATION</span>
      </div>

      <p>© 2026 Vivekananda. Built with curiosity and technology.</p>

      <div class="footer-links">
        <a href="https://github.com/" target="_blank">GitHub</a>
        <a href="https://linkedin.com/" target="_blank">LinkedIn</a>
        <a href="https://contra.com/" target="_blank">Contra</a>
      </div>
    </footer>
  `;
}

function shell(content) {
  app.innerHTML = `
    ${navigation()}
    <main>${content}</main>
    ${footer()}
    <div class="cursor-glow"></div>
    <div class="page-light"></div>
  `;

  setupNavigation();
  setupReveal();
}

function setupNavigation() {
  const open = document.querySelector("#mobileMenuButton");
  const close = document.querySelector("#closeMobile");
  const menu = document.querySelector("#mobileMenu");

  if (open) {
    open.onclick = () => menu.classList.add("open");
  }

  if (close) {
    close.onclick = () => menu.classList.remove("open");
  }

  document.querySelectorAll("#mobileMenu a").forEach((link) => {
    link.addEventListener("click", () => menu.classList.remove("open"));
  });
}

function setupReveal() {
  const elements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.08 }
  );

  elements.forEach(el => observer.observe(el));
}

function setupCursor() {
  const glow = document.querySelector(".cursor-glow");

  window.addEventListener("pointermove", e => {
    if (glow) {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    }
  });
}

function createThreeScene() {
  const canvas = document.querySelector("#three-canvas");

  if (!canvas) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    43,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  camera.position.set(0, 0, 7.8);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // ------------------------------------------------------
  // LIGHTING
  // ------------------------------------------------------

  scene.add(new THREE.AmbientLight(0x9c9cff, 1.2));

  const keyLight = new THREE.PointLight(0x776fff, 85, 18);
  keyLight.position.set(3, 3, 5);
  scene.add(keyLight);

  const cyanLight = new THREE.PointLight(0x37bfff, 55, 15);
  cyanLight.position.set(-4, 0, 3);
  scene.add(cyanLight);

  const whiteLight = new THREE.PointLight(0xffffff, 16, 12);
  whiteLight.position.set(0, -4, 4);
  scene.add(whiteLight);

  // ------------------------------------------------------
  // MASTER OBJECT
  // ------------------------------------------------------

  const master = new THREE.Group();
  scene.add(master);

  // Core
  const coreGeo = new THREE.IcosahedronGeometry(0.76, 5);

  const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x12142b,
    metalness: 0.94,
    roughness: 0.08,
    transmission: 0.12,
    emissive: 0x38308e,
    emissiveIntensity: 1.15,
    clearcoat: 1,
    clearcoatRoughness: 0.08
  });

  const core = new THREE.Mesh(coreGeo, coreMat);
  master.add(core);

  // Wireframe shell
  const wireGeo = new THREE.IcosahedronGeometry(1.02, 2);

  const wire = new THREE.LineSegments(
    new THREE.EdgesGeometry(wireGeo),
    new THREE.LineBasicMaterial({
      color: 0x9187ff,
      transparent: true,
      opacity: 0.42
    })
  );

  master.add(wire);

  // ------------------------------------------------------
  // ORBIT RINGS
  // ------------------------------------------------------

  const ringMaterials = [
    new THREE.MeshBasicMaterial({
      color: 0x8f83ff,
      transparent: true,
      opacity: 0.75
    }),
    new THREE.MeshBasicMaterial({
      color: 0x43bfff,
      transparent: true,
      opacity: 0.50
    }),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.25
    })
  ];

  const rings = [];

  for (let i = 0; i < 5; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(
        1.35 + i * 0.10,
        0.018 + (i === 2 ? 0.012 : 0),
        18,
        180
      ),
      ringMaterials[i % ringMaterials.length]
    );

    ring.rotation.x = Math.PI * (0.20 + i * 0.18);
    ring.rotation.y = Math.PI * (0.08 + i * 0.22);
    ring.rotation.z = i * 0.23;

    master.add(ring);
    rings.push(ring);
  }

  // ------------------------------------------------------
  // FLOATING GLASS NODES
  // ------------------------------------------------------

  const nodeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x161a34,
    metalness: 0.75,
    roughness: 0.12,
    transparent: true,
    opacity: 0.82,
    transmission: 0.15,
    emissive: 0x25205f,
    emissiveIntensity: 0.65
  });

  const nodeGeometry = new THREE.BoxGeometry(0.26, 0.26, 0.26);

  const nodePositions = [
    [2.05, 0.85, 0.4],
    [-2.25, 0.4, 0.1],
    [1.85, -1.15, 0.0],
    [-1.75, -1.05, 0.4],
    [2.7, -0.05, -0.7],
    [-2.65, 1.15, -0.8]
  ];

  const nodes = [];

  nodePositions.forEach((p, i) => {
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
    node.position.set(...p);
    node.rotation.set(i * 0.4, i * 0.6, i * 0.35);
    master.add(node);
    nodes.push(node);
  });

  // ------------------------------------------------------
  // PARTICLES
  // ------------------------------------------------------

  const count = 1600;

  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const radius = 3.4 + Math.random() * 5.8;

    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] =
      radius * Math.sin(phi) * Math.cos(theta);

    positions[i * 3 + 1] =
      radius * Math.sin(phi) * Math.sin(theta);

    positions[i * 3 + 2] =
      radius * Math.cos(phi);
  }

  const particleGeometry = new THREE.BufferGeometry();

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const particleMaterial = new THREE.PointsMaterial({
    color: 0x9c98ff,
    size: 0.025,
    transparent: true,
    opacity: 0.48,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const particleField = new THREE.Points(
    particleGeometry,
    particleMaterial
  );

  scene.add(particleField);

  // ------------------------------------------------------
  // DIGITAL GRID
  // ------------------------------------------------------

  const grid = new THREE.GridHelper(
    18,
    36,
    0x252250,
    0x17172a
  );

  grid.rotation.x = Math.PI / 2.65;
  grid.position.y = -3.0;
  grid.material.transparent = true;
  grid.material.opacity = 0.16;

  scene.add(grid);

  // ------------------------------------------------------
  // CONNECTING LINES
  // ------------------------------------------------------

  const lineGroup = new THREE.Group();
  scene.add(lineGroup);

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x6f67d9,
    transparent: true,
    opacity: 0.18
  });

  for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.8 + Math.random() * 1.2;

    const x = Math.cos(angle) * radius;
    const y = (Math.random() - 0.5) * 2.4;
    const z = Math.sin(angle) * radius;

    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(x, y, z)
    ]);

    lineGroup.add(
      new THREE.Line(geometry, lineMaterial)
    );
  }

  // ------------------------------------------------------
  // MOUSE INTERACTION
  // ------------------------------------------------------

  let targetX = 0;
  let targetY = 0;

  window.addEventListener("pointermove", event => {
    targetX =
      (event.clientX / window.innerWidth - 0.5) * 1.8;

    targetY =
      (event.clientY / window.innerHeight - 0.5) * 1.2;
  });

  // ------------------------------------------------------
  // ANIMATION
  // ------------------------------------------------------

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

    master.rotation.y += 0.0022;
    master.rotation.x =
      Math.sin(t * 0.35) * 0.08;

    master.rotation.y +=
      (targetX * 0.10 - master.rotation.y) * 0.003;

    master.rotation.x +=
      (targetY * 0.045 - master.rotation.x) * 0.003;

    core.rotation.x += 0.003;
    core.rotation.y += 0.004;

    wire.rotation.x -= 0.0018;
    wire.rotation.y += 0.0025;

    rings.forEach((ring, i) => {
      ring.rotation.x += 0.001 + i * 0.0004;
      ring.rotation.y -= 0.0012 + i * 0.0003;
      ring.rotation.z += 0.0007;
    });

    nodes.forEach((node, i) => {
      node.rotation.x += 0.003 + i * 0.0003;
      node.rotation.y += 0.004 + i * 0.0002;

      node.position.y +=
        Math.sin(t * 0.7 + i) * 0.0007;
    });

    particleField.rotation.y = t * 0.012;
    particleField.rotation.x =
      Math.sin(t * 0.08) * 0.08;

    lineGroup.rotation.y =
      t * 0.014;

    renderer.render(scene, camera);
  }

  animate();

  // ------------------------------------------------------
  // RESIZE
  // ------------------------------------------------------

  window.addEventListener("resize", () => {
    camera.aspect =
      window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );
  });
}

// =========================================================
// HOME
// =========================================================

if (page === "home") {

  shell(`
    <section class="hero3d">

      <canvas id="three-canvas"></canvas>

      <div class="hero-overlay">

        <div class="hero-badge reveal">
          <span class="green-dot"></span>
          Available for freelance projects
        </div>

        <div class="hero-content reveal">
          <p class="eyebrow">AI • WEB • AUTOMATION</p>

          <h1>
            Digital experiences
            <span>built to be remembered.</span>
          </h1>

          <p class="hero-subtitle">
            I design and build premium websites, AI-powered products
            and intelligent automations for ambitious businesses.
          </p>

          <div class="hero-buttons">

            <a href="./work.html" class="button primary">
              Explore Work <span>↗</span>
            </a>

            <a href="./contact.html" class="button secondary">
              Start a Project
            </a>

          </div>

          <div class="hero-stats">

            <div>
              <strong>AI</strong>
              <span>Intelligence</span>
            </div>

            <div>
              <strong>WEB</strong>
              <span>Experiences</span>
            </div>

            <div>
              <strong>AUTO</strong>
              <span>Systems</span>
            </div>

          </div>

          <div class="hero-hud">
            <div class="hud-card hud-ai">
              <span class="hud-icon">✦</span>
              <div>
                <small>INTELLIGENCE</small>
                <strong>AI SYSTEMS</strong>
              </div>
            </div>

            <div class="hud-card hud-web">
              <span class="hud-icon">◈</span>
              <div>
                <small>EXPERIENCE</small>
                <strong>WEB PRODUCTS</strong>
              </div>
            </div>

            <div class="hud-card hud-auto">
              <span class="hud-icon">↗</span>
              <div>
                <small>OPERATIONS</small>
                <strong>AUTOMATION</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="scroll-indicator">
        <span></span>
        Explore
      </div>

    </section>

    <section class="home-intro section reveal">

      <div>
        <p class="eyebrow">THE APPROACH</p>

        <h2>
          Good design gets attention.
          <span>Good technology creates results.</span>
        </h2>
      </div>

      <p>
        I combine modern frontend development, AI capabilities
        and thoughtful interaction design to build digital products
        that are useful, fast and memorable.
      </p>

    </section>

    <section class="section home-cards">

      <a href="./work.html" class="big-card reveal">
        <div>
          <span class="card-number">01</span>
          <h3>Selected Work</h3>
          <p>Explore websites, dashboards and AI concepts.</p>
        </div>
        <span class="card-arrow">↗</span>
      </a>

      <a href="./services.html" class="big-card reveal">
        <div>
          <span class="card-number">02</span>
          <h3>Services</h3>
          <p>From web development to AI automation.</p>
        </div>
        <span class="card-arrow">↗</span>
      </a>

      <a href="./about.html" class="big-card reveal">
        <div>
          <span class="card-number">03</span>
          <h3>About Me</h3>
          <p>Learn about my mindset and development approach.</p>
        </div>
        <span class="card-arrow">↗</span>
      </a>

    </section>

    <section class="cta-section section reveal">

      <p class="eyebrow">HAVE AN IDEA?</p>

      <h2>
        Let's turn your idea
        <span>into something real.</span>
      </h2>

      <a href="./contact.html" class="button primary">
        Start a conversation ↗
      </a>

    </section>
  `);

  createThreeScene();
}


// =========================================================
// WORK
// =========================================================

if (page === "work") {

  shell(`
    <section class="page-hero section">

      <p class="eyebrow reveal">SELECTED WORK</p>

      <h1 class="page-title reveal">
        Digital products
        <span>with purpose.</span>
      </h1>

      <p class="page-lead reveal">
        A collection of concept products demonstrating my approach
        to websites, AI experiences, dashboards and business automation.
      </p>

    </section>

    <section class="section projects-list">

      <a href="./project.html?project=nexora" class="project-wide reveal">

        <div class="project-preview preview-blue">

          <div class="preview-browser">

            <div class="preview-top">
              <b>NEXORA</b>
              <span>AI-POWERED SOLUTIONS</span>
            </div>

            <h3>
              Transform your
              <em>business with AI.</em>
            </h3>

            <div class="preview-buttons">
              <span>Get Started →</span>
              <span>Watch Demo</span>
            </div>

          </div>

        </div>

        <div class="project-details">

          <div>
            <small>01 • WEBSITE / AI</small>
            <h2>Nexora AI</h2>
            <p>
              A premium business website concept with AI chatbot
              integration, responsive design and lead generation.
            </p>
          </div>

          <span class="project-arrow">↗</span>

        </div>

      </a>

      <a href="./project.html?project=revenue" class="project-wide reveal">

        <div class="project-preview preview-purple">

          <div class="analytics-dashboard">

            <div class="analytics-sidebar">
              <b>V</b>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div class="analytics-main">

              <small>REVENUE INTELLIGENCE</small>

              <strong>$48,920</strong>

              <div class="bars">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>

            </div>

          </div>

        </div>

        <div class="project-details">

          <div>
            <small>02 • DASHBOARD / ANALYTICS</small>
            <h2>Revenue Intelligence</h2>
            <p>
              A business dashboard concept for revenue monitoring,
              customer intelligence and performance analytics.
            </p>
          </div>

          <span class="project-arrow">↗</span>

        </div>

      </a>

      <a href="./project.html?project=automation" class="project-wide reveal">

        <div class="project-preview preview-dark">

          <div class="automation-showcase">

            <div>NEW LEAD</div>
            <span>→</span>
            <div class="active">AI ANALYSIS</div>
            <span>→</span>
            <div>AUTO RESPONSE</div>

          </div>

        </div>

        <div class="project-details">

          <div>
            <small>03 • AUTOMATION / AI</small>
            <h2>Lead Intelligence</h2>
            <p>
              An automation concept that captures leads, analyzes intent,
              and starts intelligent follow-up.
            </p>
          </div>

          <span class="project-arrow">↗</span>

        </div>

      </a>

    </section>
  `);
}


// =========================================================
// PROJECT
// =========================================================

if (page === "project") {

  const params = new URLSearchParams(window.location.search);
  const selected = params.get("project") || "nexora";

  const projects = {
    nexora: {
      number: "01",
      category: "WEBSITE / AI",
      title: "Nexora AI",
      description:
        "A premium AI-powered business website concept focused on clarity, conversion and modern customer interaction.",
      features: [
        "Responsive website experience",
        "AI chatbot interface",
        "Lead generation",
        "Modern UI / UX",
        "Mobile-first design",
        "Fast interaction patterns"
      ]
    },

    revenue: {
      number: "02",
      category: "DASHBOARD / ANALYTICS",
      title: "Revenue Intelligence",
      description:
        "A financial intelligence dashboard concept for understanding revenue, customer activity and performance.",
      features: [
        "Revenue overview",
        "Analytics visualization",
        "Customer metrics",
        "Performance tracking",
        "Responsive dashboard",
        "Clean data hierarchy"
      ]
    },

    automation: {
      number: "03",
      category: "AUTOMATION / AI",
      title: "Lead Intelligence",
      description:
        "A business automation concept that transforms incoming leads into structured, intelligent follow-up workflows.",
      features: [
        "Lead capture",
        "AI analysis",
        "Workflow automation",
        "Automated responses",
        "Business process mapping",
        "Scalable architecture"
      ]
    }
  };

  const project = projects[selected] || projects.nexora;

  shell(`
    <section class="project-hero section">

      <a href="./work.html" class="back-link reveal">
        ← Back to work
      </a>

      <div class="project-heading">

        <div>
          <p class="eyebrow reveal">
            ${project.number} • ${project.category}
          </p>

          <h1 class="page-title reveal">
            ${project.title}
          </h1>

          <p class="page-lead reveal">
            ${project.description}
          </p>
        </div>

      </div>

    </section>

    <section class="section case-study">

      <div class="case-visual reveal">

        <div class="case-browser">

          <div class="browser-dots">
            <i></i><i></i><i></i>
          </div>

          <div class="case-screen">

            <div class="case-nav">
              <strong>
                ${selected === "nexora" ? "NEXORA" : "VIVEK AI"}
              </strong>

              <span>Dashboard</span>
              <span>Solutions</span>
              <span>Contact</span>
            </div>

            <div class="case-body">

              <small>
                AI-POWERED EXPERIENCE
              </small>

              <h2>
                ${selected === "nexora"
                  ? "Transform your business with AI."
                  : selected === "revenue"
                    ? "Understand your business in real time."
                    : "Turn leads into intelligent workflows."
                }
              </h2>

              <div class="case-pills">
                ${project.features.slice(0, 3).map(
                  feature => `<span>${feature}</span>`
                ).join("")}
              </div>

            </div>

          </div>

        </div>

      </div>

      <div class="case-info">

        <div class="case-description reveal">

          <p class="eyebrow">OVERVIEW</p>

          <p>
            ${project.description}
          </p>

        </div>

        <div class="case-features reveal">

          <p class="eyebrow">FEATURES</p>

          ${project.features.map(
            (feature, i) => `
              <div class="feature-row">
                <span>0${i + 1}</span>
                <strong>${feature}</strong>
              </div>
            `
          ).join("")}

        </div>

      </div>

    </section>

    <section class="section cta-section reveal">

      <p class="eyebrow">LIKE THIS DIRECTION?</p>

      <h2>
        Let's build
        <span>your version.</span>
      </h2>

      <a href="./contact.html" class="button primary">
        Start a project ↗
      </a>

    </section>
  `);
}


// =========================================================
// SERVICES
// =========================================================

if (page === "services") {

  shell(`
    <section class="page-hero section">

      <p class="eyebrow reveal">SERVICES</p>

      <h1 class="page-title reveal">
        Technology that
        <span>does something.</span>
      </h1>

      <p class="page-lead reveal">
        I help businesses move from idea to digital product
        using modern development, AI and automation.
      </p>

    </section>

    <section class="section service-list">

      <article class="service-large reveal">

        <div class="service-number-large">01</div>

        <div>
          <p class="eyebrow">WEB DEVELOPMENT</p>
          <h2>Websites that feel premium.</h2>

          <p>
            Modern responsive websites and landing pages built
            around business goals, performance and usability.
          </p>

          <div class="service-tags">
            <span>React</span>
            <span>Next.js</span>
            <span>JavaScript</span>
            <span>Responsive Design</span>
          </div>
        </div>

      </article>

      <article class="service-large reveal">

        <div class="service-number-large">02</div>

        <div>
          <p class="eyebrow">AI INTEGRATION</p>
          <h2>Smarter digital experiences.</h2>

          <p>
            AI-powered features such as assistants, intelligent
            interfaces, document workflows and business agents.
          </p>

          <div class="service-tags">
            <span>AI APIs</span>
            <span>LLMs</span>
            <span>Chatbots</span>
            <span>Agents</span>
          </div>
        </div>

      </article>

      <article class="service-large reveal">

        <div class="service-number-large">03</div>

        <div>
          <p class="eyebrow">AUTOMATION</p>
          <h2>Less repetition. More output.</h2>

          <p>
            Automated workflows for lead handling, business processes,
            notifications, data flow and internal operations.
          </p>

          <div class="service-tags">
            <span>Webhooks</span>
            <span>APIs</span>
            <span>Workflows</span>
            <span>Automation</span>
          </div>
        </div>

      </article>

      <article class="service-large reveal">

        <div class="service-number-large">04</div>

        <div>
          <p class="eyebrow">UI / UX</p>
          <h2>Interfaces people understand.</h2>

          <p>
            Clean visual systems, dashboards and product experiences
            with thoughtful hierarchy and interaction.
          </p>

          <div class="service-tags">
            <span>Figma</span>
            <span>Design Systems</span>
            <span>Prototyping</span>
            <span>UX</span>
          </div>
        </div>

      </article>

    </section>

    <section class="section cta-section reveal">

      <p class="eyebrow">READY TO BUILD?</p>

      <h2>
        Tell me what
        <span>you're thinking.</span>
      </h2>

      <a href="./contact.html" class="button primary">
        Let's talk ↗
      </a>

    </section>
  `);
}


// =========================================================
// ABOUT
// =========================================================

if (page === "about") {

  shell(`
    <section class="about-main section">

      <div class="about-photo reveal">

        <img
          src="./profile.png"
          alt="Vivekananda"
        />

        <div class="photo-label">
          <span class="green-dot"></span>
          Open for opportunities
        </div>

      </div>

      <div class="about-copy">

        <p class="eyebrow reveal">ABOUT ME</p>

        <h1 class="page-title reveal">
          Developer.
          <span>Builder.</span>
          Problem solver.
        </h1>

        <p class="about-big reveal">
          I'm Vivek, an AI-powered web developer focused
          on turning ideas into useful digital products.
        </p>

        <p class="about-text reveal">
          I enjoy combining modern frontend development,
          AI capabilities and automation to create experiences
          that are visually strong and genuinely useful.
        </p>

        <p class="about-text reveal">
          My approach is simple: understand the problem,
          design the experience, build quickly, test everything,
          and keep improving.
        </p>

      </div>

    </section>

    <section class="section values-section">

      <p class="eyebrow reveal">MY PRINCIPLES</p>

      <div class="values-grid">

        <article class="value reveal">
          <span>01</span>
          <h3>Clarity</h3>
          <p>
            Great products begin with a clear problem and a clear user.
          </p>
        </article>

        <article class="value reveal">
          <span>02</span>
          <h3>Craft</h3>
          <p>
            Every detail matters when creating a premium experience.
          </p>
        </article>

        <article class="value reveal">
          <span>03</span>
          <h3>Speed</h3>
          <p>
            Build quickly, test early and learn from real usage.
          </p>
        </article>

        <article class="value reveal">
          <span>04</span>
          <h3>Curiosity</h3>
          <p>
            Technology changes fast. Staying curious keeps the work better.
          </p>
        </article>

      </div>

    </section>

    <section class="section stack-section">

      <p class="eyebrow reveal">CURRENT TOOLKIT</p>

      <div class="tech-cloud reveal">

        <span>React</span>
        <span>Next.js</span>
        <span>JavaScript</span>
        <span>Python</span>
        <span>Node.js</span>
        <span>AI APIs</span>
        <span>Three.js</span>
        <span>Figma</span>
        <span>Git</span>

      </div>

    </section>
  `);
}


// =========================================================
// CONTACT
// =========================================================

if (page === "contact") {

  shell(`
    <section class="contact-main section">

      <div class="contact-heading">

        <p class="eyebrow reveal">CONTACT</p>

        <h1 class="page-title reveal">
          Let's build
          <span>something useful.</span>
        </h1>

        <p class="page-lead reveal">
          Have a website idea, AI concept or automation challenge?
          Tell me about it.
        </p>

      </div>

      <div class="contact-grid">

        <div class="contact-left reveal">

          <div class="contact-method">
            <span>EMAIL</span>
            <a href="mailto:hello@vivekananda.dev">
              hello@vivekananda.dev
            </a>
          </div>

          <div class="contact-method">
            <span>AVAILABLE</span>
            <strong>Worldwide • Remote</strong>
          </div>

          <div class="contact-method">
            <span>PLATFORM</span>
            <a href="https://contra.com/" target="_blank">
              Contra profile ↗
            </a>
          </div>

          <div class="contact-method">
            <span>SOCIAL</span>
            <div class="socials">
              <a href="https://github.com/" target="_blank">GitHub</a>
              <a href="https://linkedin.com/" target="_blank">LinkedIn</a>
            </div>
          </div>

        </div>

        <form class="contact-form reveal" id="contactForm">

          <label>
            Name
            <input
              type="text"
              id="name"
              placeholder="Your name"
              required
            >
          </label>

          <label>
            Email
            <input
              type="email"
              id="email"
              placeholder="you@company.com"
              required
            >
          </label>

          <label>
            What are you building?
            <textarea
              id="message"
              rows="7"
              placeholder="Tell me about your project..."
              required
            ></textarea>
          </label>

          <button class="button primary" type="submit">
            Send project inquiry ↗
          </button>

          <p id="formMessage"></p>

        </form>

      </div>

    </section>
  `);

  const form = document.querySelector("#contactForm");

  form.addEventListener("submit", event => {
    event.preventDefault();

    const name =
      document.querySelector("#name").value.trim();

    const email =
      document.querySelector("#email").value.trim();

    const message =
      document.querySelector("#message").value.trim();

    const subject =
      encodeURIComponent(
        `New project inquiry from ${name}`
      );

    const body =
      encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nProject:\n${message}`
      );

    window.location.href =
      `mailto:hello@vivekananda.dev?subject=${subject}&body=${body}`;

    document.querySelector("#formMessage").textContent =
      "Opening your email client...";
  });
}

setupCursor();
