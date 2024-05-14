import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Apartment from './pages/Apartment';
import Profile from './pages/Profile';
import Header from './components/ui/Header';
import { Navigate, Outlet } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

export const Context = React.createContext();

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import endpoints from './api/endpoints';
import Home from './pages/Home';
import Bookings from './pages/Bookings';
import Listings from './pages/Listings';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen py-6 px-8 mx-auto">
      <Header />
      <Outlet />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/prijava',
    element: <SignIn />,
  },
  {
    path: '/registracija',
    element: <SignUp />,  },
  {
    element: <Layout />,
    errorElement: <div style={{height: "100vh"}} className="flex items-center justify-center"><div>404</div></div>,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/prenociste/:id',
        element: <Apartment />
      },
      {
        path: '/profil',
        element: <Profile />
      },
      {
        path: '/rezervacije',
        element: <Bookings />
      },
      {
        path: '/prenocista',
        element: <Listings />
      }
    ]
  },
]);

function App() {
  const [accessToken, setAccessToken] = useState(Cookies.get("accessToken"));
  const [refreshToken, setRefreshToken] = useState(Cookies.get("refreshToken"));
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(refreshToken !== undefined) {
      axios.get(
        endpoints.base + endpoints.auth + '/refresh',
        {
          headers: {"Authorization": `Bearer ${refreshToken}`},
          validateStatus: function(status) {
            return true;
          } 
        }
      ).then((res) => {
        if(res.status === 200) {
          Cookies.set("accessToken", accessToken, { expires: 1 });
          Cookies.set("refreshToken", refreshToken, { expires: 30 });
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
        } else {
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          setAccessToken(undefined);
          setRefreshToken(undefined);
        }
        setLoading(false);
      });
    }
    setLoading(false);
  }, []);

  if(loading) {
    return <></>
  }

  return (
      <Context.Provider value={[accessToken, setAccessToken, refreshToken, setRefreshToken, country, setCountry]}>
        <RouterProvider router={router} />
      </Context.Provider>
    );
}

export default App
