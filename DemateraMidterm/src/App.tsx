import { useState } from 'react'
import type { FormEvent } from 'react'

import headphoneImage from './HeadPhone.jpg';
import mouseImage from './Mouse.jpg';
import backpackImage from './backpack.jpg';
import usbImage from './USB Flash Drive.jpg';
type Product = {
  id: number
  name: string
  category: string
  price: number
  quantity: number 
  image: string
  description: string
  specification: string
  rating: number
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 1200,
    quantity: 0,
    image: headphoneImage,
    description: 'Wireless headphones for music, online classes, and gaming.',
    specification: 'Bluetooth connectivity, rechargeable battery',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Gaming Mouse',
    category: 'Electronics',
    price: 650,
    quantity: 0,
    image: mouseImage,
    description: 'A responsive mouse for gaming and everyday computer use.',
    specification: 'USB connection, adjustable sensitivity',
    rating: 4.2,
  },
  {
    id: 3,
    name: 'School Backpack',
    category: 'Accessories',
    price: 850,
    quantity: 0,
    image: backpackImage,
    description: 'A practical backpack for school supplies and daily essentials.',
    specification: 'Multiple compartments, adjustable straps',
    rating: 4.8,
  },
  {
    id: 4,
    name: 'USB Drive',
    category: 'Electronics',
    price: 400,
    quantity: 0,
    image: usbImage,
    description: 'A compact USB drive for storing and transferring data.',
    specification: 'High-speed data transfer, durable design.',
    rating: 4.0,
  },
]

const money = (amount: number) =>
  `₱${amount.toLocaleString('en-PH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`

function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [category, setCategory] = useState('All')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [cart, setCart] = useState<Record<number, number>>({})
  const [message, setMessage] = useState('')

  const filteredProducts =
    category === 'All'
      ? products
      : products.filter((product) => product.category === category)

  const total = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  )

  const stockCount = products.reduce(
    (sum, product) => sum + product.quantity,
    0
  )

  const cartItems = products.filter(
    (product) => (cart[product.id] ?? 0) > 0
  )

  const cartCount = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0
  )

  const cartTotal = cartItems.reduce(
    (sum, product) =>
      sum + product.price * (cart[product.id] ?? 0),
    0
  )

  const selectedProduct = products.find(
    (product) => product.id === selectedId
  )

  function changeQuantity(id: number, amount: number) {
    setProducts((current) =>
      current.map((product) =>
        product.id === id
          ? {
              ...product,
              quantity: Math.max(0, product.quantity + amount),
            }
          : product
      )
    )
  }

  function deleteProduct(product: Product) {
    if (!window.confirm(`Delete "${product.name}" from your products?`)) {
      return
    }

    setProducts((current) =>
      current.filter((item) => item.id !== product.id)
    )
    setCart((current) => {
      const next = { ...current }
      delete next[product.id]
      return next
    })
    setSelectedId(null)
    setMessage(`${product.name} deleted.`)
  }

  function addToCart(product: Product) {
    if (product.quantity <= 0) {
      setMessage('This product is out of stock.')
      return
    }

    changeQuantity(product.id, -1)

    setCart((current) => ({
      ...current,
      [product.id]: (current[product.id] ?? 0) + 1,
    }))

    setMessage(`${product.name} added to cart!`)
  }

  function removeFromCart(product: Product) {
    if (!(cart[product.id] > 0)) return

    setCart((current) => {
      const next = { ...current }
      next[product.id] -= 1

      if (next[product.id] <= 0) {
        delete next[product.id]
      }

      return next
    })

    changeQuantity(product.id, 1)
    setMessage(`${product.name} removed from cart.`)
  }

function removeAllFromCart(product: Product) {
  const quantityInCart = cart[product.id] ?? 0

  if (quantityInCart <= 0) return

  setCart((current) => {
    const next = { ...current }
    delete next[product.id]
    return next
  })

  changeQuantity(product.id, quantityInCart)
  setMessage(`All ${product.name} items removed from cart.`)
}


  function addProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)

    const name = String(data.get('name') ?? '').trim()
    const categoryValue = String(data.get('category') ?? '')
    const image = String(data.get('image') ?? '').trim()
    const description = String(data.get('description') ?? '').trim()
    const specification = String(data.get('specification') ?? '').trim()
    const price = Number(data.get('price'))
    const quantity = Number(data.get('quantity'))
    const rating = Number(data.get('rating'))

    if (
      !name ||
      !categoryValue ||
      !image ||
      !description ||
      !specification ||
      data.get('price') === '' ||
      data.get('quantity') === '' ||
      data.get('rating') === '' ||
      !Number.isFinite(price) ||
      !Number.isFinite(quantity) ||
      !Number.isFinite(rating) ||
      price <= 0 ||
      quantity < 0 ||
      !Number.isInteger(quantity) ||
      rating < 0 ||
      rating > 5
    ) {
      setMessage('Please fill in every field with valid values.')
      return
    }

    const newProduct: Product = {
      id: Math.max(0, ...products.map((product) => product.id)) + 1,
      name,
      category: categoryValue,
      image,
      description,
      specification,
      price,
      quantity,
      rating,
    }

    setProducts((current) => [...current, newProduct])
    setCategory('All')
    setShowForm(false)
    setSelectedId(null)
    setMessage(`${newProduct.name} added successfully!`)
    form.reset()
  }

  const buttonClass =
    'rounded-xl border border-indigo-300/30 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-indigo-950/40 transition duration-200 hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40'

  const inputClass =
    'w-full rounded-xl border border-slate-700 bg-[#111a33] p-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20'

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#080d20] via-[#111735] to-[#0b1025] p-4 sm:p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <header className="relative mb-8 flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-3xl border border-indigo-300/15 bg-gradient-to-br from-[#17213d]/95 via-[#111a33]/95 to-[#11142b]/95 p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-indigo-300">
              Inventory dashboard
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Product Management
            </h1>
            <p className="mt-2 text-slate-400">
              Manage your products and inventory
            </p>
          </div>

          <button
            className={`${buttonClass} relative`}
            onClick={() => {
              setShowCart(true)
              setShowForm(false)
              setSelectedId(null)
            }}
          >
            <span aria-hidden="true" className="mr-2">🛒</span>
            Cart
            <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-sm">
              {cartCount}
            </span>
          </button>
        </header>

        {!showCart && !selectedProduct && !showForm && (
          <section
            aria-label="Inventory overview"
            className="mb-8 grid gap-4 sm:grid-cols-3"
          >
            <div className="rounded-2xl border border-blue-400/15 bg-gradient-to-br from-blue-500/10 to-[#111a33] p-5 shadow-lg shadow-black/10">
              <p className="text-sm font-medium text-slate-400">Products</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {products.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">In your catalog</p>
            </div>
            <div className="rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/10 to-[#111a33] p-5 shadow-lg shadow-black/10">
              <p className="text-sm font-medium text-slate-400">Units in stock</p>
              <p className="mt-2 text-3xl font-bold text-white">{stockCount}</p>
              <p className="mt-1 text-xs text-slate-500">Across all products</p>
            </div>
            <div className="rounded-2xl border border-cyan-400/15 bg-gradient-to-br from-cyan-500/10 to-[#111a33] p-5 shadow-lg shadow-black/10">
              <p className="text-sm font-medium text-slate-400">Inventory value</p>
              <p className="mt-2 text-3xl font-bold text-white">{money(total)}</p>
              <p className="mt-1 text-xs text-slate-500">Based on current stock</p>
            </div>
          </section>
        )}

        {message && (
          <div
            role="status"
            className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-blue-400/20 bg-blue-500/10 p-4 text-blue-100 shadow-lg shadow-black/10"
          >
            <span>{message}</span>
            <button
              className="font-bold"
              onClick={() => setMessage('')}
              aria-label="Dismiss message"
            >
              ✕
            </button>
          </div>
        )}

        {showCart ? (
          <section className="rounded-xl bg-[#111a33] p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-slate-100">
                Shopping Cart
              </h2>
              <button
                className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-200 hover:bg-slate-700"
                onClick={() => setShowCart(false)}
              >
                Back to Products
              </button>
            </div>

            {cartItems.length === 0 ? (
              <p className="py-8 text-slate-500">
                Your cart is empty. Add a product to get started.
              </p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-wrap items-center justify-between gap-4 border-b pb-4"
                  >
                    <div>
                      <h3 className="font-bold text-slate-800">
                        {product.name}
                      </h3>
                      <p className="text-slate-500">
                        {money(product.price)} × {cart[product.id]}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="font-bold">
                        {money(product.price * cart[product.id])}
                      </p>
                      <button
                        className="rounded-lg bg-red-100 px-3 py-2 text-red-700"
                        onClick={() => removeFromCart(product)}
                      >
                        Remove one
                      </button>
                      <button
                        className="rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                        onClick={() => removeAllFromCart(product)}
                      >
                        Remove all from cart
                      </button>
                    </div>
                  </div>
                ))}

                <p className="pt-3 text-right text-xl font-bold text-slate-800">
                  Cart Total: {money(cartTotal)}
                </p>
              </div>
            )}
          </section>
        ) : selectedProduct ? (
          <section className="rounded-2xl border border-indigo-300/15 bg-gradient-to-br from-[#17213d] to-[#0d1429] p-6 shadow-xl shadow-black/20">
            <button
              className="mb-5 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-200 hover:bg-slate-700"
              onClick={() => setSelectedId(null)}
            >
              ← Back to Products
            </button>

            <div className="grid gap-8 md:grid-cols-2">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="h-72 w-full rounded-xl border border-slate-700/70 bg-[#0b1025] object-contain"
              />

              <div>
                <p className="text-sm font-semibold text-indigo-300">
                  {selectedProduct.category}
                </p>
                <h2 className="mt-2 text-3xl font-bold text-white">
                  {selectedProduct.name}
                </h2>
                <p className="mt-4 text-2xl font-bold text-indigo-200">
                  {money(selectedProduct.price)}
                </p>
                <p className="mt-3 text-slate-300">
                  {selectedProduct.description}
                </p>
                <p className="mt-4 text-slate-300">
                  <strong>Specifications:</strong>{' '}
                  {selectedProduct.specification}
                </p>
                <p className="mt-3 text-slate-300">
                  <strong>Rating:</strong> ⭐ {selectedProduct.rating}/5
                </p>
                <p className="mt-3 text-slate-300">
                  <strong>Available stock:</strong>{' '}
                  {selectedProduct.quantity}
                </p>

                {selectedProduct.quantity < 5 && (
                  <p className="mt-3 font-semibold text-amber-300">
                    {selectedProduct.quantity === 0 ? 'Out of stock' : 'Low stock'}
                  </p>
                )}

                <button
                  className={`${buttonClass} mt-5`}
                  disabled={selectedProduct.quantity === 0}
                  onClick={() => addToCart(selectedProduct)}
                >
                  Add to Cart
                </button>
                <button
                  className="ml-3 mt-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2.5 font-semibold text-red-200 transition hover:bg-red-500/20"
                  onClick={() => deleteProduct(selectedProduct)}
                >
                  Delete Product
                </button>
              </div>
            </div>
          </section>
        ) : showForm ? (
          <section className="rounded-2xl border border-indigo-300/15 bg-gradient-to-br from-[#17213d] to-[#0d1429] p-6 shadow-xl shadow-black/20">
            <div className="mb-6 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-white">
                Add New Product
              </h2>
              <button
                className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-200 hover:bg-slate-700"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>

            <form
              onSubmit={addProduct}
              className="grid gap-5 md:grid-cols-2"
            >
              <label className="block text-sm font-medium text-slate-200">
                Product Name *
                <input
                  className={`${inputClass} mt-2`}
                  name="name"
                  required
                  placeholder="Enter product name"
                />
              </label>

              <label className="block text-sm font-medium text-slate-200">
                Product Category *
                <select
                  className={`${inputClass} mt-2`}
                  name="category"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option value="Electronics">Electronics</option>
                  <option value="Accessories">Accessories</option>
                  <option value="School Supplies">School Supplies</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-200 md:col-span-2">
                Feature Image URL *
                <input
                  className={`${inputClass} mt-2`}
                  name="image"
                  type="url"
                  required
                  placeholder="https://example.com/product.jpg"
                />
              </label>

              <label className="block text-sm font-medium text-slate-200 md:col-span-2">
                Description *
                <textarea
                  className={`${inputClass} mt-2`}
                  name="description"
                  required
                  rows={3}
                  placeholder="Describe the product"
                />
              </label>

              <label className="block text-sm font-medium text-slate-200 md:col-span-2">
                Product Specifications *
                <textarea
                  className={`${inputClass} mt-2`}
                  name="specification"
                  required
                  rows={2}
                  placeholder="Materials, features, size, connectivity, etc."
                />
              </label>

              <label className="block text-sm font-medium text-slate-200">
                Rating (0–5) *
                <input
                  className={`${inputClass} mt-2`}
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  required
                  defaultValue="5"
                />
              </label>

              <label className="block text-sm font-medium text-slate-200">
                Price (₱) *
                <input
                  className={`${inputClass} mt-2`}
                  name="price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="Enter price"
                />
              </label>

              <label className="block text-sm font-medium text-slate-200">
                Quantity *
                <input
                  className={`${inputClass} mt-2`}
                  name="quantity"
                  type="number"
                  min="0"
                  step="1"
                  required
                  defaultValue="0"
                  placeholder="Enter stock quantity"
                />
              </label>

              <div className="flex items-end">
                <button type="submit" className={buttonClass}>
                  Save Product
                </button>
              </div>

              <p className="text-sm text-slate-400 md:col-span-2">
                * All fields are required. Use a valid image URL,
                a positive price, a whole-number quantity, and a rating
                between 0 and 5.
              </p>
            </form>
          </section>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">
                  Browse inventory
                </p>
                <h2 className="mt-1 text-2xl font-bold text-white">
                  Products <span className="text-slate-400">({filteredProducts.length})</span>
                </h2>
              </div>

              <div className="flex flex-wrap gap-3">
                <select
                  aria-label="Filter products by category"
                  className="rounded-xl border border-slate-700 bg-[#111a33] p-3 text-slate-100 shadow-lg shadow-black/10"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <option value="All">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Accessories">Accessories</option>
                  <option value="School Supplies">School Supplies</option>
                  <option value="Other">Other</option>
                </select>

                <button
                  className={buttonClass}
                  onClick={() => {
                    setShowForm(true)
                    setMessage('')
                  }}
                >
                  + Add Product
                </button>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <p className="rounded-2xl border border-slate-700/70 bg-[#111a33] p-8 text-center text-slate-400">
                No products found in this category.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}

                    className="group overflow-hidden rounded-2xl border border-indigo-300/15 bg-gradient-to-br from-[#17213d] to-[#0d1429] shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-violet-400/50 hover:shadow-indigo-950/50"
                  >
                   <img
                      src={product.image}
                      alt={product.name}
                      className="h-48 w-full bg-slate-800 object-contain"
                    />

                    <div className="p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                        {product.category}
                      </p>

                      <button
                        className="mt-1 text-left text-xl font-bold text-white transition hover:text-indigo-300"
                        onClick={() => setSelectedId(product.id)}
                      >
                        {product.name}
                      </button>

                      <p className="mt-3 text-lg font-semibold text-indigo-200">
                        {money(product.price)}
                      </p>
                      <p className="mt-2 text-sm text-slate-300">
                        Quantity: {product.quantity}
                      </p>
                      <p className="mt-1 text-sm text-slate-300">
                        Rating: ⭐ {product.rating}/5
                      </p>

                      {product.quantity < 5 && (
                        <p className="mt-2 inline-flex rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-300">
                          {product.quantity === 0
                            ? 'Out of Stock'
                            : 'Low Stock'}
                        </p>
                      )}

                      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-slate-700/60 bg-black/10 p-3">
                        <button
                          aria-label={`Decrease ${product.name} quantity`}
                          onClick={() => changeQuantity(product.id, -1)}
                          disabled={product.quantity === 0}
                          className="rounded-lg border border-slate-600 bg-slate-700/70 px-3 py-1.5 text-white transition hover:bg-slate-600 disabled:opacity-40"
                        >
                          −
                        </button>

                        <span className="min-w-8 text-center font-semibold text-white">{product.quantity}</span>

                        <button
                          aria-label={`Increase ${product.name} quantity`}
                          onClick={() => changeQuantity(product.id, 1)}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 font-semibold text-white transition hover:bg-blue-500"
                        >
                          +
                        </button>

                        <button
                          aria-label={`Remove all ${product.name} stock`}
                          title="Set stock quantity to zero"
                          onClick={() => {
                            if (product.quantity === 0) return

                            setProducts((current) =>
                              current.map((item) =>
                                item.id === product.id
                                  ? { ...item, quantity: 0 }
                                  : item
                              )
                            )
                            setMessage(`All ${product.name} stock removed.`)
                          }}
                          disabled={product.quantity === 0}
                          className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-200 transition hover:bg-red-500/20 disabled:opacity-40"
                        >
                          Remove all
                        </button>
                      </div>

                      <p className="mt-4 border-t border-slate-700 pt-4 font-semibold text-slate-300">
                        Subtotal:{' '}
                        {money(product.price * product.quantity)}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          className={buttonClass}
                          disabled={product.quantity === 0}
                          onClick={() => addToCart(product)}
                        >
                          Add to Cart
                        </button>

                        <button
                          className="rounded-xl border border-slate-600 bg-slate-800/70 px-4 py-2.5 font-medium text-slate-200 transition hover:border-indigo-400/50 hover:bg-slate-700"
                          onClick={() => setSelectedId(product.id)}
                        >
                          View Details
                        </button>
                        <button
                          className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2.5 font-medium text-red-200 transition hover:bg-red-500/20"
                          onClick={() => deleteProduct(product)}
                        >
                          Delete Product
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <section className="mt-8 overflow-hidden rounded-2xl border border-indigo-300/20 bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 p-6 text-white shadow-xl shadow-indigo-950/30 sm:p-8">
              <p className="text-lg">Overall Inventory Value</p>
              <p className="mt-2 text-3xl font-bold">{money(total)}</p>
              <p className="mt-2 text-sm text-blue-100">
                Based on the current stock quantity of all products.
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  )
}

export default App