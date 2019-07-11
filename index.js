const express = require('express')
const app = express()

const persons = [
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

app.get('/info', (req, res) => {
  res.end(`Phonebook has info for ${persons.length} people \n\n${new Date()}`)
})

const PORT = 3001
app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}`)
})