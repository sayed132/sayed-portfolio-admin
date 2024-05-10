import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
// import Dashboard from "../pages/Dashboard/Dashboard";
import PortfolioList from "../pages/Dashboard/PortfolioLst/PortfolioList";
import Profile from "../pages/Dashboard/Profile/Profile";
import ServiceList from "../pages/Dashboard/ServiceList/ServiceList";
// import SkillsList from "../pages/Dashboard/SkillsList/SkilsList";
import Education from "../pages/Dashboard/SkillsList/Education";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    // errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Profile />,
      },
      {
        path: "/portfolio",
        element: <PortfolioList />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/service",
        element: <ServiceList />,
      },
      {
        path: "/education",
        element: <Education />,
      },
    ],
  },
]);

export default router;
