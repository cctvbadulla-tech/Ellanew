import React, { useState, useEffect } from 'react';
import { Language, Train, ServiceAlert, FareRecord, TouristAttraction, EmergencyContact, WebsiteSettings } from './types';
import { StorageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AlertBanner } from './components/AlertBanner';
import { TrainTimetable } from './components/TrainTimetable';
import { FareCalculator } from './components/FareCalculator';
import { StationGuide } from './components/StationGuide';
import { TouristAttractions } from './components/TouristAttractions';
import { EmergencyContacts } from './components/EmergencyContacts';
import { FeedbackForm } from './components/FeedbackForm';
import { AboutAndDisclaimer } from './components/AboutAndDisclaimer';
import { Footer } from './components/Footer';
import { AdminPortal } from './components/AdminPortal';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('ella_language_pref');
      if (saved === 'en' || saved === 'si' || saved === 'ta') return saved;
    } catch {
      // ignore
    }
    return 'en';
  });

  // App data state
  const [trains, setTrains] = useState<Train[]>([]);
  const [alerts, setAlerts] = useState<ServiceAlert[]>([]);
  const [fares, setFares] = useState<FareRecord[]>([]);
  const [attractions, setAttractions] = useState<TouristAttraction[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>(StorageService.getSettings());
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Search & Filter state for Hero <-> Timetable interaction
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');

  // Admin Modal state
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const loadData = () => {
    setTrains(StorageService.getTrains());
    setAlerts(StorageService.getAlerts());
    setFares(StorageService.getFares());
    setAttractions(StorageService.getAttractions());
    setContacts(StorageService.getContacts());
    setSettings(StorageService.getSettings());
    const auth = StorageService.getAdminAuth();
    setIsAdminLoggedIn(auth.isAuthenticated);
  };

  useEffect(() => {
    loadData();

    // Check if URL has admin param or path
    if (
      window.location.search.includes('admin') ||
      window.location.pathname.includes('admin') ||
      window.location.hash.includes('admin')
    ) {
      setIsAdminOpen(true);
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    try {
      localStorage.setItem('ella_language_pref', lang);
    } catch {
      // ignore
    }
  };

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectQuickDestination = (dest: string) => {
    setSelectedDestination(dest);
    handleNavigate('timetable');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-slate-800 font-sans selection:bg-amber-300 selection:text-emerald-950">
      {/* Top Navbar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onNavigate={handleNavigate}
      />

      {/* Active Service Delay / Cancellation Notice Bar */}
      <AlertBanner alerts={alerts} currentLang={currentLang} />

      {/* Hero Section */}
      <main className="flex-1">
        <Hero
          currentLang={currentLang}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectQuickDestination={handleSelectQuickDestination}
          onNavigateToTimetable={() => handleNavigate('timetable')}
          googleMapsUrl={settings.googleMapsDirectionsUrl}
          officialRailwayUrl={settings.officialRailwayUrl}
        />

        {/* 1. Ella Train Timetable & Times */}
        <TrainTimetable
          trains={trains}
          currentLang={currentLang}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedDestination={selectedDestination}
          onSelectDestination={setSelectedDestination}
        />

        {/* 2. Train Ticket Fares Information */}
        <FareCalculator fares={fares} currentLang={currentLang} />

        {/* 3. Ella Railway Station Information & Facilities */}
        <StationGuide
          currentLang={currentLang}
          googleMapsUrl={settings.googleMapsDirectionsUrl}
        />

        {/* 4. Tourist Attractions Near Ella */}
        <TouristAttractions
          attractions={attractions}
          currentLang={currentLang}
        />

        {/* 5. Emergency & Important Contacts */}
        <EmergencyContacts
          contacts={contacts}
          currentLang={currentLang}
        />

        {/* 6. Feedback, Complaints & Timetable Corrections */}
        <FeedbackForm currentLang={currentLang} />

        {/* 7. About This Website & Disclaimers */}
        <AboutAndDisclaimer
          currentLang={currentLang}
          officialRailwayUrl={settings.officialRailwayUrl}
        />
      </main>

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onNavigate={handleNavigate}
        officialRailwayUrl={settings.officialRailwayUrl}
      />

      {/* Admin Portal Modal */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onDataChanged={loadData}
      />
    </div>
  );
}
