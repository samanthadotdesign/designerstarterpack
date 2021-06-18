/**
 * Get dashboard data
 * @param db – Sequelize/Postgress database
 * @returns object { sections, ... }
 */
const getDashboardData = async (db, userId) => {
  let result;
  try {
    const sections = await db.Section.findAll();
    const categories = await db.Category.findAll();
    const skills = await db.Category.findAll();
    const resources = await db.Resource.findAll();

    // user_skills
    // db.Skill --> query the 'skills table'
    // Include: find the skills with the userId
    const skillsCompleted = await db.Skill.findAll({
      include: {
        // From the users table, find the PK
        model: db.User,
        where: {
          id: userId,
        },
      },
    });

    // user_categories
    // db.Category -> query the categories table
    // Include: find the categories with the userId
    const categoriesCompleted = await db.Category.findAll({
      include: {
        // From the users table, find the PK
        model: db.User,
        where: {
          id: userId,
        },
      },
    });

    result = {
      sections,
      categories,
      skills,
      resources,
      skillsCompleted,
      categoriesCompleted,
    };
  } catch (error) {
    console.log('Error getting dashboard data', error);
  }
  return result;
};

export default getDashboardData;
