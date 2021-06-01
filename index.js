import pg from 'pg';
import express from 'express';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';

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

app.get('/', async (req, res) => {
  const listSectionsQuery = 'SELECT * FROM sections';
  const listCategoriesQuery = 'SELECT * FROM categories';
  const listSkillsQuery = 'SELECT * FROM skills';
  const listResourcesQuery = 'SELECT * FROM resources';

  try {
    const listSectionsRes = await pool.query(listSectionsQuery);
    const sectionsArr = listSectionsRes.rows;

    const listCategoriesRes = await pool.query(listCategoriesQuery);
    const categoriesArr = listCategoriesRes.rows;

    const listSkillsRes = await pool.query(listSkillsQuery);
    const skillsArr = listSkillsRes.rows;

    const listResourcesRes = await pool.query(listResourcesQuery);
    const resourcesArr = listResourcesRes.rows;

    res.render('dashboard', {
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
app.put('/complete-skill/:id', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.cookies;

  const markSkillCompleteQuery = `UPDATE user_skills SET skill_completed=true WHERE user_id=${userId} AND skill_id=${id}`;

  try {
    await pool.query(markSkillCompleteQuery);
    res.redirect('/');
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

/* ============ LOGIN =========== */

/* ============ CONTRIBUTE RESOURCES =========== */

app.get('/about', (req, res) => {
  res.render('about');
});

/* ============ LISTEN =========== */

app.listen(3004);
