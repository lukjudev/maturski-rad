import React, { useContext, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import axios from 'axios'
import endpoints from '@/api/endpoints'
import { Context } from '@/App'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Loader2 } from 'lucide-react'
import Cookies from 'js-cookie'

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [accessToken, setAccessToken, refreshToken, setRefreshToken] = useContext(Context);
  const navigate = useNavigate();

  if(!refreshToken) {
    return <Navigate to="/prijava" replace/>
  }

  useEffect(() => {
    axios.get(
      endpoints.base + endpoints.user,
      {
        headers: {"Authorization": `Bearer ${accessToken}`},
        validateStatus: function(status) {
          return true;
        }
      }
    ).then((res) => {
      if(res.status === 200) {
        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
      } else {
        toast.error("Greška!");
      }
      setLoading(false);
    });
  }, []);

  
  if(loading) {
    return <div style={{height: "80vh"}} className="flex justify-center items-center"><Loader2 className="animate-spin" /></div>
  }

  const accountSubmit = () => {
    if(firstName.trim() === '' || lastName.trim() === '') {
      toast.error("Sva polja moraju biti popunjena!");
      return;
    }
    setPending(true);
    axios.put(
      endpoints.base + endpoints.user,
      {
        firstName: firstName,
        lastName: lastName
      },
      {
        headers: {"Authorization": `Bearer ${accessToken}`},
        validateStatus: function(status) {
          return true;
        }
      }
    ).then((res) => {
      setPending(false);
      if(res.status === 200) {
        toast.success("Uspešno ste izmenili nalog!");
        return;
      } 
      toast.error("Greška!");
    });
  }

  const passwordSubmit = () => {
    if(password.trim() === '' || newPassword.trim() === '') {
      toast.error("Sva polja moraju biti popunjena!");
      return
    }
    if(!newPassword.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
      toast.error("Nova lozinka je slaba!");
      return;
    }
    setPending(true);
    axios.put(
      endpoints.base + endpoints.user + "/password",
      {
        curPassword: password,
        newPassword: newPassword
      },
      {
        headers: {"Authorization": `Bearer ${accessToken}`},
        validateStatus: function(status) {
          return true;
        }
      }
    ).then((res) => {
      setPending(false);
      if(res.status === 200) {
        toast.success("Uspešno ste promenili lozinku!");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        setAccessToken(undefined);
        setRefreshToken(undefined);
        navigate('/prijava');
        return;
      } 
      toast.error("Netačna lozinka!");
    });
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Tabs defaultValue="account" className="w-[400px]"> 
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account" disabled={pending}>Nalog</TabsTrigger>
          <TabsTrigger value="password" disabled={pending}>Lozinka</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Nalog</CardTitle>
              <CardDescription>
                Ovde možete menjati informacije o nalogu.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Ime</Label>
                <Input 
                  id="name" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Prezime</Label>
                <Input 
                  id="username" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={accountSubmit} 
                disabled={pending}>
                  {pending ? <Loader2 className="animate-spin" /> : <span>Sačuvaj</span>}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Lozinka</CardTitle>
              <CardDescription>
                Ovde možete promeniti lozinku. Nakon čuvanja, bićete izlogovani.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Trenutna lozinka</Label>
                <Input 
                  id="current" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">Nova lozinka</Label>
                <Input 
                  id="new" 
                  type="password" 
                  value={newPassword}
                  onChange={(e) =>setNewPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
            <Button 
                onClick={passwordSubmit} 
                disabled={pending}>
                  {pending ? <Loader2 className="animate-spin" /> : <span>Sačuvaj</span>}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    
  );
}
