import express from "express"
import Knex from "knex"
import * as bcrypt from 'bcrypt';
a
const app = express();
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const knex = Knex ({
    client: "sqlite3",
    connection: {
      filename : "./database.db"
    }
});

app.get('/timestamp', function (req: express.Request, res: express.Response) {
    return res.json({error: 0, timestamp: Date.now()});
})

app.post("/registrations", function (req: express.Request, res: express.Response) {
    bcrypt.genSalt(10, function(err: Error, salt: string) {
        return bcrypt.hash(req.body.password, salt, function(err: Error, hash: string) {
            return knex("users")
            .insert({
                username: req.body.username, 
                displayed_name: req.body.displayed_name, 
                hashed_password: hash
            }).then((id) => {
                res.json({error: 0});
            });
        });
    });
})

app.get("/registrations", function (req:express.Request, res: express.Response) {
    return knex("users").then((rows) => {
        res.json({error: 0, data: rows});
    });
});

app.listen(port, function () {
    console.log('listening at port '+port);
})