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

  const toast = document.getElementById('toast');
  let toastTimer = null;

  let trabalhos = [];

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
          <td colspan="6" class="table__vazio">
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
        <tr><td colspan="6" class="table__vazio">Erro ao carregar a produção acadêmica.
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
      mostrarToast('Trabalho acadêmico cadastrado com sucesso!');
      await carregarTrabalhos();
    } catch (err) {
      formErro.textContent = `Não foi possível salvar: ${err.message}`;
      formErro.hidden = false;
    }
  }

  btnNovoTrabalho.addEventListener('click', abrirModal);
  btnFecharModal.addEventListener('click', fecharModal);
  btnCancelar.addEventListener('click', fecharModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) fecharModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalOverlay.hidden) fecharModal();
  });

  form.addEventListener('submit', salvarTrabalho);
  filtroAno.addEventListener('change', renderizar);
  filtroTipo.addEventListener('change', renderizar);

  carregarTrabalhos();
})();
