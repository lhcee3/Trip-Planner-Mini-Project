import React from 'react'
import { Link } from 'react-router-dom'
import { FiStar, FiTag, FiClock, FiArrowUpRight } from 'react-icons/fi'

function PlaceCardItem({ place }) {
  const name = place?.place || place?.name || place?.placeName || 'Unknown Place';
  const details = place?.details || place?.description || place?.place_details || '';
  const ticket = place?.ticket_pricing || place?.ticketPricing || place?.ticket_price || '';
  const rating = place?.rating || '';
  const time = place?.time_to_travel || place?.timeToTravel || place?.duration || '';

  return (
    <Link to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`} target='_blank'>
      <div className="group flex gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-all cursor-pointer">
        {/* Icon block instead of image */}
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
          <FiArrowUpRight size={16} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
        </div>
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <h2 className="font-semibold text-sm text-gray-900 leading-tight">{name}</h2>
          {details && <p className="text-xs text-gray-500 leading-relaxed">{details}</p>}
          <div className="flex flex-wrap gap-3 mt-1.5">
            {ticket && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <FiTag size={10} /> {ticket}
              </span>
            )}
            {rating && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <FiStar size={10} /> {rating}
              </span>
            )}
            {time && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <FiClock size={10} /> {time}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PlaceCardItem
