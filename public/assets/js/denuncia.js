 const form = document.getElementById('denunciaForm');
  const API_URL = 'http://localhost:3000/denuncias';
  const previewLocalizacao = document.getElementById('previewLocalizacao');
  let mapa, marcador;

  async function buscarLatLngViaCEP(cep) {
    if (!cep || cep.length < 8) return { lat: null, lng: null };

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
      const data = await res.json();
      if (data.erro) throw new Error('CEP inválido');

      form.local.value = data.logradouro || '';
      const endereco = `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}`;
      const geocode = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`);
      const geoData = await geocode.json();

      if (geoData.length > 0) {
        const lat = parseFloat(geoData[0].lat);
        const lng = parseFloat(geoData[0].lon);
        previewLocalizacao.textContent = `Localização estimada: ${geoData[0].display_name}`;

        if (!mapa) {
          mapa = L.map('mapa-preview').setView([lat, lng], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
          }).addTo(mapa);
        } else {
          mapa.setView([lat, lng], 15);
          if (marcador) marcador.remove();
        }

        marcador = L.marker([lat, lng]).addTo(mapa);
        return { lat, lng };
      } else {
        previewLocalizacao.textContent = 'Localização não encontrada.';
        return { lat: null, lng: null };
      }
    } catch (e) {
      previewLocalizacao.textContent = 'Erro ao buscar localização. Verifique o CEP.';
      return { lat: null, lng: null };
    }
  }

  form.cep.addEventListener('blur', async () => {
    const cep = form.cep.value.trim();
    await buscarLatLngViaCEP(cep);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    const cep = form.cep.value.trim();
    const { lat, lng } = await buscarLatLngViaCEP(cep);

    const novaDenuncia = {
      local: form.local.value.trim(),
      data: form.data.value,
      hora: form.hora.value,
      tipoArea: form['tipo-area'].value,
      descricao: form.descricao.value.trim(),
      arquivo: form.arquivo.value.trim(),
      nome: form.nome.value.trim(),
      telefone: form.telefone.value.trim(),
      email: form.email.value.trim(),
      userId: userId ? Number(userId) : null,
      lat, lng,
      id: Date.now()
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaDenuncia)
      });

      if (!res.ok) throw new Error('Erro ao enviar denúncia');

      alert('Denúncia enviada com sucesso!');
      form.reset();
      previewLocalizacao.textContent = '';
      if (mapa && marcador) marcador.remove();
    } catch (error) {
      alert('Erro ao enviar denúncia. Tente novamente.');
      console.error(error);
    }
  });