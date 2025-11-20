let category = new URLSearchParams(location.search).get("cat");
let wisatadatas;
const hero = document.getElementById("hero")
const heroTitle = document.querySelector("#hero h1")

let wisataDatas

// Validasi category
if (!category) {
    console.warn('Category parameter tidak ditemukan');
    category = '';
}

category = category.replaceAll("-", ' ').toLowerCase();
const cardArea = document.getElementById('card');

fetch('data/all-destinations.json')
    .then(r => r.json())
    .then(datas => {
        wisatadatas = datas
        if (category !== 'semua') datas = datas.filter(wisata => wisata.tipe.toLowerCase() === category);
        heroTitle.textContent = category.toUpperCase()
        hero.style.background = datas[0].image
        let cardsHTML = '';
        datas.forEach(data => {
            const slug = data.nama.replaceAll(" ", "-").toLowerCase();
            cardsHTML += `
        <a href="destinations.html?dest=${slug}" class="card">
          <div class="card-image" style="background-image: url(${data.image})"></div>
          <div class="card-content">
            <div class="card-title">${data.nama}</div>
            <div class="card-location">
              <span class="location-icon">📍</span>
              <span>${data.lokasi   }</span>
            </div>
            <div class="card-rating">
              <span class="star">⭐</span>
              <span>${data.rating}</span>
            </div>
          </div>
        </a>
      `;
        });

        if (cardsHTML === '') {
            cardArea.innerHTML = '<p>Tidak ada destinasi ditemukan</p>';
        } else {
            cardArea.innerHTML = cardsHTML;
        }


    })
    .catch(error => console.error('Error fetching data:', error));


function filterResults(query) {
    const resultsContainer = document.getElementById('resultsContainer');

    if (!query.trim()) {
        resultsContainer.innerHTML = '<div class="empty-state">Mulai mengetik untuk mencari</div>';
        return;
    }

    const filtered = wisatadatas.filter(item =>
        item.nama.toLowerCase().includes(query.toLowerCase()) ||
        item.tipe.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
        resultsContainer.innerHTML = '<div class="empty-state">Tidak ada hasil ditemukan</div>';
        return;
    }

    resultsContainer.innerHTML = filtered.map(item => `
        <a href="destinations.html?dest=${item.nama.toLowerCase().replaceAll(" ", "-")}" class="result-item">
            <img src="${item.image}" alt="${item.nama}" class="result-thumbnail">
            <div class="result-content">
                <div class="result-title">${item.nama}</div>
                <div class="result-description">${item.tipe}</div>
            </div>
        </a>
    `).join('');
}

document.getElementById('searchDialog').addEventListener('show', function () {
    document.getElementById('searchInput').focus();
});