import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { publicRoute, privateRoute } from "./routes/route";
import DefaultLayout from "./Layout/DefaultLayout/DefaultLayout";
import { Fragment } from "react";
import Search from "./components/Search"; 

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem("access_token") != null;
  };

  const RequireAuth = ({ children }) => {
    const location = useLocation();
    
    if (!isAuthenticated()) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }
    
    return children;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {publicRoute.map((route, index) => {
            const Page = route.component;
            let Layout = DefaultLayout;

            if (route.Layout) {
              Layout = route.Layout;
            } else if (route.Layout === null) {
              Layout = Fragment;
            }

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}

          {/* Protected routes */}
          {privateRoute.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                <RequireAuth>
                  <DefaultLayout>
                    <route.component />
                  </DefaultLayout>
                </RequireAuth>
              }
            />
          ))}
          <Route 
            path="/*" 
            element={
              <DefaultLayout>
                <Search />
              </DefaultLayout>
            } 
          /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
