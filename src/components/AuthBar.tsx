import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Language, Building } from '../types';
import { BUILDINGS_DATA } from '../data/buildings';
import { LogIn, LogOut, Bookmark, Heart, User, Sparkles, X, ChevronRight, AlertCircle } from 'lucide-react';

interface AuthBarProps {
  lang: Language;
  onOpenBuilding?: (building: Building) => void;
}

export const AuthBar: React.FC<AuthBarProps> = ({ lang, onOpenBuilding }) => {
  const { user, loading, favorites, signInWithGoogle, signInAsGuest, logout, error, clearError } = useAuth();
  const [showModal, setShowModal] = useState<boolean>(false);

  // Map favorite IDs to full building data
  const favoritedBuildings = BUILDINGS_DATA.filter((b) =>
    favorites.some((fav) => fav.buildingId === b.id)
  );

  return (
    <>
      <div className="flex items-center gap-2">
        {error && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-700/80 text-[11px] text-amber-200 shadow-sm animate-fade-in">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span className="truncate max-w-[180px]">{error}</span>
            <button onClick={clearError} className="hover:text-white ml-1 text-amber-400 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {loading ? (
          <div className="w-8 h-8 rounded-xl bg-slate-800 animate-pulse" />
        ) : user ? (
          <div className="flex items-center gap-1.5">
            {/* Quick Favorites count button */}
            <button
              id="user-favorites-btn"
              onClick={() => setShowModal(true)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-1.5"
              title={lang === 'en' ? 'View Saved Conic Structures' : 'सहेजी गई संरचनाएं देखें'}
            >
              <Heart className={`w-3.5 h-3.5 text-rose-400 ${favorites.length > 0 ? 'fill-current' : ''}`} />
              <span className="font-mono text-[11px]">{favorites.length}</span>
              <span className="hidden md:inline text-[11px]">{lang === 'en' ? 'Saved' : 'सहेजा'}</span>
            </button>

            {/* Profile Avatar / Menu button */}
            <button
              id="user-profile-btn"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 p-1 sm:pr-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 transition-all text-left"
              title={lang === 'en' ? 'Judge Account & Saved Data' : 'जज खाता व डेटा'}
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Judge'}
                  className="w-6 h-6 rounded-lg object-cover ring-1 ring-sky-500/40"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-6 h-6 rounded-lg bg-sky-600/30 text-sky-300 font-bold flex items-center justify-center text-xs">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                </div>
              )}
              <span className="hidden lg:inline text-xs font-medium text-slate-200 max-w-[90px] truncate">
                {user.displayName || (user.isAnonymous ? (lang === 'en' ? 'Guest Judge' : 'अतिथि जज') : 'Judge')}
              </span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              id="google-signin-btn"
              onClick={signInWithGoogle}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700/80 transition-all text-xs font-medium flex items-center gap-2 cursor-pointer"
              title={lang === 'en' ? 'Sign in with Google' : 'गूगल से साइन इन करें'}
            >
              {/* Clean SVG Google 'G' icon */}
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.02h3.87c2.26-2.09 3.67-5.17 3.67-9.12z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.02c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.12C3.24 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.61H1.26C.46 8.21 0 10.05 0 12s.46 3.79 1.26 5.39l4.01-3.12z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.24 2.64 1.26 6.61l4.01 3.12c.95-2.85 3.6-4.98 6.73-4.98z"
                />
              </svg>
              <span>{lang === 'en' ? 'Sign In' : 'साइन इन'}</span>
            </button>

            <button
              id="guest-signin-btn"
              onClick={signInAsGuest}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 transition-all text-xs font-medium hidden sm:inline-flex items-center gap-1.5 cursor-pointer"
              title={lang === 'en' ? 'Continue as Guest' : 'अतिथि के रूप में जारी रखें'}
            >
              <User className="w-3.5 h-3.5 text-neutral-400" />
              <span>{lang === 'en' ? 'Guest' : 'अतिथि'}</span>
            </button>
          </div>
        )}
      </div>

      {/* User Profile & Saved Structures Modal */}
      {showModal && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-sky-500/40"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-sky-600/30 text-sky-300 font-bold flex items-center justify-center text-lg">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                  </div>
                )}
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    {user.displayName || 'Architectural Judge'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono truncate max-w-[240px]">
                    {user.email || 'Cloud Firestore Synced'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-5">
              {/* Saved Buildings Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span>{lang === 'en' ? 'Saved Masterpieces' : 'सहेजे गए वास्तुशिल्प'}</span>
                  </h4>
                  <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                    {favoritedBuildings.length} / 16
                  </span>
                </div>

                {favoritedBuildings.length === 0 ? (
                  <div className="p-6 text-center rounded-xl bg-slate-950/60 border border-slate-800/80 text-slate-400 text-xs">
                    <Bookmark className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p>
                      {lang === 'en'
                        ? 'You have not saved any buildings yet. Click the heart icon on any building card or 3D dossier to bookmark it.'
                        : 'आपने अभी तक कोई इमारत सहेजी नहीं है। किसी भी कार्ड पर दिल के आइकन पर क्लिक करें।'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {favoritedBuildings.map((building) => (
                      <div
                        key={building.id}
                        className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-sky-500/50 transition-all flex items-center justify-between gap-3 group"
                      >
                        <div className="min-w-0">
                          <h5 className="text-sm font-bold text-slate-200 group-hover:text-sky-300 transition-colors truncate">
                            {lang === 'en' ? building.nameEn : building.nameHi}
                          </h5>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                            <span className="text-sky-400 capitalize">{building.conicType}</span>
                            <span>•</span>
                            <span className="truncate">{building.city}, {building.country}</span>
                          </div>
                        </div>

                        {onOpenBuilding && (
                          <button
                            onClick={() => {
                              setShowModal(false);
                              onOpenBuilding(building);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-sky-600 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all shrink-0"
                          >
                            <span>{lang === 'en' ? 'Inspect' : 'देखें'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer: Sign Out */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                UID: {user.uid.slice(0, 8)}...
              </span>
              <button
                id="signout-button"
                onClick={async () => {
                  await logout();
                  setShowModal(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/80 text-slate-300 hover:text-rose-300 border border-slate-700/80 hover:border-rose-700/60 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Sign Out' : 'साइन आउट'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
