import React, { useContext, useState } from 'react'
import { Button } from './button'
import { Telescope, Search, Menu, User, Bed, BedDouble, CalendarClock, LogOut, TentTree} from 'lucide-react';
import { Input } from './input';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Cookies from 'js-cookie';
import CountrySelect from './CountrySelect';

import { Context } from '@/App';
import { toast } from 'react-toastify';

export default function Header() {
    const navigate = useNavigate();
    const [accessToken, setAccessToken, refreshToken, setRefreshToken, country, setCountry] = useContext(Context);
    const pathname = useLocation().pathname;

    const signOut = () => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        setAccessToken(undefined);
        setRefreshToken(undefined);
        toast.success("Uspešno ste se odjavili.");
        navigate("/prijava");
    }

    return (
        <div className="mb-3">
            <header className="flex justify-between">
                <Link to="/" className="flex items-center gap-1">
                    <TentTree />
                    <p className="hidden md:block font-bold text-xl">TravelMate</p>
                </Link>
                <CountrySelect country={country} changeCountry={(value) => {
                    setCountry(value);
                    if(pathname !== "/") {
                        navigate("/");
                    }
                }}/>
                <DropdownMenu align="start">    
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon"><Menu /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Moj nalog</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                        <DropdownMenuItem onSelect={() => { navigate("/profil") }}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profil</span>
                        </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                            <BedDouble className="mr-2 h-4 w-4" />
                            <span>Prenoćišta</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onSelect={() => { navigate('/prenocista') }}>
                                    <Bed className="mr-2 h-4 w-4" />
                                    <span>Moja prenoćišta</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => { navigate('/rezervacije') }}>
                                    <CalendarClock className="mr-2 h-4 w-4" />
                                    <span>Moje rezervacije</span>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={signOut}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Odjava</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>
        </div>
    );
}
