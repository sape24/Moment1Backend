
const express = require("express")
const bodyParser = require("body-parser")
const sqlite3 = require("sqlite3").verbose()

const db = new sqlite3.Database("./db/courses.db")

const app = express()
const port = 3000
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

app.get("/", (req,res) => {
    db.all("SELECT * FROM courses;", (err, rows) => {
        if (err){
            console.error(err.message)
        }

        res.render("index", {
            rows: rows
        })
    })
    
})

app.get("/addcourse", (req,res) => {
    res.render("addcourse", {
        error: ""
    })
})

app.get("/about", (req,res) => {
    res.render("about")
})

app.listen(port,() => {
    console.log("server started on port: " + port);
})

app.post("/", (req,res) => {
    let name = req.body.name
    let code = req.body.code
    let syll = req.body.syll
    let prog = req.body.prog

    let error = ""
    if (name !== "" && code !== "" && syll !== "" && prog !== ""){
        const stmt = db.prepare("INSERT INTO courses(Coursename, Coursecode, Syllabus, Progression)VALUES (?,?,?,?)")
        stmt.run(name, code, syll, prog)
        stmt.finalize()
        res.redirect("/")
    }else{
        error = "Du måste fylla i hela förmuläret"

        res.render("addcourse", {
        error: error
    })
    }
})

app.get("/delete/:id",(req, res)=> {
    let id = req.params.id
    db.run("DELETE FROM courses WHERE id =?;", id, (err) => {
        if(err){
            console.error(err.message)
        }
        res.redirect("/")
    })
})