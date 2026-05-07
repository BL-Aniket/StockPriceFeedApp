import React from "react"
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"

import Login from "./pages/Login"
import './App.css'
import ErrorPage from "./pages/ErrorPage"
import RootLayout from "./pages/RootLayout"
import Portfolio from "./pages/Portfolio"
import Alerts from "./pages/Alerts"
import Profile from "./pages/Profile"

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,   // 👈 wrap everything
      errorElement: < ErrorPage />,
      children: [
        {
          index: true,
          element: <Navigate to="/login" replace />
        },
        {
          path: "login",
          element: <Login />
        },
        {
          path: "watchlist",
          element: <Portfolio />
        },
        {
          path: "alerts",
          element: <Alerts />
        },
        {
          path: "profile",
          element: <Profile />
        },
        {
          path: "*",
          element: <ErrorPage />
        }
      ]
    }
  ])

  // const router = createBrowserRouter([
  //   {
  //     path: "/",
  //     element: <Navigate to="/login" replace />
  //   },

  //   {
  //     path: "/login",
  //     element: <RootLayout />,
  //     children: [
  //       {
  //         index: true,
  //         element: <Login />
  //       }
  //     ]
  //   },

  //   {
  //     path: "/watchlist",
  //     element: <Portfolio />
  //   },

  //   {
  //     path: "*",
  //     element: <ErrorPage />
  //   },


  // ])

  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default App
