let allProducts = [];
let displayedProducts = 6;

// Fetch products from API
async function fetchProducts() {
    document.getElementById('loading').classList.remove('d-none');
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        allProducts = products;
        loadProducts(products.slice(0, displayedProducts));
    } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to demo if API fails
        loadDemoProducts();
    } finally {
        document.getElementById('loading').classList.add('d-none');
    }
}

// Demo products fallback
function loadDemoProducts() {
    const demoProducts = [
        { id: 1, title: 'iPhone 13', description: 'Latest iPhone with great camera and performance', price: 999, category: 'Electronics', location: 'New York', image_url: 'https://via.placeholder.com/250x150?text=iPhone+13', condition: 'new' },
        { id: 2, title: 'MacBook Pro', description: 'Powerful laptop for professionals with M1 chip', price: 1999, category: 'Electronics', location: 'San Francisco', image_url: 'https://via.placeholder.com/250x150?text=MacBook+Pro', condition: 'new' },
        { id: 3, title: 'Honda Civic', description: 'Reliable sedan in good condition, low mileage', price: 15000, category: 'Vehicles', location: 'Los Angeles', image_url: 'https://via.placeholder.com/250x150?text=Honda+Civic', condition: 'used' },
        { id: 4, title: 'Wooden Dining Table', description: 'Beautiful wooden table for 6 people, antique style', price: 500, category: 'Furniture', location: 'Chicago', image_url: 'https://via.placeholder.com/250x150?text=Dining+Table', condition: 'used' },
        { id: 5, title: 'Levi\'s Jeans', description: 'Comfortable blue jeans, size 32', price: 80, category: 'Clothing', location: 'Miami', image_url: 'https://via.placeholder.com/250x150?text=Levis+Jeans', condition: 'new' },
        { id: 6, title: 'Harry Potter Books', description: 'Complete collection of Harry Potter books', price: 100, category: 'Books', location: 'Boston', image_url: 'https://via.placeholder.com/250x150?text=Harry+Potter+Books', condition: 'used' },
        { id: 7, title: 'Samsung Galaxy S21', description: 'High-end Android phone with excellent display', price: 899, category: 'Electronics', location: 'Seattle', image_url: 'https://via.placeholder.com/250x150?text=Samsung+Galaxy+S21', condition: 'new' },
        { id: 8, title: 'Toyota Corolla', description: 'Fuel-efficient car, perfect for city driving', price: 12000, category: 'Vehicles', location: 'Denver', image_url: 'https://via.placeholder.com/250x150?text=Toyota+Corolla', condition: 'used' }
    ];
    allProducts = demoProducts;
    loadProducts(demoProducts.slice(0, displayedProducts));
}

// Product loading and display
function loadProducts(products, append = false) {
    const productList = document.getElementById('product-list');
    if (!append) {
        productList.innerHTML = '';
    }
    products.forEach(product => {
        // Handle images (array or single)
        let images = [];
        try {
            if (product.image_url) {
                images = JSON.parse(product.image_url);
            } else if (product.images) {
                images = product.images;
            }
        } catch (e) {
            images = product.image_url ? [product.image_url] : [];
        }
        const imageUrl = images.length > 0 ? images[0] : 'https://via.placeholder.com/250x150';

        let imageHTML = '';
        if (images.length > 1) {
            const carouselId = `carousel-${product.id}`;
            imageHTML = `
                <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">
                        ${images.map((img, index) => `
                            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                <img src="${img}" class="d-block w-100" alt="${product.title}" style="height: 200px; object-fit: cover;">
                            </div>
                        `).join('')}
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            `;
        } else {
            imageHTML = `<img src="${imageUrl}" class="card-img-top" alt="${product.title}" style="height: 200px; object-fit: cover;">`;
        }

        const productDiv = document.createElement('div');
        productDiv.className = 'col-md-4 mb-4';
        productDiv.innerHTML = `
            <div class="card h-100">
                ${imageHTML}
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0">${product.title}</h5>
                        <small class="text-muted">ID: ${product.id}</small>
                    </div>
                    <p class="card-text">${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}</p>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <p class="text-success fw-bold mb-0">$${product.price}</p>
                        <span class="badge bg-primary">${product.category}</span>
                    </div>
                    <p class="text-muted mb-2"><i class="fas fa-map-marker-alt me-1"></i>${product.location}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="badge bg-${product.condition === 'new' ? 'success' : 'secondary'}">${product.condition}</span>
                        ${images.length > 1 ? `<small class="text-muted">${images.length} photos</small>` : ''}
                    </div>
                </div>
            </div>
        `;
        productList.appendChild(productDiv);
    });

    // Add load more button if there are more products
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) loadMoreBtn.remove();
    if (products.length >= displayedProducts && allProducts.length > displayedProducts) {
        const btn = document.createElement('div');
        btn.className = 'col-12 text-center mt-4';
        btn.innerHTML = '<button id="load-more" class="btn btn-primary">Load More</button>';
        productList.appendChild(btn);
        document.getElementById('load-more').addEventListener('click', loadMoreProducts);
    }
}

// Load categories
function loadCategories() {
    const mainCategories = [
        { name: 'Electronics', icon: 'fas fa-mobile-alt' },
        { name: 'Vehicles', icon: 'fas fa-car' },
        { name: 'Property', icon: 'fas fa-home' },
        { name: 'Jobs', icon: 'fas fa-briefcase' },
        { name: 'Home & Living', icon: 'fas fa-couch' },
        { name: 'Fashion & Beauty', icon: 'fas fa-tshirt' },
        { name: 'Services', icon: 'fas fa-wrench' },
        { name: 'Others', icon: 'fas fa-box' }
    ];

    const categoryTree = {
        'Electronics': ['Mobiles', 'Laptops', 'Tablets', 'Cameras', 'Accessories'],
        'Vehicles': ['Cars', 'Bikes', 'Motorcycles', 'Trucks', 'Parts'],
        'Property': ['Apartments', 'Houses', 'Land', 'Commercial'],
        'Jobs': ['Full Time', 'Part Time', 'Freelance', 'Internships'],
        'Home & Living': ['Furniture', 'Appliances', 'Decor', 'Kitchen'],
        'Fashion & Beauty': ['Clothing', 'Shoes', 'Bags', 'Jewelry', 'Cosmetics'],
        'Services': ['Tutoring', 'Web Design', 'Cleaning', 'Repair'],
        'Others': ['Pets', 'Books', 'Sports', 'Music', 'Art']
    };

    const categoriesGrid = document.getElementById('categories-grid');
    const categoryAccordion = document.getElementById('category-list');

    // Main categories for grid
    mainCategories.forEach(category => {
        const gridItem = document.createElement('div');
        gridItem.className = 'col-md-3 mb-3';
        gridItem.innerHTML = `
            <div class="card text-center category-card" data-category="${category.name}">
                <div class="card-body">
                    <i class="${category.icon} category-icon mb-2"></i>
                    <h6 class="card-title">${category.name}</h6>
                </div>
            </div>
        `;
        categoriesGrid.appendChild(gridItem);
    });

    // Accordion for sidebar
    let accordionHTML = '<div class="accordion" id="categoryAccordion">';
    accordionHTML += '<div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseAll" aria-expanded="true">All Categories</button></h2><div id="collapseAll" class="accordion-collapse collapse show"><div class="accordion-body"><a href="#" data-category="">All Categories</a></div></div></div>';

    Object.keys(categoryTree).forEach((mainCat, index) => {
        const isFirst = index === 0;
        const collapseId = `collapse${mainCat.replace(/\s+/g, '')}`;
        const headingId = `heading${mainCat.replace(/\s+/g, '')}`;
        accordionHTML += `
            <div class="accordion-item">
                <h2 class="accordion-header" id="${headingId}">
                    <button class="accordion-button ${isFirst ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="${isFirst ? 'true' : 'false'}" aria-controls="${collapseId}">
                        ${mainCat}
                    </button>
                </h2>
                <div id="${collapseId}" class="accordion-collapse collapse ${isFirst ? 'show' : ''}" aria-labelledby="${headingId}" data-bs-parent="#categoryAccordion">
                    <div class="accordion-body">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item"><a href="#" data-category="${mainCat}">${mainCat}</a></li>
                            ${categoryTree[mainCat].map(sub => `<li class="list-group-item"><a href="#" data-category="${sub}">${sub}</a></li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    });
    accordionHTML += '</div>';
    categoryAccordion.innerHTML = accordionHTML;

    // Add click handlers for grid
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const category = e.currentTarget.getAttribute('data-category');
            filterProducts({ category });
        });
    });

    // Add click handlers for sidebar
    document.querySelectorAll('#categoryAccordion a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.getAttribute('data-category');
            filterProducts({ category });
        });
    });
}

// Search and filter
document.getElementById('search').addEventListener('input', () => filterProducts());
document.getElementById('search-btn').addEventListener('click', () => filterProducts());
document.getElementById('apply-filters').addEventListener('click', () => filterProducts());
document.getElementById('sort-by').addEventListener('change', () => filterProducts());

// Location geolocation
document.getElementById('get-location').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                const data = await response.json();
                const city = data.city || data.locality || 'Unknown Location';
                document.getElementById('location').value = city;
                filterProducts(); // Auto apply filter
            } catch (error) {
                console.error('Error getting location:', error);
                alert('Unable to determine your location. Please enter manually.');
            }
        }, (error) => {
            console.error('Geolocation error:', error);
            alert('Location access denied. Please enter location manually.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

function filterProducts(extraFilters = {}) {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const location = document.getElementById('location').value.toLowerCase();
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
    const condition = document.getElementById('condition').value;
    const category = extraFilters.category || '';
    const sortBy = document.getElementById('sort-by').value;

    let filtered = allProducts.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm) ||
                              product.description.toLowerCase().includes(searchTerm);
        const matchesLocation = !location || product.location.toLowerCase().includes(location);
        const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
        const matchesCondition = !condition || product.condition === condition;
        const matchesCategory = !category || product.category === category;
        return matchesSearch && matchesLocation && matchesPrice && matchesCondition && matchesCategory;
    });

    // Sort the filtered results
    if (sortBy) {
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'date-desc':
                    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
                case 'category':
                    return (a.category || '').localeCompare(b.category || '');
                default:
                    return 0;
            }
        });
    }

    displayedProducts = 6; // Reset for new filter
    loadProducts(filtered.slice(0, displayedProducts));
}

function loadMoreProducts() {
    displayedProducts += 6;
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const location = document.getElementById('location').value.toLowerCase();
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
    const condition = document.getElementById('condition').value;
    const sortBy = document.getElementById('sort-by').value;
    
    // Get current category filter from UI
    let currentCategory = '';
    const activeCategoryLink = document.querySelector('#categoryAccordion a.active, .category-card.active');
    if (activeCategoryLink) {
        currentCategory = activeCategoryLink.getAttribute('data-category') || '';
    }

    let filtered = allProducts.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm) ||
                              product.description.toLowerCase().includes(searchTerm);
        const matchesLocation = !location || product.location.toLowerCase().includes(location);
        const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
        const matchesCondition = !condition || product.condition === condition;
        const matchesCategory = !currentCategory || product.category === currentCategory;
        return matchesSearch && matchesLocation && matchesPrice && matchesCondition && matchesCategory;
    });

    // Sort the filtered results
    if (sortBy) {
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'date-desc':
                    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
                case 'category':
                    return (a.category || '').localeCompare(b.category || '');
                default:
                    return 0;
            }
        });
    }

    loadProducts(filtered.slice(0, displayedProducts), true);
}
// Post Ad Modal
document.getElementById('post-ad').addEventListener('click', () => {
    populateAdCategories();
    const modal = new bootstrap.Modal(document.getElementById('postAdModal'));
    modal.show();
});

function populateAdCategories() {
    const select = document.getElementById('ad-category');
    select.innerHTML = '<option value="">Select Category</option>';
    const categories = [
        'Electronics', 'Mobiles', 'Laptops', 'Tablets', 'Cameras', 'Accessories',
        'Vehicles', 'Cars', 'Bikes', 'Motorcycles', 'Trucks', 'Parts',
        'Property', 'Apartments', 'Houses', 'Land', 'Commercial',
        'Jobs', 'Full Time', 'Part Time', 'Freelance', 'Internships',
        'Home & Living', 'Furniture', 'Appliances', 'Decor', 'Kitchen',
        'Fashion & Beauty', 'Clothing', 'Shoes', 'Bags', 'Jewelry', 'Cosmetics',
        'Services', 'Tutoring', 'Web Design', 'Cleaning', 'Repair',
        'Others', 'Pets', 'Books', 'Sports', 'Music', 'Art'
    ];
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
    });
}

function nextStep(step) {
    document.getElementById(`step-1`).style.display = 'none';
    document.getElementById(`step-${step}`).style.display = 'block';
}

function prevStep(step) {
    document.getElementById(`step-2`).style.display = 'none';
    document.getElementById(`step-${step}`).style.display = 'block';
}

document.getElementById('post-ad-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', document.getElementById('ad-title').value);
    formData.append('category', document.getElementById('ad-category').value);
    formData.append('price', document.getElementById('ad-price').value);
    formData.append('condition', document.getElementById('ad-condition').value);
    formData.append('description', document.getElementById('ad-description').value);
    formData.append('location', document.getElementById('ad-location').value);
    const images = document.getElementById('ad-images').files;
    for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
    }

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token stored
            }
        });
        if (response.ok) {
            alert('Ad posted successfully!');
            document.getElementById('post-ad-form').reset();
            bootstrap.Modal.getInstance(document.getElementById('postAdModal')).hide();
            fetchProducts(); // Refresh listings
        } else {
            const error = await response.json();
            alert(error.message || 'Error posting ad');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Network error. Please try again.');
    }
});

// Search suggestions
$('#search').on('input', function() {
    const term = $(this).val().toLowerCase();
    if (term.length < 2) {
        $('#search-suggestions').hide();
        return;
    }
    const suggestions = allProducts.filter(p => p.title.toLowerCase().includes(term)).slice(0, 5).map(p => p.title);
    if (suggestions.length > 0) {
        $('#search-suggestions').html(suggestions.map(s => `<a class="dropdown-item" href="#">${s}</a>`).join('')).show();
    } else {
        $('#search-suggestions').hide();
    }
});

$('#search-suggestions').on('click', 'a', function(e) {
    e.preventDefault();
    $('#search').val($(this).text());
    $('#search-suggestions').hide();
    filterProducts();
});

$(document).on('click', function(e) {
    if (!$(e.target).closest('#search, #search-suggestions').length) {
        $('#search-suggestions').hide();
    }
});

// Initialize is handled in HTML