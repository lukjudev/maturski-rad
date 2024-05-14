import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Link } from 'react-router-dom'

export default function ListingPreviewHorizontal(props) {
  return (
      <Card className="min-w-full mx-auto hover:scale-105 transition-all">
        <Link to={"/prenociste/" + props.data.id}>
          <CardContent className="flex py-6">
              <img src={props.data.image} className="w-[100px] h-[100px]"/>
              <div className="px-5">
                  <h1 className="font-bold select-none">{props.data.title}</h1>
                  <p className="max-h-[70px] overflow-hidden select-none">{props.data.description}</p>
              </div>
          </CardContent>
        </Link>
      </Card>
  )
}
