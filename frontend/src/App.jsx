import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';
import ErrorBoundary from './components/Common/ErrorBoundary';
import HomePage from './pages/HomePage';
import ScanPage from './pages/ScanPage';
import ResultsPage from './pages/ResultsPage';
import CompliancePage from './pages/CompliancePage';
import HistoryPage from './pages/HistoryPage';
import NotFound from './pages/NotFound';
import './App.css';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="App min-h-screen flex flex-col bg-slate-50">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/scan/:type" element={<ScanPage />} />
              <Route path="/results/:scan_id" element={<ResultsPage />} />
              <Route path="/compliance/:scan_id" element={<CompliancePage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
      <Footer />
    </div>
  );
}
