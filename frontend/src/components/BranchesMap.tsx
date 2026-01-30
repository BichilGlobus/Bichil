"use client";

import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { Branch } from "@/data/branchesData";
import { useEffect, useRef, useState } from "react";

type Props = {
  branches: Branch[];
  selectedBranch: Branch | null;
  onSelect: (b: Branch) => void;
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

const getCustomMarkerIcon = () => {
  if (typeof window !== 'undefined' && (window as any).google) {
    return {
      url: `data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 320 320' xmlns='http://www.w3.org/2000/svg' fill='none'%3E%3Cdefs%3E%3ClinearGradient id='headGrad2' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23EAF2FF'%3E%3C/stop%3E%3Cstop offset='100%25' stop-color='%2393C5FD'%3E%3C/stop%3E%3C/linearGradient%3E%3Cfilter id='softShadow2' x='-35%25' y='-35%25' width='170%25' height='170%25'%3E%3CfeDropShadow dx='0' dy='6' stdDeviation='10' flood-color='%231E40AF' flood-opacity='0.28'%3E%3C/feDropShadow%3E%3C/filter%3E%3C/defs%3E%3Cg%3E%3CanimateTransform attributeName='transform' type='translate' values='0 0; 0 -6; 0 0' dur='2.4s' repeatCount='indefinite'%3E%3C/animateTransform%3E%3Cellipse cx='160' cy='160' rx='110' ry='100' fill='url(%23headGrad2)' filter='url(%23softShadow2)'%3E%3C/ellipse%3E%3Cellipse cx='160' cy='165' rx='70' ry='52' fill='%23020617'%3E%3C/ellipse%3E%3Cellipse cx='138' cy='160' rx='8' ry='10' fill='%2338BDF8'%3E%3Canimate attributeName='ry' values='10;10;2;10' keyTimes='0;0.6;0.65;1' dur='4s' repeatCount='indefinite'%3E%3C/animate%3E%3C/ellipse%3E%3Cellipse cx='182' cy='160' rx='8' ry='10' fill='%2338BDF8'%3E%3Canimate attributeName='ry' values='10;10;2;10' keyTimes='0;0.6;0.65;1' dur='4s' repeatCount='indefinite'%3E%3C/animate%3E%3C/ellipse%3E%3Cellipse cx='122' cy='178' rx='8' ry='5' fill='%23F472B6' opacity='0.9'%3E%3C/ellipse%3E%3Cellipse cx='198' cy='178' rx='8' ry='5' fill='%23F472B6' opacity='0.9'%3E%3C/ellipse%3E%3Cpath d='M140 176 Q160 192 180 176' stroke='%2338BDF8' stroke-width='4' stroke-linecap='round' fill='none'%3E%3C/path%3E%3C/g%3E%3C/svg%3E`,
      scaledSize: new (window as any).google.maps.Size(40, 40),
      origin: new (window as any).google.maps.Point(0, 0),
      anchor: new (window as any).google.maps.Point(20, 40),
    };
  }
  return undefined;
};

export default function BranchesMap({ branches, selectedBranch, onSelect }: Props) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [activeMarker, setActiveMarker] = useState<Branch | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
  });

  // Fit all branches in view
  useEffect(() => {
    if (!mapReady || branches.length === 0 || !mapRef.current) return;

    // Single branch
    if (branches.length === 1) {
      const b = branches[0];
      if (!b.latitude || !b.longitude) return;

      mapRef.current.setCenter({
        lat: +b.latitude,
        lng: +b.longitude,
      });
      mapRef.current.setZoom(15);
      return;
    }

    // Multiple branches → fit bounds
    const bounds = new google.maps.LatLngBounds();

    branches.forEach((b) => {
      if (b.latitude && b.longitude) {
        bounds.extend({
          lat: +b.latitude,
          lng: +b.longitude,
        });
      }
    });

    mapRef.current.fitBounds(bounds);
  }, [branches, mapReady]);

  // When card is clicked, pan to that branch
  useEffect(() => {
    if (!mapRef.current || !selectedBranch?.latitude || !selectedBranch?.longitude) return;

    mapRef.current.panTo({
      lat: +selectedBranch.latitude,
      lng: +selectedBranch.longitude,
    });
    mapRef.current.setZoom(16);
  }, [selectedBranch]);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 animate-pulse">
        <div className="text-sm text-gray-500">
          Газрын зураг ачааллаж байна…
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      onLoad={(map) => {
        mapRef.current = map;
        window.google.maps.event.trigger(map, "resize");
        setMapReady(true);
      }}
      options={{
        scrollwheel: true,
        gestureHandling: "auto",
      }}
    >
      {branches.map(
        (b) =>
          b.latitude &&
          b.longitude && (
            <Marker
              key={b.branch_id}
              position={{ lat: +b.latitude, lng: +b.longitude }}
              onClick={() => {
                setActiveMarker(b);
                onSelect(b);
              }}
              title={b.branch_name}
              icon={getCustomMarkerIcon()}
            />
          )
      )}

      {activeMarker?.latitude && activeMarker.longitude && (
        <InfoWindow
          position={{
            lat: +activeMarker.latitude,
            lng: +activeMarker.longitude,
          }}
          onCloseClick={() => setActiveMarker(null)}
        >
          <div className="min-w-[250px] text-sm p-2">
            {activeMarker.image && (
              <img
                src={activeMarker.image}
                alt={activeMarker.branch_name}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
            )}
            
            <h3 className="font-semibold text-gray-900 mb-1">
              {activeMarker.branch_name}
            </h3>

            {activeMarker.address && (
              <p className="text-gray-600 mb-2 text-xs">
                {activeMarker.address}
              </p>
            )}

            {activeMarker.phone_numbers?.[0] && (
              <p className="text-gray-700 mb-2 text-xs">
                 {activeMarker.phone_numbers[0]}
              </p>
            )}

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${activeMarker.latitude},${activeMarker.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-teal-600 font-medium hover:underline text-xs"
            >
              Чиглэл авах →
            </a>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
