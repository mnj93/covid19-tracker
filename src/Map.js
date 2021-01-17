import React from 'react'
import { MapContainer as LeafLet, TileLayer } from "react-leaflet";
import './Map.css';
import { showDataOnMap } from './util';

function Map({ countries, casesType, center, zoom }) {
  return (
    <div className="map">
      {
        console.log('center ->>>>>> ', center)
      }
      <LeafLet center={center} zoom={zoom}>
        {console.log("map rendered with ", center, ' and zoom level ', zoom)}
        <TileLayer
         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
         attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {console.log('cases type in map =>>> ', casesType)}
        {showDataOnMap(countries, casesType)}
      </LeafLet>
    </div>
  )
}

export default Map;
