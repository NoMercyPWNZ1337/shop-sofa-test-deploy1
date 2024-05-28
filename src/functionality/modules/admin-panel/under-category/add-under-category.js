;(async () => {
  const { AuthService } = await import('../../../services/auth.js')
  const { categorySelect } = await import('../components/category-select.js')
  const { UnderCategoryService } = await import(
    '../../../services/under-category.js'
  )

  await AuthService.checkAuth()
  await AuthService.checkAccess()

  const addUnderCategoryForm = document.querySelector('#add-under-category')

  categorySelect({ form: addUnderCategoryForm })

  addUnderCategoryForm.addEventListener('submit', async e => {
    e.preventDefault()

    try {
      const responseUnderCategory = await UnderCategoryService.create({
        underCatagoryData: {
          name: e.target.name.value,
          categoryId: e.target.category.value,
        },
      })

      if (responseUnderCategory.success) {
        alert(
          'Підкатегорію добавлено, сторінка перезагрузиться після закриття сповіщення'
        )

        window.location.reload()
      }
    } catch (error) {
      console.log(error)
    }
  })
})()
