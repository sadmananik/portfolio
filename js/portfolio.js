(() => {
  'use strict';
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#site-navigation');
  if (menu && navigation) {
    const setMenu = (open, returnFocus = false) => {
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      navigation.classList.toggle('is-open', open);
      if (returnFocus) menu.focus();
    };
    menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
    navigation.addEventListener('click', event => {
      if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('click', event => {
      if (!navigation.contains(event.target) && !menu.contains(event.target)) setMenu(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') setMenu(false, true);
    });
    // A non-modal disclosure menu: keep focus usable when keyboard users leave it.
    navigation.addEventListener('focusout', event => {
      if (event.relatedTarget && !navigation.contains(event.relatedTarget) && event.relatedTarget !== menu) setMenu(false);
    });
    const mobile = window.matchMedia('(max-width: 768px)');
    mobile.addEventListener('change', () => setMenu(false));
    setMenu(false);
    document.documentElement.classList.add('js');
  }
  document.querySelectorAll('[data-year]').forEach(element => {
    element.textContent = new Date().getFullYear();
  });
  const links = [...document.querySelectorAll('nav a[href^="#"]')];
  const sections = links.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (!visible.length) return;
      const id = visible[0].target.id;
      links.forEach(link => {
        if (link.hash === `#${id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-10% 0px -55% 0px', threshold: 0 });
    sections.forEach(section => observer.observe(section));
  }
})();

// Explore the capstone as a system, with a readable fallback when JS is disabled.
(() => {
  const notes = {
    frontend: ['The creative workspace', 'The Next.js and React frontend brings together TipTap rich-text editing, a Fabric.js canvas, reusable templates and AI-assisted content creation. Hosted with AWS Amplify.'],
    backend: ['The application layer', 'Node.js and Express.js support the full-stack application, connecting content workflows with AI generation and MongoDB Atlas project data. The backend is containerised with Docker and deployed on AWS EC2 behind NGINX with Certbot-managed HTTPS.'],
    realtime: ['Working in the same room', 'Socket.IO supports project rooms, real-time updates and user presence. Owner, Editor and Viewer permissions define how people participate in shared workspaces.'],
    ai: ['A creative assistant', 'The OpenAI API enables AI-assisted text and image generation. Prompt and image history help keep track of generated content alongside the editing workflows.'],
    data: ['Keeping the project together', 'MongoDB Atlas and Mongoose support application data, including projects and the platform’s history features.']
  };
  const nodes = [...document.querySelectorAll('[data-node]')];
  nodes.forEach(node => node.addEventListener('click', () => {
    nodes.forEach(item => item.setAttribute('aria-pressed', String(item === node)));
    const [title, description] = notes[node.dataset.node];
    document.querySelector('#node-title').textContent = title;
    document.querySelector('#node-description').textContent = description;
  }));
  const switches = [...document.querySelectorAll('[data-diagram]')];
  const selectView = selected => switches.forEach(button => {
    const active = button.dataset.diagram === selected;
    button.setAttribute('aria-pressed', String(active));
    document.getElementById(`${button.dataset.diagram}-panel`).hidden = !active;
  });
  switches.forEach(button => button.addEventListener('click', () => selectView(button.dataset.diagram)));
  if (switches.length) selectView('architecture');
})();

// Keep every contribution readable in HTML; enable the compact explorer with JS.
(() => {
  const buttons = [...document.querySelectorAll('[data-tool]')];
  if (!buttons.length) return;
  const select = selected => buttons.forEach(button => {
    const active = button === selected;
    button.setAttribute('aria-pressed', String(active));
    document.getElementById(button.getAttribute('aria-controls')).hidden = !active;
  });
  buttons.forEach(button => button.addEventListener('click', () => select(button)));
  select(buttons[0]);
})();
