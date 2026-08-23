(() => {
  'use strict';

  const API_URL = '/gestaoibii/api/publicacoes';

  const tbody = document.getElementById('tabela-publicacoes');
  const contador = document.getElementById('contador-registros');
  const filtroAno = document.getElementById('filtro-ano');
  const filtroStatus = document.getElementById('filtro-status');

  const btnNovaPublicacao = document.getElementById('btn-nova-publicacao');
  const modalOverlay = document.getElementById('modal-overlay');
  const btnFecharModal = document.getElementById('btn-fechar-modal');
  const btnCancelar = document.getElementById('btn-cancelar');
  const form = document.getElementById('form-publicacao');
  const formErro = document.getElementById('form-erro');

  const toast = document.getElementById('toast');
  let toastTimer = null;

  let publicacoes = [];

  const CLASSES_STATUS = {
    'Publicado': 'badge--publicado',
    'Aceito': 'badge--aceito',
    'Em Revisão': 'badge--revisao',
    'Submetido': 'badge--submetido'
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

  function badge(valor, classes) {
    const classe = classes[valor] || 'badge--submetido';
    return `<span class="badge ${classe}">${escaparHtml(valor)}</span>`;
  }

  function mostrarToast(mensagem, erro) {
    clearTimeout(toastTimer);
    toast.textContent = mensagem;
    toast.classList.toggle('toast--erro', Boolean(erro));
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3200);
  }

  function atualizarFiltroAnos() {
    const anos = [...new Set(publicacoes.map(p => p.ano))].sort((a, b) => b - a);
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
    const status = filtroStatus.value;

    const filtradas = publicacoes.filter(p =>
      (!ano || String(p.ano) === ano) &&
      (!status || p.status === status)
    );

    if (filtradas.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="table__vazio">
            Nenhuma publicação encontrada${(ano || status) ? ' com os filtros selecionados' : ''}.
          </td>
        </tr>`;
    } else {
      tbody.innerHTML = filtradas.map(p => `
        <tr>
          <td class="cell-titulo">
            <strong>${escaparHtml(p.titulo)}</strong>
            <span class="tag-natureza">${escaparHtml(p.natureza)}</span>
          </td>
          <td>${badge(p.status, CLASSES_STATUS)}</td>
          <td class="cell-veiculo">${escaparHtml(p.veiculo)}</td>
          <td class="cell-projeto">${escaparHtml(p.projeto)}</td>
          <td>${badge(p.conformidade_ib, CLASSES_CONFORMIDADE)}</td>
          <td class="cell-ano">${escaparHtml(p.ano)}</td>
        </tr>`).join('');
    }

    contador.textContent = `Exibindo ${filtradas.length} de ${publicacoes.length} publicação(ões).`;
  }

  async function carregarPublicacoes() {
    try {
      const resposta = await fetch(API_URL);
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
      publicacoes = await resposta.json();
      atualizarFiltroAnos();
      renderizar();
    } catch (err) {
      console.error('Erro ao carregar publicações:', err);
      tbody.innerHTML = `
        <tr><td colspan="6" class="table__vazio">Erro ao carregar as publicações.
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

  async function salvarPublicacao(evento) {
    evento.preventDefault();

    if (!form.checkValidity()) {
      formErro.textContent = 'Preencha todos os campos obrigatórios (*) antes de salvar.';
      formErro.hidden = false;
      return;
    }

    const dados = {
      titulo: form.titulo.value,
      natureza: form.natureza.value,
      status: form.status.value,
      veiculo: form.veiculo.value,
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
      mostrarToast('Publicação cadastrada com sucesso!');
      await carregarPublicacoes();
    } catch (err) {
      formErro.textContent = `Não foi possível salvar: ${err.message}`;
      formErro.hidden = false;
    }
  }

  btnNovaPublicacao.addEventListener('click', abrirModal);
  btnFecharModal.addEventListener('click', fecharModal);
  btnCancelar.addEventListener('click', fecharModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) fecharModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalOverlay.hidden) fecharModal();
  });

  form.addEventListener('submit', salvarPublicacao);
  filtroAno.addEventListener('change', renderizar);
  filtroStatus.addEventListener('change', renderizar);

  carregarPublicacoes();
})();
