import db from './db/models/index.mjs';

import initDashboardController from './controllers/dashboards.mjs';
import initSkillController from './controllers/skills.mjs';

export default function bindRoutes(app) {
  const DashboardController = initDashboardController(db);
  const SkillController = initSkillController(db);

  app.get('/', DashboardController.index);
  app.put('/complete-skill/:id', SkillController.index);
}
