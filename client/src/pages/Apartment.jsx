import Header from "@/components/ui/Header";
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import endpoints from "@/api/endpoints";
import { Context } from "@/App";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ApartmentCard from "@/components/listing/ApartmentCard";
import { countriesMap } from "@/components/ui/CountrySelect";


export default function Apartment() {
  const [accessToken, setAccessToken, refreshToken, setRefreshToken] = useContext(Context);
  const [loading, setLoading] = useState(true); 
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [capacity, setCapacity] = useState("");
  const [rooms, setRooms] = useState("");
  const [bathroom, setBathrooms] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [images, setImages] = useState([]);
  const [editable, setEditable] = useState(false);
  const [unavailableDays, setUnavailableDays] = useState([]);
  const navigate = useNavigate();

  const { id } = useParams();

  if(!refreshToken) {
    return <Navigate to="/prijava"/>;
  }

  useEffect(() => {
    axios.get(
      endpoints.base + endpoints.apartment + `/single/${id}`,
      {
        headers: {"Authorization": `Bearer ${accessToken}`},
        validateStatus: function(status) {
          return true;
        }
      }
    ).then((res) => {
      if(res.status === 200) {
        const data = res.data;
        setTitle(data.title);
        setDescription(data.description);
        setCapacity(data.capacity);
        setRooms(data.rooms);
        setAddress(data.address);
        setBathrooms(data.bathrooms);
        setEditable(data.editable);
        setCountry(data.country);
        setImages(data.images);
        setPrice(data.price);
        setFirstName(data.firstName);
        setLastName(data.lastName);
      } else {
        navigate("/404")
        //toast.error("Greška!");
      }

      axios.get(
        endpoints.base + endpoints.apartment + `/booking/${id}`,
        {
          headers: {"Authorization": `Bearer ${accessToken}`},
          validateStatus: function(status) {
            return true;
          }
        }
      ).then((res) => {
        if(res.status === 200) {
          const days = res.data.map((range) => {
            return {
              from: new Date(range.checkIn),
              to: new Date(range.checkOut)
            }
          })
          setUnavailableDays(days);
          setLoading(false);
        } else {
          toast.error("Greška!");
          setLoading(false);
          navigate("/");
        }
      })
    });
  }, []);

  if(loading) {
    return <div style={{height: "80vh"}} className="flex justify-center items-center"><Loader2 className="animate-spin" /></div>
  }

  return (
      <div className="container">
        <p className="text-2xl font-bold py-6">{title}</p>
        <div className="grid md:grid-cols-2 items-center gap-2">
            <div className="aspect-square max-w bg-slate-500">
                {images.length !== 5 ? <></> : <img src={images[0]}  className="w-[100%] object-fill"/>}
            </div>
            <div className="grid sm:grid-cols-2 items-center gap-2">
                <div className="aspect-square max-w bg-slate-500" >
                    {images.length !== 5 ? <></> : <img src={images[1]}  className="w-[100%] object-fill"/>}
                </div>
                <div className="aspect-square max-w bg-slate-500" >
                    {images.length !== 5 ? <></> : <img src={images[2]} className="w-[100%] object-fill"/>}
                </div>
                <div className="aspect-square max-w bg-slate-500" >
                    {images.length !== 5 ? <></> : <img src={images[3]}  className="w-[100%] object-fill"/>}
                </div>
                <div className="aspect-square max-w bg-slate-500" >
                    {images.length !== 5 ? <></> : <img src={images[4]}  className="w-[100%] object-fill"/>}
                </div>
            </div>
        </div>
        <div className="grid md:grid-cols-2 items-center gap-2">
          <div>
            <p className="text-xl font-bold pt-6">{address}, {countriesMap.filter((obj) => obj.code === country)[0].value}</p>
            <p className="pt-2 pb-6">{capacity} gostiju - {rooms} sobe - {bathroom} kupatila</p>
            <hr />
            <div className="flex items-center py-6">
              <Avatar>
                <AvatarFallback>{firstName[0]}{lastName[0]}</AvatarFallback>
              </Avatar>
              <p className="text-xl font-bold pl-3">{firstName} {lastName}</p>
            </div>
            <hr />
            <div className="py-6">
              <p className="font-bold text-xl">O mestu</p>
              <p className="mt-3">{description}</p>
            </div>
            <hr />
          </div>
          <div>
            <ApartmentCard unavailableDays={unavailableDays} accessToken={accessToken} id={id} price={price} editable={editable}/>
          </div>
        </div>
    </div>
  );
}
