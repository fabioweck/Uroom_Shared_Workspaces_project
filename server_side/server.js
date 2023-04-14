//This block starts the server
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3010;

//This block create and declare the router to be used. 
const appRouter = require('./router/main_router.js');
app.use(appRouter);

//This block listen and return status fro server port
console.log(`===========================================`);
console.log(`Server started at ${new Date().toLocaleString()}`);
app.listen(port, () => console.log(`Server is running on port ${port}`));
console.log(`===========================================`);

