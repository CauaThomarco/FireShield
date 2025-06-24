window.addEventListener('DOMContentLoaded', () => {
    fetch('denuncia.json')
      .then(response => response.json())
      .then(data => {
        const dados = data.denuncia;
  
        document.getElementById('numDenuncia').textContent = dados.numero;
        document.getElementById('dataOcorrencia').textContent = `${dados.dataOcorrencia} às ${dados.horarioOcorrencia}`;
        document.getElementById('local').textContent = `${dados.local.regiao}, ${dados.local.bairro}, ${dados.local.cidade} - ${dados.local.estado}`;
        document.getElementById('status').textContent = dados.status.descricao;
        document.getElementById('atualizacao').textContent = `Última atualização: ${dados.status.ultimaAtualizacao}`;
        document.getElementById('responsavel').textContent = `${dados.responsavel.nome} (${dados.responsavel.orgao})`;
        document.getElementById('origem').textContent = dados.origemSuspeita;
  
        const testemunhasEl = document.getElementById('testemunhas');
        dados.testemunhas.forEach(t => {
          const li = document.createElement('li');
          li.textContent = `${t.nome}: "${t.relato}"`;
          testemunhasEl.appendChild(li);
        });
      })
      .catch(error => {
        console.error("Erro ao carregar o JSON:", error);
        document.querySelector('.container').innerHTML = "<p>Erro ao carregar a denúncia. Tente novamente mais tarde.</p>";
      });
  });
  