const destination = new URLSearchParams(location.search).get("dest")
const rupiahFormat = new Intl.NumberFormat('id', { currency: "IDR", style: "currency" })
const mainImage = document.getElementById('mainImage');

let allImages = []; // Array untuk menyimpan semua URL gambar
let currentImageIndex = 0; // Index gambar yang sedang ditampilkan

if (destination == null || destination.includes("%")) {
    window.location.href = window.location.pathname.replace("destinations.html", "404.html")
}

/*
    {\n        title: string\n        image: array[url, title]\n        rating: float\n        price: number\n        description: array<string>[]\n        facilities: array[icon, title]\n        googleMap: string\n        address: string\n    }
*/
fetch(`data/destinations/${destination}.json`)
    .then(r => r.json())
    .then(data => {
        document.title = data.title
        
        // Simpan semua gambar untuk fungsi swipe
        allImages = data.image.map(img => img.url);
        
        mainImage.src = allImages[0]

        data.image.forEach((img, index) => {
            const imageNode = document.createElement('img')
            imageNode.src = img.url
            imageNode.alt = data.title
            imageNode.className = "thumbnail"
            
            // Tambahkan index sebagai data-attribute
            imageNode.setAttribute('data-index', index);
            imageNode.setAttribute('onclick', "changeImage(this)");
            
            document.getElementById('thumbnail').appendChild(imageNode)
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
        document.getElementById("googleMap").innerHTML = `<iframe src="${data.googleMap}" width="100%" height="${window.screen.width > 768 ? "350px" : "280px"}" style="border:0;" allowfullscreen="true" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
        document.getElementById("address").textContent = data.address

    }).catch(() => {
        window.location.href = window.location.pathname.replace("destinations.html", "404.html")
    })

function changeImage(thumb) {
    // Fungsi untuk mengganti gambar utama
    currentImageIndex = parseInt(thumb.getAttribute('data-index'));
    mainImage.src = thumb.src.replace('w=400', 'w=1200');
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
    if (allImages.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % allImages.length;
    mainImage.src = allImages[currentImageIndex];
}

function goToPrevImage() {
    if (allImages.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
    mainImage.src = allImages[currentImageIndex];
}