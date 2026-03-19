import React from 'react'
import { Link } from 'react-router-dom'
import { FiMapPin, FiStar, FiExternalLink } from 'react-icons/fi'

function HotelCardItem({ hotel }) {
  const name = hotel?.name || hotel?.hotel_name || '';
  const address = hotel?.address || hotel?.hotel_address || '';
  const price = hotel?.price || hotel?.price_per_night || '';
  const rating = hotel?.rating || '';
  const desc = hotel?.description || hotel?.descriptions || '';
  const url = hotel?.booking_url ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + address)}`;

  return (
    <Link to={url} target='_blank'>
      <div className="group rounded-xl border border-gray-100 bg-white hover:shadow-md transition-all cursor-pointer h-full flex flex-col overflow-hidden">
        {/* Color band instead of image */}
        <div className="h-2 bg-gray-900 w-full" />
        <div className="p-4 flex flex-col gap-1 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-semibold text-sm text-gray-900 leading-tight">{name}</h2>
            <FiExternalLink size={12} className="text-gray-300 shrink-0 mt-0.5 group-hover:text-gray-500 transition-colors" />
          </div>
          {address && (
            <p className="text-xs text-gray-400 flex items-start gap-1 mt-1">
              <FiMapPin size={10} className="mt-0.5 shrink-0" />
              <span className="line-clamp-2">{address}</span>
            </p>
          )}
          {desc && <p className="text-xs text-gray-500 line-clamp-2 mt-2">{desc}</p>}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
            {price && (
              <span className="text-sm font-bold text-gray-900">
                {price}
                <span className="text-xs font-normal text-gray-400"> /night</span>
              </span>
            )}
            {rating && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <FiStar size={10} /> {rating}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default HotelCardItem
