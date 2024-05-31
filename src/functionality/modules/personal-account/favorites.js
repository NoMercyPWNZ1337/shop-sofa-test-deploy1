const actualDOM = () => {
  return {
    favorites: document.querySelector('#favorites'),
    removeProductBtns: document.querySelectorAll(
      '#favorites .product .btn[data-remove-id]'
    ),
  }
}

const productTemplate = ({ product }) => {
  return `
    <div class="product">
      <img 
        class="product-image"
        src="${product.image}" 
        alt="product image" 
      />
      <a class="product-title" href="">${product.name}</a>
      <p class="product-stock">
        В наявності: ${product.quantityInDrugstore}
      </p>
      <p class="product-price ${product.discountedPrice ? 'active' : ''}">
        <span>
          <span class="price">${product.price}</span>
          ${
            product.discountedPrice &&
            `<span class="discounted">
              ${product.discountedPrice}
            </span>`
          }
          грн
        </span>
        <span class="text">за упаковку</span>
      </p>
      <button class="btn" data-remove-id="${product._id}">
        Видалити
      </button>
    </div>
  `
}

;(async () => {
  const { AuthService } = await import('../../services/auth.js')
  const { ProductService } = await import('../../services/product.js')

  await AuthService.checkAuth()

  const DOM = actualDOM()

  let favorites = JSON.parse(localStorage.getItem('favorites')) || []

  const onRemoveProduct = () => {
    const removeBtns = actualDOM().removeProductBtns

    removeBtns.forEach(btn => {
      btn.addEventListener('click', e => {
        const productId = e.target.dataset.removeId

        favorites = favorites.filter(id => id !== productId)

        localStorage.setItem('favorites', JSON.stringify(favorites))

        window.location.reload()
      })
    })
  }

  try {
    const responseProducts = await ProductService.getAllForFavorites({
      productIds: JSON.stringify(favorites),
    })

    if (!responseProducts.success) return

    if (responseProducts.products.length) {
      const productListHtml = responseProducts.products.map(product => {
        return productTemplate({ product })
      })

      DOM.favorites.innerHTML = productListHtml.join('')

      onRemoveProduct()
    } else {
      DOM.favorites.innerHTML = `<h2>Товарів в обраному ще немає</h2>`
    }
  } catch (error) {
    console.log(error)
  }
})()