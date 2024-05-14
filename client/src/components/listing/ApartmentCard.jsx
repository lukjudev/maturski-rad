import React, { useState } from 'react'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import endpoints from '@/api/endpoints'
import { toast } from 'react-toastify'
import { Loader2 } from 'lucide-react'
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

export default function ApartmentCard(props) {
    const [pending, setPending] = useState(false);
    const [date, setDate] = useState(null);
    const navigate = useNavigate();

    function calculatePrice() {
        return props.price * Math.round((date.to.getTime() - date.from.getTime()) / (1000*3600*24));
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
            navigate("/prenocista");
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
                        {pending ? <Loader2 className="animate-spin" /> : <div><span className="text-lg">€{date && date.from && date.to ? calculatePrice() : 0} (€{props.price} /</span><span className="pl-1 text-lg">noć)</span></div>}
                    </Button>
                </CardContent>
            </Card>
        )
    } else {
        return (<Card className="mx-auto max-w-sm mt-6 md:mt-0">
            <CardHeader>
            <CardTitle className="text-2xl">Vaše prenoćište</CardTitle>
            <CardDescription>
                Upravljajte svojim prenoćištem.
            </CardDescription>
            </CardHeader>
            <CardContent>
                <Button 
                    type="submit" 
                    className="w-full mb-2" 
                >
                    <span className="text-lg">Pogledajte rezervacije</span>
                </Button>
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
