import db from './db/models/index.mjs';

import initDashboardController from './controllers/dashboards.mjs';
import initSkillController from './controllers/skills.mjs';
import initUserController from './controllers/users.mjs';

export default function bindRoutes(app) {
  const DashboardController = initDashboardController(db);
  const SkillController = initSkillController(db);
  const UserController = initUserController(db);

  app.get('/', DashboardController.index);

  app.put('/complete-skill/:id', SkillController.index);
  app.put('/uncomplete-skill/:id', SkillController.remove);

  app.post('/signup', UserController.signup);
  app.post('/login', UserController.login);
  app.get('/logout', UserController.logout);
}
