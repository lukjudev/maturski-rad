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
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import endpoints from "@/api/endpoints";
import { useState, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Context } from "@/App";

export default function SignIn() {
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken, refreshToken, setRefreshToken] = useContext(Context);
  const navigate = useNavigate();

  const onSubmit = async () => {
    try {
      if(email.trim() === '' || password.trim() === '') {
        toast.error("Sva polja moraju biti popunjena!");
        throw "err";
      }

      setPending(true);
      if(!email.trim().match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)) {
        toast.error("Neispravan email!");
        throw "err";
      }
      const res = await axios.post(
        endpoints.base + endpoints.auth + "/signin",
        {
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
        toast.success("Uspešna prijava!");
        setPending(false);
        navigate("/");
      } else if(res.status === 400) {
        const msg = res.data;
        switch(msg) {
          case 'wrong-credentials':
            toast.error("Neispravan email/password!");
            break;
          default:
            toast.error("Greška!");
        }
      }
      setPending(false);
    } catch(err) {
      console.log(err);
      setPending(false);
    }
  }

  if(accessToken) {
    return <Navigate to="/" replace />
  }

  return (
    //DODAJ NEKI NASLOV (IME APLIKACIJE)
    <div style={{height: "100vh"}} className="flex items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Prijava</CardTitle>
          <CardDescription>
            Unesite svoj email i lozinku kako biste se prijavili
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
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
              <div className="flex items-center">
                <Label htmlFor="password">Lozinka</Label>
              </div>
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
              {pending ? <Loader2 className="animate-spin" /> : <span>Prijavite se</span>}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Nemate nalog?{" "}
            <Link to="/registracija" className="underline">
              Registrujte se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}