// Import the Express module
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

// Import the checklist router module
const checklistRouter = require('./src/routes/checklist');
const taskRouter = require('./src/routes/task');


const rootRouter = require('./src/routes/index');

require('./config/database')

// Create an instance of an Express application
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method', { methods: ['POST', 'GET']}));


app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.use('/', rootRouter);
app.use('/checklists', checklistRouter)
app.use('/checklists', taskRouter.checklistDependent)
app.use('/tasks', taskRouter.simple)

// Start the server on port 3000
app.listen(3000, () => {
    // Log a message indicating that the server has been initialized
    console.log('Server was initialized');
});
