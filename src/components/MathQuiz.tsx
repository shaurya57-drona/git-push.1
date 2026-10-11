import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Language } from '../types';
import { QUIZ_QUESTIONS } from '../data/quiz';
import { UI_TEXT } from '../data/translations';
import { useAuth } from '../context/AuthContext';
import { submitQuizScore, subscribeLeaderboard, LeaderboardEntry } from '../services/firebaseService';
import {
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Trophy,
  User,
  CloudCheck,
  Send,
} from 'lucide-react';

interface MathQuizProps {
  lang: Language;
}

export const MathQuiz: React.FC<MathQuizProps> = ({ lang }) => {
  const { user, signInWithGoogle, signInAsGuest } = useAuth();
  const [activeTab, setActiveTab] = useState<'quiz' | 'leaderboard'>('quiz');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [hasSavedScore, setHasSavedScore] = useState<boolean>(false);
  const [isSubmittingScore, setIsSubmittingScore] = useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Real-time Firestore subscription to leaderboard
  useEffect(() => {
    const unsubscribe = subscribeLeaderboard((entries) => {
      setLeaderboard(entries);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const currentQ = QUIZ_QUESTIONS[currentIndex];
  const selectedOption = selectedAnswers[currentQ.id];

  const handleSelectOption = (optionIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: optionIndex }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowExplanation(false);
    setIsCompleted(false);
    setHasSavedScore(false);
  };

  // Calculate score
  const correctCount = QUIZ_QUESTIONS.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;
  const scorePercent = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);

  // Auto-record or manual record score to Firestore
  const handleSaveToLeaderboard = async (asGuest = false) => {
    let currentUser = user;
    if (!currentUser) {
      if (asGuest) {
        await signInAsGuest();
      } else {
        await signInWithGoogle();
      }
      return;
    }
    setIsSubmittingScore(true);
    try {
      await submitQuizScore(
        currentUser.uid,
        currentUser.displayName || (currentUser.isAnonymous ? (lang === 'en' ? 'Guest Judge' : 'अतिथि जज') : 'Evaluation Judge'),
        correctCount,
        QUIZ_QUESTIONS.length
      );
      setHasSavedScore(true);
    } catch (err) {
      console.warn('Leaderboard score submit notice:', err);
    } finally {
      setIsSubmittingScore(false);
    }
  };

  return (
    <div id="judge-quiz" className="w-full bg-[#111316] border border-neutral-800/80 rounded-xl p-4 md:p-6 shadow-sm">
      {/* Header with Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-neutral-800 text-[#B6FFED]">
              <Award className="w-4 h-4" />
            </span>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white font-display">
              {UI_TEXT[lang].quizTitle}
            </h3>
          </div>
          <p className="text-xs md:text-sm text-neutral-400 mt-1 max-w-2xl">
            {UI_TEXT[lang].quizSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quiz / Leaderboard Switcher */}
          <div className="bg-[#0b0d0f] p-1 rounded-lg border border-neutral-800 flex items-center gap-1">
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {lang === 'en' ? 'Assessment' : 'प्रश्नोत्तरी'}
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                activeTab === 'leaderboard'
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'en' ? 'Leaderboard' : 'लीडरबोर्ड'}</span>
            </button>
          </div>

          {activeTab === 'quiz' && !isCompleted && (
            <div className="text-xs font-mono text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-800 self-start md:self-auto">
              {lang === 'en' ? 'Question' : 'प्रश्न'} {currentIndex + 1} / {QUIZ_QUESTIONS.length}
            </div>
          )}
        </div>
      </div>

      {activeTab === 'leaderboard' ? (
        /* Real-Time Firestore Leaderboard */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Trophy className="w-4 h-4" />
              {lang === 'en' ? 'Leaderboard' : 'लीडरबोर्ड'}
            </span>
          </div>

          {leaderboard.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/60 border border-slate-800 rounded-xl text-slate-500 text-xs">
              {lang === 'en'
                ? 'No scores recorded yet. Complete the assessment above to claim #1!'
                : 'अभी तक कोई स्कोर दर्ज नहीं हुआ। शीर्ष स्थान पाने हेतु प्रश्नोत्तरी हल करें!'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {leaderboard.map((entry, idx) => (
                <div
                  key={entry.id}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center ${
                        idx === 0
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : idx === 1
                          ? 'bg-slate-400/20 text-slate-300 border border-slate-400/40'
                          : idx === 2
                          ? 'bg-amber-800/20 text-amber-500 border border-amber-800/40'
                          : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <div>
                      <h5 className="text-sm font-bold text-slate-200 truncate max-w-[160px]">
                        {entry.userName}
                      </h5>
                      <span className="text-[11px] font-mono text-slate-400">
                        {entry.score} / {entry.total} {lang === 'en' ? 'correct' : 'सही'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold font-mono text-amber-300">
                      {entry.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : !isCompleted ? (
        /* Question View */
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Topic Badge & Question Text */}
          <div>
            <span className="text-[11px] font-mono text-sky-400 bg-sky-950/60 px-2.5 py-1 rounded border border-sky-800/60 font-semibold mb-2 inline-block">
              {currentQ.mathTopic}
            </span>
            <h4 className="text-base sm:text-lg font-bold text-slate-100 font-sans leading-snug">
              {lang === 'en' ? currentQ.questionEn : currentQ.questionHi}
            </h4>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-2.5">
            {(lang === 'en' ? currentQ.optionsEn : currentQ.optionsHi).map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnStyle = 'bg-slate-800/60 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-600';
              if (showExplanation) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-red-950/80 border-red-500 text-red-200';
                } else {
                  btnStyle = 'bg-slate-900/50 border-slate-800 text-slate-500';
                }
              }

              return (
                <button
                  key={idx}
                  id={`quiz-opt-${currentQ.id}-${idx}`}
                  onClick={() => handleSelectOption(idx)}
                  disabled={showExplanation}
                  className={`w-full p-3.5 rounded-xl text-xs sm:text-sm text-left transition-all border font-sans flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-900/80 border border-slate-700 text-xs font-mono font-bold flex items-center justify-center text-slate-400 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{option}</span>
                  </div>

                  {showExplanation && (
                    <div className="shrink-0">
                      {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                      {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation && (
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
                <HelpCircle className="w-4 h-4" />
                <span>{lang === 'en' ? 'Mathematical Explanation' : 'गणितीय व्याख्या'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {lang === 'en' ? currentQ.explanationEn : currentQ.explanationHi}
              </p>

              <button
                id="next-quiz-question"
                onClick={handleNext}
                className="w-full sm:w-auto py-2 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>
                  {currentIndex === QUIZ_QUESTIONS.length - 1
                    ? lang === 'en'
                      ? 'View Final Results'
                      : 'परिणाम देखें'
                    : UI_TEXT[lang].nextQuestion}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Results View */
        <div className="text-center py-6 px-4 space-y-6">
          <div className="inline-flex p-4 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Sparkles className="w-10 h-10 animate-bounce" />
          </div>

          <div>
            <h4 className="text-2xl sm:text-3xl font-bold text-white font-display">
              {UI_TEXT[lang].certificateTitle}
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
              {UI_TEXT[lang].certificateDesc}
            </p>
          </div>

          {/* Score Badge */}
          <div className="inline-block p-6 rounded-2xl bg-slate-950/90 border border-slate-800 text-center">
            <div className="text-xs uppercase text-slate-500 font-mono mb-1">
              {UI_TEXT[lang].yourScore}
            </div>
            <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-amber-300 font-mono">
              {scorePercent}%
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {correctCount} / {QUIZ_QUESTIONS.length} {lang === 'en' ? 'Correct Answers' : 'सही उत्तर'}
            </div>
          </div>

          {/* Firebase Leaderboard Submission */}
          <div className="max-w-sm mx-auto p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            {hasSavedScore ? (
              <div className="flex items-center justify-center gap-2 text-xs text-emerald-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  {lang === 'en'
                    ? 'Score published to Live Cloud Leaderboard!'
                    : 'स्कोर लाइव लीडरबोर्ड में दर्ज हो चुका है!'}
                </span>
              </div>
            ) : (
              <div>
                <p className="text-xs text-slate-400 mb-2">
                  {lang === 'en'
                    ? 'Record your evaluation score on the public Conic City leaderboard in Firestore.'
                    : 'अपना स्कोर सार्वजनिक फायरस्टोर लीडरबोर्ड पर दर्ज करें।'}
                </p>
                <button
                  id="save-score-leaderboard-btn"
                  onClick={() => handleSaveToLeaderboard(false)}
                  disabled={isSubmittingScore}
                  className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>
                    {isSubmittingScore
                      ? lang === 'en'
                        ? 'Publishing...'
                        : 'दर्ज हो रहा है...'
                      : user
                      ? lang === 'en'
                        ? 'Publish to Leaderboard'
                        : 'लीडरबोर्ड पर पोस्ट करें'
                      : lang === 'en'
                      ? 'Sign In with Google & Save'
                      : 'गूगल से साइन इन करें व सहेजें'}
                  </span>
                </button>

                {!user && (
                  <div className="pt-2 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleSaveToLeaderboard(true)}
                      className="text-[11px] text-amber-300 hover:text-amber-200 underline font-medium"
                    >
                      {lang === 'en' ? 'Or save as Guest Judge' : 'या अतिथि जज के रूप में सहेजें'}
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setActiveTab('leaderboard')}
              className="text-[11px] text-sky-400 hover:text-sky-300 transition-colors underline"
            >
              {lang === 'en' ? 'View Live Leaderboard' : 'लाइव लीडरबोर्ड देखें'}
            </button>
          </div>

          <div>
            <button
              id="retake-quiz-button"
              onClick={handleRestart}
              className="py-2.5 px-6 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-700 inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{UI_TEXT[lang].tryAgain}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
