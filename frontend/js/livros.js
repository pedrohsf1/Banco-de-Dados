async function loadLivroSelects() {
  try {
    const editoras = await request('GET', '/editoras')
    const selectEditora = document.querySelector('[name="id_editora"]')
    selectEditora.innerHTML = '<option value="">Selecione uma editora...</option>'
    editoras.forEach(e => {
      const opt = document.createElement('option')
      opt.value = e.id_editora
      opt.textContent = e.nome
      selectEditora.appendChild(opt)
    })
  } catch (err) {
    toast('Erro ao carregar editoras: ' + err.message, true)
  }

  try {
    const areas = await request('GET', '/areas')
    const selectArea = document.querySelector('[name="id_area"]')
    selectArea.innerHTML = '<option value="">Selecione uma área...</option>'
    areas.forEach(a => {
      const opt = document.createElement('option')
      opt.value = a.id_area
      opt.textContent = a.descricao
      selectArea.appendChild(opt)
    })
  } catch (err) {
    toast('Erro ao carregar áreas: ' + err.message, true)
  }

  try {
    const autores = await request('GET', '/autores')
    const selectAutor = document.querySelector('[name="id_autores"]')
    selectAutor.innerHTML = ''
    autores.forEach(a => {
      const opt = document.createElement('option')
      opt.value = a.id_autor
      opt.textContent = a.nome
      selectAutor.appendChild(opt)
    })
  } catch (err) {
    toast('Erro ao carregar autores: ' + err.message, true)
  }
}

async function loadLivros(filtro) {
  const url = filtro ? `?q=${encodeURIComponent(filtro)}` : ''
  try {
    const livros = await request('GET', `/livros${url}`)
    renderLivros(livros)
  } catch (err) {
    toast(err.message, true)
  }
}

function renderLivros(livros) {
  const el = document.getElementById('livros-list')
  if (!livros.length) {
    el.innerHTML = '<p class="empty">Nenhum livro encontrado.</p>'
    return
  }
  el.innerHTML = `
    <table>
      <thead><tr>
        <th>ID</th><th>ISBN</th><th>Título</th><th>Ano</th><th>Editora</th><th>Área</th><th>Autores</th>
      </tr></thead>
      <tbody>
        ${livros.map(l => `
          <tr>
            <td>${l.id_livro}</td>
            <td>${l.isbn}</td>
            <td>${l.titulo}</td>
            <td>${l.ano_publicacao || '-'}</td>
            <td>${l.nome_editora || '-'}</td>
            <td>${l.descricao_area || '-'}</td>
            <td>${l.autores || '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>`
}

document.getElementById('form-livro-create').addEventListener('submit', async (e) => {
  e.preventDefault()
  const fd = new FormData(e.target)
  const data = {
    isbn: fd.get('isbn'),
    titulo: fd.get('titulo'),
    ano_publicacao: fd.get('ano_publicacao') ? Number(fd.get('ano_publicacao')) : null,
    id_editora: Number(fd.get('id_editora')),
    id_area: Number(fd.get('id_area')),
    id_autores: Array.from(fd.getAll('id_autores')).map(Number),
  }
  try {
    await request('POST', '/livros', data)
    toast('Livro cadastrado!')
    e.target.reset()
    loadLivros()
  } catch (err) {
    toast(err.message, true)
  }
})

document.getElementById('btn-add-autor').addEventListener('click', async () => {
  const nome = prompt('Nome do novo autor:')
  if (!nome) return
  try {
    await request('POST', '/autores', { nome })
    toast('Autor cadastrado!')
    await loadLivroSelects()
  } catch (err) {
    toast(err.message, true)
  }
})

document.getElementById('btn-search-livro').addEventListener('click', () => {
  loadLivros(document.getElementById('search-livro').value)
})

document.getElementById('btn-list-all-livros').addEventListener('click', () => {
  document.getElementById('search-livro').value = ''
  loadLivros()
})

document.getElementById('search-livro').addEventListener('keyup', (e) => {
  if (e.key === 'Enter') document.getElementById('btn-search-livro').click()
})

loadLivroSelects()
loadLivros()
