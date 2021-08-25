import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "./Map.css";
import MapController from "./MapController";
import { showDataOnMap } from "./util";
function Map({ countries, center, zoom, casesType }) {
  return (
    <div className="map">
      <MapContainer
        minZoom={1.5}
        maxBounds={[
          [90, -180],
          [-90, 180],
        ]}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
        />
        <MapController center={center} zoom={zoom} />
        {showDataOnMap(countries, casesType)}
      </MapContainer>
    </div>
  );
}

export default Map;
