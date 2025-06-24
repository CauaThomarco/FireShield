document.getElementById('login-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const cpf = document.getElementById('cpf').value;
  const senha = document.getElementById('senha').value;

  try {
    const resposta = await fetch('http://localhost:3000/usuarios');
    const usuarios = await resposta.json();

    const usuario = usuarios.find(u => u.cpf === cpf && u.senha === senha);

    if (usuario) {
      // Salva dados no localStorage
      localStorage.setItem('logado', 'true');
      localStorage.setItem('userId', usuario.id); // importante para o perfil
      localStorage.setItem('usuarioNome', usuario.nome);
      localStorage.setItem('usuarioEmail', usuario.email);
      localStorage.setItem('usuarioCpf', usuario.cpf);
      localStorage.setItem('usuarioCidade', usuario.cidade);
      localStorage.setItem('usuarioEstado', usuario.estado);
      localStorage.setItem('usuarioPais', usuario.pais);
      localStorage.setItem('usuarioRua', usuario.rua);
      localStorage.setItem('usuarioFoto', usuario.fotoPerfil || '');

      // Se for admin (ex: CPF específico), seta a flag de admin
      if (usuario.cpf === '12345678910') {
        localStorage.setItem('admin', 'true');
      } else {
        localStorage.removeItem('admin');
      }

      // Mostra mensagem na home
      sessionStorage.setItem('mensagemLogin', 'Você foi logado com sucesso!');
      window.location.href = 'index.html';
    } else {
      alert('CPF ou senha inválidos!');
    }

  } catch (erro) {
    console.error('Erro ao buscar usuários:', erro);
    alert('Erro ao fazer login. Tente novamente mais tarde.');
  }
});
