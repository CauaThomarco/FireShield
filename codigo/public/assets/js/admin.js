document.addEventListener('DOMContentLoaded', function () {
      fetch('http://localhost:3000/usuarios')  // substitua se a URL do seu JSON Server for diferente
        .then(response => response.json())
        .then(usuarios => {
          const tbody = document.querySelector('#tabela-usuarios tbody');

          usuarios.forEach(usuario => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
              <td>${usuario.nome}</td>
              <td>${usuario.email}</td>
              <td>${usuario.cpf}</td>
              <td>${usuario.cidade}</td>
              <td>${usuario.estado}</td>
              <td>${usuario.pais}</td>
              <td>${usuario.admin ? 'Sim' : 'Não'}</td>
            `;

            tbody.appendChild(tr);
          });
        })
        .catch(error => {
          console.error('Erro ao carregar usuários:', error);
        });
    });