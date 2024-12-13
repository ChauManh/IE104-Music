import Display from '../pages/Display';
import SignIn from '../pages/SignIn';
import SignupForm from '../pages/SignupForm';
import AdminDashboard from '../pages/AdminDashBoard';
import ForgotPassword from '../pages/ForgotPassword';

const publicRoute = [
  { path: '/signin', component: SignIn, Layout: null },
  { path: '/signup', component: SignupForm, Layout: null },
  { path: '/forgot-password', component: ForgotPassword, Layout: null },
  { path: '*', component: Display }
];

const privateRoute = [
  { 
    path: '/admin/dashboard', 
    component: AdminDashboard,
    requireAdmin: true // Add this flag
  }
];

export { publicRoute, privateRoute };
