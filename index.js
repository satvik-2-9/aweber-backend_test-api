require("dotenv").config();
const express = require("express");
const axios = require("axios").default;
const cors = require("cors");
const PORT = process.env.PORT || 1337;

const app = express();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRETE = process.env.CLIENT_SECRETE;
const REDIRECT_URL = process.env.REDIRECT_URL;
const url = `https://auth.aweber.com/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=account.read`;

const baseurl = "https://auth.aweber.com/";

app.use(cors());

//ROUTER FOR GENERATING TOKEN.
app.post("/oauth/token", (req, res) => {
    const code = req.query.code;
    console.log(code);
    axios
        .post(
            "https://auth.aweber.com/oauth2/token",
            {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRETE,
                grant_type: "authorization_code",
                code,
            },
            {
                headers: {
                    Authorization: CLIENT_ID,
                },
            }
        )
        .then((result) => {
            res.json(result.data);
        })
        .catch((err) => {
            res.status(400).json({ message: "error !" });
        });
});

//Route for getting list names and list ids.
app.get("/lists", (req, res) => {
    const { accountId, token } = req.query;
    axios
        .get(`https://api.aweber.com/1.0/accounts/${accountId}/lists`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((result) => {
            res.json(result.data);
        })
        .catch((err) => {
            console.log(err);
            res.json({ message: "Internal Server Error" });
        });
});

app.get("/list", (req, res) => {
    const { listId, token, accountId } = req.query;
    console.log(listId, token, accountId); 
    axios
        .get(`https://api.aweber.com/1.0/accounts/${accountId}/lists/${listId}/subscribers`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((result) => {
            res.json(result.data);
        })
        .catch((err) => {
            console.log(err.response);
            res.json({
                message: "Internal Server Error",
            });
        });
});

app.get("/accounts", (req, res) => {
    const token = req.query.token;
    axios
        .get("https://api.aweber.com/1.0/accounts", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((result) => {
            res.json(result.data);
        })
        .catch((err) => {
            console.log(err);
            res.json({ message: "Internal Server Error" });
        });
});



app.listen(PORT, () => {
    console.log("SERVER STARTED ON PORT: ", PORT);
});
