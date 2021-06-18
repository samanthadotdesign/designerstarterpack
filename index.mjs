import pg from 'pg';
import express from 'express';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import bindRoutes from './routes.mjs';

/* ============ CONFIGURATION =========== */

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

/* ============ DASHBOARD =========== */

// /**
//  * Color the completed skills
//  * @param {arr} skillsArr – Each skill row is an object in the array
//  * @param {arr} skillsCompletedArr – Each skill completed by user row is an object in the array
//  */
// const colorSkills = (skillsArr, skillsCompletedArr) => {
//   // For each skill that is completed, show the color & "Uncomplete Skill" button
//   // For each completed skill, match the ids inside the main skills array of objects
//   // And add a new key-property pair
//   skillsArr.forEach((skill) => {
//     skill.muted = 'muted';
//     skill.completeBtn = 'visible';
//     skill.uncompleteBtn = 'hidden';
//   });

//   skillsCompletedArr.forEach((skillCompleted) => {
//     const skillsCompletedObj = skillsArr.filter(
//       (skill) => skill.id === skillCompleted.skill_id,
//     )[0];
//     skillsCompletedObj.muted = 'not-muted';
//     skillsCompletedObj.completeBtn = 'hidden';
//     skillsCompletedObj.uncompleteBtn = 'visible';
//   });
// };

//     colorSkills(appData.skills, appData.skillsCompleted);
//     // Calculates how many categories are complete
//     // database.categoriesCompleted returns array of objects [ { category_id: 1} ]
//     response.render('dashboard', appData);
//   });
// });

// /* ============ HOMEPAGE & LOGIN =========== */

// // Allows user to log in
// app.post('/login', (request, response) => {
//   const { email: inputEmail, password: inputPassword } = request.body;

//   const selectUserQuery = `SELECT * FROM users WHERE email='${inputEmail}'`;

//   pool.query(selectUserQuery, (err, res) => {
//     // Query error
//     if (err) {
//       console.log(err);
//       return;
//     }

//     // User's email does not exist
//     if (res.rowCount === 0) {
//       console.log('We couldn\'t find your email. If you can\'t remember your account, we can send you a reminder.');
//       return;
//     }
//     // User's email exists
//     // res.rows returns array with email objects [ { id: 1, user_name: 'Samantha', ... }]
//     const { id: userId, user_name, hashed_password: savedPassword } = res.rows[0];

//

//     if (hashedInputPassword !== savedPassword) {
//       console.log('We didn\'t recognize your password. Please try again!');
//       return;
//     }

//     response.cookie('loggedIn', true);
//     response.cookie('userId', userId);
//     response.redirect('/');
//   });
// });

// // User logs out
// app.get('/logout', (req, res) => {
//   // delete cookies
//   res.clearCookie('loggedIn');
//   res.clearCookie('userId');
//   res.redirect('/');
// });

// /* ============ CONTRIBUTE RESOURCES =========== */

// app.get('/about', (req, res) => {
//   res.render('about');
// });

// app.get('/contribute', (req, res) => {
//   res.render('contribute');
// });

// /* ============ LISTEN =========== */
