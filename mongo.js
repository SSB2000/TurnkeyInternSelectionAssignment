const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log(
        "Please provide the password as an argument: node mongo.js <password>"
    );
    process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.ufybe.mongodb.net/phonebook-app?retryWrites=true&w=majority`;
/*
const newName = process.argv[3];
const newNumber = process.argv[4];
*/

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

const noteSchema = new mongoose.Schema({
    name: String,
    number: Number,
});

const Person = mongoose.model("Person", noteSchema);

Person.find({}).then((result) => {
    result.forEach((person) => {
        console.log(person);
    });
    mongoose.connection.close();
});
/*
const person = new Person({
    name: newName,
    number: newNumber,
});

person.save().then((result) => {
    console.log(`added ${newName} ${newNumber} to the phonebook`);
    mongoose.connection.close();
});
*/
