require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Person = require('./models/person')
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

morgan.token('post-body', function (req) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ' ' // returning empty string prints '-' character
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-body'))

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(result => {
      res.json(result)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const reqName = req.body.name
  const reqNumber = req.body.number
  if (!reqName || !reqNumber) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }
  const person = new Person({
    name: reqName,
    number: reqNumber
  })
  person.save()
    .then(response => {
      res.json(response.toJSON())
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(result => {
      res.json(result.toJSON())
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  Person.count()
    .then(count => {
      res.end(`Phonebook has info for ${count} people \n\n${new Date()}`)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})