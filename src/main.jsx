import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CreateTrip from './create-trip/index.jsx'
import Header from './components/custom/Header.jsx'
import { Toaster } from './components/ui/sonner.jsx'
import Viewtrip from './view-trip/[tripId]/index.jsx'
import MyTrips from './my-trips/index.jsx'

// Wrap pages that need the header
function WithHeader({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // homepage has its own floating header
  },
  {
    path: '/create-trip',
    element: <WithHeader><CreateTrip /></WithHeader>,
  },
  {
    path: '/view-trip/:tripId',
    element: <WithHeader><Viewtrip /></WithHeader>,
  },
  {
    path: '/my-trips',
    element: <WithHeader><MyTrips /></WithHeader>,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Toaster />
    <RouterProvider router={router} />
  </React.StrictMode>,
)
