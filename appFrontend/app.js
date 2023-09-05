document.addEventListener('DOMContentLoaded', function (event) {
    getAllModels()
        .then((models) => {
            models.forEach(modelName => {
                addTableNameToList(modelName);
            })
        })
        .catch(error => {
            console.log(error);
        })
})


function createElement() {
    const div = document.createElement('div');
    div.setAttribute('class', 'mb-3 d-flex');
    const input = document.createElement('input');
    input.setAttribute('class', 'form-control');
    input.setAttribute('id', 'column');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'column name');
    const select = document.createElement('select');
    select.setAttribute('class', 'mx-2');
    select.setAttribute('id', 'category');
    select.setAttribute('name', 'type');
    select.innerHTML = ` <option class="option" value="" selected>type</option>
    <option class="option" value="STRING">STRING</option>
    <option class="option" value="INTEGER">INTEGER</option>
    <option class="option" value="TEXT">TEXT</option>
    <option class="option" value="BOOLEAN">BOOLEAN</option>`
    div.appendChild(input);
    div.appendChild(select);
    return div;
}

document.querySelector('#addfield').addEventListener('click', () => {
    const myForm = document.querySelector("#myform");
    const div = createElement();
    myForm.appendChild(div)
})

const axoisInstance = axios.create({
    baseURL: 'http://localhost:3000/api/table'
})

async function createTable(modelData) {
    try {
        const response = await axoisInstance.post("/create-table", modelData);
        if (response.data.error) {
            throw response.data.error;
        }
    } catch (error) {
        console.log("error: ", error);
        throw error;
    }
}

async function createRecord(modelData) {
    try {
        const response = await axoisInstance.post("/create-record", modelData);
        if (response.data.error) {
            throw response.data.error;
        }
    } catch (error) {
        console.log("error: ", error);
        throw error;
    }
}

async function getTableData(modelData) {
    try {
        const response = await axoisInstance.post("/get-records", modelData);
        if (response.data.error) {
            throw response.data.error;
        }
        return response.data.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getTableAttribute(modelData) {
    try {
        const response = await axoisInstance.post("/get-attributes", modelData);
        if (response.data.error) {
            throw response.data.error;
        }
        console.log(response.data.data);
        return response.data.data.attributes;
    } catch (error) {

    }
}

async function getAllModels() {
    try {
        const response = await axoisInstance.get("/get-models");
        if (response.data.error) {
            throw response.data.error;
        }
        console.log(response.data.data);
        return response.data.data.models;
    } catch (error) {

    }
}

async function deleteRecord(tableName, id) {
    try {
        const response = await axoisInstance.delete("/delete-record/" + tableName + "/" + id);
        if (response.data.error) {
            throw response.data.error;
        }
        console.log(response.data.data);
    } catch (error) {

    }
}

function showTable(tableData, tableName) {
    try {
        const attributes = tableData.attributes;
        const records = tableData.records;
        console.log(attributes);
        console.log(records);
        document.getElementById('modelBtn').style.display = 'block';
        document.getElementById('modelBtn').setAttribute('name', tableName);
        document.getElementById('addRecord').setAttribute('name', tableName);
        let head = '<tr>';
        head += `<th scope="col">#</th>`
        Object.keys(attributes).forEach(value => {
            head += ` <th scope="col" id="attr">${value}</th>`;
        })
        head += ` <th scope="col" id="attr">Action</th>`;
        head += '</tr>'
        let rows = '';
        records.forEach((record, index) => {
            rows += `<tr>`
            rows += `<th scope="row">${index + 1}</th>`
            let id;
            Object.entries(record).forEach(([key, value]) => {
                if (key === 'id') id = value;
                rows += `<td>${value}</td>`;

            })
            rows += `<td><button class="btn btn-success" id="${id}">Delete</button></td>`;
            rows += `</tr>`
        })
        document.getElementById('table-head').innerHTML = head;
        document.getElementById('table-body').innerHTML = rows;
        document.getElementById('table-body').setAttribute('name', tableName)

    } catch (error) {

    }

}

function addTableNameToList(tableName) {
    const tablelist = document.getElementById("table-list");
    tablelist.classList.add('justify-content-center');
    const li = document.createElement('li');
    li.setAttribute('id', `${tableName}`);
    li.setAttribute('style', 'text-align: center;');
    li.classList.add('model');
    li.textContent = tableName;
    const hr = document.createElement('hr');
    li.appendChild(hr);
    // Step 4: Add the button as the first child of the sideBox element
    tablelist.appendChild(li);
}


document.querySelector('#table-list').addEventListener('click', function (event) {
    event.preventDefault();
    const tableName = event.target.getAttribute('id');
    console.log("table name = ", tableName);
    getTableData({ tableName: tableName })
        .then(tableData => {
            showTable(tableData, tableName);
        })
        .catch(error => {
            console.log(error);
        })

})

document.getElementById('table-list').addEventListener('mouseover', function (event) {
    event.preventDefault();
    if (event.target.classList.contains('model')) {
        const models = document.querySelectorAll('.model')
        models.forEach(model => {
            model.style.cursor = "pointer";
        })
    }
})


const createTableBtn = document.getElementById('createtabel');

createTableBtn.addEventListener('click', addTable);

document.getElementById('modelBtn').addEventListener('click', function (event) {
    const modelBody = document.getElementById('createRecordModelBody');
    const tableName = event.target.getAttribute('name');
    console.log("model name = ", tableName);
    getTableAttribute({ tableName: tableName })
        .then(attributes => {
            console.log(attributes);
            let form = '<form id="myform">';
            Object.keys(attributes).forEach(attr => {
                if (attr != 'id' && attr != 'createdAt' && attr != 'updatedAt') {
                    form += ` <div class="mb-3">
                    <label for="${attr}" class="col-form-label">${attr}:</label>
                    <input type="text" class="form-control field" id="${attr}">
                </div>`
                }
            })
            form += '</form>';
            modelBody.innerHTML = form;
        })
        .catch(error => {
            console.log(error);
        })


})

function addRowInTable(tableData, tableName) {
    const records = tableData.records
    let rows = '';
    records.forEach((record, index) => {
        rows += `<tr id="row">`;
        rows += `<th scope="row">${index + 1}</th>`;
        let id;
        Object.entries(record).forEach(([key, value]) => {
            if (key === 'id') id = value;
            rows += `<td>${value}</td>`;

        })
        rows += `<td><button class="btn btn-success" id="${id}">Delete</button></td>`;
        rows += `</tr>`
    })
    document.getElementById('table-body').setAttribute('name', tableName)
    document.getElementById('table-body').innerHTML = rows;
}

document.getElementById('table-body').addEventListener('click', function (event) {
    event.preventDefault();
    const id = event.target.getAttribute('id')
    const tableName = document.getElementById('table-body').getAttribute('name')
    console.log(tableName);
    console.log(id);
    deleteRecord(tableName, id)
        .then(() => {
            return getTableData({ tableName: tableName })
        })
        .then((tableData) => {
            addRowInTable(tableData, tableName);
        })
        .catch(error => {
            console.log(error);
        })
})


document.getElementById('addRecord').addEventListener('click', addDataInTable)

function addDataInTable(event) {
    event.preventDefault();
    const fields = document.querySelectorAll('.field');
    const tableData = {};
    fields.forEach(field => {
        const attrName = field.getAttribute('id');
        tableData[attrName] = field.value;
    })
    const tableName = event.target.getAttribute('name');
    const requestData = {
        tableName: tableName,
        tableData: tableData
    }
    console.log(requestData);
    createRecord(requestData)
        .then(() => {
            console.log('successfully created record');
            return getTableData({ tableName: tableName })
        })
        .then(tableData => {
            addRowInTable(tableData, tableName);
        })
        .catch(error => {
            console.log(error);
        })

}


function addTable(event) {
    try {
        event.preventDefault();
        const tableName = document.querySelector("#table-name");
        const columns = document.querySelectorAll("#column");
        const categories = document.querySelectorAll("#category");
        const tableFields = [];
        for (let i = 0; i < columns.length; i++) {
            tableFields.push({ name: columns[i].value, type: categories[i].value });
        }
        const requestData = {};
        requestData.tableName = tableName.value;
        requestData.tableFields = tableFields
        console.log(requestData);
        createTable(requestData)
            .then(() => {
                addTableNameToList(tableName.value);
            })
            .catch(error => {
                throw error;
            });
    } catch (error) {
        console.log(error);
    }
}