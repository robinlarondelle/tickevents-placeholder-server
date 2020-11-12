if (process.env.NODE_ENV == "development") require('dotenv').config({ path: "./env/environment.env" })

const express = require("express")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cors = require("cors")

const ErrorMessage = require("./models/error.model")
const port = process.env.PORT || "3000"
const apiKey = process.env.mailchimp_api_key
const listID = process.env.mailchimp_list_id
const app = express()
const Mailchimp = require('mailchimp-api-v3')
const mailchimp = new Mailchimp(apiKey);

app.use(bodyParser.json())
app.use(morgan("dev"))
app.use(cors())

app.use("/sendDetails", (req, res, next) => {
    const { email } = req.body

    if (email) {
        mailchimp.post(`/lists/${listID}/members`, {
            email_address: email,
            status: "subscribed"
        })
            .then(result => res.status(200).json(result).end())
            .catch(err => next(new ErrorMessage("MailchimpError", err.title, 400)))

    } else next(new ErrorMessage("MissingBodyError", "Please provide a valid email", 400))
})

app.use("*", function (req, res, next) { next(new ErrorMessage("EndpointNotFoundError", "Endpoint not found", 404)) })
app.use((err, req, res, next) => res.status(err.status || 404).json(err).send())
app.listen(port, () => console.log(`The server is running on port ${port}.\n`))