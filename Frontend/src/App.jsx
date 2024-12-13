import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { publicRoute } from "./routes/route";
import DefaultLayout from "./Layout/DefaultLayout/DefaultLayout";
import { Fragment } from "react";

function App() {
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
                    {/* {privateRoute.map((route, index) => (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <DefaultLayout>
                                    <route.component />
                                </DefaultLayout>
                            }
                        />
                    ))} */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
