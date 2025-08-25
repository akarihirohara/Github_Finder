import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import UserDetail from "./pages/UserDetail";
import About from "./pages/About";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: "user/:login", element: <UserDetail /> },
            { path: "about", element: <About /> },
            { path: "*", element: <div style={{ padding: 24 }}>Not Found</div> },
        ],
    },
]);