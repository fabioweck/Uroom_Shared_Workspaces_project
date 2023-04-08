
const path = require('path');
const { uuid } = require('uuidv4');
const fs = require('fs');

function addUser(user) {

    // Read existing data from JSON file
    const filePath = path.join(__dirname, '../repository/users.json');

    fs.readFile(filePath, (err, data) => {
        if (err) {
            throw new Error(err.message, 500);
        } else {

            //to add automatic ID
            user.user_id = uuid();

            // Parse existing data from JSON string
            const existingData = JSON.parse(data);

            // Add new form data to existing data
            existingData.push(user);

            // Write updated data back to JSON file
            fs.writeFile(filePath, JSON.stringify(existingData), (err) => {
                if (err) {
                    throw new Error(err.message, 500);
                }
            });
        }
    });

    return user;
}

module.exports = { addUser }