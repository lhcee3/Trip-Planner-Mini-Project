import React from 'react'
import HotelCardItem from './HotelCardItem'

function Hotels({ trip }) {
  const hotels =
    trip?.tripData?.hotel_options ||
    trip?.tripData?.hotels ||
    trip?.tripData?.hotelOptions ||
    [];

  if (!hotels.length) return null;

  return (
    <div className="mt-10">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-5 w-1 bg-gray-900 rounded-full" />
        <h2 className="font-bold text-xl text-gray-900">Hotel Recommendations</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {hotels.map((hotel, index) => (
          <HotelCardItem key={index} hotel={hotel} />
        ))}
      </div>
    </div>
  )
}

export default Hotels
