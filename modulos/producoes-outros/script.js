(() => {
  'use strict';

  const API_URL = '/gestaoibii/api/producoes-outros';

  const tbody = document.getElementById('tabela-producoes');
  const contador = document.getElementById('contador-registros');
  const filtroAno = document.getElementById('filtro-ano');
  const filtroNatureza = document.getElementById('filtro-natureza');

  const btnNovaProducao = document.getElementById('btn-nova-producao');
  const modalOverlay = document.getElementById('modal-overlay');
  const btnFecharModal = document.getElementById('btn-fechar-modal');
  const btnCancelar = document.getElementById('btn-cancelar');
  const form = document.getElementById('form-producao');
  const formErro = document.getElementById('form-erro');

  const toast = document.getElementById('toast');
  let toastTimer = null;

  let producoes = [];

  const CLASSES_NATUREZA = {
    'Capacitação': 'badge--capacitacao',
    'Método': 'badge--metodo',
    'Framework': 'badge--framework',
    'Relatório Técnico': 'badge--relatorio',
    'Produção Diversa': 'badge--diversa'
  };

  const CLASSES_CONFORMIDADE = {
    'Sim': 'badge--sim',
    'Não': 'badge--nao',
    'Pendente': 'badge--pendente'
  };

  function escaparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = String(texto ?? '');
    return div.innerHTML;
  }

  function mostrarToast(mensagem, erro) {
    clearTimeout(toastTimer);
    toast.textContent = mensagem;
    toast.classList.toggle('toast--erro', Boolean(erro));
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3200);
  }

  function atualizarFiltroAnos() {
    const anos = [...new Set(producoes.map(p => p.ano))].sort((a, b) => b - a);
    const selecionado = filtroAno.value;
    filtroAno.innerHTML =
      '<option value="">Todos</option>' +
      anos.map(a => `<option value="${a}">${a}</option>`).join('');
    if (anos.some(a => String(a) === selecionado)) {
      filtroAno.value = selecionado;
    }
  }

  function renderizar() {
    const ano = filtroAno.value;
    const natureza = filtroNatureza.value;

    const filtradas = producoes.filter(p =>
      (!ano || String(p.ano) === ano) &&
      (!natureza || p.natureza === natureza)
    );

    if (filtradas.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="table__vazio">
            Nenhuma produção encontrada${(ano || natureza) ? ' com os filtros selecionados' : ''}.
          </td>
        </tr>`;
    } else {
      tbody.innerHTML = filtradas.map(p => `
        <tr>
          <td class="cell-titulo">
            <strong>${escaparHtml(p.titulo)}</strong>
            ${p.descricao ? `<span class="cell-subtitulo">${escaparHtml(p.descricao)}</span>` : ''}
          </td>
          <td><span class="badge ${CLASSES_NATUREZA[p.natureza] || 'badge--diversa'}">${escaparHtml(p.natureza)}</span></td>
          <td class="cell-autores">${escaparHtml(p.autores)}</td>
          <td class="cell-instituicao">${escaparHtml(p.instituicao)}</td>
          <td class="cell-projeto">${escaparHtml(p.projeto)}</td>
          <td><span class="badge ${CLASSES_CONFORMIDADE[p.conformidade_ib] || 'badge--pendente'}">${escaparHtml(p.conformidade_ib)}</span></td>
          <td class="cell-ano">${escaparHtml(p.ano)}</td>
        </tr>`).join('');
    }

    contador.textContent = `Exibindo ${filtradas.length} de ${producoes.length} produção(ões).`;
  }

  async function carregarProducoes() {
    try {
      const resposta = await fetch(API_URL);
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
      producoes = await resposta.json();
      atualizarFiltroAnos();
      renderizar();
    } catch (err) {
      console.error('Erro ao carregar outras produções:', err);
      tbody.innerHTML = `
        <tr><td colspan="7" class="table__vazio">Erro ao carregar as produções.
        Verifique se o servidor está rodando.</td></tr>`;
      contador.textContent = '';
    }
  }

  function abrirModal() {
    form.reset();
    formErro.hidden = true;
    modalOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('campo-titulo').focus();
  }

  function fecharModal() {
    modalOverlay.hidden = true;
    document.body.style.overflow = '';
  }

  async function salvarProducao(evento) {
    evento.preventDefault();

    if (!form.checkValidity()) {
      formErro.textContent = 'Preencha todos os campos obrigatórios (*) antes de salvar.';
      formErro.hidden = false;
      return;
    }

    const dados = {
      titulo: form.titulo.value,
      descricao: form.descricao.value,
      natureza: form.natureza.value,
      autores: form.autores.value,
      instituicao: form.instituicao.value,
      projeto: form.projeto.value,
      conformidade_ib: form.conformidade_ib.value,
      ano: form.ano.value
    };

    try {
      const resposta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      if (!resposta.ok) {
        const erro = await resposta.json().catch(() => ({}));
        throw new Error(erro.detail || `HTTP ${resposta.status}`);
      }

      fecharModal();
      mostrarToast('Produção cadastrada com sucesso!');
      await carregarProducoes();
    } catch (err) {
      formErro.textContent = `Não foi possível salvar: ${err.message}`;
      formErro.hidden = false;
    }
  }

  btnNovaProducao.addEventListener('click', abrirModal);
  btnFecharModal.addEventListener('click', fecharModal);
  btnCancelar.addEventListener('click', fecharModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) fecharModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalOverlay.hidden) fecharModal();
  });

  form.addEventListener('submit', salvarProducao);
  filtroAno.addEventListener('change', renderizar);
  filtroNatureza.addEventListener('change', renderizar);

  carregarProducoes();
})();
