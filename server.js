
const express = require("express")                                              //Hämtar express ramverket
const bodyParser = require("body-parser")                                       //Hämtar bodyparser för att parsa POST-data
const sqlite3 = require("sqlite3").verbose()                                    //hämtar sqlite3 i verbose vilket ger mer detaljerade felmeddelande

const db = new sqlite3.Database("./db/courses.db")                              //skapar/ansluter till sqlite databasen courses.db

const app = express()                                                           //startar express appen
const port = 3000                                                                 
app.set("view engine", "ejs")                                                   //sätter ejs som view engine
app.use(express.static("public"))                                               //Så att man kan använda statiska filer som till exempel css eller javascriptfiler i public katalogen
app.use(bodyParser.urlencoded({extended:true}))                                 //så att express kan parsa Url data från POST
   
app.get("/", (req,res) => {                                                     //Route för startsidan
    db.all("SELECT * FROM courses;", (err, rows) => {                           //Hämtar alla kurser från tabellen courses
        if (err){
            console.error(err.message)                                          //Logga eventuella errors
        }

        res.render("index", {                                                   //Rendererar view i index.ejs
            rows: rows                                                          //skickar med kurserna i variabeln rows
        })
    })
    
})

app.get("/addcourse", (req,res) => {                                             //Route för läggtillkurs sidan
    res.render("addcourse", {
        error: ""
    })
})

app.get("/about", (req,res) => {                                                 //Route for Om sidan
    res.render("about")
})

app.listen(port,() => {                                                          //Startar servern och loggar att den har startat och i vilken port den har startat
    console.log("server started on port: " + port);
})

app.post("/", (req,res) => {                                                     //Post route och hämtar värdena från fälten och lägger dom i en variabel
    let name = req.body.name                                                       
    let code = req.body.code
    let syll = req.body.syll
    let prog = req.body.prog

    let error = ""
    if (name !== "" && code !== "" && syll !== "" && prog !== ""){               //Kontrollerar att inga fält är tomma genom att kolla att variabeln inte är tom
        const stmt = db.prepare("INSERT INTO courses(Coursename, Coursecode, Syllabus, Progression)VALUES (?,?,?,?)") //Förbereder en INSERT
        stmt.run(name, code, syll, prog)                                        //Kör insert med de angivna värdena
        stmt.finalize()
        res.redirect("/")                                                       //redirectar användaren till startsidan
    }else{
        error = "Du måste fylla i hela förmuläret"                               //Felmeddelande ifall någon av fälten är tommar

        res.render("addcourse", {                                                //renderar om sidan och skickar med felmeddelandet
        error: error 
    })
    }
})

app.get("/delete/:id",(req, res)=> {                                             //Route for att ta bort specifik ID
    let id = req.params.id                                                       //hämtar kurs id
    db.run("DELETE FROM courses WHERE id =?;", id, (err) => {                    //kör en DELETE sats
        if(err){
            console.error(err.message)                                           //Loggar eventuella fel
        } 
        res.redirect("/")                                                        //Redirect tillbaka till startsidan
    })
})