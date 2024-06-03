const actualDOM = () => {
  return {
    catalogFilters: document.querySelector('#catalog-filters'),
    products: document.querySelector('#products'),
    watchedProductsSection: document.querySelector('#watched-products'),
    watchedProducts: document.querySelector('#watched-products-swiper'),
    manufacturers: document.querySelector('#manufacturers'),
  }
}

const searchProducts = async ({ searchQuery }) => {
  const { ProductService } = await import('../services/product.js')
  const { productCard } = await import('./components/product-card.js')
  const { addToCart } = await import('./components/add-to-cart.js')
  const { addToFavorite } = await import('./components/add-to-favorite.js')

  const DOM = actualDOM()

  const responseProducts = await ProductService.getAllByQuery({
    searchQuery,
  })

  if (!responseProducts.success) return responseProducts

  if (responseProducts.products.length) {
    const productListHtml = responseProducts.products.map(product => {
      return productCard({ product })
    })

    DOM.products.innerHTML = productListHtml.join('')

    addToCart()
    addToFavorite()
  } else {
    DOM.products.innerHTML = '<h3>Товарів не знайдено</h3>'
  }
}

;(async () => {
  const { ProductService } = await import('../services/product.js')
  const { watchedProducts } = await import('./components/watched-products.js')

  const searchQuery = window.location.search
  const DOM = actualDOM()

  try {
    await searchProducts({ searchQuery })
    watchedProducts({ DOM })

    const responseManufactures = await ProductService.getAllManufactures({
      searchQuery,
    })

    if (!responseManufactures.success) return

    if (responseManufactures.manufacturers.length) {
      const manufacturersListHtml = responseManufactures.manufacturers.map(
        manufacturer => {
          return `
            <label for="${manufacturer}">
              <input id="${manufacturer}" type="checkbox" data-manufacturer name="${manufacturer}" />
              ${manufacturer}
            </label>
          `
        }
      )

      DOM.manufacturers.innerHTML = manufacturersListHtml.join('')
    }
  } catch (error) {
    console.log(error)
  }

  DOM.catalogFilters.addEventListener('submit', async e => {
    e.preventDefault()

    const manufacturerCheckboxes = e.target.querySelectorAll(
      'input[data-manufacturer]'
    )
    const checkedManufacturer = [...manufacturerCheckboxes]
      .map(checkbox => checkbox.checked && checkbox.name)
      .filter(value => Boolean(value))

    const minPrice = e.target.min.value
    const maxPrice = e.target.max.value
    const withDiscounted = e.target.withDiscounted.checked
    const withRecipe = e.target.withRecipe.checked
    let generateSearchQuery = searchQuery

    if (minPrice) generateSearchQuery += `&minPrice=${minPrice}`
    if (maxPrice) generateSearchQuery += `&maxPrice=${maxPrice}`
    if (withDiscounted) {
      generateSearchQuery += `&withDiscounted=${withDiscounted}`
    }
    if (checkedManufacturer.length) {
      generateSearchQuery += `&manufactures=${JSON.stringify(
        checkedManufacturer
      )}`
    }
    generateSearchQuery += `&withRecipe=${withRecipe}`

    searchProducts({ searchQuery: generateSearchQuery })
  })
})()