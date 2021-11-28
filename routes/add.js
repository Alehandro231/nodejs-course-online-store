const { Router } = require('express')
const Course = require('../models/course')
const auth = require('../middleware/auth')
const router = Router()

router.get('/', auth, (req, res) => {
  try {
    res.render(
      'add',
      {
        title: 'Добавить курс',
        isAdd: true,
      })
  } catch (e) {
    console.log(e)
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { title, price, img } = req.body
    const course = new Course({
      title,
      price,
      img,
      userId: req.user
    })

    await course.save()

    res.redirect('/courses');
  } catch (e) {
    console.log(e)
  }  
})

module.exports = router
