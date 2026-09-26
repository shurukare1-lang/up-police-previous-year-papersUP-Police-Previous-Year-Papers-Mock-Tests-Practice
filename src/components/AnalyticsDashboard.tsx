import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getStoredAttempts } from '../utils/storage';
import { 
  BarChart3, 
  Target, 
  Clock, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Layers, 
  BookOpen, 
  History, 
  ChevronRight,
  Shield,
  TrendingUp,
  XCircle
} from 'lucide-react';
import { SubjectType } from '../types';

export const AnalyticsDashboard: React.FC = () => {
  const { 
    analytics, 
    viewAttemptResult, 
    openPracticeMode, 
    setCurrentView,
    language 
  } = useApp();

  const attempts = getStoredAttempts();
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'constable' | 'upsi' | 'pet' | 'upcat' | 'ctet'>('all');

  const filteredAttempts = categoryFilter === 'all'
    ? attempts
    : attempts.filter(a => a.category === categoryFilter);

  // Subject statistics
  const subjectList = Object.entries(analytics.subjectAnalytics);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 text-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4" />
              <span>COMPREHENSIVE PERFORMANCE ANALYTICS</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Progress & Subject Mastery Tracking
            </h1>
            <p className="text-xs text-slate-400 font-hindi mt-0.5">
              आरक्षी, उपनिरीक्षक, PET, UP CAT व CTET की तैयारी, समय प्रबंधन, कमजोर विषयों एवं शुद्धता (Accuracy) का विस्तृत विश्लेषण।
            </p>
          </div>

          {/* Category Toggle for Analytics */}
          <div className="flex items-center p-1 bg-slate-800 rounded-lg border border-slate-700 text-xs shrink-0 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                categoryFilter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({attempts.length})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('constable')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                categoryFilter === 'constable' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Constable ({analytics.constableAttempts})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('upsi')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                categoryFilter === 'upsi' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              SI / UPSI ({analytics.upsiAttempts})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('pet')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                categoryFilter === 'pet' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              PET ({analytics.petAttempts || 0})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('upcat')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                categoryFilter === 'upcat' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              UP CAT ({analytics.upcatAttempts || 0})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('ctet')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                categoryFilter === 'ctet' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              CTET ({analytics.ctetAttempts || 0})
            </button>
          </div>
        </div>

        {/* Primary KPIs (NO STATIC PILLS) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-5 border-t border-slate-800 mt-5">
          <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/80">
            <span className="text-xs text-slate-400">Total Tests Taken</span>
            <div className="text-xl sm:text-2xl font-bold text-white mt-1">
              {attempts.length}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              {analytics.constableAttempts} Constable · {analytics.upsiAttempts} UPSI · {analytics.petAttempts || 0} PET · {analytics.upcatAttempts || 0} UP CAT · {analytics.ctetAttempts || 0} CTET
            </span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/80">
            <span className="text-xs text-slate-400">Overall Accuracy</span>
            <div className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1">
              {analytics.overallAccuracy}%
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Across {analytics.totalQuestionsAnswered} answered questions
            </span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/80">
            <span className="text-xs text-slate-400">Average Score</span>
            <div className="text-xl sm:text-2xl font-bold text-amber-400 mt-1">
              {analytics.averageScorePercent}%
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Average aggregate score
            </span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/80">
            <span className="text-xs text-slate-400">Average Speed</span>
            <div className="text-xl sm:text-2xl font-bold text-amber-300 mt-1 font-mono">
              ~{analytics.avgTimePerQuestionSec}s
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Per question average response
            </span>
          </div>
        </div>

      </div>

      {/* Two Column Layout: Subject Mastery + Weak Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Subject-wise Mastery */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-400" />
              <span>Subject-wise Accuracy & Performance (विषयवार विश्लेषण)</span>
            </h2>
            <span className="text-xs text-slate-400">5 Official Subjects</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {subjectList.map(([key, data]) => {
              const isStrong = data.accuracy >= 65 && data.attempted >= 2;
              const isWeak = data.accuracy < 50 && data.attempted >= 2;

              return (
                <div key={key} className="bg-slate-800/60 p-3.5 rounded-lg border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-slate-200">{language === 'en' ? data.nameEn : data.nameHi}</strong>
                      <span className="text-slate-400 ml-2">({data.attempted} Qs attempted)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-mono">{data.accuracy}%</span>
                      {isStrong && (
                        <span className="text-[10px] text-emerald-400 font-bold border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                          STRONG
                        </span>
                      )}
                      {isWeak && (
                        <span className="text-[10px] text-rose-400 font-bold border border-rose-500/40 bg-rose-500/10 px-1.5 py-0.2 rounded">
                          NEEDS WORK
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        data.accuracy >= 70 ? 'bg-emerald-500' : data.accuracy >= 45 ? 'bg-amber-400' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, data.accuracy))}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                    <span>Correct: <strong className="text-emerald-400">{data.correct}</strong></span>
                    <span>Incorrect: <strong className="text-rose-400">{data.attempted - data.correct}</strong></span>
                    <button
                      type="button"
                      onClick={() => openPracticeMode({ subject: key as SubjectType })}
                      className="text-amber-400 hover:text-amber-300 font-semibold"
                    >
                      Practice Subject →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Weak Topics & Best Subjects */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Weak Topics Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                <Flame className="w-4 h-4" />
                <span>Weak Topics (कमजोर विषय क्षेत्र)</span>
              </div>
              <button
                type="button"
                onClick={() => openPracticeMode({ subject: undefined })}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium"
              >
                Drill All Weak Topics
              </button>
            </div>

            {analytics.weakTopics.length > 0 ? (
              <div className="space-y-2 pt-1">
                {analytics.weakTopics.map((wt, idx) => (
                  <div key={idx} className="bg-slate-800/70 p-2.5 rounded-lg border border-slate-700 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-200 font-hindi">{wt.topicHi}</div>
                      <div className="text-[11px] text-slate-400">{wt.topic}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-rose-400 font-bold block">{wt.failureRate}% Errors</span>
                      <button
                        type="button"
                        onClick={() => openPracticeMode({ topic: wt.topic })}
                        className="text-[11px] text-amber-400 hover:underline font-semibold"
                      >
                        Practice Topic
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-400 bg-slate-800/40 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <p>No critical weak topics detected yet! Complete more tests to map error patterns.</p>
              </div>
            )}
          </div>

          {/* Best Performing Subjects */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-100 shadow-sm space-y-3">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs pb-2 border-b border-slate-800">
              <Award className="w-4 h-4" />
              <span>Best-Performing Subjects (मजबूत पक्ष)</span>
            </div>

            {analytics.bestSubjects.length > 0 ? (
              <div className="space-y-2 pt-1">
                {analytics.bestSubjects.map((bs, idx) => (
                  <div key={idx} className="bg-slate-800/70 p-2.5 rounded-lg border border-slate-700 text-xs flex items-center justify-between">
                    <span className="font-semibold text-slate-200 font-hindi">{bs.nameHi}</span>
                    <span className="text-emerald-400 font-bold">{bs.accuracy}% Accuracy</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 text-center text-xs text-slate-400">
                Attempt mock tests to reveal your top strength subjects.
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Test Attempt History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            <span>Past Test History & Detailed Result Logs (गत परीक्षाओं का विवरण)</span>
          </h2>
          <span className="text-xs text-slate-400">{filteredAttempts.length} Records</span>
        </div>

        {filteredAttempts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Test / Paper Title</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Accuracy</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredAttempts.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white max-w-xs truncate">
                      {att.paperTitle}
                    </td>
                    <td className="py-3 px-3 uppercase text-[11px] font-bold text-amber-400">
                      {att.category}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {new Date(att.timestamp).toLocaleDateString('hi-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-3 font-bold text-white">
                      {att.score.toFixed(1)} / {att.maxScore}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-bold ${att.accuracy >= 65 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {att.accuracy}%
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">
                      {Math.floor(att.timeTakenSeconds / 60)}m {att.timeTakenSeconds % 60}s
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => viewAttemptResult(att)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold rounded border border-slate-700 text-[11px] transition-colors"
                      >
                        View Solution
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-400">
            No test attempts found under this filter. Start any 10-year mock test from the Dashboard to build your stats!
          </div>
        )}
      </div>

    </div>
  );
};
