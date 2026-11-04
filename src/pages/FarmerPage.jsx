
import { useEffect, useState } from 'react'
import { getProducts, createProduct, deleteProduct } from '../api'
import './FarmerPage.css'

// Product image library
const productImages = {
  tomato: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800',
  onion: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=800',
  potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800',
  carrot: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=800',
  spinach: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800',
  cabbage: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=800',
  apple: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800',
  banana: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800',
  mango: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800',
  orange: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=800',
  grapes: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800',
  rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800',
  wheat: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
  corn: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800',
  peas: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=800',
  chilli: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800',
}

const categoryImages = {
  Vegetables: productImages.tomato,
  Fruits: productImages.apple,
  'Leafy Greens': productImages.spinach,
  'Grains & Pulses': productImages.rice,
}

// Match products without worrying about uppercase, lowercase or plurals
const getProductImage = (name, category, customImage) => {
  if (customImage && customImage.trim()) {
    return customImage.trim()
  }

  const productName = (name || '').toLowerCase().trim()

  const aliases = {
    tomatoes: 'tomato',
    potatoes: 'potato',
    onions: 'onion',
    carrots: 'carrot',
    apples: 'apple',
    bananas: 'banana',
    mangoes: 'mango',
    oranges: 'orange',
    grapes: 'grapes',
    chillies: 'chilli',
    chilies: 'chilli',
    chilli: 'chilli',
    spinach: 'spinach',
    cabbages: 'cabbage',
    corns: 'corn',
    peas: 'peas',
    rice: 'rice',
    wheat: 'wheat',
  }

  const words = productName
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)

  const matchingWord = words
    .map((word) => aliases[word] || word)
    .find((word) => productImages[word])

  return matchingWord
    ? productImages[matchingWord]
    : categoryImages[category] || productImages.tomato
}

const initialForm = {
  name: '',
  category: 'Vegetables',
  price: '',
  stock: '',
  image: '',
  qualityGrade: 'Grade A',
  sizeCategory: 'Medium',
  pesticideStatus: 'Conventional',
  harvestDate: '',
  location: 'Nagpur, Maharashtra',
}

function FarmerPage() {
  const [listings, setListings] = useState([])
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadListings()
  }, [])

  const loadListings = async () => {
    try {
      setLoading(true)
      const products = await getProducts()

      setListings(
        products.map((product) => ({
          ...product,
          id: product._id,
          stock: product.quantity,
          image: getProductImage(
            product.name,
            product.category,
            product.image
          ),
        }))
      )
    } catch (error) {
      setMessage(error.message || 'Could not load listings from the server.')
    } finally {
      setLoading(false)
    }
  }

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const addListing = async (event) => {
    event.preventDefault()

    const price = Number(form.price)
    const stock = Number(form.stock)

    if (!form.name.trim() || price <= 0 || stock <= 0) {
      setMessage('Enter a produce name, positive price and available stock.')
      return
    }

    try {
      setSaving(true)
      setMessage('')

      const selectedImage = getProductImage(
        form.name,
        form.category,
        form.image
      )

      const savedProduct = await createProduct({
        name: form.name.trim(),
        category: form.category,
        price,
        quantity: stock,
        unit: 'kg',
        location: form.location.trim(),
        farmerName: 'Demo Farmer',
        image: selectedImage,
        description: '',
        qualityGrade: form.qualityGrade,
        sizeCategory: form.sizeCategory,
        pesticideStatus: form.pesticideStatus,
        harvestDate: form.harvestDate || null,
      })

      setListings((previous) => [
        {
          ...savedProduct,
          id: savedProduct._id,
          stock: savedProduct.quantity,
          image: savedProduct.image || selectedImage,
        },
        ...previous,
      ])

      setForm({ ...initialForm })
      setMessage(`${savedProduct.name} published successfully with an image!`)
    } catch (error) {
      setMessage(error.message || 'Failed to save the listing.')
    } finally {
      setSaving(false)
    }
  }

  const removeListing = async (id) => {
    try {
      await deleteProduct(id)
      setListings((previous) => previous.filter((item) => item.id !== id))
      setMessage('Listing removed from MongoDB.')
    } catch (error) {
      setMessage(error.message || 'Failed to remove the listing.')
    }
  }

  const totalStock = listings.reduce(
    (total, item) => total + Number(item.stock || 0),
    0
  )

  return (
    <main className="farmer-page">
      <header className="farmer-header">
        <a href="/" className="farmer-logo">🌿 AGRI-CONNECT</a>
        <a href="/" className="farmer-home">← Back to homepage</a>
      </header>

      <section className="farmer-welcome">
        <p className="farmer-eyebrow">YOUR FARM. YOUR MARKET.</p>
        <h1>Good to see you, Farmer.</h1>
        <p>Manage your produce and bring your harvest closer to buyers.</p>
      </section>

      <section className="farmer-dashboard">
        <div className="farmer-stats">
          <article className="farmer-stat">
            <span>Active listings</span>
            <strong>{listings.length}</strong>
            <small>Produce items listed</small>
          </article>

          <article className="farmer-stat">
            <span>Available stock</span>
            <strong>{totalStock.toLocaleString('en-IN')} kg</strong>
            <small>Across your listings</small>
          </article>

          <article className="farmer-stat">
            <span>Orders received</span>
            <strong>0</strong>
            <small>Demo orders so far</small>
          </article>
        </div>

        <section className="farmer-panel">
          <div className="farmer-panel-heading">
            <div>
              <p className="farmer-eyebrow">ADD TO MARKETPLACE</p>
              <h2>List your produce</h2>
            </div>
            <span className="farmer-panel-symbol">＋</span>
          </div>

          <form className="listing-form" onSubmit={addListing}>
            <label>
              Produce name
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="e.g. Fresh Green Chillies"
                required
              />
            </label>

            <label>
              Category
              <select name="category" value={form.category} onChange={updateField}>
                <option>Vegetables</option>
                <option>Fruits</option>
                <option>Leafy Greens</option>
                <option>Grains & Pulses</option>
              </select>
            </label>

            <label>
              Price per kg (₹)
              <input
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={updateField}
                placeholder="e.g. 30"
                required
              />
            </label>

            <label>
              Available quantity (kg)
              <input
                name="stock"
                type="number"
                min="1"
                value={form.stock}
                onChange={updateField}
                placeholder="e.g. 200"
                required
              />
            </label>

            <label>
              Custom product image URL (optional)
              <input
                name="image"
                type="url"
                value={form.image}
                onChange={updateField}
                placeholder="Paste image URL or leave blank"
              />
            </label>

            <label>
              Quality grade
              <select name="qualityGrade" value={form.qualityGrade} onChange={updateField}>
                <option>Premium</option>
                <option>Grade A</option>
                <option>Grade B</option>
                <option>Standard</option>
              </select>
            </label>

            <label>
              Produce size
              <select name="sizeCategory" value={form.sizeCategory} onChange={updateField}>
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </select>
            </label>

            <label>
              Pesticide information
              <select name="pesticideStatus" value={form.pesticideStatus} onChange={updateField}>
                <option>Conventional</option>
                <option>No pesticides reported</option>
                <option>Organic certified</option>
              </select>
            </label>

            <label>
              Harvest date
              <input
                name="harvestDate"
                type="date"
                value={form.harvestDate}
                onChange={updateField}
              />
            </label>

            <label>
              Farm location (District, State)
              <input
                name="location"
                value={form.location}
                onChange={updateField}
                placeholder="e.g. Nagpur, Maharashtra"
                required
              />
            </label>

            <button className="publish-button" type="submit" disabled={saving}>
              {saving ? 'Saving...' : '+ Publish listing'}
            </button>
          </form>

          {message && (
            <p className="farmer-message" role="status">{message}</p>
          )}
        </section>

        <section className="farmer-panel">
          <div className="farmer-panel-heading">
            <div>
              <p className="farmer-eyebrow">YOUR INVENTORY</p>
              <h2>Your produce listings</h2>
            </div>
            <span className="listing-count">{listings.length} items</span>
          </div>

          {loading ? (
            <p className="farmer-empty">Loading listings...</p>
          ) : listings.length > 0 ? (
            <div className="listing-table-wrap">
              <table className="listing-table">
                <thead>
                  <tr>
                    <th>Produce</th>
                    <th>Category</th>
                    <th>Quality</th>
                    <th>Price / kg</th>
                    <th>Stock</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((item) => (
                    <tr key={item.id}>
                      <td className="listing-name">{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.qualityGrade || 'Not specified'}</td>
                      <td>₹{Number(item.price).toLocaleString('en-IN')}</td>
                      <td>{Number(item.stock).toLocaleString('en-IN')} kg</td>
                      <td>
                        <button
                          className="remove-listing"
                          type="button"
                          onClick={() => removeListing(item.id)}
                          aria-label={`Remove ${item.name}`}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="farmer-empty">
              No listings yet. Add your first produce item above.
            </p>
          )}

          <p className="farmer-disclaimer">
            Listings are stored in the AGRI-CONNECT MongoDB database.
          </p>
        </section>
      </section>
    </main>
  )
}

export default FarmerPage
