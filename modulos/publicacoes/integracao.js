/* ============================================================
   Integração: aba "Produção Científica" » módulo Publicações
   Carregado pela pagina.html junto com a SPA compilada.
   Intercepta o clique na aba e exibe o módulo em um painel
   sobreposto (iframe), já que a view nativa da SPA não existe.
   ============================================================ */
(() => {
  'use strict';

  const ALVO = 'Produção Científica';
  const URL_MODULO = '/producao-cientifica/publicacoes';

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
      gap: 12px;
      padding: 12px 16px;
      border-bottom: 1px solid #e2e8f0;
      background: #f8fafc;
    }
    .pcib-titulo {
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      color: #16406f;
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
      transition: background-color .15s ease, color .15s ease;
    }
    .pcib-btn--modulo {
      background-color: #1e56a0;
      color: #ffffff;
    }
    .pcib-btn--modulo:hover { background-color: #16406f; }
    .pcib-btn--fechar {
      background: transparent;
      color: #64748b;
      border-color: #e2e8f0;
      font-size: 1.1rem;
      line-height: 1;
      padding: 4px 10px;
    }
    .pcib-btn--fechar:hover { color: #0f172a; background: #f1f5f9; }
    .pcib-conteudo {
      flex: 1;
      border: none;
      width: 100%;
      height: 100%;
    }
    @media (max-width: 720px) {
      .pcib-overlay { padding: 0; }
      .pcib-panel { width: 100%; height: 100%; border-radius: 0; }
    }
  `;

  function criarEstilo() {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  let overlay, iframe, carregado = false;

  function criarPainel() {
    overlay = document.createElement('div');
    overlay.className = 'pcib-overlay';
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="pcib-panel" role="dialog" aria-modal="true" aria-label="Produção Científica">
        <div class="pcib-header">
          <span class="pcib-titulo">Produção Científica</span>
          <button type="button" class="pcib-btn pcib-btn--modulo">Publicações</button>
          <button type="button" class="pcib-btn pcib-btn--fechar" aria-label="Fechar">&times;</button>
        </div>
        <iframe class="pcib-conteudo" title="Módulo Publicações"></iframe>
      </div>`;

    iframe = overlay.querySelector('iframe');

    overlay.querySelector('.pcib-btn--modulo').addEventListener('click', abrirModulo);
    overlay.querySelector('.pcib-btn--fechar').addEventListener('click', fecharPainel);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) fecharPainel();
    });

    document.body.appendChild(overlay);
  }

  function abrirPainel() {
    if (!overlay) criarPainel();
    abrirModulo();
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function abrirModulo() {
    if (!carregado) {
      iframe.src = URL_MODULO;
      carregado = true;
    }
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
