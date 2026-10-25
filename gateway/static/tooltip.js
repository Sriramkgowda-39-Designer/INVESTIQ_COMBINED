/**
 * Universal InvestIQ Interactive Hover Tooltip Engine
 * Dynamically binds to any element with [data-metric] or [data-tooltip]
 * Displays rich, glassmorphic financial insight cards with formulas, ELI5 descriptions & benchmarks.
 */
(function() {
  let glossary = {};
  let cardEl = null;
  let activeTarget = null;
  let hideTimeout = null;

  // Initialize Tooltip Element
  function initTooltipDom() {
    if (document.getElementById('iq-universal-tooltip')) return;
    cardEl = document.createElement('div');
    cardEl.id = 'iq-universal-tooltip';
    cardEl.className = 'iq-tooltip-card';
    cardEl.setAttribute('role', 'tooltip');
    document.body.appendChild(cardEl);

    // Keep open if user moves cursor directly onto the card (for reading or links)
    cardEl.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
    cardEl.addEventListener('mouseleave', hide);
  }

  // Load Glossary Data
  async function loadGlossary() {
    try {
      const res = await fetch('/api/glossary');
      if (res.ok) {
        glossary = await res.json();
      }
    } catch (e) {
      console.warn('InvestIQ Tooltip: Could not load remote glossary, using built-in defaults.');
    }
  }

  // Position calculation with automatic viewport boundary clamping
  function positionTooltip(target) {
    if (!cardEl) return;
    const rect = target.getBoundingClientRect();
    const cardRect = cardEl.getBoundingClientRect();
    const margin = 12;

    let top = rect.bottom + margin;
    let left = rect.left + (rect.width / 2) - (cardRect.width / 2);

    // If overflowing bottom, place above
    if (top + cardRect.height > window.innerHeight - margin) {
      top = rect.top - cardRect.height - margin;
    }
    // Prevent top cutoff
    if (top < margin) {
      top = margin;
    }

    // Prevent left/right cutoff
    if (left < margin) {
      left = margin;
    } else if (left + cardRect.width > window.innerWidth - margin) {
      left = window.innerWidth - cardRect.width - margin;
    }

    cardEl.style.top = `${Math.round(top)}px`;
    cardEl.style.left = `${Math.round(left)}px`;
  }

  function show(target) {
    clearTimeout(hideTimeout);
    activeTarget = target;
    initTooltipDom();

    const metricKey = target.getAttribute('data-metric');
    const customText = target.getAttribute('data-tooltip');

    let html = '';
    const item = glossary[metricKey];

    if (item) {
      html = `
        <div class="iq-tooltip-header">
          <div>
            <span class="iq-tooltip-badge">${item.category || 'Financial Metric'}</span>
            <div class="iq-tooltip-title">${item.term || metricKey}</div>
          </div>
        </div>
        <div class="iq-tooltip-body">
          <div class="iq-tooltip-eli5">💡 <b>Plain English:</b> ${item.eli5 || ''}</div>
          ${item.formula ? `
            <div class="iq-tooltip-row">
              <span class="iq-tooltip-label">Calculation / Basis:</span>
              <span class="iq-tooltip-val">${item.formula}</span>
            </div>
          ` : ''}
          ${item.whyItMatters ? `
            <div class="iq-tooltip-row">
              <span class="iq-tooltip-label">Why It Matters:</span>
              <span>${item.whyItMatters}</span>
            </div>
          ` : ''}
          ${item.benchmarks ? `
            <div class="iq-tooltip-benchmarks">
              <div class="iq-tooltip-bench-green">
                <b>🟢 Favorable:</b><br>${item.benchmarks.green || 'Optimal range'}
              </div>
              <div class="iq-tooltip-bench-red">
                <b>🔴 Warning:</b><br>${item.benchmarks.red || 'Elevated risk'}
              </div>
            </div>
          ` : ''}
          ${item.example ? `
            <div class="iq-tooltip-example">📌 <b>Example:</b> ${item.example}</div>
          ` : ''}
        </div>
      `;
    } else if (customText) {
      html = `
        <div class="iq-tooltip-header">
          <span class="iq-tooltip-badge">Contextual Insight</span>
        </div>
        <div class="iq-tooltip-body">
          <div class="iq-tooltip-eli5">${customText}</div>
        </div>
      `;
    } else {
      return;
    }

    cardEl.innerHTML = html;
    cardEl.classList.add('active');
    positionTooltip(target);
  }

  function hide() {
    hideTimeout = setTimeout(() => {
      if (cardEl) {
        cardEl.classList.remove('active');
      }
      activeTarget = null;
    }, 120);
  }

  // Delegated Event Listeners for seamless dynamic elements
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-metric], [data-tooltip]');
    if (target) {
      show(target);
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('[data-metric], [data-tooltip]');
    if (target && target === activeTarget) {
      hide();
    }
  });

  // Reposition on scroll or resize
  window.addEventListener('scroll', () => {
    if (activeTarget && cardEl && cardEl.classList.contains('active')) {
      positionTooltip(activeTarget);
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (activeTarget && cardEl && cardEl.classList.contains('active')) {
      positionTooltip(activeTarget);
    }
  }, { passive: true });

  // Expose API
  window.InvestIQTooltip = {
    setGlossary: (data) => { glossary = data; },
    show,
    hide
  };

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initTooltipDom();
      loadGlossary();
    });
  } else {
    initTooltipDom();
    loadGlossary();
  }
})();
