
const usuarioId = localStorage.getItem('userId');
if (!usuarioId) {
  alert('Usuário não logado.');
  window.location.href = 'login.html';
}

async function carregarPerfil() {
  const usuarioId = localStorage.getItem('userId');
  if (!usuarioId) {
    alert('Usuário não logado.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const resposta = await fetch(`https://fireshield-1.onrender.com/usuarios/${usuarioId}`);
    const usuario = await resposta.json();

    document.getElementById('nome-texto').textContent = usuario.nome;
    document.getElementById('email-texto').textContent = usuario.email;
    document.getElementById('nome-input').value = usuario.nome;
    document.getElementById('email-input').value = usuario.email;
    document.getElementById('cpf-texto').textContent = usuario.cpf;
    document.getElementById('cpf-input').value = usuario.cpf;
    document.getElementById('cidade-texto').textContent = usuario.cidade;
    document.getElementById('cidade-input').value = usuario.cidade;
    document.getElementById('rua-texto').textContent = usuario.rua;
    document.getElementById('rua-input').value = usuario.rua;
    document.getElementById('estado-texto').textContent = usuario.estado;
    document.getElementById('estado-input').value = usuario.estado;
    document.getElementById('pais-texto').textContent = usuario.pais;
    document.getElementById('pais-input').value = usuario.pais;
    document.getElementById('foto-perfil').src = usuario.fotoPerfil || 'assets/img/perfil-icon.png';
  } catch (erro) {
    console.error('Erro ao carregar perfil:', erro);
  }
}

document.getElementById('editar-btn').addEventListener('click', () => {
  document.querySelectorAll('.editavel').forEach(input => input.style.display = 'inline');
  document.querySelectorAll('span[id$="-texto"]').forEach(span => span.style.display = 'none');
  document.getElementById('editar-btn').style.display = 'none';
  document.getElementById('salvar-btn').style.display = 'inline';
});

document.getElementById('salvar-btn').addEventListener('click', async () => {
  const usuarioId = localStorage.getItem('userId');

  const nome = document.getElementById('nome-input').value;
  const email = document.getElementById('email-input').value;
  const cpf = document.getElementById('cpf-input').value;
  const cidade = document.getElementById('cidade-input').value;
  const rua = document.getElementById('rua-input').value;
  const estado = document.getElementById('estado-input').value;
  const pais = document.getElementById('pais-input').value;
  const fotoPerfil = document.getElementById('foto-perfil').src;


  try {
    await fetch(`https://fireshield-1.onrender.com/usuarios/${usuarioId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: Number(usuarioId),
        nome: document.getElementById('nome-input').value,
        email: document.getElementById('email-input').value,
        cpf: document.getElementById('cpf-input').value,
        cidade: document.getElementById('cidade-input').value,
        estado: document.getElementById('estado-input').value,
        pais: document.getElementById('pais-input').value,
        rua: document.getElementById('rua-input').value,
        fotoPerfil: document.getElementById('foto-perfil').src
      })
    });

    alert('Perfil atualizado com sucesso!');
    carregarPerfil();

    document.querySelectorAll('.editavel').forEach(input => input.style.display = 'none');
    document.querySelectorAll('span[id$="-texto"]').forEach(span => span.style.display = 'inline');
    document.getElementById('editar-btn').style.display = 'inline';
    document.getElementById('salvar-btn').style.display = 'none';

  } catch (erro) {
    console.error('Erro ao salvar perfil:', erro);
    alert('Erro ao atualizar perfil.');
  }
});

window.addEventListener('DOMContentLoaded', carregarPerfil);


async function carregarDenuncias() {
  try {
    const resposta = await fetch('https://fireshield-1.onrender.com/denuncias');
    const todas = await resposta.json();

    const minhas = todas.filter(d => d.userId == usuarioId); // Corrigido aqui

    const lista = document.getElementById('lista-denuncias');
    lista.innerHTML = '';

    if (minhas.length === 0) {
      lista.innerHTML = '<p>Nenhuma denúncia registrada.</p>';
      return;
    }

    minhas.forEach(denuncia => {
      const div = document.createElement('div');
      div.className = 'denuncia-item';
      div.innerHTML = `
        <p><strong>Local:</strong> ${denuncia.local || 'Sem local'}</p>
        <p><strong>Descrição:</strong> ${denuncia.descricao || 'Sem descrição'}</p>
        <button class="btn-excluir-denuncia" onclick="excluirDenuncia(${denuncia.id})">Excluir</button>
      `;
      lista.appendChild(div);
    });
  } catch (erro) {
    console.error('Erro ao carregar denúncias:', erro);
    document.getElementById('lista-denuncias').innerHTML = '<p>Erro ao carregar denúncias.</p>';
  }
}

// Carregamento inicial
carregarPerfil();
carregarDenuncias();
  