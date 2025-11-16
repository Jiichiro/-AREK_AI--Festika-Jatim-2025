function changeImage(thumb) {
    const mainImage = document.getElementById('mainImage');
    mainImage.src = thumb.src.replace('w=400', 'w=1200');
}

function openMap() {
    window.open('https://www.google.com/maps/dir/?api=1&destination=Gapura+Wringin+Lawang+Trowulan', '_blank');
}