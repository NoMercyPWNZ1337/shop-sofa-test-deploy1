import { validationResult } from 'express-validator'

import UnderCategory from '../models/under-category.js'

const create = async (req, res) => {
  try {
    const { errors } = validationResult(req)

    if (errors.length) {
      return res.status(400).json({
        message: 'Помилка при створенні підкатегорії',
        errors,
      })
    }

    const underCategory = new UnderCategory({
      name: req.body.name,
      categoryId: req.body.categoryId,
    })

    await underCategory.save()

    res.json({ success: true })
  } catch (error) {
    console.log(error)

    return res.status(400).json({
      message: 'Помилка при створенні підкатегорії',
      success: false,
    })
  }
}

const update = async (req, res) => {
  try {
    const { errors } = validationResult(req)

    if (errors.length) {
      return res.status(400).json({
        message: 'Помилка при оновленні підкатегорії',
        errors,
      })
    }

    await UnderCategory.findByIdAndUpdate(
      { _id: req.params.id },
      { name: req.body.name, categoryId: req.body.categoryId }
    )

    res.json({ success: true })
  } catch (error) {
    console.log(error)

    return res.status(400).json({
      message: 'Помилка при оновленні підкатегорії',
      success: false,
    })
  }
}

const remove = async (req, res) => {
  try {
    await UnderCategory.findOneAndDelete({ _id: req.params.id })

    res.json({ success: true })
  } catch (error) {
    console.log(error)

    return res.status(400).json({
      message: 'Помилка при видаленні підкатегорії',
      success: false,
    })
  }
}

const getAll = async (req, res) => {
  try {
    const underCategories = await UnderCategory.find().exec()

    return res.json({ success: true, underCategories })
  } catch (error) {
    console.log(error)

    return res.status(400).json({
      message: 'Помилка при полученні підкатегорій',
      success: false,
    })
  }
}

const getOne = async (req, res) => {
  try {
    const underCategory = await UnderCategory.findById(req.params.id).exec()

    return res.json({ success: true, underCategory })
  } catch (error) {
    console.log(error)

    return res.status(400).json({
      message: 'Помилка при полученні підкатегорій',
      success: false,
    })
  }
}

export const UnderCategoryController = {
  create,
  update,
  remove,
  getAll,
  getOne,
}
