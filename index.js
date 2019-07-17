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

morgan.token('post-body', function (req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return ' ' // returning empty string prints '-' character
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-body'))

var persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "040-123456",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "040-123456",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "040-123456",
    // id: 4
  }
]

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(result => {
      res.json(result)
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      res.json(person.toJSON())
    })
})

app.post('/api/persons', (req, res) => {
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
})

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
})

app.get('/info', (req, res) => {
  res.end(`Phonebook has info for ${persons.length} people \n\n${new Date()}`)
})

const PORT = process.env.PORT
app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}`)
})