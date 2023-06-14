const express = require('express')
var morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('req-data', (req, res) => {
    return JSON.stringify(req.body);
})

app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :req-data`))
// app.use(morgan('tiny'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const generateId = () => {
    while (true) {
        const id = Math.round(Math.random() * (persons.length + 1))

        if (id <= persons.length) {
            continue
        } else {
            return id;
        }
    }
}

app.get('/info', (request, response) => {
    response.send(`
    <p>Phonebook has info for ${persons.length} people<p/>
    <p>${new Date()}<p/>
    `)
    console.log(request.headers)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).json({
            "message": "Person is not found"
        })
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "name or number is missing !"
        })
    }

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }

    // body.id = generateId();   //! Warning: this code assign new property id to the request body !
    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(newPerson)
    response.json(newPerson)
})

const PORT = 3001;
app.listen(PORT)
console.log(`Server running on port ${PORT}`)