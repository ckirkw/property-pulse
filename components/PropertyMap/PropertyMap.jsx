"use client";

import React from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

const PropertyMap = (props) => {
  const {
    property: {
      location: { lat, long },
    },
  } = props;

  return (
    <>
      {lat != null && long != null ? (
        <div style={{ height: "400px", width: "100%" }}>
          <MapContainer center={[lat, long]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, long]} />
          </MapContainer>
        </div>
      ) : (
        <p>This property has no location</p>
      )}
    </>
  );
};

export default PropertyMap;
