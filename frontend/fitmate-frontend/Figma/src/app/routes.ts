import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import AICoachPage from "./pages/AICoachPage";
import WorkoutPlanPage from "./pages/WorkoutPlanPage";
import KnowledgeLibraryPage from "./pages/KnowledgeLibraryPage";
import KnowledgeDetailPage from "./pages/KnowledgeDetailPage";
import DataDashboardPage from "./pages/DataDashboardPage";
import UserProfilePage from "./pages/UserProfilePage";
import LoginPage from "./pages/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: AICoachPage },
      { path: "coach", Component: AICoachPage },
      { path: "workout", Component: WorkoutPlanPage },
      { path: "knowledge", Component: KnowledgeLibraryPage },
      { path: "knowledge/:id", Component: KnowledgeDetailPage },
      { path: "dashboard", Component: DataDashboardPage },
      { path: "profile", Component: UserProfilePage },
    ],
  },
]);