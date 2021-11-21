const { v4: uuid } = require('uuid')
const fs = require('fs')
const path = require('path')

class Course {
  constructor(title, price, img) {
    this.title = title
    this.price = price
    this.img = img
    this.id = uuid()
  }

  toJSON() {
    return {
      title: this.title,
      price: this.price,
      img: this.img,
      id: this.id,
    }
  }

  static async update(course) {
    const courses = await Course.getAll()

    const idx = courses.findIndex(c => c.id === course.id)
    courses[idx] = course
    return new Promise((res, rej) => {
      fs.writeFile(
        path.join(__dirname, '..', 'data', 'courses.json'),
        JSON.stringify(courses),
        (err) => {
          if (err) {
            rej(err)
          }
          res()
        }
      )
    })
  }

  async save() {
    const courses = await Course.getAll()
    courses.push(this.toJSON())

    return new Promise((res, rej) => {
      fs.writeFile(
        path.join(__dirname, '..', 'data', 'courses.json'),
        JSON.stringify(courses),
        (err) => {
          if (err) {
            rej(err)
          }
          res()
        }
      )
    })
  }

  static getAll() {
    return new Promise((res, rej) => {
      fs.readFile(
        path.join(__dirname, '..', 'data', 'courses.json'),
        'utf-8',
        (err, content) => {
          if (err) {
            rej(err)
          }
          res(JSON.parse(content))
        }
      )
    })
  }

  static async getById(id) {
    const courses = await Course.getAll()
    return courses.find(c => c.id === id)
  }
}

module.exports = Course
