import Display from "../pages/Display";
import SignIn from "../pages/SignIn";
import SignupForm from "../pages/SignupForm";
import AdminDashboard from "../pages/AdminDashBoard";
import ForgotPassword from "../pages/ForgotPassword";
import ProfilePage from "../pages/ProfilePage";

const publicRoute = [
  { path: "/signin", component: SignIn, Layout: null },
  { path: "/signup", component: SignupForm, Layout: null },
  { path: "/forgot-password", component: ForgotPassword, Layout: null },
  {
    path: "/admin/dashboard",
    component: AdminDashboard,
    Layout: null,
    requireAdmin: true, // Add this flag
  },
  { path: "*", component: Display },
];

export { publicRoute };
