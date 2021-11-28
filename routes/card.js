const { Router } = require('express')
const auth = require('../middleware/auth')
const Course = require('../models/course')
const router = Router()

const mapCartItems = (cart) => cart.items.map(c => ({
  ...c.courseId._doc,
  id: c.courseId.id,
  count: c.count,
}))

const computePrice = (courses) =>
  courses.reduce((acc, c) => acc += c.price * c.count, 0)

router.post('/add', auth, async (req, res) => {
  const course = await Course.findById(req.body.id)
  await req.user.addToCart(course)
  res.redirect('/card')
})

router.get('/', auth, async (req, res) => {
  const user = await req.user
    .populate('cart.items.courseId')

  const courses = mapCartItems(user.cart)
  const price = computePrice(courses)

  res.render('card', {
    title: 'Корзина',
    isCard: true,
    courses,
    price,
  })
})

router.delete('/remove/:id', auth, async (req, res) => {
  await req.user.removeFromCart(req.params.id)
  const user = await req.user.populate('cart.items.courseId')

  const courses = mapCartItems(user.cart)
  const price = computePrice(courses)
  const cart = {
    courses,
    price,
  }

  res.status(200).json(cart)
})

module.exports = router
