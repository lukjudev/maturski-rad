import React, { useState } from 'react'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import endpoints from '@/api/endpoints'
import { toast } from 'react-toastify'
import { Loader2,  Trash2 } from 'lucide-react'
import { DateRangePicker } from './DateRangePicker'
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { format } from 'date-fns'

export default function ApartmentCard(props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const [date, setDate] = useState(null);
    const navigate = useNavigate();

    function generateIntervalString(date1, date2) {
        return format(new Date(date1), "dd/MM/yyyy") + "-" + format(new Date(date2), "dd/MM/yyyy");
    }

    function calculatePrice(date1, date2) {
        return props.price * Math.round((date1.getTime() - date2.getTime()) / (1000*3600*24));
    }

    function removeBooking(id) {
        axios.delete(
            endpoints.base + endpoints.apartment + "/booking/" + id,
            {
                headers: {"Authorization": `Bearer ${props.accessToken}`},
                validateStatus: function(status) {
                    return true;
                }
            }
        ).then((res) => {
            if(res.status === 200) {
                const newBookings = props.bookings.filter((booking) => booking.id !== id);
                props.setBookings(newBookings);
                setDialogOpen(false);
                toast.success("Uspešno ste poništili rezervaciju.");
            } else {
                toast.error("Greška!");
            }
        });
    }

    function onSubmit() {
        setPending(true);
        axios.post(
            endpoints.base + endpoints.apartment + `/book`,
            {
                apartment: props.id,
                checkIn: date.from.toString(),
                checkOut: date.to.toString()
            },
            {
                headers: {"Authorization": `Bearer ${props.accessToken}`},
                validateStatus: function(status) {
                    return true;
                }
            }
        ).then((res) => {
            if(res.status === 200) {
                toast.success("Uspešno ste rezervisali prenoćište!");
            } else {
                toast.error("Greška!");
            }
            setPending(false);
            navigate("/rezervacije");
        });
    }

    function deleteApartment() {
        setPending(true);
        axios.delete(
            endpoints.base + endpoints.apartment + `/${props.id}`,
            {
                headers: {"Authorization": `Bearer ${props.accessToken}`},
                validateStatus: function(status) {
                    return true;
                }
            }
        ).then((res) => {
            if(res.status === 200) {
                toast.success("Uspešno ste obrisali prenoćište.");
            } else {
                toast.error("Greška!");
            }
            setPending(false);
            navigate("/prenocista");
        });
    }    
    
    
    if(!props.editable) {
        return (
            <Card className="mx-auto max-w-sm mt-6 md:mt-0">
                <CardHeader>
                <CardTitle className="text-2xl">Rezervacija</CardTitle>
                <CardDescription>
                    Popunite formular i rezervišite mesto klikom na dugme.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <DateRangePicker date={date} setDate={setDate} unavailableDays={props.unavailableDays}/>
                    <Button 
                        type="submit" 
                        className="w-full mt-5" 
                        disabled={pending || !date || !date.from || !date.to}
                        onClick={onSubmit}
                    >
                        {pending ? <Loader2 className="animate-spin" /> : <div><span className="text-lg">€{date && date.from && date.to ? calculatePrice(date.to, date.from) : 0} (€{props.price} /</span><span className="pl-1 text-lg">noć)</span></div>}
                    </Button>
                </CardContent>
            </Card>
        )
    } else {
        console.log(props.bookings);
        return (<Card className="mx-auto max-w-sm mt-6 md:mt-0">
            <CardHeader>
            <CardTitle className="text-2xl">Vaše prenoćište</CardTitle>
            <CardDescription>
                Upravljajte svojim prenoćištem.
            </CardDescription>
            </CardHeader>
            <CardContent>
                <Dialog open={dialogOpen} onOpenChange={(open) => {setDialogOpen(open)}}>
                    <DialogTrigger asChild>
                        <Button 
                            type="submit" 
                            className="w-full mb-2" 
                        >
                            <span className="text-lg">Pogledajte rezervacije</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                        <DialogTitle>Rezervacije</DialogTitle>
                        <DialogDescription>Spisak svih rezervacija ovog prenoćišta.</DialogDescription>
                        </DialogHeader>
                        <div className="grid">
                            {
                                !props.bookings || props.bookings.length === 0 ?
                                <div style={{height: "80vh"}} className="col-span-4 flex justify-center items-center"><p className="text-2xl">Nema rezervacija.</p></div>
                                :
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                        <TableHead className="w-[100px]">Korisnik</TableHead>
                                        <TableHead>Period</TableHead>
                                        <TableHead>Cena</TableHead>
                                        <TableHead className="text-right">Poništite</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            props.bookings.map((booking, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">{booking.user}</TableCell>
                                                    <TableCell>{generateIntervalString(booking.checkIn, booking.checkOut)}</TableCell>
                                                    <TableCell className="font-medium">€{calculatePrice(new Date(booking.checkOut), new Date(booking.checkIn))}</TableCell>
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
                            }
                        </div>
                        <DialogTrigger asChild>
                            <Button type="submit">Zatvori</Button>
                        </DialogTrigger>

                    </DialogContent>
                </Dialog>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button 
                            type="submit" 
                            className="w-full" 
                            variant="destructive"
                            disabled={pending}
                        >
                            {pending ? <Loader2 className="animate-spin" /> : <span className="text-lg">Obrišite prenoćište</span>}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Da li ste sigurni?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Brisanje prenočišta je nepovratna radnja. Morali biste ponovo prolaziti kroz proces kreiranja kako biste ga vratili.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Otkaži</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteApartment}>Obriši</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>

            </CardContent>
        </Card>);
    }
}
