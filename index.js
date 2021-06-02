import pg from 'pg';
import express from 'express';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import jsSHA from 'jssha';

/* ============ CONFIGURATION =========== */

const { Pool } = pg;
const app = express();

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

// Set the way we will connect to the server
const pgConnectionConfigs = {
  user: 'samanthalee',
  host: 'localhost',
  database: 'starterpack',
  port: 5432, // Postgres server always runs on this port
};

// Create the var we'll use
const pool = new Pool(pgConnectionConfigs);

// Connect to the server
pool.connect();

/* ============ DASHBOARD =========== */

// Main route for homepage and user dashboard
app.get('/', async (request, response) => {
  // Check if user is logged in or not
  // If user is not logged in, show homepage
  const { userId } = request.cookies;

  console.log(userId);

  // If the user does not exist, render the homepage
  if (!userId) {
    response.render('homepage');
    return;
  }

  // If user is logged in, show their dashboard with completed skills
  const skillsCompletedQuery = `SELECT skill_id FROM user_skills WHERE user_id=${userId} AND skill_completed=true`;

  // if (request.query) {
  // request.query returns { skillId: '9', uncomplete: 'hidden' }
  // console.log(request.query);
  // }

  const listSectionsQuery = 'SELECT * FROM sections';
  const listCategoriesQuery = 'SELECT * FROM categories';
  const listSkillsQuery = 'SELECT * FROM skills';
  const listResourcesQuery = 'SELECT * FROM resources';

  try {
    const skillsCompletedRes = await pool.query(skillsCompletedQuery);
    const skillsCompletedArr = skillsCompletedRes.rows;
    // skillsCompletedArr returns [ { skill_id: 2 }, { skill_id: 10 } ...]

    // For each skill that is completed, show the color & "Uncomplete Skill" button

    const listSectionsRes = await pool.query(listSectionsQuery);
    const sectionsArr = listSectionsRes.rows;

    const listCategoriesRes = await pool.query(listCategoriesQuery);
    const categoriesArr = listCategoriesRes.rows;

    const listSkillsRes = await pool.query(listSkillsQuery);
    const skillsArr = listSkillsRes.rows;

    // For each skill that is completed, show the color & "Uncomplete Skill" button
    // For each completed skill, match the ids inside the main skills array of objects
    // And add a new key-property pair
    skillsArr.forEach((skill) => {
      skill.muted = 'muted';
      skill.completeBtn = 'visible';
      skill.uncompleteBtn = 'hidden';
    });

    skillsCompletedArr.forEach((skillCompleted) => {
      const skillsCompletedObj = skillsArr.filter(
        (skill) => skill.id === skillCompleted.skill_id,
      )[0];
      skillsCompletedObj.muted = 'not-muted';
      skillsCompletedObj.completeBtn = 'hidden';
      skillsCompletedObj.uncompleteBtn = 'visible';
    });

    const listResourcesRes = await pool.query(listResourcesQuery);
    const resourcesArr = listResourcesRes.rows;

    response.render('dashboard', {
      sections: sectionsArr, categories: categoriesArr, skills: skillsArr, resources: resourcesArr,
    });
  } catch (err) {
    console.log(err.stack);
  }
});

/* ============ ACTIONS INSIDE DASHBOARD =========== */

/**
 * When user clicks "Complete Skill" inside div.resources
 * Updates SQL table user_skills
 */
app.put('/complete-skill/:id', async (request, response) => {
  const { id: skillId } = request.params;
  const { userId } = request.cookies;

  // If user has marked it as uncomplete before, entry exists in user_skills table
  const skillExistsQuery = `SELECT * FROM user_skills WHERE user_id=${userId} AND skill_id=${skillId}`;

  try {
    const skillExistsRes = await pool.query(skillExistsQuery);
    // skillExistsRes.rows[0]
    // returns existing line { id: 1, user_id: 1, skill_id: 1, skill_completed: false }
    const userSkill = skillExistsRes.rows[0];

    // If the row doesn't exist
    if (userSkill === undefined) {
      // Add the row inside database
      const addSkillQuery = `INSERT INTO user_skills (user_id, skill_id, skill_completed) VALUES (${userId}, ${skillId}, true)`;
      const addSkillRes = await pool.query(addSkillQuery);
    } else {
      // Update the row
      const updateSkillQuery = `UPDATE user_skills SET skill_completed=true WHERE user_id=${userId} AND skill_id=${skillId}`;
      const updateSkillRes = await pool.query(updateSkillQuery);
    }
    // Toggle the Complete -> Uncomplete button
    response.redirect(`/?skillId=${skillId}&uncomplete=hidden`);
  } catch (err) {
    console.log(err.stack);
  }
});

/**
 * When user clicks "Uncomplete Skill" inside div.resources
 * Updates SQL table user_skills
 */
app.put('/uncomplete-skill/:id', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.cookies;

  const markSkillUncompleteQuery = `UPDATE user_skills SET skill_completed=false WHERE user_id=${userId} AND skill_id=${id}`;

  try {
    await pool.query(markSkillUncompleteQuery);
    console.log('done');
    res.redirect('/');
  } catch (err) {
    console.log(err.stack);
  }
});

/* ============ HOMEPAGE & LOGIN =========== */

// app.get('/home', (request, response) => {
//   response.render('homepage');
// });

// Renders a Sign Up page
app.get('/signup', (req, res) => {
  res.render('signup');
});

// Allows the user to sign up
app.post('/signup', (request, response) => {
  // initialise the SHA object
  const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
  // input the password from the request to the SHA object
  shaObj.update(request.body.password);
  // get the hashed password as output from the SHA object
  const hashedPassword = shaObj.getHash('HEX');

  // store the hashed password in our DB
  const values = [request.body.name, request.body.email, hashedPassword];

  const addUserQuery = 'INSERT INTO users (user_name, email, hashed_password) VALUES ($1, $2, $3) RETURNING *';
  pool.query(addUserQuery, values, (error, result) => {
    response.redirect('/');
  });
});

// Allows user to log in
app.post('/login', (request, response) => {
  const { email: inputEmail, password: inputPassword } = request.body;

  const selectUserQuery = `SELECT * FROM users WHERE email='${inputEmail}'`;

  pool.query(selectUserQuery, (err, res) => {
    // Query error
    if (err) {
      console.log(err);
      return;
    }

    // User's email does not exist
    if (res.rowCount === 0) {
      console.log('We couldn\'t find your email. If you can\'t remember your account, we can send you a reminder.');
      return;
    }
    // User's email exists
    // res.rows returns array with email objects [ { id: 1, user_name: 'Samantha', ... }]
    const { id: userId, user_name, hashed_password: savedPassword } = res.rows[0];

    const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
    shaObj.update(inputPassword);
    const hashedInputPassword = shaObj.getHash('HEX');

    if (inputPassword !== savedPassword) {
      console.log('We didn\'t recognize your password. Please try again!');
      return;
    }

    response.cookie('loggedIn', true);
    response.cookie('userId', userId);
    response.redirect('/');
  });
});

/* ============ CONTRIBUTE RESOURCES =========== */

app.get('/about', (req, res) => {
  res.render('about');
});

/* ============ LISTEN =========== */

app.listen(3004);
