let nav, wisataDatas, currentFilter = 'Semua', displayLimit = 8;

nav = document.getElementById('mainNav');
const hero = document.querySelector('.hero')
fetch('data/all-destinations.json').then(r => r.json()).then(data => {
    wisataDatas = data
    const randNum = Math.floor(Math.random() * (data.length))
    hero.style.backgroundImage = `url(${data[randNum].image})`
    document.querySelector(".hero-label").textContent = data[randNum].nama
    const filterSection = document.querySelector('.jelajahi-filter-section');
    const uniqueDestinationCategories = [...new Set(data.map(item => item.tipe))]

    uniqueDestinationCategories.forEach(tipe => {
        const button = document.createElement('button');
        button.className = 'jelajahi-filter-btn';
        button.textContent = tipe;
        filterSection.appendChild(button);
    });
}).finally(() => {
    renderCards();
    makeFilterButton()
})

document.addEventListener('scroll', () => {
    if (scrollY > 50) {
        hero.classList.add('scrolled');
        nav.classList.add('scrolled')
    } else {
        nav.classList.remove('scrolled')
        hero.classList.remove('scrolled');
    }
})

// Close menu when clicking outside
document.addEventListener('click', function (event) {
    const toggle = document.querySelector('.menu-toggle');

    if (!nav.contains(event.target) && !toggle.contains(event.target)) {
        nav.classList.remove('active');
    }
});

function makeFilterButton() {
    const filterButtons = document.querySelectorAll('.jelajahi-filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Hapus class active dari semua button
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Tambah class active ke button yang diklik
            this.classList.add('active');

            // Filter data berdasarkan teks button
            currentFilter = this.textContent.trim();
            displayLimit = 8; // Reset limit saat ganti filter
            filterWisata();
        });
    });
}

createIntersectionObserver({
    target: "#dest-stat",
    once: true,
    threshold: 0.2,
    onIntersect: async (entry) => {
        if (entry.isIntersecting) {
            for (let i = 0; i < 50; i++) {
                entry.target.textContent = `${i + 1}+`
                await new Promise(r => setTimeout(r, 20))
            }
        }
    }
})

createIntersectionObserver({
    target: "#candi-stat",
    once: true,
    threshold: 0.2,
    onIntersect: async (entry) => {
        if (entry.isIntersecting) {
            for (let i = 0; i < 5; i++) {
                entry.target.textContent = `${i + 1}+`
                await new Promise(r => setTimeout(r, 200))
            }
        }
    }
})

createIntersectionObserver({
    target: ".fade-in",
    once: true,
    threshold: 0.2,
    onIntersect: (entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible")
        }
    }
})

function toggleMenu() {
    nav.classList.toggle('active');
}

// Fungsi untuk format harga
function formatHarga(harga) {
    if (harga === 0) return "Gratis";
    return `Rp ${(harga / 1000).toFixed(0)}k`;
}

// Fungsi untuk format reviews
function formatReviews(reviews) {
    if (reviews >= 1000) {
        return `${(reviews / 1000).toFixed(0)}k`;
    }
    return reviews;
}

// Fungsi untuk render cards
function renderCards() {
    const grid = document.querySelector('.jelajahi-cards-grid');
    grid.innerHTML = '';

    // Dapatkan data yang sudah difilter
    const filteredData = getFilteredData();

    // Render sesuai limit
    const itemsToShow = Math.min(displayLimit, filteredData.length);

    for (let i = 0; i < itemsToShow; i++) {
        const card = `
      <a href=${filteredData[i].url} class="jelajahi-card">
        <img loading="lazy" src="${filteredData[i].image}" alt="${filteredData[i].nama}" class="jelajahi-card-image">
        <div class="jelajahi-card-overlay">
          <div class="jelajahi-card-title">${filteredData[i].nama}</div>
          <div class="jelajahi-card-info">
            <span>⭐ ${filteredData[i].rating} (${formatReviews(filteredData[i].reviews)})</span>
            <span>💵 ${formatHarga(filteredData[i].harga)}</span>
          </div>
        </div>
      </a>
    `;
        grid.innerHTML += card;
    }

    // Tampilkan/sembunyikan tombol "View More"
    updateViewMoreButton(itemsToShow, filteredData.length);
}

// Fungsi untuk mendapatkan data yang sudah difilter
function getFilteredData() {
    if (currentFilter === 'Semua') {
        return wisataDatas;
    } else {
        return wisataDatas.filter(wisata => wisata.tipe === currentFilter);
    }
}

// Fungsi untuk filter wisata
function filterWisata() {
    renderCards();
}

// Fungsi untuk view more
function viewMoreWisata() {
    displayLimit += 8;
    renderCards();
}

// Fungsi untuk update tombol view more
function updateViewMoreButton(shown, total) {
    const viewMoreBtn = document.querySelector('.jelajahi-more-btn');
    if (viewMoreBtn) {
        if (shown >= total) {
            viewMoreBtn.style.display = 'none';
        } else {
            viewMoreBtn.style.display = 'block';
        }
    }
}

function filterResults(query) {
    const resultsContainer = document.getElementById('resultsContainer');
    
    if (!query.trim()) {
        resultsContainer.innerHTML = '<div class="empty-state">Mulai mengetik untuk mencari</div>';
        return;
    }

    const filtered = wisataDatas.filter(item =>
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