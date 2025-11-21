let wisataDatas;
let heroInterval;

const nav = document.getElementById('mainNav');
const hero = document.querySelector('.hero');
const searchBtn = document.querySelector(".open-search-button");
const menuToggleIcon = document.querySelector('.menu-toggle i');

const keywordMap = {
    // Gunung/Hiking
    'gunung': 'Gunung', 'mendaki': 'Gunung', 'ndaki': 'Gunung', 'daki': 'Gunung',
    'tracking': 'Gunung', 'trekking': 'Gunung', 'hiking': 'Gunung',
    'pemandangan': 'Gunung', 'alam': 'Gunung', 'bukit': 'Gunung', 'puncak': 'Gunung',
    
    // Wisata Air
    'kolam': 'Wisata Air', 'air': 'Wisata Air', 'berenang': 'Wisata Air',
    'segar': 'Wisata Air', 'sungai': 'Wisata Air', 'curug': 'Wisata Air',
    'air terjun': 'Wisata Air', 'terjun': 'Wisata Air', 'pemandian': 'Wisata Air',

    // Sejarah & Budaya
    'budaya': 'Wisata Sejarah', 'sejarah': 'Wisata Sejarah', 'candi': 'Wisata Sejarah',
    'kerajaan': 'Wisata Sejarah', 'purbakala': 'Wisata Sejarah', 'religi': 'Wisata Sejarah',
    'majapahit': 'Wisata Sejarah', 'kuno': 'Wisata Sejarah',

    // Wisata Keluarga/Anak
    'anak': 'Wisata Keluarga', 'keluarga': 'Wisata Keluarga', 'main': 'Wisata Keluarga',
    'edukasi': 'Wisata Keluarga', 'hiburan': 'Wisata Keluarga', 'wahana': 'Wisata Keluarga',
    'rekreasi': 'Wisata Keluarga',

    // Popularitas
    'populer': 'POPULAR', 'popular': 'POPULAR', 'popu': 'POPULAR', 'terbaik': 'POPULAR',
    'favorit': 'POPULAR', 'terbanyak': 'POPULAR', 'rating': 'POPULAR',
};

// Fetch Data
fetch('data/all-destinations.json')
    .then(r => r.json())
    .then(data => {
        wisataDatas = data;

        // Mulai Auto Hero Slider
        if (data.length > 0) {
            startHeroSlider(data);
        }

        // Generate Categories
        const filterSection = document.querySelector('.jelajahi-filter-section');
        const uniqueDestinationCategories = [...new Set(data.map(item => item.tipe))];

        uniqueDestinationCategories.forEach(tipe => {
            const example = wisataDatas.find(w => w.tipe === tipe);

            const img = document.createElement('img');
            img.src = example.image;
            img.alt = tipe;
            img.className = "jelajahi-image";

            const categoryLink = document.createElement('a');
            categoryLink.href = "categories.html?cat=" + tipe.toLowerCase().replace(/\s+/g, '-');
            categoryLink.className = 'jelajahi-filter-btn';

            categoryLink.appendChild(img);
            categoryLink.append(document.createTextNode(tipe));

            filterSection.appendChild(categoryLink);
        });
    })
    .catch(err => console.error("Gagal memuat data:", err));

// FUNGSI AUTO SLIDER HERO (3 Detik Smooth)
function startHeroSlider(data) {
    let currentIndex = 0;
    const heroOverlay = document.querySelector(".hero-overlay");
    const heroLabel = document.querySelector(".hero-label");

    // Helper untuk format string gambar
    const getBgString = (imageUrl) => `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${imageUrl})`;

    // Set Gambar Awal
    hero.style.backgroundImage = getBgString(data[0].image);

    // Interval Loop
    heroInterval = setInterval(() => {
        // Tentukan index selanjutnya
        const nextIndex = (currentIndex + 1) % data.length;
        const nextItem = data[nextIndex];

        // 1. Siapkan gambar baru di layer Overlay (masih transparan)
        heroOverlay.style.backgroundImage = getBgString(nextItem.image);
        
        // 2. Munculkan Overlay (Fade In)
        // Gambar lama di .hero tetap terlihat di belakangnya, jadi tidak ada putih
        heroOverlay.style.opacity = "1";

        // Efek ganti teks (Fade Out teks lama)
        if(heroLabel) heroLabel.style.opacity = 0;

        // 3. Tunggu transisi selesai (1000ms sesuai CSS transition)
        setTimeout(() => {
            // Pindahkan gambar baru ke layer Utama (.hero)
            hero.style.backgroundImage = getBgString(nextItem.image);
            
            // Matikan transisi overlay sebentar untuk reset instan
            heroOverlay.style.transition = "none";
            heroOverlay.style.opacity = "0"; // Sembunyikan overlay

            // Update teks baru & Munculkan (Fade In)
            if(heroLabel) {
                heroLabel.textContent = nextItem.nama;
                heroLabel.style.opacity = 1;
            }
            
            // Update current index
            currentIndex = nextIndex;

            // Hidupkan kembali transisi overlay untuk putaran berikutnya
            // Timeout kecil agar browser merender perubahan 'transition: none' dulu
            setTimeout(() => {
                heroOverlay.style.transition = "opacity 1s ease-in-out";
            }, 50);

        }, 1000); // Waktu ini harus SAMA dengan durasi CSS transition overlay

    }, 4000); // Ganti gambar setiap 4 detik (memberi waktu untuk animasi)
}

// Scroll Effect
document.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    
    if (scrollPos > 50) {
        nav.classList.add('scrolled');
        hero.classList.add('scrolled');
        searchBtn.classList.add('scrolled');
        if(menuToggleIcon) menuToggleIcon.style.color = "#333";
    } else {
        nav.classList.remove('scrolled');
        hero.classList.remove('scrolled');
        searchBtn.classList.remove('scrolled');
        if(menuToggleIcon) menuToggleIcon.style.color = "white";
    }
});

// Close Menu on Click Outside
document.addEventListener('click', function (event) {
    const toggle = document.querySelector('.menu-toggle');
    const closeBtn = document.querySelector('.nav-close-btn');
    
    if (!nav.contains(event.target) && !toggle.contains(event.target)) {
        nav.classList.remove('active');
    }
});

// Toggle Menu Mobile
function toggleMenu() {
    nav.classList.toggle('active');
}

// Intersection Observer
if(typeof createIntersectionObserver === 'function') {
    createIntersectionObserver({
        target: "#dest-stat",
        once: true,
        threshold: 0.2,
        onIntersect: async (entry) => {
            if (entry.isIntersecting) {
                for (let i = 0; i < 25; i++) {
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
                for (let i = 0; i < 10; i++) { 
                    entry.target.textContent = `${i + 1}+`;
                    await new Promise(r => setTimeout(r, 100));
                }
            }
        }
    });

    createIntersectionObserver({
        target: ".fade-in",
        once: true,
        threshold: 0.1,
        onIntersect: (entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        }
    });
}

// Search Logic
function filterResults(query) {
    const resultsContainer = document.getElementById('resultsContainer');
    const lowerQuery = query.trim().toLowerCase();

    if (!wisataDatas) return; 

    if (!lowerQuery) {
        resultsContainer.innerHTML = '<div class="empty-state">Mulai mengetik untuk mencari</div>';
        return;
    }
    
    // 1. Cek apakah query adalah partial match untuk popularitas
    const isPopularQuery = Object.keys(keywordMap).some(key => 
        key.startsWith(lowerQuery) && keywordMap[key] === 'POPULAR'
    );

    let filtered = [];

    if (isPopularQuery) {
        // Jika mencari "popu", "pop", dll, tampilkan yang populer
        filtered = [...wisataDatas]
            .sort((a, b) => {
                // Prioritaskan rating tinggi dan review banyak
                const scoreA = (a.rating * 1000) + (a.reviews / 1000);
                const scoreB = (b.rating * 1000) + (b.reviews / 1000);
                return scoreB - scoreA;
            })
            .slice(0, 10); // Batasi 10 teratas
    } else {
        // Pencarian biasa dengan scoring system
        filtered = wisataDatas.map(item => {
            let score = 0;
            
            // Exact match di nama (skor tertinggi)
            if (item.nama.toLowerCase().includes(lowerQuery)) score += 100;
            
            // Partial match di nama
            if (item.nama.toLowerCase().indexOf(lowerQuery) !== -1) score += 50;
            
            // Match di tipe
            if (item.tipe.toLowerCase().includes(lowerQuery)) score += 30;
            
            // Match di lokasi
            if (item.lokasi.toLowerCase().includes(lowerQuery)) score += 20;
            
            // Match di keywords (jika ada)
            if (item.keywords && item.keywords.some(keyword => 
                keyword.toLowerCase().includes(lowerQuery))) score += 40;
            
            // Keyword mapping match
            const matchedTipe = keywordMap[lowerQuery];
            if (matchedTipe && item.tipe === matchedTipe) score += 25;
            
            // Partial keyword mapping (untuk "ndaki", "daki", dll)
            Object.keys(keywordMap).forEach(key => {
                if (lowerQuery.includes(key) && item.tipe === keywordMap[key]) {
                    score += 15;
                }
            });

            return { ...item, score };
        })
        .filter(item => item.score > 0) // Hanya yang punya skor
        .sort((a, b) => b.score - a.score) // Urutkan berdasarkan skor
        .slice(0, 10); // Batasi 10 hasil
    }

    if (filtered.length === 0) {
        // Fallback: coba cari dengan kata yang lebih pendek
        if (lowerQuery.length > 3) {
            const shorterQuery = lowerQuery.substring(0, lowerQuery.length - 1);
            if (shorterQuery.length >= 2) {
                filterResults(shorterQuery);
                return;
            }
        }
        resultsContainer.innerHTML = '<div class="empty-state">Tidak ada hasil ditemukan</div>';
        return;
    }
    
    resultsContainer.innerHTML = filtered.map(item => {
         const url = `destinations.html?dest=${item.nama.toLowerCase().replace(/\s+/g, '-')}`;
         return `
            <a href="${url}" class="result-item">
                <img src="${item.image}" alt="${item.nama}" class="result-thumbnail">
                <div class="result-content">
                    <div class="result-title">${item.nama}</div>
                    <div class="result-description">${item.tipe} • ${item.lokasi}</div>
                </div>
            </a>
        `;
    }).join('');
}

// Dialog Event Listener
const searchDialog = document.getElementById('searchDialog');
if (searchDialog) {
    searchDialog.addEventListener('show', function () {
        const input = document.getElementById('searchInput');
        if(input) input.focus();
    });
    
    searchDialog.addEventListener('click', function(event) {
        var rect = searchDialog.getBoundingClientRect();
        var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
        if (!isInDialog) {
            searchDialog.close();
        }
    });
}