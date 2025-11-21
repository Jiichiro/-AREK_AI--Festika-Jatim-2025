let wisatadatas;
const hero = document.getElementById("hero");
const heroTitle = document.getElementById("heroTitle");
const heroDesc = document.getElementById("heroDesc");
const contentTitle = document.getElementById("contentTitle");
const cardArea = document.getElementById('card');
const nav = document.getElementById('mainNav');
const header = document.querySelector('header');

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

// Ambil parameter kategori
let category = new URLSearchParams(location.search).get("cat");

// Handle jika tidak ada kategori
if (!category) category = 'semua';
let displayCategory = category.replaceAll("-", ' ').toLowerCase();

// Logic Scroll Header
document.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
        nav.classList.add('scrolled');
        if(document.querySelector('.menu-toggle i')) {
             document.querySelector('.menu-toggle i').style.color = "#333";
        }
    } else {
        header.classList.remove('scrolled');
        nav.classList.remove('scrolled');
        if(document.querySelector('.menu-toggle i')) {
             document.querySelector('.menu-toggle i').style.color = "white";
        }
    }
});

// Toggle Menu Mobile
function toggleMenu() {
    nav.classList.toggle('active');
}

// Fetch Data
fetch('data/all-destinations.json')
    .then(r => r.json())
    .then(datas => {
        wisatadatas = datas;
        let filteredData = datas;

        // Filter Data
        if (displayCategory !== 'semua') {
            filteredData = datas.filter(wisata => wisata.tipe.toLowerCase() === displayCategory);
        }

        // Update Hero UI
        heroTitle.textContent = displayCategory === 'semua' ? "Semua Wisata" : displayCategory;
        
        if (filteredData.length > 0) {
            // Gunakan gambar pertama dari hasil filter sebagai background hero
            // Atau fallback ke gambar default jika perlu
            hero.style.backgroundImage = `url(${filteredData[0].image})`;
            contentTitle.textContent = `Menampilkan ${filteredData.length} destinasi untuk "${displayCategory}"`;
        } else {
            hero.style.background = "#333"; // Fallback color
            contentTitle.textContent = `Tidak ada destinasi untuk "${displayCategory}"`;
        }

        // Render Cards
        renderCards(filteredData);
    })
    .catch(error => console.error('Error fetching data:', error));


function renderCards(data) {
    let cardsHTML = '';
    
    if (data.length === 0) {
        cardArea.innerHTML = '<div class="empty-state"><p>Belum ada data wisata untuk kategori ini.</p></div>';
        return;
    }

    data.forEach(item => {
        // Format URL slug
        const slug = item.nama.toLowerCase().replace(/\s+/g, '-');
        
        // Format Rating & Lokasi (Fallback jika data kosong)
        const rating = item.rating || '4.5';
        const lokasi = item.lokasi || 'Mojokerto';

        cardsHTML += `
        <a href="destinations.html?dest=${slug}" class="card">
          <div class="card-image" style="background-image: url('${item.image}')"></div>
          <div class="card-content">
            <div class="card-title">${item.nama}</div>
            <div class="card-location">
              <i class="fas fa-map-marker-alt"></i>
              <span>${lokasi}</span>
            </div>
            <div class="card-rating">
              <i class="fas fa-star"></i>
              <span>${rating}</span>
            </div>
          </div>
        </a>
      `;
    });

    cardArea.innerHTML = cardsHTML;
}

// Search Logic (Sama seperti Index)
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

// Close dialog on click outside
document.getElementById('searchDialog')?.addEventListener('click', function(event) {
    var rect = this.getBoundingClientRect();
    var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
    if (!isInDialog) {
        this.close();
    }
});