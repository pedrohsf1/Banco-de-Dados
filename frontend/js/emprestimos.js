async function loadSelect(selector, labelFn, url) {
  try {
    const items = await request('GET', url)
    const select = document.querySelector(selector)
    const placeholder = select.querySelector('option')
    select.innerHTML = ''
    select.appendChild(placeholder)
    items.forEach(item => {
      const opt = document.createElement('option')
      opt.value = Object.values(item)[0]
      opt.textContent = labelFn(item)
      select.appendChild(opt)
    })
  } catch (err) {
    toast('Erro ao carregar ' + selector + ': ' + err.message, true)
  }
}

async function loadEmprestimoSelects() {
  loadSelect('[name="id_aluno"]', a => `${a.nome} (${a.matricula})`, '/alunos')
  loadSelect('[name="id_exemplar"]', e => `${e.titulo_livro} (${e.codigo_barras})`, '/exemplares')
  loadSelect('[name="id_funcionario"]', f => `${f.nome} (${f.cargo})`, '/funcionarios')
  await loadEmprestimosReturnSelect()
}

async function loadEmprestimosReturnSelect() {
  try {
    const items = await request('GET', '/emprestimos')
    const select = document.querySelector('[name="id_emprestimo"]')
    if (!select) return
    const placeholder = select.querySelector('option')
    select.innerHTML = ''
    select.appendChild(placeholder)
    const hoje = new Date()
    items.forEach(item => {
      const opt = document.createElement('option')
      opt.value = item.id_emprestimo
      const prevista = new Date(item.data_devolucao_prevista + (item.data_devolucao_prevista.includes('T') ? '' : 'T00:00:00'))
      const atrasado = prevista < hoje
      opt.textContent = `#${item.id_emprestimo} - ${item.nome_aluno} - ${item.titulo_livro} (desde ${formatDate(item.data_emprestimo)}, vencia ${formatDate(item.data_devolucao_prevista)})${atrasado ? ' - EM ATRASO' : ''}`
      if (atrasado) opt.style.color = '#dc3545'
      select.appendChild(opt)
    })
  } catch (err) {
    toast('Erro ao carregar empréstimos: ' + err.message, true)
  }
}

const previewEl = document.getElementById('data-prevista-preview')
if (previewEl) {
  function updatePreview() {
    const dias = parseInt(document.getElementById('dias-emprestimo').value) || 7
    const d = new Date()
    d.setDate(d.getDate() + dias)
    previewEl.textContent = 'Devolução prevista: ' + d.toLocaleDateString('pt-BR')
  }
  document.getElementById('dias-emprestimo').addEventListener('input', updatePreview)
  updatePreview()
}

document.getElementById('form-emprestimo-create').addEventListener('submit', async (e) => {
  e.preventDefault()
  const fd = new FormData(e.target)
  const data = Object.fromEntries(fd)
  data.id_aluno = Number(data.id_aluno)
  data.id_exemplar = Number(data.id_exemplar)
  data.id_funcionario = Number(data.id_funcionario)
  data.dias_emprestimo = Number(data.dias_emprestimo)
  try {
    await request('POST', '/emprestimos', data)
    toast('Empréstimo registrado!')
    e.target.reset()
    e.target.querySelector('[name="dias_emprestimo"]').value = 7
    loadEmprestimoSelects()
  } catch (err) {
    toast(err.message, true)
  }
})

document.getElementById('form-emprestimo-return').addEventListener('submit', async (e) => {
  e.preventDefault()
  const fd = new FormData(e.target)
  const id = Number(fd.get('id_emprestimo'))
  const valor_multa_diaria = Number(fd.get('valor_multa_diaria'))
  try {
    await request('PUT', `/emprestimos/${id}/devolver`, { valor_multa_diaria })
    toast('Devolução registrada!')
    e.target.reset()
    e.target.querySelector('[name="valor_multa_diaria"]').value = 2.50
    loadEmprestimoSelects()
  } catch (err) {
    toast(err.message, true)
  }
})

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = dateStr.includes('T') ? new Date(dateStr) : new Date(dateStr + 'T00:00:00')
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('pt-BR')
}

function formatMoney(value) {
  if (!value || value === 0) return 'R$ 0,00'
  return 'R$ ' + Number(value).toFixed(2).replace('.', ',')
}

function renderEmprestimosTable(items, containerId, vazioMsg, erroMsg) {
  const container = document.getElementById(containerId)
  if (!container) return
  if (!items || items.length === 0) {
    container.innerHTML = `<p class="empty">${vazioMsg}</p>`
    return
  }
  const table = document.createElement('table')
  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th><th>Aluno</th><th>Livro</th><th>Empréstimo</th><th>Prevista</th><th>Devolução</th><th>Multa</th><th>Funcionário</th>
      </tr>
    </thead>
    <tbody>
      ${items.map(d => `
        <tr>
          <td>${d.id_emprestimo}</td>
          <td>${d.nome_aluno} (${d.matricula})</td>
          <td>${d.titulo_livro}</td>
          <td>${formatDate(d.data_emprestimo)}</td>
          <td>${formatDate(d.data_devolucao_prevista)}</td>
          <td>${formatDate(d.data_devolucao_real)}</td>
          <td>${formatMoney(d.valor_multa)}</td>
          <td>${d.nome_funcionario}</td>
        </tr>
      `).join('')}
    </tbody>
  `
  container.innerHTML = ''
  container.appendChild(table)
}

async function loadHistorico(filtro) {
  try {
    const url = filtro ? `/emprestimos/todos?q=${encodeURIComponent(filtro)}` : '/emprestimos/todos'
    const items = await request('GET', url)
    renderEmprestimosTable(items, 'emprestimos-historico', 'Nenhum empréstimo encontrado.', null)
  } catch (err) {
    const c = document.getElementById('emprestimos-historico')
    if (c) c.innerHTML = '<p class="empty">Erro ao carregar: ' + err.message + '</p>'
  }
}

document.getElementById('btn-search-emprestimo').addEventListener('click', () => {
  const q = document.getElementById('search-emprestimo').value.trim()
  loadHistorico(q || undefined)
})

document.getElementById('btn-list-all-emprestimos').addEventListener('click', () => {
  document.getElementById('search-emprestimo').value = ''
  loadHistorico()
})

document.getElementById('search-emprestimo').addEventListener('keyup', (e) => {
  if (e.key === 'Enter') document.getElementById('btn-search-emprestimo').click()
})

loadEmprestimoSelects()
loadHistorico()
