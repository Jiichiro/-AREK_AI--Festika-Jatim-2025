let nav, wisataDatas, currentFilter = 'Semua', displayLimit = 10;

document.addEventListener('DOMContentLoaded', () => {
    nav = document.getElementById('mainNav');
    wisataDatas = JSON.parse(document.getElementById('jelajahiDatas').textContent)
    const hero = document.querySelector('.hero')

    const randNum = Math.floor(Math.random() * (wisataDatas.length + 1))
    hero.style.backgroundImage = `url(${wisataDatas[randNum].image})`
    document.querySelector(".hero-label").textContent = wisataDatas[randNum].nama

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

    const filterSection = document.querySelector('.jelajahi-filter-section');
    const uniqueDestinationCategories = [...new Set(wisataDatas.map(item => item.tipe))]

    uniqueDestinationCategories.forEach(tipe => {
        const button = document.createElement('button');
        button.className = 'jelajahi-filter-btn';
        button.textContent = tipe;
        filterSection.appendChild(button);
    });

    renderCards();

    const filterButtons = document.querySelectorAll('.jelajahi-filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Hapus class active dari semua button
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Tambah class active ke button yang diklik
            this.classList.add('active');

            // Filter data berdasarkan teks button
            currentFilter = this.textContent.trim();
            displayLimit = 10; // Reset limit saat ganti filter
            filterWisata();
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
    displayLimit += 10;
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