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
import ProtectedRoute from "./routes/ProtectedRoute";

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
        element: (
          <ProtectedRoute>
            <Portfolio />
          </ProtectedRoute>
        )
      },
      {
        path: "alerts",
        element: (
          <ProtectedRoute>
            <Alerts />
          </ProtectedRoute>
        )
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
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
