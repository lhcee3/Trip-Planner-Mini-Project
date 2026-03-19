import React from 'react'
import { FiCalendar, FiDollarSign, FiUsers } from 'react-icons/fi'

function InfoSection({ trip }) {
  const sel = trip?.userSelection;
  const destination = sel?.location?.label || trip?.tripData?.destination || '';

  return (
    <div>
      <div className="relative h-[320px] w-full rounded-2xl overflow-hidden flex flex-col justify-end p-7">
        <img
          src={`https://picsum.photos/seed/${encodeURIComponent(destination)}/1200/500`}
          alt={destination}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <h1 className="text-3xl font-bold text-white tracking-tight relative z-10">{destination}</h1>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="flex items-center gap-1.5 bg-white/10 text-white text-xs px-3 py-1.5 rounded-full border border-white/20">
            <FiCalendar size={11} /> {sel?.noOfDays} {sel?.noOfDays == 1 ? 'Day' : 'Days'}
          </span>
          <span className="flex items-center gap-1.5 bg-white/10 text-white text-xs px-3 py-1.5 rounded-full border border-white/20">
            <FiDollarSign size={11} /> {sel?.budget}
          </span>
          <span className="flex items-center gap-1.5 bg-white/10 text-white text-xs px-3 py-1.5 rounded-full border border-white/20">
            <FiUsers size={11} /> {sel?.traveler}
          </span>
        </div>
      </div>

      {trip?.tripData?.overview && (
        <div className="mt-5 p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-700 leading-relaxed">{trip.tripData.overview}</p>
          {trip?.tripData?.tips?.length > 0 && (
            <ul className="mt-4 flex flex-col gap-2">
              {trip.tripData.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default InfoSection
