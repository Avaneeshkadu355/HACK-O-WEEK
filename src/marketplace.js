const STORAGE_KEY = 'agri-connect-listings'

// Product-specific fallback images for demo listings.
const productImages = {
  tomato: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?auto=format&fit=crop&w=700&q=85',
  onion: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=700&q=85',
  potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=85',
  spinach: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=700&q=85',
  carrot: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=700&q=85',
  apple: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=700&q=85',
  default: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?auto=format&fit=crop&w=700&q=85',
}

function getProductImage(name) {
  const productName = name.toLowerCase()

  for (const [keyword, image] of Object.entries(productImages)) {
    if (keyword !== 'default' && productName.includes(keyword)) {
      return image
    }
  }

  return productImages.default
}

const initialListings = [
  {
    id: 1,
    name: 'Fresh Tomatoes',
    category: 'Vegetables',
    farmer: 'Ramesh Patil',
    location: 'Nashik, Maharashtra',
    price: 28,
    stock: 450,
    image: productImages.tomato,
  },
  {
    id: 2,
    name: 'Red Onions',
    category: 'Vegetables',
    farmer: 'Suresh Jadhav',
    location: 'Lasalgaon, Maharashtra',
    price: 32,
    stock: 800,
    image: productImages.onion,
  },
  {
    id: 3,
    name: 'Fresh Potatoes',
    category: 'Vegetables',
    farmer: 'Anil Deshmukh',
    location: 'Pune, Maharashtra',
    price: 25,
    stock: 600,
    image: productImages.potato,
  },
  {
    id: 4,
    name: 'Green Spinach',
    category: 'Leafy Greens',
    farmer: 'Meena Pawar',
    location: 'Nagpur, Maharashtra',
    price: 35,
    stock: 150,
    image: productImages.spinach,
  },
  {
    id: 5,
    name: 'Fresh Carrots',
    category: 'Vegetables',
    farmer: 'Vijay Shinde',
    location: 'Ahmednagar, Maharashtra',
    price: 40,
    stock: 320,
    image: productImages.carrot,
  },
  {
    id: 6,
    name: 'Fresh Apples',
    category: 'Fruits',
    farmer: 'Rajesh Kumar',
    location: 'Shimla, Himachal Pradesh',
    price: 120,
    stock: 200,
    image: productImages.apple,
  },
]

export function getListings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved !== null) {
      const parsed = JSON.parse(saved)

      if (Array.isArray(parsed)) {
        return parsed.map((product) => ({
          ...product,
          image: product.image || getProductImage(product.name || ''),
        }))
      }

      return initialListings
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialListings))
  } catch (error) {
    console.error('Could not load marketplace listings:', error)
  }

  return initialListings
}

export function saveListings(listings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings))
    return true
  } catch (error) {
    console.error('Could not save marketplace listings:', error)
    return false
  }
}

export function createListing(form) {
  return {
    id: Date.now(),
    name: form.name.trim(),
    category: form.category,
    farmer: 'Demo Farmer',
    location: 'Maharashtra, India',
    price: Number(form.price),
    stock: Number(form.stock),
    image: getProductImage(form.name),
  }
}