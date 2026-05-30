import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Property } from '../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom colored markers for different sources
const createCustomIcon = (source: Property['source'], isSelected: boolean) => {
  let color = '#38bdf8'; // Default Blue
  if (source === 'Zillow') color = '#3b82f6';
  if (source === 'Realtor.com') color = '#ef4444';
  if (source === 'Redfin') color = '#10b981';
  if (isSelected) color = '#9E7FFF'; // Selected Purple

  const svgHtml = `
    <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-center;">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 0C10.268 0 4 6.268 4 14C4 24.5 18 36 18 36C18 36 32 24.5 32 14C32 6.268 25.732 0 18 0Z" fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="18" cy="14" r="6" fill="white"/>
      </svg>
      ${isSelected ? '<div style="position: absolute; top: -4px; right: -4px; width: 10px; height: 10px; background-color: #f472b6; border-radius: 50%; border: 1.5px solid white; animation: ping 1.5s infinite;"></div>' : ''}
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-marker-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

// Component to handle map centering and zooming dynamically
interface MapControllerProps {
  center: [number, number];
  zoom: number;
}

const MapController: React.FC<MapControllerProps> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, {
      animate: true,
      duration: 1.5
    });
  }, [center, zoom, map]);
  return null;
};

interface InteractiveMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  mapCenter: [number, number];
  mapZoom: number;
  theme: 'light' | 'dark';
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  mapCenter,
  mapZoom,
  theme
}) => {
  // Choose map tile style based on theme
  const tileUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  const attribution = theme === 'dark'
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#2F2F2F] shadow-inner">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution={attribution}
          url={tileUrl}
        />
        
        <MapController center={mapCenter} zoom={mapZoom} />

        {properties.map((property) => {
          const isSelected = selectedProperty?.id === property.id;
          return (
            <Marker
              key={property.id}
              position={[property.latitude, property.longitude]}
              icon={createCustomIcon(property.source, isSelected)}
              eventHandlers={{
                click: () => onSelectProperty(property)
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 text-neutral-900 dark:text-white max-w-[220px]">
                  <img 
                    src={property.imageUrl} 
                    alt={property.title} 
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <div className="flex justify-between items-start gap-1 mb-1">
                    <h4 className="font-bold text-sm line-clamp-1">{property.title}</h4>
                    <span className="text-[10px] bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded shrink-0">
                      {property.source}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 line-clamp-1">
                    {property.address}
                  </p>
                  <p className="text-sm font-extrabold text-[#9E7FFF]">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0
                    }).format(property.price)}
                  </p>
                  <div className="flex gap-2 mt-2 text-[10px] text-neutral-500 dark:text-neutral-400 border-t border-neutral-200 dark:border-neutral-800 pt-1.5">
                    <span>{property.beds}bds</span>
                    <span>{property.baths}ba</span>
                    <span>{property.sqft}sqft</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-[#1E1E1E]/90 backdrop-blur-md border border-[#2F2F2F] rounded-xl p-3 text-xs text-white shadow-lg">
        <p className="font-semibold mb-2 text-neutral-300">Data Sources</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#3b82f6] border border-white/20" />
            <span>Zillow</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ef4444] border border-white/20" />
            <span>Realtor.com</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#10b981] border border-white/20" />
            <span>Redfin</span>
          </div>
          <div className="flex items-center gap-2 border-t border-[#2F2F2F] pt-1.5 mt-1.5">
            <span className="w-3 h-3 rounded-full bg-[#9E7FFF] border border-white/20" />
            <span className="font-medium text-[#9E7FFF]">Selected</span>
          </div>
        </div>
      </div>
    </div>
  );
};
