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
  try {
    const course = await Course.findById(req.body.id)
    
    await req.user.addToCart(course)
    
    res.redirect('/card')
  } catch (e) {
    console.log(e)
  }
})

router.get('/', auth, async (req, res) => {
  try {
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
  } catch (e) {
    console.log(e)
  }
})

router.delete('/remove/:id', auth, async (req, res) => {
  try {
    await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate('cart.items.courseId')

    const courses = mapCartItems(user.cart)
    const price = computePrice(courses)
    const cart = {
      courses,
      price,
    }

    res.status(200).json(cart)
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
