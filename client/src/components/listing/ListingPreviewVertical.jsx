import React from 'react'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link } from 'react-router-dom';

export default function ListingPreviewVertical({image, title, id}) {
    function shortenText(text, length) {
        if(text.length > length) {
            return (text.slice(0, length - 3) + '...')
        }
        return text;
    }

    return (
        <Link to={`/prenociste/${id}`}>
            <Card className="mx-auto max-w-sm max-h-[24rem] mt-6 md:mt-0 overflow-hidden">
                <CardHeader>
                <div className="aspect-square max-w">
                    <img src={image}  className="w-[100%] object-fill"/>
                </div>
                </CardHeader>
                <CardContent>
                    <p className="select-none">{shortenText(title, 64)}</p>
                </CardContent>
            </Card>
        </Link>

    )
}
