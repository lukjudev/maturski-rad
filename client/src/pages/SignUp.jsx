import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from 'react';
import endpoints from "@/api/endpoints";
import axios from 'axios';
import Cookies from 'js-cookie';

import { Context } from "@/App";

export default function SignUp() {
  const [pending, setPending] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken, refreshToken, setRefreshToken] = useContext(Context);
  const navigate = useNavigate();

  const onSubmit = async () => {
    try {
      setPending(true);
      if(firstName.trim() === '' || lastName.trim() === '' || email.trim() === '' || password.trim() === '') {
        toast.error("Sva polja moraju biti popunjena!");
        throw "err";
      }
      if(!email.trim().match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)) {
        toast.error("Neispravan email!");
        throw "err";
      }
      if(!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
        toast.error("Slaba lozinka!");
        throw "err";
      }

      console.log(endpoints.base + endpoints.user);
      const res = await axios.post(
        endpoints.base + endpoints.user,
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password: password
        },
        {
          validateStatus: function(status) {
            return true;
          }
        }
      )
      if(res.status === 200) {
        Cookies.set("accessToken", res.data.accessToken, { expires: 1 });
        Cookies.set("refreshToken", res.data.refreshToken, { expires: 30 });
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        toast.success("Uspešna registracija!");
        setPending(false);
        navigate("/");
      } else if(res.status === 400) {
        const msg = res.data;
        switch(msg) {
          case 'already-exists':
            toast.error("Email je zauzet!");
            break;
          default:
            toast.error("Greška!");
        }
      }
      setPending(false);
    } catch(err) {
      setPending(false);
    }
  }

  if(accessToken) {
    return <Navigate to="/" replace />
  }

  return (
    //dodaj neki naslov (ime aplikacije)
    <div style={{height: "100vh"}} className="flex items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Registracija</CardTitle>
          <CardDescription>
            Unesite svoje podatke kako biste se registrovali
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">Ime</Label>
                <Input 
                  id="first-name" 
                  placeholder="Marko" 
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  required 
                  />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Prezime</Label>
                <Input 
                  id="last-name" 
                  placeholder="Babić" 
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  required 
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="korisnik@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Lozinka</Label>
              <Input 
                id="password" 
                type="password" 
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              onClick={onSubmit} 
              disabled={pending}
            >
              {pending ? <Loader2 className="animate-spin" /> : <span>Registrujte se</span>}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Već imate nalog?{" "}
            <Link to="/prijava" className="underline">
              Prijavite se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}