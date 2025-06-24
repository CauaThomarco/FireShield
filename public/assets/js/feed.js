  const feed = document.getElementById('feed');
  const API_URL = 'http://localhost:3000/denuncias';

  function formatarDataHora(dataStr, horaStr) {
    if (!dataStr || !horaStr) return '';
    const dt = new Date(dataStr + 'T' + horaStr);
    return dt.toLocaleString('pt-BR', { dateStyle:'short', timeStyle:'short' });
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