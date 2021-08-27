require("dotenv").config();
const { response, request } = require("express");
const express = require("express");
const cors = require("cors"); // allows CORS
const bcrypt = require("bcrypt");
const User = require("./models/user");
const app = express();
app.use(cors());
// app.use(express.static("build"));
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
app.use(express.json());

app.get("/", (request, response) => {
    response.send("<h1>Hello World!<h1>");
});

app.get("/info", (request, response) => {
    const date = new Date();
    Person.count({}, (err, count) => {
        response.send(`<p>Hello!</p>
        <p>${date}</p>`);
    });
});

// Login Routes
app.use("/api/login", loginRouter);

// All Users
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
