// Global requirements 
const path = require('path');
const { uuid } = require('uuidv4');
const fs = require('fs');
const { escape } = require('querystring');

function generateID() {
    return Math.floor(Math.random() * 900000) + 100000;
}



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
                            resolve({ user_id: user.user_id });
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


async function updateUser(updateUser) {

    const users = await loadJsonFile('users.json');

    return new Promise(async (resolve, reject) => {

        for (const user of users) {
            if (user.user_id == updateUser.user_id) {
                Object.assign(user, updateUser);
                console.log('user after update:', user)
                resolve(user);
            }
        }
        await writeJsonFile(users, 'users.json')

    }).catch(err => {
        const code = err.statusCode || 500;
        const message = err.message || 'Error occurred while delisting workspace';
        throw { code, message };
    });
};



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

    newProperty.property_id = generateID();

    const firstThreeLetters = newProperty.user_id.substring(0, 3);
    newProperty.property_id = firstThreeLetters + "-" + newProperty.property_id;


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
                            resolve(newProperty);
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

    newWorkspace.workspace_id = generateID();

    const firstThreeLetters = newWorkspace.user_id.substring(0, 3);
    newWorkspace.workspace_id = firstThreeLetters + "-" + newWorkspace.workspace_id;

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
                            resolve(newWorkspace);
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

// We can inactive this function !!! Replace by getWorlspaceByOwner();
async function findPropertyByOwner(user_id) {

    const property = await loadJsonFile('properties.json');

    return new Promise((resolve, reject) => {

        const filterPropertyByOwner = property.filter(propertyOnly => propertyOnly.user_id === user_id);
        resolve(filterPropertyByOwner);

    }).catch(err => {
        const code = err.statusCode || 500;
        const message = err.message || 'Error occurred while filter properties';
        throw { code, message };
    });
};

// We can inactive this function !!! Replace by getWorlspaceByOwner();
async function findWorkspaceByOwner(user_id) {

    const workspace = await loadJsonFile('workspaces.json');

    return new Promise((resolve, reject) => {

        const filterWorkspaceByOwner = workspace.filter(workspaceOnly => workspaceOnly.user_id === user_id);
        resolve(filterWorkspaceByOwner);

    }).catch(err => {
        const code = err.statusCode || 500;
        const message = err.message || 'Error occurred while filter properties';
        throw { code, message };
    });
};

async function getWorkspaceByOwner(user_id = null) {

    const workspaces = await loadJsonFile('workspaces.json');
    const properties = await loadJsonFile('properties.json');
    return new Promise((resolve, reject) => {

        const mergedData = [];

        for (const property of properties) {

            const propertyExists = workspaces.some(workspace => workspace.property_id === property.property_id);

            // merge properties with workspace associated
            if (propertyExists) {
                for (const workspace of workspaces) {
                    if (property.property_id == workspace.property_id) {
                        if (user_id === null || user_id === workspace.user_id) {
                            const mergedObject = { ...workspace, ...property, user_id: workspace.user_id };
                            mergedData.push(mergedObject);
                        }
                    }
                }
            } else {
                // merge properties with NO workspaces
                if (user_id === null || user_id === property.user_id) {
                    const mergedObject = { ...workspaces[0], ...property };
                    mergedData.push(mergedObject);
                }
            }
        }
        console.log(mergedData);
        resolve(mergedData);

    }).catch(err => {
        const code = err.statusCode || 500;
        const message = err.message || 'Error occurred while filter properties';
        throw { code, message };
    });
};

async function getReservedDate(workspace) {

    const workspace_id = workspace;
    const bookings = await loadJsonFile('bookings.json');
    const workspaceBookings = bookings[0].workspace_bookings;
    const bookingsForWorkspace = workspaceBookings[workspace_id];
    const formattedBookings = [];

    return new Promise((resolve, reject) => {
        {
            for (const [year, months] of Object.entries(bookingsForWorkspace)) {
                for (const [month, days] of Object.entries(months)) {
                    formattedBookings.push({
                        year: parseInt(year),
                        month: parseInt(month),
                        days
                    });
                }
            }
            console.log(bookingsForWorkspace);
            resolve(formattedBookings)
        }
    }).catch(err => {
        const code = err.statusCode || 500;
        const message = err.message || 'Error occurred while find bookings';
        throw { code, message };
    });
};

async function updateReservedDate(dates) {

    const allNewBookings = dates;
    const bookings = await loadJsonFile('bookings.json');
    const workspaceBookings = bookings[0].workspace_bookings;
    const bookingsForWorkspace = workspaceBookings[allNewBookings.workspace_id];

    console.log('from front', allNewBookings);
    console.log('from file', bookings);
    return new Promise(async (resolve, reject) => {
        for (const monthBook in allNewBookings) {
            for (const newBook in monthBook) {

                if (!(newBook.year in bookingsForWorkspace)) {
                    bookingsForWorkspace[newBook.year] = {};
                }
                if (!(newBook.month in bookingsForWorkspace[newBook.year])) {
                    bookingsForWorkspace[newBook.year][newBook.month] = [];
                }
                for (const day of newBook.days) {
                    if (!bookingsForWorkspace[newBook.year][newBook.month].includes(day)) {
                        bookingsForWorkspace[newBook.year][newBook.month].push(day);
                    }
                }
            }

            const sortedBookings = sortBookings(bookings);

            await writeJsonFile(sortedBookings, 'bookings.json');

            resolve('passed');
        }


    }).catch(err => {
        const code = err.statusCode || 500;
        const message = err.message || 'Error occurred while delisting workspace';
        throw { code, message };
    });

}


function sortBookings(bookings) {

    for (const workspace_bookings in bookings[0]) {

        for (const workspace_id in bookings[0][workspace_bookings]) {

            if (Array.isArray(workspace_id)) {
                bookings[0][workspace_bookings] = workspace_id.sort((a, b) => a - b);
            }

            for (const year in bookings[0][workspace_bookings][workspace_id]) {

                if (Array.isArray(year)) {
                    bookings[0][workspace_bookings][workspace_id] = year.sort((a, b) => a - b);
                }

                for (const month in bookings[0][workspace_bookings][workspace_id][year]) {

                    if (Array.isArray(month)) {
                        bookings[0][workspace_bookings][workspace_id][year] = month.sort((a, b) => a - b);
                    }

                    const days = bookings[0][workspace_bookings][workspace_id][year][month];

                    if (Array.isArray(days)) {
                        bookings[0][workspace_bookings][workspace_id][year][month] = days.sort((a, b) => a - b);
                    }
                }
            }
        }
    }
    return bookings;
}


async function delistWorkspace(user_id, workspace_id) {

    const workspaces = await loadJsonFile('workspaces.json');
    return new Promise(async (resolve, reject) => {

        for (const workspace of workspaces) {

            if (workspace.workspace_id == workspace_id) {
                if (workspace.user_id === user_id) {
                    workspace.workspace_status = false;
                    console.log('The workspace', workspace_id, 'was delisted');

                    resolve(workspace);
                } else {
                    console.log('workspace not found');
                    resolve();
                }
            }
        }
        await writeJsonFile(workspaces, 'workspaces.json');
    }).catch(err => {
        const code = err.statusCode || 500;
        const message = err.message || 'Error occurred while delisting workspace';
        throw { code, message };
    });
}

async function delistProperty(user_id, property_id) {

    const workspaces = await loadJsonFile('workspaces.json');
    const properties = await loadJsonFile('properties.json');
    const workspaceDelisted = [];

    return new Promise(async (resolve, reject) => {

        // to delist all workspaces associate with property and user required

        for (const workspace of workspaces) {
            if (workspace.property_id == property_id) {

                delistWorkspace(user_id, workspace.workspace_id)
                workspaceDelisted.push(workspace.workspace_id);
            };
        }

        // to delist property associate with user required
        for (const property of properties) {
            if (property.property_id == property_id) {

                if (property.user_id == user_id) {

                    property.property_status = false;

                    console.log('The workspace', property_id, 'was delisted');
                } else {
                    resolve('user not match the property');
                };
            };
        };

        await writeJsonFile(properties, 'properties.json');
        resolve(`The property ${property_id} and workspace(s): ${workspaceDelisted} was delisted successful`);

    }).catch(err => {
        const code = err.statusCode || 500;
        const message = err.message || 'Error occurred while delisting property';
        throw { code, message };
    });
}



//===================Standard Functions==========================//

async function loadJsonFile(fileName) {
    const filePath = path.join(__dirname, '../repository', fileName);
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            const parsed = JSON.parse(data);
            resolve(parsed);
        });
    });
}

async function writeJsonFile(data, fileName) {

    const filePath = path.join(__dirname, '../repository', fileName);
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data), (err) => {
            if (err) {
                reject({ statusCode: 500, message: err.message });
            } else {
                resolve('file updated');
            }
        });
    });
}


module.exports = { addUser, login, addProperty, addWorkspace, findPropertyByOwner, findWorkspaceByOwner, getWorkspaceByOwner, delistWorkspace, delistProperty, getReservedDate, updateReservedDate, updateUser }