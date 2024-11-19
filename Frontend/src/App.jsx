import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { publicRoute, privateRoute } from "./routes/route";
import DefaultLayout from "./Layout/DefaultLayout/DefaultLayout";
import { Fragment } from "react";
import Search from "./components/Search"; // Import the Search component

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem("access_token") != null;
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

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  isAuthenticated() ? (
                    <Layout>
                      <Page />
                    </Layout>
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
            );
          })}
          <Route path="/search" element={<Search />} /> {/* Add search route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
