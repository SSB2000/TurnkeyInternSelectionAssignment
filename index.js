const { response, request } = require("express");
const express = require("express");
var morgan = require("morgan");
const app = express();
app.use(express.static("build"));
app.use(express.json());

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

// morgan.token("id", (req) => {
//     return req.id;
// });

// app.use(
//     morgan(":id :method :url :status :res[content-length] - :response-time ms ")
// );

app.get("/", (request, response) => {
    response.send("<h1>Hello World!<h1>");
});

app.get("/api/persons", (request, response) => {
    response.json(persons);
});

let totalPersons = persons.length;

app.get("/info", (request, response) => {
    const date = new Date();
    response.send(`<p>Phonebook has info for ${totalPersons} people.</p>
	<p>${date}</p>`);
});

app.get("/api/persons/:id", (request, response) => {
    const id = parseInt(request.params.id);
    const person = persons.find((person) => person.id === id);

    if (person) response.json(person);
    else response.status(404).end();
});

app.delete("/api/persons/:id", (request, response) => {
    const id = parseInt(request.params.id);
    persons = persons.filter((person) => person.id !== id);
    response.status(204).end();
});

app.post("/api/persons", (request, response) => {
    const body = request.body;
    console.log(`body`, body);
    if (!body.name) {
        return response.status(404).json({
            error: "name missing",
        });
    } else {
        const isNamePresent = persons.find(
            (person) => person.name === body.name
        );
        if (isNamePresent) {
            response.status(404).json({
                error: `name must be unique.`,
            });
        }
    }

    if (!body.number) {
        return response.status(404).json({
            error: "number missing",
        });
    }

    const person = {
        id: parseInt(Math.random() * 10000000),
        name: body.name,
        number: body.number,
    };

    persons = persons.concat(person);

    response.json(person);
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
