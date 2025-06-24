document.getElementById('register-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const novoUsuario = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('Email').value,
    cpf: document.getElementById('cpf').value,
    cidade: document.getElementById('cidade').value,
    estado: document.getElementById('estado').value,
    pais: document.getElementById('pais').value,
    identidade: document.getElementById('identidade').value,
    rua: document.getElementById('rua').value,
    senha: document.getElementById('senha').value
  };

  const response = await fetch("http://localhost:3000/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novoUsuario)
  });

  if (response.ok) {
    alert("Usuário registrado com sucesso!");
    window.location.href = "login.html";
  } else {
    alert("Erro ao registrar usuário.");
  }
});
