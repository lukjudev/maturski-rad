import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import React, { useState, useContext, useEffect } from 'react'
import ListingPreviewHorizontal from '@/components/listing/ListingPreviewHorizontal'
import { Loader2, Plus } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectGroup, SelectItem, SelectContent, SelectLabel } from '@/components/ui/select'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { toast } from 'react-toastify'
import CountrySelect from '@/components/ui/CountrySelect'
import axios from 'axios'
import endpoints from '@/api/endpoints'
import { Context } from '@/App'
import { processImages } from '@/lib/utils'

export default function Listings() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pending, setPending] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [rooms, setRooms] = useState("");
    const [bathrooms, setBathrooms] = useState("");
    const [capacity, setCapacity] = useState("");
    const [price, setPrice] = useState("");
    const [images, setImages] = useState([]);
    const [accessToken, setAccessToken, refreshToken, setRefreshToken] = useContext(Context);

    if(!refreshToken) {
        return <Navigate to="/prijava" replace/>
    }
    
    useEffect(() => {
        axios.get(
          endpoints.base + endpoints.apartment + '/personal',
          {
            headers: {"Authorization": `Bearer ${accessToken}`},
            validateStatus: function(status) {
              return true;
            }
          }
        ).then((res) => {
          if(res.status === 200) {
            setListings(res.data);
          } else {
            toast.error("Greška!");
          }
          setLoading(false);
        });
    }, []);

    if(loading) {
      return <div style={{height: "80vh"}} className="flex justify-center items-center"><Loader2 className="animate-spin" /></div>
    }

    function onSubmit() {
        if(title.trim() === '' 
        || description.trim() === '' 
        || country.trim() === '' 
        || address.trim() === '' 
        || rooms.trim() === '' 
        || bathrooms.trim() === '' 
        || capacity.trim() === ''
        || price.trim() === ''
        || images.length !== 5) {
            toast.error("Sva polja moraju biti popunjena!");
            return;
        }
        setPending(true);
        axios.post(
          endpoints.base + endpoints.apartment,
          {
            title: title,
            description: description,
            country: country,
            address: address,
            rooms: rooms,
            bathrooms: bathrooms,
            capacity: capacity,
            price: price,
            images: images
          },
          {
            headers: {"Authorization": `Bearer ${accessToken}`},
            validateStatus: function(status) {
              return true;
            }
          }
        ).then((res) => {
          setPending(false);
          if(res.status === 201) {
            setListings([...listings, {
                id: res.data._id,
                title: res.data.title,
                description: res.data.description,
                image: res.data.images[0]
            }]);
            toast.success("Uspešno ste kreirali novo prenoćište!");
            return;
          } 
          toast.error("Greška!");
        });
    }

    return (
        <Dialog>
            <div className="grid container my-5 gap-5">
                {
                    listings.length === 0 ? 
                    <div style={{height: "80vh"}} className="flex justify-center items-center"><p className="text-2xl">Nemate nijedno prenoćište.</p></div>
                        : listings.map((listing, i) => <ListingPreviewHorizontal data={listing} key={i}/>)
                }
            </div>
            <DialogTrigger asChild>
                <Button size="icon" className="fixed bottom-0 right-0 h-16 w-16 m-8">
                    <Plus />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-auto">
                <DialogHeader>
                    <DialogTitle>Novo prenoćište</DialogTitle>
                    <DialogDescription>
                        Imate mesto gde možete da ugostite? Popunite formular.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="naslov" className="text-right">Naslov</Label>
                        <Input 
                            id="naslov" 
                            className="col-span-3"
                            onChange={(e) => {setTitle(e.target.value)}}
                            value={title}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="opis" className="text-right">Opis</Label>
                        <Textarea 
                            id="opis" 
                            className="col-span-3"
                            onChange={(e) => {setDescription(e.target.value)}}
                            value={description}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Država</Label>
                        <CountrySelect country={country} changeCountry={(value) => {setCountry(value)}}/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="adresa" className="text-right">Adresa</Label>
                        <Input 
                            id="adresa" 
                            className="col-span-3"
                            onChange={(e) => {setAddress(e.target.value)}}
                            value={address}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="room" className="text-right">Broj soba</Label>
                        <Input 
                            id="room" 
                            type="number" 
                            className="col-span-1"
                            onChange={(e) => setRooms(e.target.value)}
                            value={rooms}
                        />
                        <Label htmlFor="bathroom" className="text-right">Broj kupatila</Label>
                        <Input 
                            id="bathroom" 
                            type="number" 
                            className="col-span-1"
                            onChange={(e) => setBathrooms(e.target.value)}
                            value={bathrooms}
                        />
                        <Label htmlFor="capacity" className="text-right">Kapacitet</Label>
                        <Input 
                            id="capacity" 
                            type="number" 
                            className="col-span-1"
                            onChange={(e) => setCapacity(e.target.value)}
                            value={capacity}
                        />
                        <Label htmlFor="price" className="text-right">Cena (€)</Label>
                        <Input 
                            id="price" 
                            type="number" 
                            className="col-span-1"
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                        />
                    </div>
                    <Separator />
                    <div className="grid grid-cols-4 items-center gap-4">
                        <div className="grid col-span-3 w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="pictures">Slike prenoćišta (5 slika)</Label>
                            <Input 
                                id="pictures" 
                                type="file" 
                                multiple="multiple" 
                                accept="image/png, image/jpeg"
                                onChange={(e) => {
                                    processImages(e).then((output) => {
                                        setImages(output);
                                        toast.success("Uspešno ste postavili slike.");
                                    });
                                }}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-2">
                        <div className="aspect-square max-w bg-slate-500">
                            {images.length !== 5 ? <></> : <img src={images[0]}/>}
                        </div>
                        <div className="grid grid-cols-2 items-center gap-2">
                            <div className="aspect-square max-w bg-slate-500" >
                                {images.length !== 5 ? <></> : <img src={images[1]} />}
                            </div>
                            <div className="aspect-square max-w bg-slate-500" >
                                {images.length !== 5 ? <></> : <img src={images[2]} />}
                            </div>
                            <div className="aspect-square max-w bg-slate-500" >
                                {images.length !== 5 ? <></> : <img src={images[3]}/>}
                            </div>
                            <div className="aspect-square max-w bg-slate-500" >
                                {images.length !== 5 ? <></> : <img src={images[4]}/>}
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogTrigger asChild>
                        <Button type="submit" 
                            onClick={onSubmit}
                            disabled={pending}
                        >
                            { pending ? <Loader2 className="animate-spin" /> : <span>Sačuvaj</span> }
                        </Button>
                    </DialogTrigger>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
