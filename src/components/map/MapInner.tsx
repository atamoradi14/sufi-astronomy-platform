"use client";

import { useEffect } from "react";
import {
  CircleMarker,
  MapContainer,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  lat: number;
  lon: number;
  heading: number | null;
  layer: "street" | "satellite";
  showQibla: boolean;
  showCircles: boolean;
  qiblaPath: Array<[number, number]>;
  circles: Array<{ r: number; pts: Array<[number, number]> }>;
  kaaba: { lat: number; lon: number };
};

function Recenter({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], map.getZoom(), { animate: true });
  }, [lat, lon, map]);
  return null;
}

export default function MapInner({
  lat,
  lon,
  heading,
  layer,
  showQibla,
  showCircles,
  qiblaPath,
  circles,
  kaaba,
}: Props) {
  const street =
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const satellite =
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

  const headingLine: Array<[number, number]> | null =
    heading != null
      ? [
          [lat, lon],
          destinationApprox(lat, lon, heading, 0.15),
        ]
      : null;

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={5}
      className="h-[420px] w-full z-0"
      scrollWheelZoom
    >
      <TileLayer
        key={layer}
        attribution={
          layer === "satellite"
            ? "Tiles © Esri"
            : "&copy; OpenStreetMap"
        }
        url={layer === "satellite" ? satellite : street}
        maxZoom={19}
      />
      <Recenter lat={lat} lon={lon} />

      {showQibla && (
        <Polyline
          positions={qiblaPath}
          pathOptions={{ color: "#c9a227", weight: 2.5, opacity: 0.9 }}
        />
      )}

      {showCircles &&
        circles.map((c) => (
          <Polyline
            key={c.r}
            positions={c.pts}
            pathOptions={{
              color: "#3d7a7a",
              weight: 1.5,
              opacity: 0.75,
              dashArray: "6 8",
            }}
          >
            <Tooltip sticky>{`${c.r} کیلومتر`}</Tooltip>
          </Polyline>
        ))}

      {headingLine && (
        <Polyline
          positions={headingLine}
          pathOptions={{ color: "#e8e2d4", weight: 3, opacity: 0.85 }}
        />
      )}

      <CircleMarker
        center={[lat, lon]}
        radius={8}
        pathOptions={{
          color: "#e6d39a",
          fillColor: "#c9a227",
          fillOpacity: 1,
          weight: 2,
        }}
      >
        <Tooltip direction="top">موقعیت شما</Tooltip>
      </CircleMarker>

      <CircleMarker
        center={[kaaba.lat, kaaba.lon]}
        radius={7}
        pathOptions={{
          color: "#8b4557",
          fillColor: "#c45c5c",
          fillOpacity: 1,
          weight: 2,
        }}
      >
        <Tooltip direction="top">کعبه</Tooltip>
      </CircleMarker>
    </MapContainer>
  );
}

function destinationApprox(
  lat: number,
  lon: number,
  bearing: number,
  degDistance: number,
): [number, number] {
  const rad = (bearing * Math.PI) / 180;
  const dLat = degDistance * Math.cos(rad);
  const dLon =
    (degDistance * Math.sin(rad)) /
    Math.max(0.2, Math.cos((lat * Math.PI) / 180));
  return [lat + dLat, lon + dLon];
}
