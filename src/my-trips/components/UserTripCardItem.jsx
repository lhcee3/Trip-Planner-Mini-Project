import React from 'react'
import { Link } from 'react-router-dom'
import { FiCalendar, FiDollarSign, FiTrash2 } from 'react-icons/fi'

const DEST_COLORS = [
  'from-[#134e5e] to-[#71b280]',
  'from-[#373b44] to-[#4286f4]',
  'from-[#c94b4b] to-[#4b134f]',
  'from-[#1a1a2e] to-[#16213e]',
  'from-[#b8860b] to-[#8b4513]',
  'from-[#1e3c72] to-[#2a5298]',
]

function UserTripCardItem({ trip, onDelete }) {
  const label = trip?.userSelection?.location?.label || 'Unknown destination'
  const days = trip?.userSelection?.noOfDays
  const budget = trip?.userSelection?.budget
  const colorIdx = Math.abs(label.charCodeAt(0) + label.charCodeAt(1)) % DEST_COLORS.length

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden">
      {/* Color box instead of image */}
      <Link to={`/view-trip/${trip?.id}`}>
        <div className={`h-[160px] w-full bg-gradient-to-br ${DEST_COLORS[colorIdx]} flex items-end p-4`}>
          <span className="text-white/20 text-6xl font-black leading-none select-none">
            {label.charAt(0)}
          </span>
        </div>
      </Link>

      {/* Delete button */}
      {onDelete && (
        <button
          onClick={(e) => { e.preventDefault(); onDelete(trip?.id); }}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
        >
          <FiTrash2 size={12} className="text-white" />
        </button>
      )}

      <Link to={`/view-trip/${trip?.id}`}>
        <div className="p-4 flex flex-col gap-1">
          <h2 className="font-bold text-sm text-gray-900 leading-tight line-clamp-1">{label}</h2>
          <div className="flex items-center gap-3 mt-1">
            {days && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <FiCalendar size={10} /> {days} {days == 1 ? 'Day' : 'Days'}
              </span>
            )}
            {budget && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <FiDollarSign size={10} /> {budget}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default UserTripCardItem
