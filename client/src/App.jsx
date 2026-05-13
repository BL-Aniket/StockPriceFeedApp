import React from "react"
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import toast, { Toaster } from 'react-hot-toast';

import Login from "./pages/Login"
import './App.css'
import ErrorPage from "./pages/ErrorPage"
import RootLayout from "./pages/RootLayout"
import Portfolio from "./pages/Portfolio"
import Alerts from "./pages/Alerts"
import Profile from "./pages/Profile"
import Register from "./pages/Register"

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
          path: "register",
          element: <Register />
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



  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />

      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App


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