let nav, currentFilter = 'Semua', displayLimit = 8;

const wisataDatas = [
    {
        "nama": "Bukit Watu Jengger",
        "tipe": "Wisata Alam",
        "rating": 4.91,
        "reviews": 8000,
        "harga": 5000,
        "image": "assets/images/bukit-watu-jengger-mojokerto.webp",
        "url": "destinations.html?dest=bukit-watu-jengger"
    },
    {
        "nama": "Air Terjun Dlundung",
        "tipe": "Wisata Alam",
        "rating": 4.85,
        "reviews": 12000,
        "harga": 10000,
        "image": "assets/images/air-terjun-dlundung-mojokerto.webp",
        "url": "destinations.html?dest=air-terjun-dlundung"
    },
    {
        "nama": "Candi Bajang Ratu",
        "tipe": "Wisata Sejarah",
        "rating": 4.95,
        "reviews": 5000,
        "harga": 3000,
        "image": "assets/images/candi-bajang-ratu-mojokerto.webp",
        "url": "destinations.html?dest=candi-bajang-ratu"
    },
    {
        "nama": "Gapura Wringin Lawang",
        "tipe": "Wisata Sejarah",
        "rating": 4.8,
        "reviews": 3000,
        "harga": 10000,
        "image": "assets/images/gapura-wringin-lawang-mojokerto.webp",
        "url": "destinations.html?dest=gapura-wringin-lawang"
    },
    {
        "nama": "Patung Budha Tidur",
        "tipe": "Wisata Religi",
        "rating": 4.88,
        "reviews": 9000,
        "harga": 5000,
        "image": "assets/images/patung-buddha-tidur.webp",
        "url": "destinations.html?dest=patung-budha-tidur"
    },
    {
        "nama": "Candi Tikus",
        "tipe": "Wisata Sejarah",
        "rating": 4.82,
        "reviews": 11000,
        "harga": 3000,
        "image": "assets/images/candi-tikus.webp",
        "url": "destinations.html?dest=candi-tikus"
    },
    {
        "nama": "Museum Majapahit",
        "tipe": "Wisata Edukasi",
        "rating": 4.78,
        "reviews": 4000,
        "harga": 5000,
        "image": "assets/images/museum-majapahit-mojokerto.webp",
        "url": "destinations.html?dest=museum-majapahit"
    },
    {
        "nama": "Kolam Segaran",
        "tipe": "Wisata Sejarah",
        "rating": 4.7,
        "reviews": 3500,
        "harga": 0,
        "image": "assets/images/kolam-segaran.webp",
        "url": "destinations.html?dest=kolam-segaran"
    },
    {
        "nama": "Candi Minak Jinggo",
        "tipe": "Wisata Sejarah",
        "rating": 4.75,
        "reviews": 2000,
        "harga": 3000,
        "image": "assets/images/candi-minak-jinggo.webp",
        "url": "destinations.html?dest=candi-minak-jinggo"
    },
    {
        "nama": "Air Terjun Coban Canggu",
        "tipe": "Wisata Alam",
        "rating": 4.83,
        "reviews": 8900,
        "harga": 10000,
        "image": "assets/images/air-terjun-coban-canggu-mojokerto.webp",
        "url": "destinations.html?dest=air-terjun-coban-canggu"
    },
    {
        "nama": "Gunung Penanggungan",
        "tipe": "Wisata Alam",
        "rating": 4.92,
        "reviews": 14000,
        "harga": 5000,
        "image": "assets/images/gunung-penanggungan.webp",
        "url": "destinations.html?dest=gunung-penanggungan"
    },
    {
        "nama": "Taman Ghanjaran",
        "tipe": "Wisata Keluarga",
        "rating": 4.81,
        "reviews": 30000,
        "harga": 10000,
        "image": "assets/images/taman-ghanjaran.webp",
        "url": "destinations.html?dest=taman-ghanjaran"
    },
    {
        "nama": "Ranu Manduro",
        "tipe": "Wisata Alam",
        "rating": 4.65,
        "reviews": 12000,
        "harga": 0,
        "image": "assets/images/ranu-manduro.webp",
        "url": "destinations.html?dest=ranu-manduro"
    },
    {
        "nama": "Petirtaan Jolotundo",
        "tipe": "Wisata Religi",
        "rating": 4.89,
        "reviews": 6000,
        "harga": 8000,
        "image": "assets/images/petirtaan-jolotundo.webp",
        "url": "destinations.html?dest=petirtaan-jolotundo"
    },
    {
        "nama": "Sendi Adventure",
        "tipe": "Wisata Alam",
        "rating": 4.77,
        "reviews": 7000,
        "harga": 10000,
        "image": "assets/images/sendi-adventure.webp",
        "url": "destinations.html?dest=sendi-adventure"
    },
    {
        "nama": "Alun-Alun Mojokerto",
        "tipe": "Wisata Kota",
        "rating": 4.6,
        "reviews": 50000,
        "harga": 0,
        "image": "assets/images/alun-alun-mojokerto.webp",
        "url": "destinations.html?dest=alun-alun-mojokerto"
    },
    {
        "nama": "Candi Wringin Branjang",
        "tipe": "Wisata Sejarah",
        "rating": 4.66,
        "reviews": 1700,
        "harga": 0,
        "image": "assets/images/candi-wringin-branjang.webp",
        "url": "destinations.html?dest=candi-wringin-branjang"
    }
]

nav = document.getElementById('mainNav');
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
        displayLimit = 8; // Reset limit saat ganti filter
        filterWisata();
    });
});

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