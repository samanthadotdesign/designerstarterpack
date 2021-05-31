import pg from 'pg';
import express from 'express';

/* ============ CONFIGURATION =========== */

const { Pool } = pg;
const app = express();

// Set the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Set up static directory
app.use(express.static('public'));

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

app.get('/', async (req, res)=> {
  const listSectionsQuery = `SELECT * FROM sections`;
  const listCategoriesQuery = `SELECT * FROM categories`;
  const listSkillsQuery = `SELECT * FROM skills`;
  const listResourcesQuery = `SELECT * FROM resources`;

    try {
    const listSectionsRes = await pool.query(listSectionsQuery);
    const sectionsArr = listSectionsRes.rows;
    
    const listCategoriesRes = await pool.query(listCategoriesQuery);
    const categoriesArr = listCategoriesRes.rows;

    const listSkillsRes = await pool.query(listSkillsQuery);
    const skillsArr = listSkillsRes.rows;

    const listResourcesRes = await pool.query(listResourcesQuery);
    const resourcesArr = listResourcesRes.rows;

    res.render('dashboard', { sections: sectionsArr, categories: categoriesArr, skills: skillsArr, resources: resourcesArr });

  } catch (err) {
    console.log(err.stack)
  }
});

/* ============ LISTEN =========== */

app.listen(3004);
