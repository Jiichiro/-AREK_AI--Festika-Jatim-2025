let wisataDatas, currentFilter = 'Semua', displayLimit = 8;

const nav = document.getElementById('mainNav');
const hero = document.querySelector('.hero');
const searchBtn = document.querySelector(".open-search-button");

fetch('data/all-destinations.json')
    .then(r => r.json()) // FIX: harus r.json()
    .then(data => {
        wisataDatas = data;

        const randNum = Math.floor(Math.random() * data.length);
        hero.style.backgroundImage = `url(${data[randNum].image})`;
        document.querySelector(".hero-label").textContent = data[randNum].nama;

        const filterSection = document.querySelector('.jelajahi-filter-section');
        const uniqueDestinationCategories = [...new Set(data.map(item => item.tipe))];

        uniqueDestinationCategories.forEach(tipe => {
            const example = wisataDatas.find(w => w.tipe === tipe);

            const img = document.createElement('img');
            img.src = example.image; // FIX: harusnya image, bukan url
            img.alt = example.nama;  // FIX: title tidak ada
            img.className = "jelajahi-image"

            const category = document.createElement('a');
            category.href = "categories.html?cat=" + tipe.toLowerCase().replaceAll(" ", "-");
            category.className = 'jelajahi-filter-btn';

            category.appendChild(img);
            category.append(document.createTextNode(tipe));

            filterSection.appendChild(category);
        });
    });

document.addEventListener('scroll', () => {
    if (scrollY > 50) {
        hero.classList.add('scrolled');
        nav.classList.add('scrolled');
        searchBtn.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
        hero.classList.remove('scrolled');
        searchBtn.classList.remove('scrolled');
    }
});

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
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            currentFilter = this.textContent.trim();
            displayLimit = 8;

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
                entry.target.textContent = `${i + 1}+`;
                await new Promise(r => setTimeout(r, 20));
            }
        }
    }
});

createIntersectionObserver({
    target: "#candi-stat",
    once: true,
    threshold: 0.2,
    onIntersect: async (entry) => {
        if (entry.isIntersecting) {
            for (let i = 0; i < 5; i++) {
                entry.target.textContent = `${i + 1}+`;
                await new Promise(r => setTimeout(r, 200));
            }
        }
    }
});

createIntersectionObserver({
    target: ".fade-in",
    once: true,
    threshold: 0.2,
    onIntersect: (entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    }
});

function toggleMenu() {
    nav.classList.toggle('active');
}

function formatHarga(harga) {
    if (harga === 0) return "Gratis";
    return `Rp ${(harga / 1000).toFixed(0)}k`;
}

function formatReviews(reviews) {
    if (reviews >= 1000) {
        return `${(reviews / 1000).toFixed(0)}k`;
    }
    return reviews;
}

function renderCards() {
    const grid = document.querySelector('.jelajahi-cards-grid');
    grid.innerHTML = '';

    const filteredData = getFilteredData();
    const itemsToShow = Math.min(displayLimit, filteredData.length);

    for (let i = 0; i < itemsToShow; i++) {
        const card = `
        <a href="${filteredData[i].url}" class="jelajahi-card">
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

    updateViewMoreButton(itemsToShow, filteredData.length);
}

function getFilteredData() {
    if (currentFilter === 'Semua') {
        return wisataDatas;
    }
    return wisataDatas.filter(w => w.tipe === currentFilter);
}

function filterWisata() {
    renderCards();
}

function viewMoreWisata() {
    displayLimit += 8;
    renderCards();
}

function updateViewMoreButton(shown, total) {
    const viewMoreBtn = document.querySelector('.jelajahi-more-btn');
    if (!viewMoreBtn) return;

    viewMoreBtn.style.display = shown >= total ? 'none' : 'block';
}

function filterResults(query) {
    const resultsContainer = document.getElementById('resultsContainer');

    if (!wisataDatas) return; // FIX: jaga-jaga fetch belum selesai

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

// FIX: pastikan ini dialog beneran <dialog>
document.getElementById('searchDialog')?.addEventListener('show', function () {
    document.getElementById('searchInput').focus();
});
