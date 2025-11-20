const destination = new URLSearchParams(location.search).get("dest")
const rupiahFormat = new Intl.NumberFormat('id', { currency: "IDR", style: "currency" })

if (destination == null || destination.includes("%")) {
    window.location.href = window.location.pathname.replace("destinations.html", "404.html")
}

/*
    {
        title: string
        image: array[url, title]
        rating: float
        price: number
        description: array<string>[]
        facilities: array[icon, title]
        googleMap: string
        address: string
    }
*/
fetch(`data/destinations/${destination}.json`)
    .then(r => r.json())
    .then(data => {
        document.title = data.title
        document.getElementById('mainImage').src = data.image[0].url
        data.image.forEach(img => {
            const imageNode = document.createElement('img')
            imageNode.src = img.url
            imageNode.alt = data.title
            imageNode.className = "thumbnail"
            imageNode.setAttribute('onclick', "changeImage(this)")
            document.getElementById('thumbnail').appendChild(imageNode)
        });
        document.getElementById("destTitle").textContent = data.title
        document.getElementById("rating").textContent = data.rating
        document.getElementById("price").innerHTML += data.price > 0 ? "Rp " + data.price.toLocaleString("id-ID", {minimumFractionDigits: 0, maximumFractionDigits: 2}) : "Gratis"
        document.getElementById("description").innerHTML = data.description.join("<br><br>")
        data.facilities.forEach(facility => {
            const facilityNode = document.createElement('div')
            facilityNode.className = "facility-tag"
            facilityNode.innerHTML = `<i class="${facility.icon}"></i>${facility.title}`
            document.getElementById("facility").appendChild(facilityNode)
        })
        document.getElementById("goToTheLocation").href = `https://www.google.com/maps/dir/?api=1&destination=${data.title.replaceAll(" ", "+")}`
        document.getElementById("googleMap").innerHTML = `<iframe src="${data.googleMap}" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
        document.getElementById("address").textContent = data.address
    }).catch(() => {
        window.location.href = window.location.pathname.replace("destinations.html", "404.html")
    })

function changeImage(thumb) {
    mainImage.src = thumb.src.replace('w=400', 'w=1200');
}

function viewMoreBtn() {
    document.querySelector('.description').classList.remove('collapsed')
    document.querySelector(".view-more-btn").classList.add('hidden')
}