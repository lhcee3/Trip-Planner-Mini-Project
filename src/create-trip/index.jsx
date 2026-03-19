import { Input } from '@/components/ui/input';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelList } from '@/constants/options';
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner';
import { chatSession } from '@/service/AIModel';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/service/firebaseConfig';
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import { FiMapPin, FiCalendar, FiUsers, FiDollarSign, FiX, FiArrowRight } from 'react-icons/fi';

const parseTripJson = (rawText) => {
  const match = rawText.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (!match) throw new Error('No JSON found in AI response');
  return JSON.parse(match[0]);
};

const POPULAR_DESTINATIONS = [
  'Paris, France', 'Tokyo, Japan', 'New York, USA',
  'Bali, Indonesia', 'London, UK', 'Dubai, UAE',
];

function CreateTrip() {
  const [formData, setFormData] = useState({});
  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAuthDialog, setOpenAuthDialog] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));

  useEffect(() => {
    const handler = setTimeout(() => {
      if (locationInput.length > 2) searchPlaces(locationInput);
      else setSuggestions([]);
    }, 500);
    return () => clearTimeout(handler);
  }, [locationInput]);

  const searchPlaces = async (query) => {
    try {
      const res = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: query, format: 'json', limit: 5 },
      });
      setSuggestions(res.data || []);
    } catch (e) { console.error(e); }
  };

  const selectLocation = (label, lat, lon) => {
    setLocationInput(label);
    setSuggestions([]);
    handleInputChange('location', { label, lat, lon });
  };

  const validateForm = () => {
    if (!formData?.location || !formData?.budget || !formData?.traveler || !formData?.noOfDays) {
      toast('Please fill in all details'); return false;
    }
    if (Number(formData?.noOfDays) > 5) { toast('Max 5 days per trip'); return false; }
    return true;
  };

  const onGenerateTrip = async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user?.email) { setOpenAuthDialog(true); return; }
    if (!validateForm()) return;
    try {
      setLoading(true);
      const finalPrompt = AI_PROMPT
        .replace('{location}', formData.location.label)
        .replace('{totalDays}', formData.noOfDays)
        .replace('{traveler}', formData.traveler)
        .replace('{budget}', formData.budget)
        .replace('{budget}', formData.budget)
        .replace('{totalDays}', formData.noOfDays);
      const result = await chatSession.sendMessage(finalPrompt);
      const text = result?.response?.text();
      if (!text) { toast('Could not generate trip, try again'); return; }
      await saveAiTrip(text, user.email);
    } catch (e) {
      console.error(e); toast('Failed to generate trip. Please try again.');
    } finally { setLoading(false); }
  };

  const saveAiTrip = async (tripDataText, userEmail) => {
    const docId = Date.now().toString();
    const tripData = parseTripJson(tripDataText);
    console.log('[saveAiTrip] Saving...', docId);
    await setDoc(doc(db, 'AITrips', docId), { userSelection: formData, tripData, userEmail, id: docId });
    console.log('[saveAiTrip] Done, navigating...');
    navigate('/view-trip/' + docId);
  };

  const handleAuth = async () => {
    try {
      setAuthLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast('Signed in');
      setOpenAuthDialog(false);
    } catch (e) {
      toast(e?.message || 'Sign-in failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const completedSteps = [formData?.location, formData?.noOfDays, formData?.budget, formData?.traveler].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#f8f9fb]">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Plan a Trip</h1>
          <p className="text-sm text-gray-400 mt-0.5">Fill in your preferences and we'll generate a full itinerary.</p>
          <div className="flex gap-1.5 mt-4">
            {[1,2,3,4].map(s => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${s <= completedSteps ? 'bg-gray-900' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8 flex flex-col gap-6">

        {/* Destination */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiMapPin className="text-gray-400" size={16} />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Destination</span>
          </div>
          <div className="relative">
            <Input
              placeholder="Search city or country..."
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              className="h-11 text-sm border-gray-200 focus:border-gray-400"
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg overflow-hidden">
                {suggestions.map((s) => (
                  <li
                    key={s.place_id}
                    onClick={() => selectLocation(s.display_name, s.lat, s.lon)}
                    className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 flex items-center gap-2"
                  >
                    <FiMapPin size={12} className="text-gray-300 shrink-0" />
                    <span className="truncate">{s.display_name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {formData?.location ? (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
              <FiMapPin size={13} className="text-gray-400 shrink-0" />
              <span className="truncate flex-1">{formData.location.label}</span>
              <button onClick={() => { setLocationInput(''); handleInputChange('location', null); }}>
                <FiX size={14} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-2">Suggestions</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_DESTINATIONS.map((dest) => (
                  <button
                    key={dest}
                    onClick={() => selectLocation(dest, null, null)}
                    className="px-3 py-1.5 rounded-full border border-gray-200 text-xs text-gray-500 hover:border-gray-400 hover:text-gray-800 transition-all"
                  >
                    {dest}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Duration */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiCalendar className="text-gray-400" size={16} />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Duration</span>
          </div>
          <div className="flex gap-2">
            {[1,2,3,4,5].map((d) => (
              <button
                key={d}
                onClick={() => handleInputChange('noOfDays', String(d))}
                className={`flex-1 py-3 rounded-lg border text-sm font-semibold transition-all flex flex-col items-center gap-0.5 ${
                  formData?.noOfDays == d
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 text-gray-500 hover:border-gray-400'
                }`}
              >
                <span className="text-base font-bold">{d}</span>
                <span className={`text-[10px] font-normal ${formData?.noOfDays == d ? 'text-gray-300' : 'text-gray-400'}`}>
                  {d === 1 ? 'Day' : 'Days'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiDollarSign className="text-gray-400" size={16} />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Budget</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {SelectBudgetOptions.map((item) => (
              <button
                key={item.title}
                onClick={() => handleInputChange('budget', item.title)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  formData?.budget === item.title
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <div className={`text-xs font-bold uppercase tracking-wide mb-1 ${formData?.budget === item.title ? 'text-gray-300' : 'text-gray-400'}`}>{item.title}</div>
                <div className={`text-sm ${formData?.budget === item.title ? 'text-white' : 'text-gray-700'}`}>{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Travelers */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiUsers className="text-gray-400" size={16} />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Travelers</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {SelectTravelList.map((item) => (
              <button
                key={item.people}
                onClick={() => handleInputChange('traveler', item.people)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  formData?.traveler === item.people
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <div className={`text-sm font-semibold mb-0.5 ${formData?.traveler === item.people ? 'text-white' : 'text-gray-800'}`}>{item.title}</div>
                <div className={`text-xs ${formData?.traveler === item.people ? 'text-gray-300' : 'text-gray-400'}`}>{item.people}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate */}
        <button
          disabled={loading}
          onClick={onGenerateTrip}
          className={`w-full py-4 rounded-xl font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all ${
            loading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.99]'
          }`}
        >
          {loading ? (
            <><AiOutlineLoading3Quarters className="animate-spin" /> Generating itinerary...</>
          ) : (
            <>Generate Itinerary <FiArrowRight size={15} /></>
          )}
        </button>

      </div>

      <Dialog open={openAuthDialog} onOpenChange={setOpenAuthDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">Sign in to continue</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-400 text-center -mt-2">You need an account to save your trip</p>
          <Button className="w-full mt-2 flex items-center gap-2" disabled={authLoading} onClick={handleAuth}>
            <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
              <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.3-.2-2.7-.5-4z" fill="#FFC107"/>
              <path d="M6.3 14.7l7 5.1C15.1 16.1 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3c-7.6 0-14.2 4.3-17.7 11.7z" fill="#FF3D00"/>
              <path d="M24 45c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 36.1 27 37 24 37c-6 0-10.6-3.1-11.8-7.5l-7 5.4C8.1 40.8 15.5 45 24 45z" fill="#4CAF50"/>
              <path d="M44.5 20H24v8.5h11.8c-.6 2.8-2.3 5.1-4.7 6.6l6.6 5.4C41.8 37.1 45 31 45 24c0-1.3-.2-2.7-.5-4z" fill="#1976D2"/>
            </svg>
            {authLoading ? 'Signing in...' : 'Continue with Google'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
