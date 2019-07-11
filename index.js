const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

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
    id: 4
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const person = persons.find(p => p.id === Number(req.params.id))
  if (person) {
    return res.json(person)
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  const reqName = req.body.name
  const reqNumber = req.body.number
  if (!reqName || !reqNumber) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }
  if (persons.find(p => p.name === reqName)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }
  const person = {
    name: reqName,
    number: reqNumber,
    id: Math.floor(Math.random() * 999999999)
  };
  persons = persons.concat(person)
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  persons = persons.filter(p => p.id !== Number(req.params.id))
  res.status(204).end()
})

app.get('/info', (req, res) => {
  res.end(`Phonebook has info for ${persons.length} people \n\n${new Date()}`)
})

const PORT = 3001
app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}`)
})