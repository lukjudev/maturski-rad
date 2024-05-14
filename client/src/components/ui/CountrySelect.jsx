import React from 'react'
import { Select, SelectTrigger, SelectValue, SelectGroup, SelectItem, SelectContent, SelectLabel } from '@/components/ui/select'

export const countriesMap = [
  { "value": "Australija", "code": "AU" },
  { "value": "Austrija", "code": "AT" },
  { "value": "Belgija", "code": "BE" },
  { "value": "Brazil", "code": "BR" },
  { "value": "Bugarska", "code": "BG" },
  { "value": "Kanada", "code": "CA" },
  { "value": "Hrvatska", "code": "HR" },
  { "value": "Kipar", "code": "CY" },
  { "value": "Češka Republika", "code": "CZ" },
  { "value": "Danska", "code": "DK" },
  { "value": "Estonija", "code": "EE" },
  { "value": "Finska", "code": "FI" },
  { "value": "Francuska", "code": "FR" },
  { "value": "Nemačka", "code": "DE" },
  { "value": "Gibraltar", "code": "GI" },
  { "value": "Grčka", "code": "GR" },
  { "value": "Hong Kong", "code": "HK" },
  { "value": "Mađarska", "code": "HU" },
  { "value": "Indija", "code": "IN" },
  { "value": "Indonezija", "code": "ID" },
  { "value": "Irska", "code": "IE" },
  { "value": "Italija", "code": "IT" },
  { "value": "Japan", "code": "JP" },
  { "value": "Letonija", "code": "LV" },
  { "value": "Lihtenštajn", "code": "LI" },
  { "value": "Litvanija", "code": "LT" },
  { "value": "Luksemburg", "code": "LU" },
  { "value": "Malezija", "code": "MY" },
  { "value": "Malta", "code": "MT" },
  { "value": "Meksiko", "code": "MX" },
  { "value": "Holandija", "code": "NL" },
  { "value": "Novi Zeland", "code": "NZ" },
  { "value": "Norveška", "code": "NO" },
  { "value": "Poljska", "code": "PL" },
  { "value": "Portugal", "code": "PT" },
  { "value": "Rumunija", "code": "RO" },
  { "value": "Singapur", "code": "SG" },
  { "value": "Slovačka", "code": "SK" },
  { "value": "Slovenija", "code": "SI" },
  { "value": "Srbija", "code": "RS" },
  { "value": "Španija", "code": "ES" },
  { "value": "Švedska", "code": "SE" },
  { "value": "Švajcarska", "code": "CH" },
  { "value": "Tajland", "code": "TH" },
  { "value": "Ujedinjeni Arapski Emirati", "code": "AE" },
  { "value": "Ujedinjeno Kraljevstvo", "code": "GB" },
  { "value": "Sjedinjene Američke Države", "code": "US" }
];

export default function CountrySelect(props) {
  return (
    <Select value={props.country} onValueChange={(value) => {
      props.changeCountry(value);
    }}>
        <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Izaberite državu" />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
            <SelectLabel>Izaberite državu</SelectLabel>
                {
                    countriesMap.map((country) => {
                        return <SelectItem value={country.code} key={country.code}>{country.value}</SelectItem>
                    }) 
                }
            </SelectGroup>
        </SelectContent>
    </Select>
  );
}
