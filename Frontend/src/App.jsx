import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { publicRoute, privateRoute } from "./routes/route";
import DefaultLayout from "./Layout/DefaultLayout/DefaultLayout";
import { Fragment } from "react";
import Search from "./components/Search"; 

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem("access_token") != null;
  };

  const isAdmin = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.role === 'admin';
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
          {privateRoute.map((route, index) => {
            const Page = route.component;
            let Layout = DefaultLayout;

            if (route.Layout) {
              Layout = route.Layout;
            } else if (route.Layout === null) {
              Layout = Fragment;
            }

            // Add admin route protection
            if (route.path.startsWith('/admin')) {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    isAuthenticated() && isAdmin() ? (

                        <Page />
                    ) : (
                      <Navigate to="/signin" replace />
                    )
                  }
                />
              );
            }
            // ... rest of the routes
          })}
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
