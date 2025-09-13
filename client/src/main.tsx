import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { registerSW } from "virtual:pwa-register"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import { Statistics } from "./multiplicationTable/Statistics.tsx"
import { MultiplicationTableSolve } from "./multiplicationTable/MultiplicationTable.tsx"
import { getTable } from "./calc/getMultiplicationTable.ts"
import { AdminPanel } from "./admin/AdminPanel.tsx"
import { ErrorPage } from "./ErrorPage.tsx"
import { MixedTasks } from "./MixedTasks/MixedTasks.tsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <MultiplicationTableSolve table={getTable()} />,
        errorElement: <ErrorPage />,
      },
      {
        path: "statistics",
        element: <Statistics />,
        errorElement: <ErrorPage />,
      },
      {
        path: "admin",
        element: <AdminPanel />,
        errorElement: <ErrorPage />,
      },
      {
        path: "mixed-tasks",
        element: <MixedTasks />,
        errorElement: <ErrorPage />,
      },
    ],
  },
])

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New content available. Reload?")) {
      updateSW(true)
    }
  },
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
)
