// Affects the entire dashboard

export default function initDashboardController(db) {
  // Get dashboard data
  const index = async (req, res) => {
    const { userId } = req.cookies;

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

      // Object that holds all the dashboard data
      res.render('dashboard', {
        sections, categories, skills, resources, skillsCompleted, categoriesCompleted,
      });
    } catch (error) {
      console.log('Error getting dashboard data', error);
    }
  };

  return { index };
}
