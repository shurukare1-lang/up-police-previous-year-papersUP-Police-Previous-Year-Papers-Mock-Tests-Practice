import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { TenYearDashboard } from './components/TenYearDashboard';
import { MockTestEngine } from './components/MockTestEngine';
import { PracticeModes } from './components/PracticeModes';
import { PaperViewer } from './components/PaperViewer';
import { TestResultView } from './components/TestResultView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { MistakeNotebook } from './components/MistakeNotebook';
import { BookmarksView } from './components/BookmarksView';
import { 
  ShieldCheck, 
  ExternalLink, 
  FileCheck2, 
  Info,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentView, setCurrentView, selectedCategory, language } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Header & Navigation */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 pb-2 border-b border-slate-900">
          <button 
            type="button" 
            onClick={() => setCurrentView('dashboard')}
            className="hover:text-amber-400 transition-colors"
          >
            UP Police 10-Year Portal
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-amber-400 font-semibold uppercase">
            {selectedCategory === 'constable' && 'Constable (आरक्षी)'}
            {selectedCategory === 'upsi' && 'SI / UPSI (दरोगा)'}
            {selectedCategory === 'pet' && 'UPSSSC PET'}
            {selectedCategory === 'upcat' && 'UP CAT'}
            {selectedCategory === 'ctet' && 'CTET (CBSE)'}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-200 capitalize">
            {currentView === 'dashboard' && '10-Year Dashboard'}
            {currentView === 'mock_test' && 'Live Timed Mock Test'}
            {currentView === 'practice' && 'PYQ Practice Modes (8 Modes)'}
            {currentView === 'view_paper' && 'Master Paper Viewer'}
            {currentView === 'test_result' && 'Scorecard & Detailed Solutions'}
            {currentView === 'analytics' && 'Performance & Analytics'}
            {currentView === 'mistake_notebook' && 'Wrong Questions Bank'}
            {currentView === 'bookmarks' && 'Saved Questions'}
          </span>
        </div>

        {/* View Switcher */}
        {currentView === 'dashboard' && <TenYearDashboard />}
        {currentView === 'mock_test' && <MockTestEngine />}
        {currentView === 'practice' && <PracticeModes />}
        {currentView === 'view_paper' && <PaperViewer />}
        {currentView === 'test_result' && <TestResultView />}
        {currentView === 'analytics' && <AnalyticsDashboard />}
        {currentView === 'mistake_notebook' && <MistakeNotebook />}
        {currentView === 'bookmarks' && <BookmarksView />}
      </main>

      {/* Official Transparency Footer */}
      <footer className="bg-slate-900 border-t border-slate-800/80 text-slate-400 text-xs py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>UP Police Recruitment & Promotion Board (UPPBPB) Examination Archive</span>
              </div>
              <p className="text-xs text-slate-400 max-w-2xl font-hindi">
                यह पोर्टल उत्तर प्रदेश पुलिस आरक्षी (Constable) एवं उपनिरीक्षक (SI/UPSI) के 10 वर्षों के प्रामाणिक प्रश्न पत्रों, परीक्षा पैटर्नों, समय सीमाओं व नकारात्मक अंकन योजनाओं के आधिकारिक सत्यापन पर आधारित है।
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="text-slate-300">Constable: +2.0 / -0.5 (120 Mins)</span>
              <span>·</span>
              <span className="text-slate-300">UPSI: +2.5 / 0 (35% Sec. Cutoff)</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
            <div>
              © 2026 UP Police Previous Year Papers & Mock Test Portal · All questions verified with official UPPBPB answer keys.
            </div>
            <div className="flex items-center gap-3">
              <span>Bilingual Support (हिंदी / English)</span>
              <span>·</span>
              <span>Local Storage Persistence</span>
              <span>·</span>
              <span>Zero-Invented Question Guarantee</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
