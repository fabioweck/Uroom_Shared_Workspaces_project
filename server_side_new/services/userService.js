// Global requirements 
const path = require('path');
const { uuid } = require('uuidv4');
const fs = require('fs');


async function addUser(user) {

    const filePath = path.join(__dirname, '../repository/users.json');

    try {
        return await new Promise((resolve, reject) => {

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    reject({ statusCode: 500, message: err.message });
                } else {

                    //to add automatic ID
                    user.user_id = uuid();

                    // Parse existing data from JSON string
                    const existingData = JSON.parse(data);

                    // Add new form data to existing data
                    existingData.push(user);

                    //  Write updated data back to JSON file
                    fs.writeFile(filePath, JSON.stringify(existingData), (err_1) => {
                        if (err_1) {
                            reject({ statusCode: 500, message: err_1.message });
                        } else {
                            resolve(user.fullName);
                        }
                    });
                };
            });
        });
    } catch (err_2) {
        const code = err_2.statusCode || 500;
        const message = err_2.message || 'Error occurred while logging in';
        throw { code, message };
    }

}

async function login(user) {

    const filePath = path.join(__dirname, '../repository/users.json');

    try {
        return await new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    reject({ statusCode: 500, message: err.message });
                } else {
                    const users = JSON.parse(data);
                    const userMatch = users.find(u => u.emailAddress === user.emailAddress);

                    if (!userMatch) {
                        reject({ statusCode: 401, message: 'Email not found' });
                    } else if (userMatch.password !== user.password) {
                        reject({ statusCode: 401, message: 'Invalid password' });
                    } else {
                        delete userMatch.password;
                        resolve(userMatch);
                    }
                }
            });
        });
    } catch (err_1) {
        const code = err_1.statusCode || 500;
        const message = err_1.message || 'Error occurred while logging in';
        throw { code, message };
    }
};


async function addProperty(newProperty) {

    const filePath = path.join(__dirname, '../repository/properties.json');

    try {
        return await new Promise((resolve, reject) => {

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    reject({ statusCode: 500, message: err.message });
                } else {

                    // Parse existing data from JSON string
                    const existingData = JSON.parse(data);

                    // Add new form data to existing data
                    existingData.push(newProperty);

                    //  Write updated data back to JSON file
                    fs.writeFile(filePath, JSON.stringify(existingData), (err_1) => {
                        if (err_1) {
                            reject({ statusCode: 500, message: err_1.message });
                        } else {
                            resolve(newProperty.address);
                        }
                    });
                };
            });
        });
    } catch (err_2) {
        const code = err_2.statusCode || 500;
        const message = err_2.message || 'Error occurred while add in';
        throw { code, message };
    }


}

async function addWorkspace(newWorkspace) {

    const filePath = path.join(__dirname, '../repository/workspaces.json');

    try {
        return await new Promise((resolve, reject) => {

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    reject({ statusCode: 500, message: err.message });
                } else {

                    // Parse existing data from JSON string
                    const existingData = JSON.parse(data);

                    // Add new form data to existing data
                    existingData.push(newWorkspace);

                    //  Write updated data back to JSON file
                    fs.writeFile(filePath, JSON.stringify(existingData), (err_1) => {
                        if (err_1) {
                            reject({ statusCode: 500, message: err_1.message });
                        } else {
                            resolve(newWorkspace.workspace_type);
                        }
                    });
                };
            });
        });
    } catch (err_2) {
        const code = err_2.statusCode || 500;
        const message = err_2.message || 'Error occurred while add in';
        throw { code, message };
    }
}

async function findPropertyByOwner(user_id) {

    const property = await loadPropertyJson()

    return new Promise((resolve, reject) => {

        const filterPropertyByOwner = property.filter(propertyOnly => propertyOnly.user_id === user_id);
        resolve(filterPropertyByOwner);

    }).catch(err => {
        const code = err.statusCode || 500;
        const message = err.message || 'Error occurred while filter properties';
        throw { code, message };
    });
};


async function findWorkspaceByOwner(user_id) {

    const workspace = await loadWorkspaceJson()

    return new Promise((resolve, reject) => {

        const filterWorkspaceByOwner = workspace.filter(workspaceOnly => workspaceOnly.user_id === user_id);
        resolve(filterWorkspaceByOwner);

    }).catch(err => {
        const code = err.statusCode || 500;
        const message = err.message || 'Error occurred while filter properties';
        throw { code, message };
    });
};

async function getWorkspaceByOwner(user_id) {

    const workspaces = await loadWorkspaceJson();
    const properties = await loadPropertyJson();

    return new Promise((resolve, reject) => {

        const mergedData = [];

        for (const property of properties) {
            for (const workspace of workspaces) {
                if (property.user_id === workspace.user_id && property.property_id == workspace.property_id) {
                    const mergedObject = { ...workspace, ...property };
                    mergedData.push(mergedObject);
                }
            }
            console.log(mergedData);
            resolve(mergedData);
        }
    }).catch(err => {
        const code = err.statusCode || 500;
        const message = err.message || 'Error occurred while filter properties';
        throw { code, message };
    });
};


async function loadPropertyJson() {
    const filePath = path.join(__dirname, '../repository/properties.json');
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            const property = JSON.parse(data);
            resolve(property);
        });
    });
}

async function loadWorkspaceJson() {
    const filePath = path.join(__dirname, '../repository/workspaces.json');
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            const workspace = JSON.parse(data);
            resolve(workspace);
        });
    });
}

module.exports = { addUser, login, addProperty, addWorkspace, findPropertyByOwner, findWorkspaceByOwner, getWorkspaceByOwner }