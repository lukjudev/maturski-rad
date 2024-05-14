import React from 'react'

import ListingPreviewVertical from '@/components/listing/ListingPreviewVertical';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import { Context } from '@/App';
import { useState, useEffect, useContext } from 'react';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import endpoints from '@/api/endpoints';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [apartments, setApartments] = useState([]);
  const [accessToken, setAccessToken, refreshToken, setRefreshToken, country] = useContext(Context);

  if(!refreshToken) {
    return <Navigate to="/prijava" replace/>
  }

  useEffect(() => {
    setLoading(true);
    axios.get(
      endpoints.base + endpoints.apartment + (country ? "?country=" + country : ""),
      {
        headers: {"Authorization": `Bearer ${accessToken}`},
        validateStatus: function(status) {
          return true;
        }
      }
    ).then((res) => {
      if(res.status === 200) {
        setApartments(res.data);
      } else {
        toast.error("Greška!");
      }
      setLoading(false);
    });
  }, [country]);

  useEffect(() => {
    axios.get(
      endpoints.base + endpoints.apartment + (country ? "?country=" + country : ""),
      {
        headers: {"Authorization": `Bearer ${accessToken}`},
        validateStatus: function(status) {
          return true;
        }
      }
    ).then((res) => {
      if(res.status === 200) {
        setApartments(res.data);
      } else {
        toast.error("Greška!");
      }
      setLoading(false);
    });
  }, []);

  if(loading) {
    return <div style={{height: "80vh"}} className="flex justify-center items-center"><Loader2 className="animate-spin" /></div>
  }

  return (
    <div className="container my-10">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {
          apartments.length === 0 ?
          <div style={{height: "80vh"}} className="col-span-4 flex justify-center items-center"><p className="text-2xl">Nije pronađeno nijedno prenoćište.</p></div>
          :
          apartments.map((apartment, index) =>
            <ListingPreviewVertical 
              className="col-span-1"
              image={apartment.image}
              title={apartment.title}
              id={apartment.id}
              key={index}
            />
          )
        }
      </div>
    </div>
  )
}
