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

/**
 * Display sections, categories, skills, resources
 * @returns {obj} – { sections, categories, skills, resources }
 */
const getDashboardData = (userId, callback) => {
  const listSectionsQuery = 'SELECT * FROM sections ORDER BY id ASC';
  const listCategoriesQuery = 'SELECT * FROM categories';
  const listSkillsQuery = 'SELECT * FROM skills';
  const listResourcesQuery = 'SELECT * FROM resources';
  const skillsCompletedQuery = `SELECT skill_id FROM user_skills WHERE user_id=${userId} AND skill_completed=true`;
  const categoriesCompletedQuery = `
  SELECT user_categories.category_id, categories.category_img, categories.id
  FROM user_categories
  INNER JOIN categories
  ON user_categories.category_id = categories.id
  WHERE user_categories.user_id=${userId} AND user_categories.category_completed=true`;

  const skillsSectionQuery = `
  SELECT skills.id AS skill_id, skills.skill_img, skills.skill_name, skills.category_id,
  categories.id, categories.section_id, sections.id, sections.section_name
  FROM skills
  INNER JOIN categories ON skills.category_id=categories.id
  INNER JOIN sections ON sections.id=categories.section_id`;

  const listSectionsRes = pool.query(listSectionsQuery);
  const listCategoriesRes = pool.query(listCategoriesQuery);
  const listSkillsRes = pool.query(listSkillsQuery);
  const listResourcesRes = pool.query(listResourcesQuery);
  const skillsCompletedRes = pool.query(skillsCompletedQuery);
  const categoriesCompletedRes = pool.query(categoriesCompletedQuery);
  const skillsSectionRes = pool.query(skillsSectionQuery);

  Promise.all([listSectionsRes, listCategoriesRes,
    listSkillsRes, listResourcesRes, skillsCompletedRes,
    categoriesCompletedRes, skillsSectionRes])
    .then((values) => {
    // values is an array of all the promises in order
      const sectionsArr = values[0].rows;
      const categoriesArr = values[1].rows;
      const skillsArr = values[2].rows;
      const resourcesArr = values[3].rows;
      const skillsCompletedArr = values[4].rows;
      const categoriesCompletedArr = values[5].rows;
      const skillsSectionArr = values[6].rows;

      // Callback returns array of arrays
      callback(sectionsArr, categoriesArr,
        skillsArr, resourcesArr, skillsCompletedArr,
        categoriesCompletedArr, skillsSectionArr);
    });
};

/**
 * Color the completed skills
 * @param {arr} skillsArr – Each skill row is an object in the array
 * @param {arr} skillsCompletedArr – Each skill completed by user row is an object in the array
 */
const colorSkills = (skillsArr, skillsCompletedArr) => {
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
};

/**
 * Checks if the category is complete when the skill is marked complete
 * @param {int} userId – For this user, mark category as complete
 * @param {int} skillId – For this skill, check if its category is complete
 */
const checkCategoryComplete = (userId, skillId) => {
  const categoryIdQuery = `SELECT category_id FROM skills WHERE id=${skillId}`;
  let categoryId;
  let skillsCount;
  let userSkillsCount;

  // Get the category id for the skill user is marking as complete
  // return here returns the promise for the .catch() or final .then()
  // Without return here, return only happens in the callback
  return pool.query(categoryIdQuery)
    .then(
      (categoryIdRes) => {
        categoryId = categoryIdRes.rows[0].category_id;
        // Count the number of skills in that category
        const countSkillsCategoryQuery = `SELECT COUNT (*) FROM skills WHERE category_id=${categoryId}`;
        return pool.query(countSkillsCategoryQuery);
      },
      (categoryErr) => {
        console.error('Category Id Error', categoryErr);
      },
    ).then(
      // Store the skillCount for the category
      // Compare this count with the next userSkillCount
      (countSkillsCategoryRes) => {
        skillsCount = countSkillsCategoryRes.rows[0].count;
        // This returns a string i.e. '5'

        // Get the user's skills count for that category
        const countUserSkillsCategoryQuery = `
          SELECT
            user_skills.skill_id,
            user_skills.user_id,
            skills.id,
            skills.category_id
          FROM user_skills
          INNER JOIN skills ON user_skills.skill_id=skills.id
          WHERE skills.category_id=${categoryId} AND user_skills.user_id=${userId} AND user_skills.skill_completed=true`;

        return pool.query(countUserSkillsCategoryQuery);
      },
      (countSkillsErr) => {
        console.error('Count skills error', countSkillsErr);
      },
    ).then(
      (countUserSkillsCategoryRes) => {
        const userSkillsArr = countUserSkillsCategoryRes.rows;
        // userSkillsArr returns [ { skill_id: 27, user_id: 8, id: 27, category_id: 8 }, ...]
        userSkillsCount = userSkillsArr.length;

        // If the user has completed all the skills in this category, mark as complete
        if (userSkillsCount == skillsCount) {
          // If the row already exists in user_categories, update
          const markCategoryCompleteQuery = `
          INSERT INTO user_categories (user_id, category_id, category_completed) 
          VALUES (${userId}, ${categoryId}, true)
          ON CONFLICT (user_id,category_id)
          DO 
          UPDATE SET category_completed=true`;

          return pool.query(markCategoryCompleteQuery);
        }
        // If the user hasn't completed all the skills in the category
        // Prompt to let user know how many left
      },
    )
    .catch(
      // Catch all errors
      (err) => {
        console.error('Catch all errors', err);
      },
    );
};

/**
 * Main route for homepage and user dashboard
 */
app.get('/', (request, response) => {
  // Check if user is logged in or not
  // If user is not logged in, show homepage
  const { userId } = request.cookies;

  // If the user does not exist, render the homepage
  if (!userId) {
    response.render('homepage');
  }

  // If user is logged in, show their dashboard with completed skills
  getDashboardData(userId, (...results) => {
    // results returns array of arrays of objects
    const appData = {
      sections: results[0],
      categories: results[1],
      skills: results[2],
      resources: results[3],
      skillsCompleted: results[4],
      categoriesCompleted: results[5],
      skillSections: results[6],
    };

    colorSkills(appData.skills, appData.skillsCompleted);
    // Calculates how many categories are complete
    // database.categoriesCompleted returns array of objects [ { category_id: 1} ]
    response.render('dashboard-user', appData);
  });
});

/* ============ ACTIONS INSIDE DASHBOARD =========== */

/**
 * When user clicks "Complete Skill" inside div.resources
 * Updates SQL table user_skills
 */
app.put('/complete-skill/:id', (request, response) => {
  const { id: skillId } = request.params;
  const { userId } = request.cookies;

  // Update the table if the row exists in user_skills
  // ON CONFLICT – requires a unique set of columns
  // user_id: 8, 9 -- skill_id: 4, 4 (multiple rows with the same skill id & user id)
  const markSkillCompleteQuery = `
  INSERT INTO user_skills (user_id, skill_id, skill_completed) 
  VALUES (${userId}, ${skillId}, true)
  ON CONFLICT (user_id, skill_id)
  DO 
  UPDATE SET skill_completed=true`;

  const markSkillCompletePromise = pool.query(markSkillCompleteQuery);

  return Promise.all([markSkillCompletePromise, checkCategoryComplete(userId, skillId)])
    .then(() => {
      response.redirect('/');
    })
    .catch((err) => {
      console.error(err);
    });
});

/**
 * When user clicks "Uncomplete Skill" inside div.resources
 * Updates SQL table user_skills
 */
app.put('/uncomplete-skill/:id', (req, res) => {
  const { id } = req.params;
  const { userId } = req.cookies;

  const categoryIdQuery = `SELECT category_id FROM skills WHERE id=${id}`;

  const markSkillUncompleteQuery = `UPDATE user_skills SET skill_completed=false WHERE user_id=${userId} AND skill_id=${id}`;

  let categoryId;

  pool.query(categoryIdQuery)
    .then((values) => {
      categoryId = values.rows[0].category_id;
      return pool.query(markSkillUncompleteQuery);
    })
    .then(() => {
      const markCategoryUncompleteQuery = `
      UPDATE user_categories
      SET category_completed=false
      WHERE user_id=${userId} AND category_id=${categoryId}`;

      return pool.query(markCategoryUncompleteQuery);
    })
    .then(() => res.redirect('/'))
    .catch((err) => {
      console.error(err);
    });
});

/* ============ HOMEPAGE & LOGIN =========== */

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
  // Redirect to logged in
  pool.query(addUserQuery, values, (err, res) => {
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

    if (hashedInputPassword !== savedPassword) {
      console.log('We didn\'t recognize your password. Please try again!');
      return;
    }

    response.cookie('loggedIn', true);
    response.cookie('userId', userId);
    response.redirect('/');
  });
});

// User logs out
app.get('/logout', (req, res) => {
  // delete cookies
  res.clearCookie('loggedIn');
  res.clearCookie('userId');
  res.redirect('/');
});

/* ============ CONTRIBUTE RESOURCES =========== */

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contribute', (req, res) => {
  res.render('contribute');
});

app.post('/contribute', (req, res) => {
  console.log(res);
});

/* ============ LISTEN =========== */

app.listen(3004);
