const express = require("express");

const expenseRouter = express.Router();

const expenseController = require("../controllers/table.controller");

expenseRouter.post("/table/create-table", expenseController.createTable);

expenseRouter.post("/table/create-record", expenseController.createRecord);

expenseRouter.post("/table/get-records", expenseController.getRecords);

expenseRouter.post("/table/get-attributes", expenseController.getAttributes);

expenseRouter.get("/table/get-models", expenseController.getAllCreatedModels);



expenseRouter.delete("/table/delete-record/:tableName/:id", expenseController.deleteRecord);


module.exports = expenseRouter;
