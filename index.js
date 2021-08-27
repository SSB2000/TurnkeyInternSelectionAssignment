require("dotenv").config();
const { response, request } = require("express");
const express = require("express");
// var morgan = require("morgan");
// const cors = require("cors"); // allows CORS
const bcrypt = require("bcrypt");
// const usersRouter = require("express").Router();
const User = require("./models/user");
const app = express();
const Person = require("./models/person");
app.use(express.static("build"));
const usersRouter = require("./controllers/users");
app.use(express.json());

app.get("/", (request, response) => {
    response.send("<h1>Hello World!<h1>");
});

app.get("/api/people", (request, response) => {
    Person.find({}).then((people) => {
        response.json(people);
    });
});

app.get("/info", (request, response) => {
    const date = new Date();
    Person.count({}, (err, count) => {
        response.send(`<p>Phone book has info for ${count} people.</p>
        <p>${date}</p>`);
    });
});

app.get("/api/people/:id", (request, response, next) => {
    Person.findById(request.params.id)
        .then((note) => {
            if (note) {
                response.json(note);
            } else {
                response.status(404).end();
            }
        })
        .catch((error) => next(error));
});

app.delete("/api/people/:id", (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then((result) => {
            response.status(204).end();
        })
        .catch((error) => next(error));
});

app.post("/api/people", (request, response, next) => {
    const body = request.body;
    if (body.name == undefined) {
        return response.status(404).json({
            error: "name missing",
        });
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person
        .save()
        .then((savedPerson) => {
            return savedPerson.toJSON();
        })
        .then((savedAndFormattedPerson) => {
            response.json(savedAndFormattedPerson);
        })
        .catch((error) => next(error));
});

app.put("/api/people/:id", (request, response, next) => {
    const body = request.body;

    const updatedPer = {
        name: body.name,
        number: body.number,
    };

    Person.findByIdAndUpdate(request.params.id, updatedPer, { new: true })
        .then((updatedPerson) => {
            response.json(updatedPerson);
        })
        .catch((error) => next(error));
});
/*
app.get("/api/users", async (request, response) => {
    const users = await User.find({});
    response.json(users);
});

app.post("/api/users", async (request, response) => {
    console.log(request);
    const body = request.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    });

    const savedUser = await user.save();

    response.json(savedUser);
});
*/

// User Get and Post handler middleware.
usersRouter.get("/", async (request, response) => {
    const users = await User.find({});
    response.json(users);
});
app.use("/api/users", usersRouter);

// Unknown endPoint error handler middleware
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.log(error.message);
    console.log(error.name);
    if (error.name === "CastError") {
        return response.status(400).send({ error: "Mal formatted Id." });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
