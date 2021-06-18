/**
 * When user clicks on the button "Complete Skill"
 * @param db
 * Does not return anything
 */
export default function initSkillController(db) {
  const index = async (req, res) => {
    const { id: skillId } = req.params;
    console.log('skillid', skillId);
    // const { userId } = req.cookies;
    const userId = 8;
    try {
      // mark skill as complete

      // 1. find the instance of the user
      // findOne is a static class method for db.User (class)

      // can use findByPk
      const user = await db.User.findByPk(userId);
      console.log('user', user);

      // 2. find the instance of the skill
      const skill = await db.Skill.findByPk(skillId);
      console.log('skill', skill);

      // 3. add a new row in the join table user_skill
      // mixin method createUser only applies the instance 'skill'
      await skill.addUser(user);

      // 4. count the number of skills in a category
      // count inside the 'skills' model for the category id
      const skillsInCategoryCount = await db.Skill.count({
        // already saved the skill object and get the categoryId property
        where: { categoryId: skill.categoryId },
      });

      // 5. count the number of user's skills for that category
      // 'user' instance, count skills with category id
      // const userSkillsInCategoryCount = await skill.countUsers( {
      //   where: { categoryId: skill.categoryId, userId: userId }
      // })

      // check category if complete

      console.log('skills in category', skillsInCategoryCount);

      // if category is complete, mark category as complete

      // redirect to the section id of page
      res.redirect('/');
    } catch (error) {
      console.log(error);
    }
  };
  return { index };
}
