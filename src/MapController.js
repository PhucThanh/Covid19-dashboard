import React from "react";
import { useMap } from "react-leaflet";
function MapController({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default MapController;
