import React from 'react';
import { Property } from '../types';
import { Home, MapPin, BedDouble, Bath, Maximize, ExternalLink, Phone, User } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  isSelected?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect, isSelected }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getSourceBadgeColor = (source: Property['source']) => {
    switch (source) {
      case 'Zillow': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Realtor.com': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Redfin': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  return (
    <div 
      onClick={() => onSelect(property)}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer ${
        isSelected 
          ? 'border-[#9E7FFF] bg-[#262626] shadow-lg shadow-[#9E7FFF]/10 ring-1 ring-[#9E7FFF]' 
          : 'border-[#2F2F2F] bg-[#1E1E1E] hover:border-[#38bdf8]/50 hover:shadow-md hover:shadow-[#38bdf8]/5'
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={property.imageUrl} 
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium backdrop-blur-md ${getSourceBadgeColor(property.source)}`}>
            {property.source}
          </span>
          <span className="rounded-full bg-black/40 border border-white/10 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-md">
            {property.status}
          </span>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 left-3">
          <p className="text-xl font-bold text-white drop-shadow-md">
            {formatPrice(property.price)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white line-clamp-1 group-hover:text-[#38bdf8] transition-colors">
            {property.title}
          </h3>
          <span className="shrink-0 rounded bg-[#2F2F2F] px-1.5 py-0.5 text-[10px] font-medium text-neutral-400">
            {property.type}
          </span>
        </div>

        <div className="mb-4 flex items-center gap-1 text-xs text-neutral-400">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#38bdf8]" />
          <span className="line-clamp-1">{property.address}, {property.city}</span>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#171717] p-2.5 text-center text-xs text-neutral-300 border border-[#2F2F2F] mb-4">
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1 text-neutral-400">
              <BedDouble className="h-3.5 w-3.5 text-[#9E7FFF]" />
              <span className="font-medium text-white">{property.beds}</span>
            </div>
            <span className="text-[10px] text-neutral-500">Beds</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 border-x border-[#2F2F2F]">
            <div className="flex items-center gap-1 text-neutral-400">
              <Bath className="h-3.5 w-3.5 text-[#38bdf8]" />
              <span className="font-medium text-white">{property.baths}</span>
            </div>
            <span className="text-[10px] text-neutral-500">Baths</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1 text-neutral-400">
              <Maximize className="h-3.5 w-3.5 text-[#f472b6]" />
              <span className="font-medium text-white">{property.sqft.toLocaleString()}</span>
            </div>
            <span className="text-[10px] text-neutral-500">Sq Ft</span>
          </div>
        </div>

        {/* Realtor Info */}
        <div className="mt-auto pt-3 border-t border-[#2F2F2F] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-[#9E7FFF] to-[#38bdf8] flex items-center justify-center text-white font-bold text-[10px]">
              {property.realtorName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="font-medium text-white line-clamp-1">{property.realtorName}</p>
              <p className="text-[10px] text-neutral-500">Listing Agent</p>
            </div>
          </div>
          <a 
            href={`tel:${property.realtorPhone}`}
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg bg-[#2F2F2F] hover:bg-[#38bdf8]/20 hover:text-[#38bdf8] text-neutral-400 transition-colors"
            title="Call Realtor"
          >
            <Phone className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
