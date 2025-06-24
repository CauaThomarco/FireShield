
document.addEventListener('DOMContentLoaded', function () {
  var perfilContainer = document.getElementById('perfil-container');
  var logado = localStorage.getItem('logado');

  if (logado === 'true') {
    perfilContainer.innerHTML = `
        <div class="perfil-menu">
          <img src="assets/img/perfil-icon.png" alt="Perfil" class="perfil-icone" id="perfil-icone">
          <div class="perfil-opcoes" id="perfil-opcoes" style="display: none;">
            <a href="perfil.html" class="btn perfil-btn">Ver Perfil</a>
            <button id="logout-btn" class="btn logout-btn">Sair</button>
          </div>
        </div>
      `;

    // Mostrar opções ao clicar na bolinha
    document.getElementById('perfil-icone').addEventListener('click', function () {
      var opcoes = document.getElementById('perfil-opcoes');
      opcoes.style.display = (opcoes.style.display === 'none') ? 'block' : 'none';
    });

    // Função de deslogar
    document.getElementById('logout-btn').addEventListener('click', function () {
      localStorage.removeItem('logado');
      localStorage.removeItem('admin');
      localStorage.removeItem('cpfLogado');
      alert('Você saiu da conta.');
      window.location.href = 'index.html';
    });

  } else {
    perfilContainer.innerHTML = `
        <a href="login.html" class="btn login-btn">Entrar</a>
        <a href="register.html" class="btn register-btn">Registrar-se</a>
      `;
  }
});
const msg = sessionStorage.getItem('mensagemLogin');
if (msg) {
  alert(msg);
  sessionStorage.removeItem('mensagemLogin');
}
document.addEventListener('DOMContentLoaded', function () {
  const isAdmin = localStorage.getItem('admin') === 'true';
  const adminLink = document.getElementById('admin-link');

  if (isAdmin && adminLink) {
    adminLink.style.display = 'inline-block';
  }
});
const feed = document.getElementById('feed');
const API_URL = 'http://localhost:3000/denuncias';

function formatarDataHora(dataStr, horaStr) {
  if (!dataStr || !horaStr) return '';
  const dt = new Date(dataStr + 'T' + horaStr);
  return dt.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

function criarPost(denuncia) {
  const post = document.createElement('article');
  post.classList.add('post');

  const dataHoraFormatada = formatarDataHora(denuncia.data, denuncia.hora);

  post.innerHTML = `
      <h3>${denuncia.local} (${denuncia.tipoArea || 'Área não informada'})</h3>
      <small>Data/hora: ${dataHoraFormatada}</small>
      <p>${denuncia.descricao}</p>
      ${denuncia.arquivo ? `<img src="${denuncia.arquivo}" alt="Imagem denúncia">` : ''}
      ${(denuncia.nome || denuncia.telefone || denuncia.email) ? `
        <small>
          <strong>Denunciante:</strong> ${denuncia.nome || '-'}<br>
          <strong>Telefone:</strong> ${denuncia.telefone || '-'}<br>
          <strong>E-mail:</strong> ${denuncia.email || '-'}
        </small>
      ` : ''}
    `;
  return post;
}

async function carregarDenuncias() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Erro ao buscar denúncias');
    const denuncias = await res.json();

    feed.querySelectorAll('.post').forEach(post => post.remove());

    denuncias.sort((a, b) => {
      const dtA = new Date(a.data + 'T' + a.hora);
      const dtB = new Date(b.data + 'T' + b.hora);
      return dtB - dtA;
    });

    denuncias.forEach(denuncia => {
      const post = criarPost(denuncia);
      feed.appendChild(post);
    });
  } catch (error) {
    console.error('Erro ao carregar denúncias:', error);
    feed.innerHTML += '<p>Erro ao carregar as denúncias. Tente novamente mais tarde.</p>';
  }
}

carregarDenuncias();
setInterval(carregarDenuncias, 60000);