import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Statistics } from "./multiplicationTable/Statistics.tsx";
import { MultiplicationTableSolve } from "./multiplicationTable/MultiplicationTable.tsx";
import { getTable } from "./calc/getMultiplicationTable.ts";
import { AdminPanel } from "./admin/AdminPanel.tsx";
import { ErrorPage } from "./ErrorPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "statistics",
        element: <Statistics />,
      },
      {
        path: "/",
        element: <MultiplicationTableSolve table={getTable()} />,
      },
      {
        path: "admin",
        element: <AdminPanel />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
