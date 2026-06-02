async function loadAcervo(filtro) {
  try {
    const url = filtro ? `/exemplares?q=${encodeURIComponent(filtro)}` : '/exemplares'
    const items = await request('GET', url)
    const container = document.getElementById('acervo-list')
    if (!container) return

    if (items.length === 0) {
      container.innerHTML = '<p class="empty">Nenhum exemplar encontrado.</p>'
      return
    }

    const table = document.createElement('table')
    table.innerHTML = `
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>ISBN</th>
          <th>Código de Barras</th>
          <th>Condição</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(d => `
          <tr>
            <td>${d.id_exemplar}</td>
            <td>${d.titulo_livro}</td>
            <td>${d.isbn}</td>
            <td>${d.codigo_barras}</td>
            <td>${d.condicao}</td>
            <td style="color:${d.status === 'Disponível' ? '#28a745' : '#dc3545'};font-weight:600">${d.status}</td>
          </tr>
        `).join('')}
      </tbody>
    `
    container.innerHTML = ''
    container.appendChild(table)
  } catch (err) {
    const c = document.getElementById('acervo-list')
    if (c) c.innerHTML = '<p class="empty">Erro ao carregar: ' + err.message + '</p>'
  }
}

document.getElementById('btn-search-acervo').addEventListener('click', () => {
  const q = document.getElementById('search-acervo').value.trim()
  loadAcervo(q || undefined)
})

document.getElementById('btn-list-all-acervo').addEventListener('click', () => {
  document.getElementById('search-acervo').value = ''
  loadAcervo()
})

document.getElementById('search-acervo').addEventListener('keyup', (e) => {
  if (e.key === 'Enter') document.getElementById('btn-search-acervo').click()
})

loadAcervo()
