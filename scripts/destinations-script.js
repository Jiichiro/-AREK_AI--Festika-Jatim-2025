function changeImage(thumb) {
    const mainImage = document.getElementById('mainImage');
    mainImage.src = thumb.src.replace('w=400', 'w=1200');
}