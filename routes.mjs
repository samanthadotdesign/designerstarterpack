import db from './models/index.mjs';

import initDashboardController from './controllers/dashboards.mjs';

export default function bindRoutes(app) {
  const DashboardController = initDashboardController(db);

  app.get('/', DashboardController.index);
}
