import Display from '../pages/Display';
import SignIn from '../pages/SignIn';
import SignupForm from '../pages/SignupForm';

const publicRoute = [
  { path: '/signin', component: SignIn, Layout: null },
  { path: '/signup', component: SignupForm, Layout: null },
  { path: '*', component: Display }
];

const privateRoute = [];

export { publicRoute, privateRoute };
