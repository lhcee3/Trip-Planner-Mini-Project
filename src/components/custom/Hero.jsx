import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth'
import { auth } from '@/service/firebaseConfig'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'

const SLIDES = [
  { seed: 'bali-beach-tropical',    city: 'Bali',      country: 'Indonesia' },
  { seed: 'paris-eiffel-tower',     city: 'Paris',     country: 'France'    },
  { seed: 'tokyo-japan-city',       city: 'Tokyo',     country: 'Japan'     },
  { seed: 'santorini-greece-blue',  city: 'Santorini', country: 'Greece'    },
  { seed: 'dubai-skyline-night',    city: 'Dubai',     country: 'UAE'       },
]

const STEPS = [
  { n: '01', label: 'Pick a destination' },
  { n: '02', label: 'Set your preferences' },
  { n: '03', label: 'Get your itinerary' },
]

export default function Hero() {
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const u = {
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email,
          uid: firebaseUser.uid,
          picture: firebaseUser.photoURL || ''
        }
        localStorage.setItem('user', JSON.stringify(u))
        setUser(u)
      } else {
        localStorage.removeItem('user')
        setUser(null)
      }
    })
    return () => unsub()
  }, [])

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      await signInWithPopup(auth, new GoogleAuthProvider())
      toast('Signed in')
      setOpenDialog(false)
    } catch (e) {
      toast(e?.message || 'Sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const t = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setActive(p => (p + 1) % SLIDES.length)
        setFading(false)
      }, 400)
    }, 4500)
    return () => clearInterval(t)
  }, [])

  const slide = SLIDES[active]

  return (
    <div className="bg-[#f8f9fb]">

      {/* ── HERO ── */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">

        {/* Background image */}
        <img
          key={slide.seed}
          src={`https://picsum.photos/seed/${slide.seed}/1600/900`}
          alt={slide.city}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: fading ? 0 : 1 }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* Floating nav */}
        <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center px-5 md:px-20 py-4">
          <a href="/">
            <img src="/logo.svg" alt="Logo" className="h-16 md:h-24 brightness-0 invert drop-shadow-2xl" />
          </a>
          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/my-trips" className="hidden sm:block text-sm text-white font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] hover:text-white/80 transition-colors">My Trips</Link>
            <Link to="/create-trip">
              <button className="text-xs md:text-sm text-white bg-black/60 border border-white/30 px-3 md:px-4 py-1.5 md:py-2 rounded-[10px] hover:bg-black/80 transition-all backdrop-blur-sm">
                + Create Trip
              </button>
            </Link>
            {!user && (
              <button
                onClick={() => setOpenDialog(true)}
                className="text-xs md:text-sm text-white bg-black/60 border border-white/30 px-3 md:px-4 py-1.5 md:py-2 rounded-[10px] hover:bg-black/80 transition-all backdrop-blur-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setFading(true); setTimeout(() => { setActive(i); setFading(false) }, 400) }}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-20 px-5 md:px-20 max-w-5xl mx-auto">

          {/* Location pill */}
          <div
            className="flex items-center gap-2 mb-3 md:mb-4 transition-opacity duration-500"
            style={{ opacity: fading ? 0 : 1 }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-white/50">Now showing</span>
            <span className="text-xs font-bold text-white bg-white/15 border border-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              {slide.city}, {slide.country}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-7xl font-black text-white leading-none tracking-tight mb-3 md:mb-4">
            Your next trip,<br />
            <span className="text-white/40">planned by AI.</span>
          </h1>

          <p className="text-sm md:text-base text-white/60 max-w-md mb-6 md:mb-8 leading-relaxed">
            Tell us where you want to go. We'll handle the hotels, itinerary, and everything in between.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/create-trip">
              <button className="btn-shimmer flex items-center gap-2 bg-white text-gray-900 px-5 md:px-7 py-3 md:py-3.5 rounded-[10px] text-sm font-bold hover:shadow-[0_0_24px_rgba(255,255,255,0.3)] transition-all">
                Start Planning <FiArrowRight size={15} />
              </button>
            </Link>
            <Link to="/my-trips">
              <button className="text-sm text-white/70 hover:text-white border border-white/20 px-5 md:px-6 py-3 md:py-3.5 rounded-[10px] hover:bg-white/10 transition-all">
                View My Trips
              </button>
            </Link>
          </div>
        </div>

        {/* Steps bar — bottom right */}
        <div className="absolute bottom-8 right-8 md:right-20 z-20 hidden md:flex flex-col gap-2">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[10px] font-black text-white/30">{s.n}</span>
              <span className="text-xs text-white/50">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES STRIP ── */}
      <section className="features-border-top bg-white py-7 px-5">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {[
            ['Free to use', 'No credit card required'],
            ['AI-generated', 'Powered by Groq LLaMA'],
            ['Instant results', 'Plan in under a minute'],
          ].map(([title, sub]) => (
            <div key={title} className="group px-4 py-3 rounded-xl hover:-translate-y-1 hover:border-l-[3px] hover:border-l-[#6C47FF] hover:bg-purple-50/40 transition-all">
              <p className="text-sm font-bold text-gray-800 leading-tight">{title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative overflow-hidden py-24 px-5 bg-[#0A0F1E] text-center">
        <div className="blob absolute top-[-60px] left-[-60px] w-[350px] h-[350px] rounded-full"
          style={{ background: 'radial-gradient(circle, #6C47FF 0%, transparent 70%)', opacity: 0.08 }} />
        <div className="blob blob-delay absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)', opacity: 0.08 }} />
        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center gap-5">
          <h2 className="text-3xl font-extrabold text-white leading-tight">Ready to plan your next adventure?</h2>
          <p className="text-sm text-gray-400">Join thousands of travelers using AI to plan smarter trips.</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link to="/create-trip">
              <button className="btn-shimmer bg-white text-gray-900 px-6 py-3 rounded-[10px] text-sm font-semibold hover:shadow-lg transition-all">
                Start Planning
              </button>
            </Link>
            <Link to="/my-trips">
              <button className="border border-white/20 text-white px-6 py-3 rounded-[10px] text-sm font-semibold hover:bg-white/10 transition-all">
                View My Trips
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0A0F1E] border-t border-white/5 px-5 pt-12 pb-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div className="flex flex-col gap-2">
            <img src="/logo.svg" alt="Logo" className="h-16 w-auto brightness-0 invert drop-shadow-2xl" />
            <p className="text-xs text-gray-500 mt-1">AI-powered travel planning</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Navigation</p>
            {[['/', 'Home'], ['/create-trip', 'Create Trip'], ['/my-trips', 'My Trips']].map(([href, label]) => (
              <Link key={href} to={href} className="text-sm text-gray-500 hover:text-white transition-colors">{label}</Link>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Follow</p>
            <div className="flex gap-3">
              {['T', 'In', 'Li'].map((s) => (
                <div key={s} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-xs text-gray-500 hover:border-white/30 hover:text-white transition-all cursor-pointer">
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-5 text-center">
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} AI Travel Planner. All rights reserved.</p>
        </div>
      </footer>

      {/* Sign In Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">Welcome</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-400 text-center -mt-2">Sign in to save and view your trips</p>
          <button
            className="w-full mt-2 flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all disabled:opacity-50"
            disabled={loading}
            onClick={handleGoogleSignIn}
          >
            <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
              <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.3-.2-2.7-.5-4z" fill="#FFC107"/>
              <path d="M6.3 14.7l7 5.1C15.1 16.1 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3c-7.6 0-14.2 4.3-17.7 11.7z" fill="#FF3D00"/>
              <path d="M24 45c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 36.1 27 37 24 37c-6 0-10.6-3.1-11.8-7.5l-7 5.4C8.1 40.8 15.5 45 24 45z" fill="#4CAF50"/>
              <path d="M44.5 20H24v8.5h11.8c-.6 2.8-2.3 5.1-4.7 6.6l6.6 5.4C41.8 37.1 45 31 45 24c0-1.3-.2-2.7-.5-4z" fill="#1976D2"/>
            </svg>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>
        </DialogContent>
      </Dialog>

    </div>
  )
}
