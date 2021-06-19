// Affects the entire dashboard
import getDashboardData from '../utils/getDashboardData.mjs';

export default function initDashboardController(db) {
  // Get dashboard data
  // Use async/await here to getDashboardData
  const index = async (req, res) => {
    const { userId } = req.cookies;
    const dashboardData = await getDashboardData(db, userId);
    // Object that holds all the dashboard data
    res.render('random', dashboardData);
  };

  return { index };
}
