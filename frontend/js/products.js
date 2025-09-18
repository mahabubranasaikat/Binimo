let allProducts = [];
let displayedProducts = 6;

// Fetch products from API
async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        allProducts = products;
        loadProducts(products.slice(0, displayedProducts));
    } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to demo if API fails
        loadDemoProducts();
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
            images = product.images || (product.image_url ? [product.image_url] : []);
        } catch (e) {
            images = product.image_url ? [product.image_url] : [];
        }
        const imageUrl = images.length > 0 ? images[0] : 'https://via.placeholder.com/250x150';

        const productDiv = document.createElement('div');
        productDiv.className = 'col-md-4 mb-4';
        productDiv.innerHTML = `
            <div class="card h-100">
                <img src="${imageUrl}" class="card-img-top" alt="${product.title}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}</p>
                    <p class="text-success fw-bold">$${product.price}</p>
                    <p class="text-muted">${product.location}</p>
                    <span class="badge bg-${product.condition === 'new' ? 'success' : 'secondary'}">${product.condition}</span>
                    ${images.length > 1 ? `<small class="text-muted">${images.length} photos</small>` : ''}
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
document.querySelector('button[type="button"]').addEventListener('click', () => filterProducts());
document.getElementById('apply-filters').addEventListener('click', () => filterProducts());

function filterProducts(extraFilters = {}) {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const location = document.getElementById('location').value.toLowerCase();
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
    const condition = document.getElementById('condition').value;
    const category = extraFilters.category || '';

    const filtered = allProducts.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm) ||
                              product.description.toLowerCase().includes(searchTerm);
        const matchesLocation = !location || product.location.toLowerCase().includes(location);
        const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
        const matchesCondition = !condition || product.condition === condition;
        const matchesCategory = !category || product.category === category;
        return matchesSearch && matchesLocation && matchesPrice && matchesCondition && matchesCategory;
    });

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
    const category = '';

    const filtered = allProducts.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm) ||
                              product.description.toLowerCase().includes(searchTerm);
        const matchesLocation = !location || product.location.toLowerCase().includes(location);
        const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
        const matchesCondition = !condition || product.condition === condition;
        const matchesCategory = !category || product.category === category;
        return matchesSearch && matchesLocation && matchesPrice && matchesCondition && matchesCategory;
    });

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
            bootstrap.Modal.getInstance(document.getElementById('postAdModal')).hide();
            fetchProducts(); // Refresh listings
        } else {
            alert('Error posting ad');
        }
    } catch (error) {
        console.error('Error:', error);
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

// Initialize
function loadProducts() {
    fetchProducts();
}