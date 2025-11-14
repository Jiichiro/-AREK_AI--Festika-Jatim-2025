function toggleMenu() {
    const nav = document.getElementById('mainNav');
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
    const nav = document.getElementById('mainNav');
    const toggle = document.querySelector('.menu-toggle');

    if (!nav.contains(event.target) && !toggle.contains(event.target)) {
        nav.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
        const hero = document.querySelector('.hero')
        if (scrollY > 50) {
            hero.classList.add('scrolled');
            nav.classList.add('scrolled')
        } else {
            nav.classList.remove('scrolled')
            hero.classList.remove('scrolled');
        }
    })
})