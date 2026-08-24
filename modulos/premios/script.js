(() => {
  'use strict';

  const API_URL = '/gestaoibii/api/premios';

  const tbody = document.getElementById('tabela-premios');
  const contador = document.getElementById('contador-registros');
  const filtroAno = document.getElementById('filtro-ano');
  const filtroNatureza = document.getElementById('filtro-natureza');

  const btnNovoPremio = document.getElementById('btn-novo-premio');
  const modalOverlay = document.getElementById('modal-overlay');
  const btnFecharModal = document.getElementById('btn-fechar-modal');
  const btnCancelar = document.getElementById('btn-cancelar');
  const form = document.getElementById('form-premio');
  const formErro = document.getElementById('form-erro');
  const modalTitulo = document.getElementById('modal-titulo');
  const btnSalvarModal = document.getElementById('btn-salvar-modal');

  const toast = document.getElementById('toast');
  let toastTimer = null;

  let premios = [];
  let editandoId = null;

  const CLASSES_NATUREZA = {
    'Prêmio': 'badge--premio',
    'Homenagem': 'badge--homenagem',
    'Menção Honrosa': 'badge--mencao'
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

  function formatarData(iso) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return escaparHtml(iso ?? '');
    const [ano, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  function mostrarToast(mensagem, erro) {
    clearTimeout(toastTimer);
    toast.textContent = mensagem;
    toast.classList.toggle('toast--erro', Boolean(erro));
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3200);
  }

  function atualizarFiltroAnos() {
    const anos = [...new Set(premios.map(p => String(p.data_concessao).substring(0, 4)))]
      .filter(Boolean)
      .sort((a, b) => b - a);
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

    const filtrados = premios.filter(p =>
      (!ano || String(p.data_concessao).substring(0, 4) === ano) &&
      (!natureza || p.natureza_area === natureza)
    );

    if (filtrados.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="table__vazio">
            Nenhum prêmio encontrado${(ano || natureza) ? ' com os filtros selecionados' : ''}.
          </td>
        </tr>`;
    } else {
      tbody.innerHTML = filtrados.map(p => `
        <tr>
          <td class="cell-titulo">
            <strong>${escaparHtml(p.nome)}</strong>
            ${p.trabalho ? `<span class="cell-subtitulo">${escaparHtml(p.trabalho)}</span>` : ''}
          </td>
          <td><span class="badge ${CLASSES_NATUREZA[p.natureza_area] || 'badge--premio'}">${escaparHtml(p.natureza_area)}</span></td>
          <td class="cell-integrantes">${escaparHtml(p.integrantes)}</td>
          <td class="cell-instituicao">${escaparHtml(p.instituicao)}</td>
          <td class="cell-projeto">${escaparHtml(p.projeto)}</td>
          <td><span class="badge ${CLASSES_CONFORMIDADE[p.conformidade_ib] || 'badge--pendente'}">${escaparHtml(p.conformidade_ib)}</span></td>
          <td class="cell-data">${formatarData(p.data_concessao)}</td>
          <td class="table__col-acoes">
            <div class="actions-cell">
              <button type="button" class="btn-action btn-action--editar" data-id="${p.id}" title="Editar prêmio">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button type="button" class="btn-action btn-action--excluir" data-id="${p.id}" title="Excluir prêmio">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
          </td>
        </tr>`).join('');
    }

    contador.textContent = `Exibindo ${filtrados.length} de ${premios.length} registro(s).`;
  }

  async function carregarPremios() {
    try {
      const resposta = await fetch(API_URL);
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
      premios = await resposta.json();
      atualizarFiltroAnos();
      renderizar();
    } catch (err) {
      console.error('Erro ao carregar prêmios:', err);
      tbody.innerHTML = `
        <tr><td colspan="8" class="table__vazio">Erro ao carregar os prêmios.
        Verifique se o servidor está rodando.</td></tr>`;
      contador.textContent = '';
    }
  }

  function abrirModal(item = null) {
    form.reset();
    formErro.hidden = true;
    editandoId = item ? item.id : null;
    modalTitulo.textContent = item ? 'Editar Prêmio' : 'Novo Prêmio';
    btnSalvarModal.textContent = item ? 'Salvar Alterações' : 'Salvar Prêmio';

    if (item) {
      form.nome.value = item.nome || '';
      form.trabalho.value = item.trabalho || '';
      form.natureza_area.value = item.natureza_area || '';
      form.conformidade_ib.value = item.conformidade_ib || '';
      form.integrantes.value = item.integrantes || '';
      form.instituicao.value = item.instituicao || '';
      form.projeto.value = item.projeto || '';
      form.data_concessao.value = item.data_concessao ? item.data_concessao.substring(0, 10) : '';
    }

    modalOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('campo-nome').focus();
  }

  function fecharModal() {
    modalOverlay.hidden = true;
    editandoId = null;
    document.body.style.overflow = '';
  }

  async function salvarPremio(evento) {
    evento.preventDefault();

    if (!form.checkValidity()) {
      formErro.textContent = 'Preencha todos os campos obrigatórios (*) antes de salvar.';
      formErro.hidden = false;
      return;
    }

    const dados = {
      nome: form.nome.value,
      trabalho: form.trabalho.value,
      natureza_area: form.natureza_area.value,
      integrantes: form.integrantes.value,
      instituicao: form.instituicao.value,
      projeto: form.projeto.value,
      conformidade_ib: form.conformidade_ib.value,
      data_concessao: form.data_concessao.value
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
      mostrarToast(editandoId ? 'Prêmio atualizado com sucesso!' : 'Prêmio cadastrado com sucesso!');
      await carregarPremios();
    } catch (err) {
      formErro.textContent = `Não foi possível salvar: ${err.message}`;
      formErro.hidden = false;
    }
  }

  async function excluirPremio(id) {
    if (!confirm('Deseja realmente excluir este prêmio?')) return;
    try {
      const resposta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!resposta.ok) {
        const erro = await resposta.json().catch(() => ({}));
        throw new Error(erro.detail || `HTTP ${resposta.status}`);
      }
      mostrarToast('Prêmio excluído com sucesso!');
      await carregarPremios();
    } catch (err) {
      mostrarToast(`Erro ao excluir: ${err.message}`, true);
    }
  }

  btnNovoPremio.addEventListener('click', () => abrirModal(null));
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
      const item = premios.find(p => p.id === id);
      if (item) abrirModal(item);
    }

    if (btnExcluir) {
      const id = parseInt(btnExcluir.dataset.id, 10);
      excluirPremio(id);
    }
  });

  form.addEventListener('submit', salvarPremio);
  filtroAno.addEventListener('change', renderizar);
  filtroNatureza.addEventListener('change', renderizar);

  carregarPremios();
})();
