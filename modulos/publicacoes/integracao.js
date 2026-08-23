/* ============================================================
   Integração: aba "Produção Científica" » módulos
   Carregado pela pagina.html junto com a SPA compilada.
   Intercepta o clique na aba e exibe os módulos disponíveis em
   um painel sobreposto (iframes), já que a view nativa da SPA
   não existe (chunks ausentes).
   ============================================================ */
(() => {
  'use strict';

  const ALVO = 'Produção Científica';
  const MODULOS = [
    { rotulo: 'Publicações', url: '/producao-cientifica/publicacoes' },
    { rotulo: 'Produção Acadêmica', url: '/producao-cientifica/producao-academica' },
    { rotulo: 'Prêmios', url: '/producao-cientifica/premios' },
    { rotulo: 'Produção Técnica', url: '/producao-cientifica/producao-tecnologica' },
    { rotulo: 'Outras Produções', url: '/producao-cientifica/producoes-outros' }
  ];

  const css = `
    .pcib-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background-color: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(2px);
    }
    .pcib-overlay[hidden] { display: none; }
    .pcib-panel {
      display: flex;
      flex-direction: column;
      width: min(1400px, 96vw);
      height: min(920px, 94vh);
      background: #ffffff;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 24px 64px rgba(15, 23, 42, 0.35);
      animation: pcib-entra 0.18s ease-out;
    }
    @keyframes pcib-entra {
      from { opacity: 0; transform: translateY(14px) scale(0.985); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .pcib-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-bottom: 1px solid #e2e8f0;
      background: #f8fafc;
      flex-wrap: wrap;
    }
    .pcib-titulo {
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      color: #4E7020;
      margin-right: auto;
    }
    .pcib-btn {
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
      font-size: 0.85rem;
      font-weight: 600;
      padding: 8px 16px;
      border-radius: 8px;
      border: 1px solid transparent;
      cursor: pointer;
      transition: background-color .15s ease, color .15s ease, box-shadow .15s ease;
    }
    .pcib-btn--modulo {
      background-color: #89BE30;
      color: #ffffff;
    }
    .pcib-btn--modulo:hover { background-color: #6E9A26; }
    .pcib-btn--modulo[aria-pressed="true"] {
      background-color: #6E9A26;
      box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.45);
    }
    .pcib-btn--fechar {
      background: transparent;
      color: #64748b;
      border-color: #e2e8f0;
      font-size: 1.1rem;
      line-height: 1;
      padding: 4px 10px;
    }
    .pcib-btn--fechar:hover { color: #0f172a; background: #f1f5f9; }
    .pcib-corpo {
      position: relative;
      flex: 1;
      background: #ffffff;
    }
    .pcib-conteudo {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: none;
    }
    .pcib-placeholder {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
      font-size: 0.9rem;
      color: #64748b;
    }
    @media (max-width: 720px) {
      .pcib-overlay { padding: 0; }
      .pcib-panel { width: 100%; height: 100%; border-radius: 0; }
    }
  `;

  let overlay, corpo, placeholder;
  const frames = new Map();

  function criarEstilo() {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function montarBotoes() {
    return MODULOS.map(m =>
      `<button type="button" class="pcib-btn pcib-btn--modulo" data-url="${m.url}" aria-pressed="false">${m.rotulo}</button>`
    ).join('');
  }

  function criarPainel() {
    overlay = document.createElement('div');
    overlay.className = 'pcib-overlay';
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="pcib-panel" role="dialog" aria-modal="true" aria-label="Produção Científica">
        <div class="pcib-header">
          <span class="pcib-titulo">Produção Científica</span>
          ${montarBotoes()}
          <button type="button" class="pcib-btn pcib-btn--fechar" aria-label="Fechar">&times;</button>
        </div>
        <div class="pcib-corpo">
          <p class="pcib-placeholder">Selecione um dos módulos acima para visualizar.</p>
        </div>
      </div>`;

    corpo = overlay.querySelector('.pcib-corpo');
    placeholder = overlay.querySelector('.pcib-placeholder');

    overlay.querySelector('.pcib-btn--fechar').addEventListener('click', fecharPainel);

    overlay.querySelector('.pcib-header').addEventListener('click', (e) => {
      const btn = e.target.closest('.pcib-btn--modulo');
      if (btn) mostrarModulo(btn.dataset.url, btn);
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) fecharPainel();
    });

    document.body.appendChild(overlay);
  }

  function obterFrame(url) {
    if (!frames.has(url)) {
      const f = document.createElement('iframe');
      f.className = 'pcib-conteudo';
      f.title = url;
      f.src = url;
      frames.set(url, f);
      corpo.appendChild(f);
    }
    return frames.get(url);
  }

  function mostrarModulo(url, btn) {
    placeholder.hidden = true;
    frames.forEach(f => { f.style.display = 'none'; });
    obterFrame(url).style.display = 'block';

    overlay.querySelectorAll('.pcib-btn--modulo').forEach(b =>
      b.setAttribute('aria-pressed', String(b === btn))
    );
  }

  function abrirPainel() {
    if (!overlay) criarPainel();
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function fecharPainel() {
    overlay.hidden = true;
    document.body.style.overflow = '';
  }

  /* Intercepta o clique na aba ANTES de chegar ao React (fase de captura,
     no document — o React escuta no contêiner #root, mais abaixo na árvore). */
  function ehAbaProducaoCientifica(elemento) {
    const clicavel = elemento && elemento.closest(
      'button, a, [role="button"], [role="tab"], [role="menuitem"], li'
    );
    if (!clicavel) return false;
    const texto = (clicavel.textContent || '').trim().replace(/\s+/g, ' ');
    return texto === ALVO || texto.startsWith(ALVO + ' ');
  }

  document.addEventListener('click', (e) => {
    if (ehAbaProducaoCientifica(e.target)) {
      e.preventDefault();
      e.stopImmediatePropagation();
      abrirPainel();
    }
  }, true);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && !overlay.hidden) fecharPainel();
  });

  criarEstilo();
})();
