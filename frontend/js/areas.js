async function loadAreas() {
  try {
    const areas = await request('GET', '/areas')
    renderAreas(areas)
  } catch (err) {
    toast(err.message, true)
  }
}

function renderAreas(areas) {
  const el = document.getElementById('areas-list')
  if (!areas.length) {
    el.innerHTML = '<p class="empty">Nenhuma área encontrada.</p>'
    return
  }
  el.innerHTML = `
    <table>
      <thead><tr>
        <th>ID</th><th>Descrição</th><th>Ações</th>
      </tr></thead>
      <tbody>
        ${areas.map(a => `
          <tr>
            <td>${a.id_area}</td>
            <td>${a.descricao}</td>
            <td>
              <button class="small" onclick="editArea(${a.id_area}, '${a.descricao.replace(/'/g, "\\'")}')">Editar</button>
              <button class="small danger" onclick="deleteArea(${a.id_area})">Excluir</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>`
}

async function deleteArea(id) {
  if (!confirm('Excluir esta área?')) return
  try {
    await request('DELETE', `/areas/${id}`)
    toast('Área excluída com sucesso!')
    loadAreas()
  } catch (err) {
    toast(err.message, true)
  }
}

function editArea(id, descricaoAtual) {
  const descricao = prompt('Nova descrição:', descricaoAtual)
  if (!descricao || descricao === descricaoAtual) return
  updateArea(id, { descricao })
}

async function updateArea(id, data) {
  try {
    await request('PUT', `/areas/${id}`, data)
    toast('Área atualizada com sucesso!')
    loadAreas()
  } catch (err) {
    toast(err.message, true)
  }
}

document.getElementById('form-area-create').addEventListener('submit', async (e) => {
  e.preventDefault()
  const fd = new FormData(e.target)
  const data = Object.fromEntries(fd)
  try {
    await request('POST', '/areas', data)
    toast('Área cadastrada!')
    e.target.reset()
    loadAreas()
  } catch (err) {
    toast(err.message, true)
  }
})

loadAreas()
