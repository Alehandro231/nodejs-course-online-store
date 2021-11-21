const path = require('path')
const fs = require('fs')

const p = path.join(
  __dirname, '..',
  'data',
  'card.json'
)

class Card {
  static async add(course) {
    const card = await Card.fetch()

    const idx = card.courses.findIndex(c => c.id === course.id)
    const candidate = card.courses[idx]

    if (candidate) {
      // Курс уже есть
      candidate.count += 1
      card.courses[idx] = candidate
    } else {
      // Нужно добавить
      course.count = 1
      card.courses.push(course)
    }

    card.price += +course.price

    return new Promise((res, rej) => {
      fs.writeFile(p, JSON.stringify(card), (err) => {
        if (err) {
          rej(err)
        } else {
          res()
        }
      })
    })
  }

  static async remove(id) {
    const card = await Card.fetch()

    const idx = card.courses.findIndex(c => c.id === id)
    const course = card.courses[idx]

    if (course.count === 1) {
      // Удалить
      card.courses.splice(idx, 1)
    } else {
      // Изменить количество
      card.courses[idx].count--
    }

    card.price -= course.price

    return new Promise((res, rej) => {
      fs.writeFile(p, JSON.stringify(card), (err) => {
        if (err) {
          rej(err)
        } else {
          res(card)
        }
      })
    })
  }
  
  static async fetch() {
    return new Promise((res, rej) => {
      fs.readFile(p, 'utf-8', (err, content) => {
        if (err) {
          rej(err)
        } else {
          res(JSON.parse(content))
        }
      })
    })
  }
}

module.exports = Card