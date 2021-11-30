const bcrypt = require('bcryptjs')
const { body } = require('express-validator')
const User = require('../models/user')

exports.registerValidators = [
  body('email', 'Введите корректный email')
    .isEmail()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value })
        if (user) {
          return Promise.reject('Такой email уже занят')
        }
      } catch (e) {
        console.log(e)
      }
    })
    .normalizeEmail(),
  body('password', 'Пароль должен быть минимум 6 символов')
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
  body('confirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Пароли должны совпадать')
      }
      return true
    })
    .trim(),
  body('name')
    .isLength({ min: 3 })
    .withMessage('Имя должно быть минимум 3 символа')
    .trim(),
]

exports.loginValidators = [
  body('email')
    .isEmail()
    .withMessage('Введите корректный email')
    .custom(async (value, {req}) => {
      try {
        const user = await User.findOne({ email: value })
        if (!user) {
          return Promise.reject('Пользователь с таким email не зарегистрирован в системе')
        }
        req.session.user = user
        req.session.isAuthenticated = true
      } catch (e) {
        console.log(e)
      }
    }),
  body('password')
    .isAlphanumeric()
    .withMessage('Пароль должен содержать только латинские символы и цифры')
    .isLength({ min: 6, max: 56 })
    .withMessage('Пароль должен содержать не меньше 6 символов')
    .custom(async (value, { req }) => {
      const areSame = await bcrypt.compare(value, req.session.user.password)
      if (!areSame) {
        return Promise.reject('Неверный пароль')
      }
    })
]

exports.courseValidators = [
  body('title')
    .isLength({ min: 3 })
    .withMessage('Минимальная длина названия 3 символа')
    .trim(),
  body('price')
    .isNumeric()
    .withMessage('Введите корректную цену'),
  body('img')
    .isURL()
    .withMessage('Введите корректный URL картинки')
]
