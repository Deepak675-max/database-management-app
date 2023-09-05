require('dotenv').config();
const express = require('express');

const httpErrors = require("http-errors");

const cors = require("cors");

const tableRoutes = require("./routes/table.route");
const sequelize = require('./helper/common/init_mysql');

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api", tableRoutes);

app.use(async (req, _res, next) => {
    console.log(req, _res);
    next(httpErrors.NotFound(`Route not Found for [${req.method}] ${req.url}`));
});

// Common Error Handler
app.use((error, req, res, next) => {
    const responseStatus = error.status || 500;
    const responseMessage =
        error.message || `Cannot resolve request [${req.method}] ${req.url}`;
    if (res.headersSent === false) {
        res.status(responseStatus);
        res.send({
            error: {
                status: responseStatus,
                message: responseMessage,
            },
        });
    }
    next();
});

const port = 3000;

sequelize.sync({ force: true })
    .then(() => {
        app.listen(port, async () => {
            console.log(`server is listening on the port of ${port}`);
        })
    })
    .catch(error => {
        console.log(error);
    })




