import { db } from '@/service/firebaseConfig';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';

function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tripId) GetTripData();
  }, [tripId]);

  const GetTripData = async () => {
    try {
      const docRef = doc(db, 'AITrips', tripId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTrip(docSnap.data());
      } else {
        toast('No trip found');
      }
    } catch (e) {
      toast('Failed to load trip');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
        <div className="text-sm text-gray-400">Loading your trip...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <div className="max-w-4xl mx-auto px-5 py-10">
        <InfoSection trip={trip} />
        <Hotels trip={trip} />
        <PlacesToVisit trip={trip} />
        <Footer />
      </div>
    </div>
  );
}

export default Viewtrip
