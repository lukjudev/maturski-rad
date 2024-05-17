import React from 'react'

import { useContext, useState, useEffect } from 'react';
import { Context } from '@/App';
import axios from 'axios';
import endpoints from '@/api/endpoints';
import { Navigate, useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Loader2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Button } from '@/components/ui/button';

export default function Bookings() {
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken, refreshToken, setRefreshToken] = useContext(Context);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  if(!refreshToken) {
    return <Navigate to="/prijava"/>;
  }

  useEffect(() => {
    axios.get(
      endpoints.base + endpoints.apartment + `/booking`,
      {
        headers: {"Authorization": `Bearer ${accessToken}`},
        validateStatus: function(status) {
          return true;
        }
      }
    ).then((res) => {
      if(res.status === 200) {
        setBookings(res.data);
        setLoading(false);

      } else {
        setLoading(false);
        navigate("/404")
      }
    });
  }, []);

  if(loading) {
    return <div style={{height: "80vh"}} className="flex justify-center items-center"><Loader2 className="animate-spin" /></div>
  }


  function generateIntervalString(date1, date2) {
    return format(new Date(date1), "dd/MM/yyyy") + " - " + format(new Date(date2), "dd/MM/yyyy");
}

function calculatePrice(date1, date2, price) {
    return price * Math.round((date1.getTime() - date2.getTime()) / (1000*3600*24));
}

function removeBooking(id) {
    axios.delete(
        endpoints.base + endpoints.apartment + "/booking/" + id,
        {
            headers: {"Authorization": `Bearer ${accessToken}`},
            validateStatus: function(status) {
                return true;
            }
        }
    ).then((res) => {
        if(res.status === 200) {
            const newBookings = bookings.filter((booking) => booking.id !== id);
            setBookings(newBookings);
            toast.success("Uspešno ste poništili rezervaciju.");
        } else {
            toast.error("Greška!");
        }
    });
}

return (
    <div className="mt-5">
      {
        bookings.length > 0 ?
          <Table>
            <TableHeader>
                  <TableRow>
                  <TableHead className="w-[100px]">Domaćin</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Cena</TableHead>
                  <TableHead className="text-right">Poništite</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {
                      bookings.map((booking, index) => (
                          <TableRow key={index}>
                              <TableCell className="font-medium">{booking.host}</TableCell>
                              <TableCell>{generateIntervalString(booking.checkIn, booking.checkOut)}</TableCell>
                              <TableCell className="font-medium">€{calculatePrice(new Date(booking.checkOut), new Date(booking.checkIn), booking.price)}</TableCell>
                              <TableCell className="text-right">
                                  <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                          <Button variant="destructive" size="icon">
                                              <Trash2 />
                                          </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                          <AlertDialogHeader>
                                          <AlertDialogTitle>Da li ste sigurni?</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                  Klikom na dugme poništavate rezervaciju. Ova radnja je nepovratna.
                                              </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                              <AlertDialogCancel>Otkaži</AlertDialogCancel>
                                              <AlertDialogAction onClick={() => {removeBooking(booking.id)}}>Poništi rezervaciju</AlertDialogAction>
                                          </AlertDialogFooter>
                                      </AlertDialogContent>
                                  </AlertDialog>
                              </TableCell>
                          </TableRow>
                      ))
                  }
              </TableBody>
            </Table>
        :
        <div style={{height: "80vh"}} className="flex justify-center items-center font-medium">Nemate rezervacije.</div>
      }
    </div>
  )
}
