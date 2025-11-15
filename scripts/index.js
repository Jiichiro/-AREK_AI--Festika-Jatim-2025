let nav, wisataDatas;

document.addEventListener('DOMContentLoaded', () => {
    nav = document.getElementById('mainNav');
    wisataDatas = JSON.parse(document.getElementById('jelajahiDatas').textContent)
    
    document.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero')
        if (scrollY > 50) {
            hero.classList.add('scrolled');
            nav.classList.add('scrolled')
        } else {
            nav.classList.remove('scrolled')
            hero.classList.remove('scrolled');
        }
    })

    renderCards(wisataDatas);

    const filterButtons = document.querySelectorAll('.jelajahi-filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Hapus class active dari semua button
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Tambah class active ke button yang diklik
            this.classList.add('active');

            // Filter data berdasarkan teks button
            const tipeWisata = this.textContent.trim();
            filterWisata(tipeWisata);
        });
    });
})

function toggleMenu() {
    nav.classList.toggle('active');
}

function scrollToDestinations() {
    document.getElementById('destinations').scrollIntoView({
        behavior: 'smooth'
    });
}

function searchDestination() {
    const searchTerm = document.getElementById('searchInput').value;
    alert('Mencari: ' + searchTerm);
}

function filterCategory(category) {
    alert('Filter kategori: ' + category);
}

function viewDestination(name) {
    alert('Membuka detail: ' + name);
}

// Close menu when clicking outside
document.addEventListener('click', function (event) {
    const toggle = document.querySelector('.menu-toggle');

    if (!nav.contains(event.target) && !toggle.contains(event.target)) {
        nav.classList.remove('active');
    }
});

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
function renderCards(data) {
    const grid = document.querySelector('.jelajahi-cards-grid');
    grid.innerHTML = '';

    data.forEach(wisata => {
        const card = `
      <figure class="jelajahi-card">
        <img loading="lazy" src="${wisata.image}" alt="${wisata.nama}" class="jelajahi-card-image">
        <figcaption class="jelajahi-card-overlay">
          <div class="jelajahi-card-title">${wisata.nama}</div>
          <div class="jelajahi-card-info">
            <span>⭐ ${wisata.rating} (${formatReviews(wisata.reviews)})</span>
            <span>💵 ${formatHarga(wisata.harga)}</span>
          </div>
        </figcaption>
      </figure>
    `;
        grid.innerHTML += card;
    });
}

// Fungsi untuk filter wisata
function filterWisata(tipe) {
    if (tipe === 'Semua') {
        renderCards(wisataDatas);
    } else {
        const filtered = wisataDatas.filter(wisata => wisata.tipe === tipe);
        renderCards(filtered);
    }
}