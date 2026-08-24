(() => {
  'use strict';

  const API_URL = '/gestaoibii/api/producao-academica';

  const tbody = document.getElementById('tabela-trabalhos');
  const contador = document.getElementById('contador-registros');
  const filtroAno = document.getElementById('filtro-ano');
  const filtroTipo = document.getElementById('filtro-tipo');

  const btnNovoTrabalho = document.getElementById('btn-novo-trabalho');
  const modalOverlay = document.getElementById('modal-overlay');
  const btnFecharModal = document.getElementById('btn-fechar-modal');
  const btnCancelar = document.getElementById('btn-cancelar');
  const form = document.getElementById('form-trabalho');
  const formErro = document.getElementById('form-erro');
  const modalTitulo = document.getElementById('modal-titulo');
  const btnSalvarModal = document.getElementById('btn-salvar-modal');

  const toast = document.getElementById('toast');
  let toastTimer = null;

  let trabalhos = [];
  let editandoId = null;

  const CLASSES_TIPO = {
    'Tese de Doutorado': 'badge--doutorado',
    'Dissertação de Mestrado': 'badge--mestrado',
    'Monografia': 'badge--monografia'
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
    const anos = [...new Set(trabalhos.map(t => t.ano))].sort((a, b) => b - a);
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
    const tipo = filtroTipo.value;

    const filtrados = trabalhos.filter(t =>
      (!ano || String(t.ano) === ano) &&
      (!tipo || t.tipo_nivel === tipo)
    );

    if (filtrados.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="table__vazio">
            Nenhum trabalho acadêmico encontrado${(ano || tipo) ? ' com os filtros selecionados' : ''}.
          </td>
        </tr>`;
    } else {
      tbody.innerHTML = filtrados.map(t => `
        <tr>
          <td class="cell-titulo">
            <strong>${escaparHtml(t.titulo)}</strong>
            ${t.subtitulo ? `<span class="cell-subtitulo">${escaparHtml(t.subtitulo)}</span>` : ''}
          </td>
          <td><span class="badge ${CLASSES_TIPO[t.tipo_nivel] || 'badge--monografia'}">${escaparHtml(t.tipo_nivel)}</span></td>
          <td class="cell-autor">${escaparHtml(t.autor)}</td>
          <td class="cell-orientador">${escaparHtml(t.orientador)}</td>
          <td class="cell-projeto">${escaparHtml(t.projeto)}</td>
          <td class="cell-ano">${escaparHtml(t.ano)}</td>
          <td class="table__col-acoes">
            <div class="actions-cell">
              <button type="button" class="btn-action btn-action--editar" data-id="${t.id}" title="Editar trabalho">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button type="button" class="btn-action btn-action--excluir" data-id="${t.id}" title="Excluir trabalho">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
          </td>
        </tr>`).join('');
    }

    contador.textContent = `Exibindo ${filtrados.length} de ${trabalhos.length} trabalho(s) acadêmico(s).`;
  }

  async function carregarTrabalhos() {
    try {
      const resposta = await fetch(API_URL);
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
      trabalhos = await resposta.json();
      atualizarFiltroAnos();
      renderizar();
    } catch (err) {
      console.error('Erro ao carregar produção acadêmica:', err);
      tbody.innerHTML = `
        <tr><td colspan="7" class="table__vazio">Erro ao carregar a produção acadêmica.
        Verifique se o servidor está rodando.</td></tr>`;
      contador.textContent = '';
    }
  }

  function abrirModal(item = null) {
    form.reset();
    formErro.hidden = true;
    editandoId = item ? item.id : null;
    modalTitulo.textContent = item ? 'Editar Trabalho Acadêmico' : 'Novo Trabalho Acadêmico';
    btnSalvarModal.textContent = item ? 'Salvar Alterações' : 'Salvar Trabalho';

    if (item) {
      form.titulo.value = item.titulo || '';
      form.subtitulo.value = item.subtitulo || '';
      form.tipo_nivel.value = item.tipo_nivel || '';
      form.ano.value = item.ano || '';
      form.autor.value = item.autor || '';
      form.orientador.value = item.orientador || '';
      form.projeto.value = item.projeto || '';
    }

    modalOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('campo-titulo').focus();
  }

  function fecharModal() {
    modalOverlay.hidden = true;
    editandoId = null;
    document.body.style.overflow = '';
  }

  async function salvarTrabalho(evento) {
    evento.preventDefault();

    if (!form.checkValidity()) {
      formErro.textContent = 'Preencha todos os campos obrigatórios (*) antes de salvar.';
      formErro.hidden = false;
      return;
    }

    const dados = {
      titulo: form.titulo.value,
      subtitulo: form.subtitulo.value,
      tipo_nivel: form.tipo_nivel.value,
      autor: form.autor.value,
      orientador: form.orientador.value,
      projeto: form.projeto.value,
      ano: form.ano.value
    };

    try {
      const url = editandoId ? `${API_URL}/${editandoId}` : API_URL;
      const metodo = editandoId ? 'PUT' : 'POST';

      const resposta = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      if (!resposta.ok) {
        const erro = await resposta.json().catch(() => ({}));
        throw new Error(erro.detail || `HTTP ${resposta.status}`);
      }

      fecharModal();
      mostrarToast(editandoId ? 'Trabalho acadêmico atualizado com sucesso!' : 'Trabalho acadêmico cadastrado com sucesso!');
      await carregarTrabalhos();
    } catch (err) {
      formErro.textContent = `Não foi possível salvar: ${err.message}`;
      formErro.hidden = false;
    }
  }

  async function excluirTrabalho(id) {
    if (!confirm('Deseja realmente excluir este trabalho acadêmico?')) return;
    try {
      const resposta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!resposta.ok) {
        const erro = await resposta.json().catch(() => ({}));
        throw new Error(erro.detail || `HTTP ${resposta.status}`);
      }
      mostrarToast('Trabalho acadêmico excluído com sucesso!');
      await carregarTrabalhos();
    } catch (err) {
      mostrarToast(`Erro ao excluir: ${err.message}`, true);
    }
  }

  btnNovoTrabalho.addEventListener('click', () => abrirModal(null));
  btnFecharModal.addEventListener('click', fecharModal);
  btnCancelar.addEventListener('click', fecharModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) fecharModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalOverlay.hidden) fecharModal();
  });

  tbody.addEventListener('click', (e) => {
    const btnEditar = e.target.closest('.btn-action--editar');
    const btnExcluir = e.target.closest('.btn-action--excluir');

    if (btnEditar) {
      const id = parseInt(btnEditar.dataset.id, 10);
      const item = trabalhos.find(t => t.id === id);
      if (item) abrirModal(item);
    }

    if (btnExcluir) {
      const id = parseInt(btnExcluir.dataset.id, 10);
      excluirTrabalho(id);
    }
  });

  form.addEventListener('submit', salvarTrabalho);
  filtroAno.addEventListener('change', renderizar);
  filtroTipo.addEventListener('change', renderizar);

  carregarTrabalhos();
})();
