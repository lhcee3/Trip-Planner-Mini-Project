import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/service/firebaseConfig'
import UserTripCardItem from './components/UserTripCardItem'
import { toast } from 'sonner'
import { FiPlus } from 'react-icons/fi'

function MyTrips() {
  const navigate = useNavigate()
  const [userTrips, setUserTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { GetUserTrips() }, [])

  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user?.email) {
      toast('Please sign in to view your trips')
      navigate('/')
      return
    }
    try {
      const q = query(collection(db, 'AITrips'), where('userEmail', '==', user.email))
      const snapshot = await getDocs(q)
      const trips = []
      snapshot.forEach((d) => trips.push(d.data()))
      setUserTrips(trips)
    } catch (e) {
      toast('Failed to load trips')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (tripId) => {
    if (!tripId) return
    try {
      await deleteDoc(doc(db, 'AITrips', tripId))
      setUserTrips(prev => prev.filter(t => t.id !== tripId))
      toast('Trip deleted')
    } catch (e) {
      toast('Failed to delete trip')
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <div className="max-w-4xl mx-auto px-5 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Trips</h1>
          <button
            onClick={() => navigate('/create-trip')}
            className="flex items-center gap-1.5 bg-gray-900 text-white text-sm px-4 py-2 rounded-[10px] hover:bg-gray-800 transition-all"
          >
            <FiPlus size={14} /> New Trip
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[220px] rounded-2xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : userTrips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
              <FiPlus size={24} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-400">No trips yet. Start planning your first one.</p>
            <button
              onClick={() => navigate('/create-trip')}
              className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-[10px] hover:bg-gray-800 transition-all"
            >
              Create a Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {userTrips.map((trip, i) => (
              <UserTripCardItem key={i} trip={trip} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyTrips
