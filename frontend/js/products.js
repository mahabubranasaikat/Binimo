// Demo products
const demoProducts = [
    {
        id: 1,
        title: 'iPhone 13',
        description: 'Latest iPhone with great camera',
        price: 999,
        category: 'Electronics',
        location: 'New York',
        image_url: 'https://via.placeholder.com/250x150?text=iPhone+13'
    },
    {
        id: 2,
        title: 'MacBook Pro',
        description: 'Powerful laptop for professionals',
        price: 1999,
        category: 'Electronics',
        location: 'San Francisco',
        image_url: 'https://via.placeholder.com/250x150?text=MacBook+Pro'
    },
    {
        id: 3,
        title: 'Honda Civic',
        description: 'Reliable sedan in good condition',
        price: 15000,
        category: 'Vehicles',
        location: 'Los Angeles',
        image_url: 'https://via.placeholder.com/250x150?text=Honda+Civic'
    },
    {
        id: 4,
        title: 'Wooden Dining Table',
        description: 'Beautiful wooden table for 6 people',
        price: 500,
        category: 'Furniture',
        location: 'Chicago',
        image_url: 'https://via.placeholder.com/250x150?text=Dining+Table'
    },
    {
        id: 5,
        title: 'Levi\'s Jeans',
        description: 'Comfortable blue jeans',
        price: 80,
        category: 'Clothing',
        location: 'Miami',
        image_url: 'https://via.placeholder.com/250x150?text=Levis+Jeans'
    },
    {
        id: 6,
        title: 'Harry Potter Book Set',
        description: 'Complete collection of Harry Potter books',
        price: 100,
        category: 'Books',
        location: 'Boston',
        image_url: 'https://via.placeholder.com/250x150?text=Harry+Potter+Books'
    }
];

let allProducts = demoProducts;

// Product loading and display
function loadProducts(products = allProducts) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p class="price">Price: $${product.price}</p>
            <p class="category">Category: ${product.category}</p>
            <p class="location">Location: ${product.location}</p>
            <img src="${product.image_url}" alt="${product.title}">
        `;
        productList.appendChild(productDiv);
    });
}

// Search and filter
document.getElementById('search').addEventListener('input', filterProducts);
document.getElementById('category').addEventListener('change', filterProducts);

function filterProducts() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const selectedCategory = document.getElementById('category').value;

    const filtered = allProducts.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm) ||
                              product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    loadProducts(filtered);
}