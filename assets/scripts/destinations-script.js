const destination = new URLSearchParams(location.search).get("dest")
const rupiahFormat = new Intl.NumberFormat('id', { currency: "IDR", style: "currency" })
const mainImage = document.getElementById('mainImage');

let allImages = []; // Array untuk menyimpan semua URL gambar
let currentImageIndex = 0; // Index gambar yang sedang ditampilkan
let isAnimating = false; // Flag untuk mencegah animasi bertumpuk

if (destination == null || destination.includes("%")) {
    window.location.href = window.location.pathname.replace("destinations.html", "404.html")
}

fetch(`data/destinations/${destination}.json`)
    .then(r => r.json())
    .then(data => {
        document.title = data.title
        
        // Simpan semua gambar untuk fungsi swipe
        allImages = data.image.map(img => img.url);
        
        mainImage.src = allImages[0]

        // Buat thumbnail untuk desktop (samping) dan mobile (bawah)
        data.image.forEach((img, index) => {
            // Thumbnail untuk desktop (samping)
            const sideThumbNode = document.createElement('img')
            sideThumbNode.src = img.url
            sideThumbNode.alt = data.title
            sideThumbNode.className = "side-thumbnail"
            sideThumbNode.setAttribute('data-index', index);
            sideThumbNode.setAttribute('onclick', "changeImage(this)");
            
            // Set active untuk thumbnail pertama
            if (index === 0) {
                sideThumbNode.classList.add('active');
            }
            
            document.getElementById('sideThumbnail').appendChild(sideThumbNode)
            
            // Thumbnail untuk mobile (bawah)
            const bottomThumbNode = document.createElement('img')
            bottomThumbNode.src = img.url
            bottomThumbNode.alt = data.title
            bottomThumbNode.className = "bottom-thumbnail"
            bottomThumbNode.setAttribute('data-index', index);
            bottomThumbNode.setAttribute('onclick', "changeImage(this)");
            
            document.getElementById('bottomThumbnail').appendChild(bottomThumbNode)
        });
        
        document.getElementById("destTitle").textContent = data.title
        document.getElementById("rating").textContent = data.rating

        const priceElement = document.getElementById("price");
        const priceNoteElement = document.getElementById("priceNote");

        if (data.price > 0) {
            priceElement.innerHTML = "Rp " + data.price.toLocaleString("id-ID", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            });
            priceNoteElement.style.display = 'inline';
        } else {
            priceElement.textContent = "Gratis";
            priceNoteElement.style.display = 'none';
        }

        document.getElementById("description").innerHTML = data.description.join("<br><br>")
        
        // Cek apakah perlu tombol Selengkapnya/Ringkas
        const descElement = document.getElementById('description');
        if (descElement.scrollHeight > descElement.clientHeight) {
            document.getElementById('viewMoreBtn').classList.remove('hidden');
        } else {
            document.getElementById('viewMoreBtn').classList.add('hidden');
        }

        data.facilities.forEach(facility => {
            const facilityNode = document.createElement('div')
            facilityNode.className = "facility-tag"
            facilityNode.innerHTML = `<i class="${facility.icon}"></i>${facility.title}`
            document.getElementById("facility").appendChild(facilityNode)
        })

        document.getElementById("goToTheLocation").href = `https://www.google.com/maps/dir/?api=1&destination=${data.title.replaceAll(" ", "+")}`
        document.getElementById("googleMap").innerHTML = `<iframe src="${data.googleMap}" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
        document.getElementById("address").textContent = data.address

    }).catch(() => {
        window.location.href = window.location.pathname.replace("destinations.html", "404.html")
    })

function changeImage(thumb) {
    if (isAnimating) return; // Mencegah animasi bertumpuk
    
    const newIndex = parseInt(thumb.getAttribute('data-index'));
    
    // Tentukan arah animasi
    const direction = newIndex > currentImageIndex ? 'left' : 'right';
    
    // Update thumbnail aktif
    updateActiveThumbnail(newIndex);
    
    // Update gambar utama dengan animasi
    animateImageChange(allImages[newIndex], direction);
    
    currentImageIndex = newIndex;
}

function updateActiveThumbnail(index) {
    // Hapus class active dari semua thumbnail
    document.querySelectorAll('.side-thumbnail, .bottom-thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    
    // Tambah class active ke thumbnail yang sesuai
    document.querySelectorAll(`[data-index="${index}"]`).forEach(thumb => {
        thumb.classList.add('active');
    });
}

function animateImageChange(newSrc, direction) {
    isAnimating = true;
    
    // Tambah class animasi berdasarkan arah
    mainImage.classList.add(direction === 'left' ? 'slide-left' : 'slide-right');
    
    // Tunggu sedikit sebelum mengganti sumber gambar
    setTimeout(() => {
        mainImage.src = newSrc.replace('w=400', 'w=1200');
        
        // Hapus class animasi setelah transisi selesai
        setTimeout(() => {
            mainImage.classList.remove('slide-left', 'slide-right');
            isAnimating = false;
        }, 300);
    }, 10);
}

// PERUBAHAN: Fungsi View More/Less yang digabungkan
function toggleDescription(isViewMore) {
    const description = document.querySelector('.description');
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    const viewLessBtn = document.getElementById('viewLessBtn');

    if (isViewMore) {
        description.classList.remove('collapsed');
        viewMoreBtn.classList.add('hidden');
        viewLessBtn.classList.remove('hidden');
    } else {
        description.classList.add('collapsed');
        viewMoreBtn.classList.remove('hidden');
        viewLessBtn.classList.add('hidden');
        description.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Kembali ke atas deskripsi
    }
}

// --- LOGIC SWIPE UNTUK GAMBAR UTAMA (MOBILE) ---
const swipeContainer = document.getElementById('swipeContainer');
let touchStartX = 0;
let touchEndX = 0;

swipeContainer.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

swipeContainer.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
});

function handleGesture() {
    if (isAnimating) return; // Mencegah swipe saat animasi berjalan
    
    const swipeThreshold = 50; // Jarak minimal swipe dalam piksel

    // Geser ke KIRI (Menuju gambar berikutnya)
    if (touchEndX < touchStartX - swipeThreshold) {
        goToNextImage();
    }
    
    // Geser ke KANAN (Menuju gambar sebelumnya)
    if (touchEndX > touchStartX + swipeThreshold) {
        goToPrevImage();
    }
}

function goToNextImage() {
    if (allImages.length === 0 || isAnimating) return;
    const newIndex = (currentImageIndex + 1) % allImages.length;
    updateActiveThumbnail(newIndex);
    animateImageChange(allImages[newIndex], 'left');
    currentImageIndex = newIndex;
}

function goToPrevImage() {
    if (allImages.length === 0 || isAnimating) return;
    const newIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
    updateActiveThumbnail(newIndex);
    animateImageChange(allImages[newIndex], 'right');
    currentImageIndex = newIndex;
}