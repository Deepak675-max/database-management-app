const sequelize = require("../helper/common/init_mysql")
const DataTypes = require("sequelize");

const httpErros = require('http-errors');

async function createTableHelper(tableName, tableFields) {
    try {
        const tableAttributes = {};

        // Add the fields and their types to the tableAttributes object
        tableFields.forEach((field) => {
            const { name, type } = field;
            console.log(name, ", ", type);
            tableAttributes[name] = {
                type: DataTypes[type],
                allowNull: false, // You can adjust this based on your requirements
            };
        });

        const DynamicTable = sequelize.define(tableName, tableAttributes, { timestamps: true });

        await DynamicTable.sync();

        console.log(`Table "${tableName}" created successfully.`);

        return DynamicTable;
    } catch (error) {
        console.log(error.message);
        throw error;
    }
}

const createTable = async (req, res, next) => {
    try {
        const tableName = req.body.tableName;

        const tableFields = req.body.tableFields;

        await createTableHelper(tableName, tableFields);

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    message: "Table Created successfully.",
                },
            });
        }
    } catch (error) {
        console.log(error.message);
        next(error.message);
    }
}

const createRecord = async (req, res, next) => {
    try {
        const tableName = req.body.tableName;

        const tableData = req.body.tableData;

        const query = `INSERT INTO ${tableName} (${Object.keys(tableData).join(', ')}, createdAt, updatedAt) VALUES (${Object.keys(tableData).map(() => '?').join(', ')}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

        const [results] = await sequelize.query(query, {
            replacements: Object.values(tableData),
            type: sequelize.QueryTypes.INSERT,
        });

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    message: "Record Created successfully",
                },
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const getAllCreatedModels = async (req, res, next) => {
    try {
        const models = await sequelize.getQueryInterface().showAllTables();

        console.log("model = ", models);

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    models: models,
                    message: "models fetched successfully",
                },
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}


const getRecords = async (req, res, next) => {
    try {
        const tableName = req.body.tableName;

        const query = `SELECT * FROM ${tableName};`;

        const [results] = await sequelize.query(query);

        const attributes = await sequelize.getQueryInterface().describeTable(tableName);

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    attributes: attributes,
                    records: results,
                    message: "Record fetched successfully",
                },
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const getAttributes = async (req, res, next) => {
    try {
        const tableName = req.body.tableName
        const attributes = await sequelize.getQueryInterface().describeTable(tableName);

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    attributes: attributes,
                    message: "Attributes fetched successfully",
                },
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const deleteRecord = async (req, res, next) => {
    try {
        const tableName = req.params.tableName;

        const recordId = req.params.id;

        const query = `DELETE FROM ${tableName} WHERE id = ${recordId}`;

        await sequelize.query(query);

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    message: "Record deleted successfully",
                },
            });
        }

    } catch (error) {
        console.log(error);
        next(error);
    }
}


module.exports = {
    createTable,
    createRecord,
    deleteRecord,
    getRecords,
    getAttributes,
    getAllCreatedModels
}