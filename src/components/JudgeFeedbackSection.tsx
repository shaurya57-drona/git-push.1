import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Language } from '../types';
import { submitFeedback, subscribeFeedback, JudgeFeedbackItem } from '../services/firebaseService';
import { Star, MessageSquare, Send, CheckCircle2, User, Sparkles, ShieldCheck } from 'lucide-react';

interface JudgeFeedbackSectionProps {
  lang: Language;
}

export const JudgeFeedbackSection: React.FC<JudgeFeedbackSectionProps> = ({ lang }) => {
  const { user, signInWithGoogle, signInAsGuest } = useAuth();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [feedbackList, setFeedbackList] = useState<JudgeFeedbackItem[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeFeedback((list) => {
      setFeedbackList(list);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    let activeUser = user;
    if (!activeUser) {
      await signInWithGoogle();
      return;
    }

    setIsSubmitting(true);
    try {
      await submitFeedback(
        activeUser.uid,
        activeUser.displayName || (activeUser.isAnonymous ? (lang === 'en' ? 'Guest Judge' : 'अतिथि जज') : 'Evaluation Judge'),
        rating,
        comment.trim()
      );
      setComment('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      console.warn('Feedback submission notice:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#111316] border border-neutral-800/80 rounded-xl p-4 md:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white font-display flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#B6FFED]" />
            <span>{lang === 'en' ? 'Reviews & Feedback' : 'समीक्षा व मूल्यांकन'}</span>
          </h3>
          <p className="text-xs md:text-sm text-neutral-400 mt-1 max-w-2xl">
            {lang === 'en'
              ? 'Submit ratings and evaluations for the architectural models.'
              : 'वास्तुशिल्प मॉडलों के लिए रेटिंग और समीक्षा दर्ज करें।'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Feedback Input Form */}
        <div className="lg:col-span-5 bg-[#0b0d0f] border border-neutral-800 rounded-lg p-4 sm:p-5 flex flex-col justify-between">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
                {lang === 'en' ? 'Architectural Rigor Rating' : 'गणितीय व वास्तुशिल्प रेटिंग'}
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-neutral-600 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-neutral-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-mono font-medium text-neutral-400 ml-2">
                  {rating} / 5
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
                {lang === 'en' ? 'Evaluation Notes' : 'समीक्षा व टिप्पणियां'}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  lang === 'en'
                    ? 'Enter remarks on eccentricity proofs, acoustic wave simulations, or 3D geometry accuracy...'
                    : 'उत्केंद्रता गणना, ध्वनिकी तरंग सिमुलेशन या 3D ज्यामिति सटीकता पर टिप्पणी दर्ज करें...'
                }
                rows={4}
                maxLength={1000}
                required
                className="w-full bg-[#111316] border border-neutral-800 rounded-lg p-3 text-xs sm:text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#B6FFED]/60 transition-colors resize-none"
              />
              <div className="flex justify-end items-center text-[10px] text-neutral-500 font-mono mt-1">
                <span>{comment.length} / 1000</span>
              </div>
            </div>

            {submitted && (
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  {lang === 'en'
                    ? 'Evaluation published to exhibition board.'
                    : 'समीक्षा बोर्ड पर दर्ज कर दी गई है।'}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="w-full py-2 px-4 rounded-lg text-xs font-semibold bg-[#B6FFED] hover:bg-[#9effe4] disabled:opacity-50 text-[#0a0a0a] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>{lang === 'en' ? 'Recording...' : 'दर्ज हो रहा है...'}</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {user
                      ? lang === 'en'
                        ? 'Publish Evaluation'
                        : 'समीक्षा पोस्ट करें'
                      : lang === 'en'
                      ? 'Sign in & Publish'
                      : 'साइन इन करें व पोस्ट करें'}
                  </span>
                </>
              )}
            </button>

            {!user && (
              <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1 pt-0.5">
                <span>{lang === 'en' ? 'No Google account?' : 'गूगल खाता नहीं है?'}</span>
                <button
                  type="button"
                  onClick={signInAsGuest}
                  className="text-[#B6FFED] hover:underline font-medium cursor-pointer"
                >
                  {lang === 'en' ? 'Post as Guest' : 'अतिथि के रूप में पोस्ट करें'}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Live Feedback Feed */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B6FFED]" />
              <span>{lang === 'en' ? 'Recent Submissions' : 'हालिया समीक्षाएं'}</span>
            </h4>
            <span className="text-xs font-mono text-neutral-500">
              {feedbackList.length} {lang === 'en' ? 'records' : 'प्रविष्टियां'}
            </span>
          </div>

          {feedbackList.length === 0 ? (
            <div className="p-8 text-center rounded-lg bg-[#0b0d0f] border border-neutral-800 text-neutral-500 text-xs">
              {lang === 'en'
                ? 'No evaluations submitted yet.'
                : 'अभी तक कोई समीक्षा नहीं।'}
            </div>
          ) : (
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {feedbackList.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-[#0b0d0f] border border-neutral-800 hover:border-neutral-700 transition-colors text-xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-neutral-900 border border-neutral-800 text-[#B6FFED] flex items-center justify-center text-[10px] font-bold">
                        <User className="w-3 h-3" />
                      </div>
                      <span className="font-semibold text-neutral-200">
                        {item.userName}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < item.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-neutral-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-neutral-300 leading-relaxed font-sans">
                    {item.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
