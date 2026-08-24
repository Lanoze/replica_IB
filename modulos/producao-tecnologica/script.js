(() => {
  'use strict';

  const API_URL = '/gestaoibii/api/producao-tecnologica';

  const tbody = document.getElementById('tabela-producoes');
  const contador = document.getElementById('contador-registros');
  const filtroAno = document.getElementById('filtro-ano');
  const filtroTipo = document.getElementById('filtro-tipo');

  const btnNovaProducao = document.getElementById('btn-nova-producao');
  const modalOverlay = document.getElementById('modal-overlay');
  const btnFecharModal = document.getElementById('btn-fechar-modal');
  const btnCancelar = document.getElementById('btn-cancelar');
  const form = document.getElementById('form-producao');
  const formErro = document.getElementById('form-erro');
  const modalTitulo = document.getElementById('modal-titulo');
  const btnSalvarModal = document.getElementById('btn-salvar-modal');

  const toast = document.getElementById('toast');
  let toastTimer = null;

  let producoes = [];
  let editandoId = null;

  const CLASSES_TIPO = {
    'Patente': 'badge--patente',
    'Registro de Software': 'badge--software',
    'Protótipo': 'badge--prototipo',
    'Produto Tecnológico': 'badge--produto'
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
    const tipo = filtroTipo.value;

    const filtradas = producoes.filter(p =>
      (!ano || String(p.ano) === ano) &&
      (!tipo || p.tipo === tipo)
    );

    if (filtradas.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="table__vazio">
            Nenhuma produção encontrada${(ano || tipo) ? ' com os filtros selecionados' : ''}.
          </td>
        </tr>`;
    } else {
      tbody.innerHTML = filtradas.map(p => `
        <tr>
          <td class="cell-titulo">
            <strong>${escaparHtml(p.titulo)}</strong>
            ${p.numero ? `<span class="cell-subtitulo">${escaparHtml(p.numero)}</span>` : ''}
          </td>
          <td>
            <span class="badge ${CLASSES_TIPO[p.tipo] || 'badge--prototipo'}">${escaparHtml(p.tipo)}</span>${p.trl ? `<span class="tag-trl">TRL ${escaparHtml(p.trl)}</span>` : ''}
          </td>
          <td class="cell-autores">${escaparHtml(p.autores)}</td>
          <td class="cell-instituicao">${escaparHtml(p.instituicao)}</td>
          <td class="cell-projeto">${escaparHtml(p.projeto)}</td>
          <td><span class="badge ${CLASSES_CONFORMIDADE[p.conformidade_ib] || 'badge--pendente'}">${escaparHtml(p.conformidade_ib)}</span></td>
          <td class="cell-ano">${escaparHtml(p.ano)}</td>
          <td class="table__col-acoes">
            <div class="actions-cell">
              <button type="button" class="btn-action btn-action--editar" data-id="${p.id}" title="Editar produção">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button type="button" class="btn-action btn-action--excluir" data-id="${p.id}" title="Excluir produção">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
          </td>
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
      console.error('Erro ao carregar produção técnica e tecnológica:', err);
      tbody.innerHTML = `
        <tr><td colspan="8" class="table__vazio">Erro ao carregar a produção técnica e tecnológica.
        Verifique se o servidor está rodando.</td></tr>`;
      contador.textContent = '';
    }
  }

  function abrirModal(item = null) {
    form.reset();
    formErro.hidden = true;
    editandoId = item ? item.id : null;
    modalTitulo.textContent = item ? 'Editar Produção Tecnológica' : 'Nova Produção Técnica e Tecnológica';
    btnSalvarModal.textContent = item ? 'Salvar Alterações' : 'Salvar Produção';

    if (item) {
      form.titulo.value = item.titulo || '';
      form.numero.value = item.numero || '';
      form.tipo.value = item.tipo || '';
      form.trl.value = item.trl || '';
      form.autores.value = item.autores || '';
      form.instituicao.value = item.instituicao || '';
      form.projeto.value = item.projeto || '';
      form.conformidade_ib.value = item.conformidade_ib || '';
      form.ano.value = item.ano || '';
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

  async function salvarProducao(evento) {
    evento.preventDefault();

    if (!form.checkValidity()) {
      formErro.textContent = 'Preencha todos os campos obrigatórios (*) antes de salvar.';
      formErro.hidden = false;
      return;
    }

    const dados = {
      titulo: form.titulo.value,
      numero: form.numero.value,
      tipo: form.tipo.value,
      trl: form.trl.value,
      autores: form.autores.value,
      instituicao: form.instituicao.value,
      projeto: form.projeto.value,
      conformidade_ib: form.conformidade_ib.value,
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
      mostrarToast(editandoId ? 'Produção atualizada com sucesso!' : 'Produção cadastrada com sucesso!');
      await carregarProducoes();
    } catch (err) {
      formErro.textContent = `Não foi possível salvar: ${err.message}`;
      formErro.hidden = false;
    }
  }

  async function excluirProducao(id) {
    if (!confirm('Deseja realmente excluir esta produção?')) return;
    try {
      const resposta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!resposta.ok) {
        const erro = await resposta.json().catch(() => ({}));
        throw new Error(erro.detail || `HTTP ${resposta.status}`);
      }
      mostrarToast('Produção excluída com sucesso!');
      await carregarProducoes();
    } catch (err) {
      mostrarToast(`Erro ao excluir: ${err.message}`, true);
    }
  }

  btnNovaProducao.addEventListener('click', () => abrirModal(null));
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
      const item = producoes.find(p => p.id === id);
      if (item) abrirModal(item);
    }

    if (btnExcluir) {
      const id = parseInt(btnExcluir.dataset.id, 10);
      excluirProducao(id);
    }
  });

  form.addEventListener('submit', salvarProducao);
  filtroAno.addEventListener('change', renderizar);
  filtroTipo.addEventListener('change', renderizar);

  carregarProducoes();
})();
