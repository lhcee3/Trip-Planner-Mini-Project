import React from 'react'
import PlaceCardItem from './PlaceCardItem'

function PlacesToVisit({ trip }) {
  const itinerary =
    trip?.tripData?.itinerary ||
    trip?.tripData?.daily_itinerary ||
    trip?.tripData?.dailyItinerary ||
    [];

  if (!itinerary.length) return null;

  return (
    <div className="mt-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-5 w-1 bg-gray-900 rounded-full" />
        <h2 className="font-bold text-xl text-gray-900">Day-by-Day Itinerary</h2>
      </div>

      <div className="flex flex-col gap-10">
        {itinerary.map((item, index) => {
          const places = item.plan || item.places || item.activities || [];
          return (
            <div key={index}>
              {/* Day header */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-gray-900 text-white text-sm font-bold flex items-center justify-center shrink-0">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{item.day || `Day ${index + 1}`}{item.theme ? ` — ${item.theme}` : ''}</h3>
                </div>
              </div>

              {/* Day summary */}
              {item.summary && (
                <p className="ml-12 text-sm text-gray-500 mb-4 leading-relaxed">{item.summary}</p>
              )}

              {/* Places */}
              <div className="ml-2 md:ml-4 pl-6 md:pl-8 border-l-2 border-gray-100 flex flex-col gap-4">
                {places.map((place, i) => (
                  <div key={i}>
                    {(place.time || place.best_time) && (
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                        {place.time || place.best_time}
                      </p>
                    )}
                    <PlaceCardItem place={place} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default PlacesToVisit
