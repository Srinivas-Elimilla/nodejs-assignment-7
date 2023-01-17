const express = require('express')
const mongoose = require("mongoose");
const initialData = require("./InitialData");
const app = express()
const bodyParser = require("body-parser");
const port = 8080
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// your code goes here

mongoose.connect("mongodb://localhost/studentdb", { useNewUrlParser: true });



const studentSchema = new mongoose.Schema({
  id: Number,
  name: String,
  currentClass: Number,
  division: String,
});

const Student = mongoose.model("Student", studentSchema);
initialData.forEach((student) => {
  const newStudent = new Student(student);
  newStudent.save((err) => {
    if (err) {
      console.log(`Error: ${err}`);
    }
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/student", (req, res) => {
  Student.find({}, (err, students) => {
    if (err) res.status(500).send(err);
    else res.json(students);
  });
});

app.get("/api/student/:id", (req, res) => {
  Student.findById(req.params.id, (err, student) => {
    if (err) res.status(404).send(err);
    else res.json(student);
  });
});

app.post("/api/student", (req, res) => {
  const student = new Student(req.body);
  student.save((err, newStudent) => {
    if (err) res.status(400).send(err);
    else res.json({ id: newStudent.id });
  });
});

app.put("/api/student/:id", (req, res) => {
  Student.findByIdAndUpdate(req.params.id, req.body, (err, student) => {
    if (err) res.status(400).send(err);
    else res.send("Student record updated");
  });
});

app.delete("/api/student/:id", (req, res) => {
  Student.findByIdAndDelete(req.params.id, (err, student) => {
    if (err) res.status(404).send(err);
    else res.send("Student record deleted");
  });
});

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   