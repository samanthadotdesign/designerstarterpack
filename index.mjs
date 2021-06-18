import pg from 'pg';
import express from 'express';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import bindRoutes from './routes.mjs';

const app = express();
const PORT = process.env.PORT || 3004;

// Set the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Set up static directory
app.use(express.static('public'));

// Receive POST Requests in Express
app.use(express.urlencoded({ extended: true }));

// Override POST requests with query param ?_method=PUT to be PUT requeåsts
app.use(methodOverride('_method'));

// Cookies to save user id for updating skills & SQL table user_skills
app.use(cookieParser());

// Bind route definitions to the Express application
bindRoutes(app);

app.listen(PORT);
