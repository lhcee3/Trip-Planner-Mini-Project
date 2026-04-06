import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth } from '@/service/firebaseConfig'
import { toast } from 'sonner'

function Header() {
  const googleProvider = new GoogleAuthProvider();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const nextUser = {
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email,
          uid: firebaseUser.uid,
          picture: firebaseUser.photoURL || ''
        }
        localStorage.setItem('user', JSON.stringify(nextUser));
        setUser(nextUser);
        return;
      }
      localStorage.removeItem('user');
      setUser(null);
    });
    return () => unsub();
  }, [])

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      toast('Signed in');
      setOpenDialog(false);
    } catch (e) {
      toast(e?.message || 'Sign-in failed');
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  }

  return (
    <div className="sticky top-0 z-50 flex justify-between items-center px-4 md:px-6 py-3"
      style={{
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
      }}>
      <a href="/">
        <img src="/logo.svg" alt="Logo" className="h-12 md:h-16 drop-shadow-lg" />
      </a>
      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <a href="/create-trip">
              <Button variant="outline" className="rounded-full text-sm hover:shadow-[0_0_14px_rgba(108,71,255,0.35)] hover:border-[#6C47FF] transition-all">
                + Create Trip
              </Button>
            </a>
            <a href="/my-trips">
              <span className="nav-link text-sm text-gray-600 hover:text-gray-900 font-medium pb-0.5">My Trips</span>
            </a>
            <Popover>
              <PopoverTrigger>
                {user?.picture ? (
                  <img src={user.picture} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold">
                    {user?.email?.slice(0, 2)?.toUpperCase() || 'U'}
                  </div>
                )}
              </PopoverTrigger>
              <PopoverContent className="w-32 p-2">
                <button onClick={handleLogout} className="w-full text-left text-sm text-gray-700 hover:text-gray-900 px-2 py-1.5 rounded hover:bg-gray-50">
                  Sign out
                </button>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setOpenDialog(true)} className="text-sm">Sign In</Button>
        )}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">Welcome back</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-400 text-center -mt-2">Sign in to save and view your trips</p>
          <Button
            className="w-full mt-2 flex items-center gap-2"
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
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Header
