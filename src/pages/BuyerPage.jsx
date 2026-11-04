
import { useEffect, useState } from 'react'
import { getProducts } from '../api'
import './BuyerPage.css'

const categories = [
  'All Produce',
  'Vegetables',
  'Fruits',
  'Leafy Greens',
  'Grains & Pulses',
]

const fallbackImages = {
  tomato: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?auto=format&fit=crop&w=700&q=85',
  onion: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=700&q=85',
  potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=85',
  spinach: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=700&q=85',
  carrot: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=700&q=85',
  apple: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=700&q=85',
}

function getProductImage(product) {
  if (product.image?.trim()) return product.image

  const name = product.name.toLowerCase()

  for (const [keyword, image] of Object.entries(fallbackImages)) {
    if (name.includes(keyword)) return image
  }

  return ''
}

function BuyerPage() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Produce')
  const [quality, setQuality] = useState('All Quality')
  const [size, setSize] = useState('All Sizes')
  const [pesticide, setPesticide] = useState('All Pesticide Status')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        setError('')
        const data = await getProducts()

        setProducts(data.map((product) => ({
          ...product,
          id: product._id,
          farmer: product.farmerName || 'Local Farmer',
          stock: product.quantity,
        })))
      } catch (err) {
        setError('Could not load produce. Please check that the backend server is running.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const filteredProducts = products.filter((product) => {
    const searchText =
      `${product.name} ${product.farmer} ${product.location}`.toLowerCase()

    const matchesSearch = searchText.includes(search.toLowerCase())
    const matchesCategory =
      category === 'All Produce' || product.category === category
    const matchesQuality =
      quality === 'All Quality' || product.qualityGrade === quality
    const matchesSize =
      size === 'All Sizes' || product.sizeCategory === size
    const matchesPesticide =
      pesticide === 'All Pesticide Status' ||
      product.pesticideStatus === pesticide

    return matchesSearch && matchesCategory &&
      matchesQuality && matchesSize && matchesPesticide
  })

  const clearFilters = () => {
    setSearch('')
    setCategory('All Produce')
    setQuality('All Quality')
    setSize('All Sizes')
    setPesticide('All Pesticide Status')
  }

  return (
    <main className="buyer-page">
      <header className="market-header">
        <a href="/" className="market-logo">🌿 AGRI-CONNECT</a>
        <span>FARM FRESH. FAIR PRICES.</span>
      </header>

      <section className="market-intro">
        <p className="market-eyebrow">THE FARMER-TO-BUYER MARKETPLACE</p>
        <h1>Fresh from the farm.</h1>
        <p>
          Discover quality produce from farmers across India.
          Connect directly, trade transparently.
        </p>
      </section>

      <section className="market-content">

        <div className="market-results">
          <h2>Browse by category</h2>
          <span>{products.length} total listings</span>
        </div>

        <div className="buyer-category-list">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? 'category-active' : ''}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="market-toolbar">
          <input
            type="search"
            placeholder="Search produce, farmers or locations..."
            aria-label="Search marketplace"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select value={quality} onChange={(event) => setQuality(event.target.value)}>
            <option>All Quality</option>
            <option>Premium</option>
            <option>Grade A</option>
            <option>Grade B</option>
            <option>Standard</option>
          </select>

          <select value={size} onChange={(event) => setSize(event.target.value)}>
            <option>All Sizes</option>
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
          </select>

          <select value={pesticide} onChange={(event) => setPesticide(event.target.value)}>
            <option>All Pesticide Status</option>
            <option>Organic certified</option>
            <option>No pesticides reported</option>
            <option>Conventional</option>
          </select>

          <button type="button" className="clear-filters" onClick={clearFilters}>
            Clear filters
          </button>
        </div>

        <div className="market-results">
          <h2>Explore the harvest</h2>
          <span>{filteredProducts.length} listings found</span>
        </div>

        {loading && <p className="empty-market">Loading fresh produce...</p>}
        {error && <p className="empty-market">{error}</p>}

        {!loading && !error && (
          <>
            <div className="produce-grid">
              {filteredProducts.map((product) => (
                <article className="produce-card" key={product.id}>
                  <div className="produce-image">
                    {getProductImage(product) ? (
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="produce-image-placeholder">
                        Image not available
                      </div>
                    )}
                    <span>{product.category}</span>
                  </div>

                  <div className="produce-details">
                    <p className="produce-location">📍 {product.location}</p>
                    <h3>{product.name}</h3>
                    <p className="produce-farmer">By {product.farmer}</p>

                    <div className="product-attributes">
                      <span>Quality: {product.qualityGrade || 'Not specified'}</span>
                      <span>Size: {product.sizeCategory || 'Not specified'}</span>
                      <span>
                        Pesticides: {product.pesticideStatus || 'Not specified'}
                      </span>
                      {product.harvestDate && (
                        <span>
                          Harvested: {new Date(product.harvestDate).toLocaleDateString('en-IN')}
                        </span>
                      )}
                    </div>

                    <div className="produce-bottom">
                      <div>
                        <strong>₹{product.price}/kg</strong>
                        <small>{product.stock} kg available</small>
                      </div>

                      <button
                        type="button"
                        onClick={() => alert(
                          `${product.name} — ordering will be added next.`
                        )}
                      >
                        View Produce ↗
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <p className="empty-market">
                No produce found. Try changing your filters.
              </p>
            )}
          </>
        )}

        <p className="market-disclaimer">
          Product quality and pesticide details are farmer-reported unless independently verified.
        </p>
      </section>
    </main>
  )
}

export default BuyerPage
