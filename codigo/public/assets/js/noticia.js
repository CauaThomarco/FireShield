  const API_URL = 'http://localhost:3000/noticias';
    const feedContainer = document.getElementById('news-feed');
    const sortSelect = document.getElementById('sort-select');
    const filterSelect = document.getElementById('filter-select');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    async function fetchNoticias() {
      const res = await fetch(API_URL);
      return res.json();
    }

    function renderNoticias(noticias) {
      feedContainer.innerHTML = '';
      noticias.forEach(noticia => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
          <h2>${noticia.title}</h2>
          <img src="${noticia.image}" alt="Imagem da notícia">
          <p><strong>Categoria:</strong> ${noticia.category}</p>
          <p><strong>Data:</strong> ${new Date(noticia.date).toLocaleDateString('pt-BR')}</p>
          <p>${noticia.content}</p>
          <a href="${noticia.link}" target="_blank">Leia mais</a>
        `;
        feedContainer.appendChild(card);
      });
    }

    function applyFilters(noticias) {
      const sortValue = sortSelect.value;
      const filterValue = filterSelect.value;
      const searchValue = searchInput.value.toLowerCase();

      let filtered = noticias;

      if (filterValue !== 'all') {
        filtered = filtered.filter(n => n.category === filterValue);
      }

      if (searchValue) {
        filtered = filtered.filter(n =>
          n.title.toLowerCase().includes(searchValue) ||
          n.content.toLowerCase().includes(searchValue)
        );
      }

      switch (sortValue) {
        case 'date-asc':
          filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
          break;
        case 'date-desc':
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case 'title-asc':
          filtered.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'title-desc':
          filtered.sort((a, b) => b.title.localeCompare(a.title));
          break;
      }

      return filtered;
    }

    async function updateFeed() {
      const noticias = await fetchNoticias();
      const filteredNoticias = applyFilters(noticias);
      renderNoticias(filteredNoticias);
    }

    sortSelect.addEventListener('change', updateFeed);
    filterSelect.addEventListener('change', updateFeed);
    searchForm.addEventListener('submit', e => {
      e.preventDefault();
      updateFeed();
    });

    updateFeed();