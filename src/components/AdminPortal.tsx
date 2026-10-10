import React, { useState, useEffect } from 'react';
import {
  Train,
  ServiceAlert,
  FareRecord,
  TouristAttraction,
  EmergencyContact,
  FeedbackSubmission,
  AuditLog,
  WebsiteSettings
} from '../types';
import { StorageService } from '../services/storage';
import {
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Train as TrainIcon,
  AlertTriangle,
  Ticket,
  Mountain,
  PhoneCall,
  MessageSquare,
  Settings,
  ShieldCheck,
  FileSpreadsheet,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Download,
  Upload,
  RefreshCw,
  Search,
  KeyRound
} from 'lucide-react';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose, onDataChanged }) => {
  // Auth state
  const [auth, setAuth] = useState(() => StorageService.getAdminAuth());
  const [username, setUsername] = useState('Admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Mandatory change password modal
  const [mustChangePasswordModal, setMustChangePasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'trains' | 'csv' | 'alerts' | 'fares' | 'attractions' | 'feedback' | 'contacts' | 'settings' | 'audit' | 'password'
  >('overview');

  // Loaded data
  const [trains, setTrains] = useState<Train[]>([]);
  const [alerts, setAlerts] = useState<ServiceAlert[]>([]);
  const [fares, setFares] = useState<FareRecord[]>([]);
  const [attractions, setAttractions] = useState<TouristAttraction[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [feedback, setFeedback] = useState<FeedbackSubmission[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>(StorageService.getSettings());

  // Search in trains tab
  const [trainSearchQuery, setTrainSearchQuery] = useState('');

  // Train Edit/Add Modal state
  const [editingTrain, setEditingTrain] = useState<Train | null>(null);
  const [isAddTrainOpen, setIsAddTrainOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // New Train Form fields
  const [trainForm, setTrainForm] = useState<Partial<Train>>({
    trainNumber: '',
    name: '',
    direction: 'to_badulla',
    originStation: 'Colombo Fort (FOT)',
    destinationStation: 'Badulla (BDA)',
    arrivalTimeElla: '12:00',
    departureTimeElla: '12:05',
    operatingDays: ['Daily'],
    classes: ['2nd Class Reserved', '3rd Class Unreserved'],
    currentStatus: 'On Time',
    platform: 'Platform 1',
    source: 'Station Master Working Schedule'
  });

  // CSV Import state
  const [csvContent, setCsvContent] = useState('');
  const [csvFeedback, setCsvFeedback] = useState<{ success?: boolean; message?: string; errors?: string[] } | null>(null);

  // Alert Form
  const [newAlertForm, setNewAlertForm] = useState<Partial<ServiceAlert>>({
    type: 'advisory',
    title: '',
    message: '',
    affectedTrain: '',
    active: true,
    source: 'Ella Station Operations'
  });

  // Reload all data
  const reloadData = () => {
    setTrains(StorageService.getTrains());
    setAlerts(StorageService.getAlerts());
    setFares(StorageService.getFares());
    setAttractions(StorageService.getAttractions());
    setContacts(StorageService.getContacts());
    setFeedback(StorageService.getFeedback());
    setAuditLogs(StorageService.getAuditLogs());
    setSettings(StorageService.getSettings());
    setAuth(StorageService.getAdminAuth());
    onDataChanged();
  };

  useEffect(() => {
    if (isOpen) {
      reloadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await StorageService.loginAdmin(username, password);
      if (res.success) {
        setAuth(StorageService.getAdminAuth());
        setPassword('');
        reloadData();
        if (res.mustChangePassword) {
          setMustChangePasswordModal(true);
        }
      } else {
        setLoginError(res.message || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setLoginError('An unexpected authentication error occurred.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Mandatory Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError('');

    if (newPassword !== confirmPassword) {
      setChangePasswordError('Passwords do not match.');
      return;
    }

    const res = await StorageService.changeAdminPassword(newPassword);
    if (res.success) {
      setMustChangePasswordModal(false);
      setNewPassword('');
      setConfirmPassword('');
      reloadData();
      alert('Password updated securely. You may now continue using the administrative console.');
    } else {
      setChangePasswordError(res.message || 'Failed to update password.');
    }
  };

  const handleLogout = () => {
    StorageService.logoutAdmin();
    setAuth(StorageService.getAdminAuth());
    reloadData();
  };

  // Handle Save / Add Train
  const handleSaveTrain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainForm.trainNumber || !trainForm.name) {
      alert('Please fill in train number and name.');
      return;
    }

    if (editingTrain) {
      StorageService.updateTrain({
        ...editingTrain,
        ...trainForm,
        lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16)
      } as Train);
      setEditingTrain(null);
    } else {
      StorageService.addTrain({
        trainNumber: trainForm.trainNumber!,
        name: trainForm.name!,
        direction: trainForm.direction || 'to_badulla',
        originStation: trainForm.originStation || 'Colombo Fort (FOT)',
        destinationStation: trainForm.destinationStation || 'Badulla (BDA)',
        arrivalTimeElla: trainForm.arrivalTimeElla || '12:00',
        departureTimeElla: trainForm.departureTimeElla || '12:05',
        operatingDays: trainForm.operatingDays || ['Daily'],
        classes: trainForm.classes || ['2nd Class Reserved', '3rd Class Unreserved'],
        currentStatus: trainForm.currentStatus || 'On Time',
        platform: trainForm.platform || 'Platform 1',
        lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
        source: trainForm.source || 'Station Operations Manual'
      });
      setIsAddTrainOpen(false);
    }

    reloadData();
  };

  // Handle CSV Import
  const handleCSVImport = () => {
    if (!csvContent.trim()) {
      setCsvFeedback({ success: false, message: 'Please provide CSV content or upload a file.' });
      return;
    }

    const result = StorageService.parseCSVToTrains(csvContent);
    if (result.success && result.trains) {
      // Merge imported trains
      const existing = StorageService.getTrains();
      const updated = [...result.trains, ...existing];
      StorageService.saveTrains(updated);
      reloadData();
      setCsvFeedback({
        success: true,
        message: `Successfully imported ${result.trains.length} trains into timetable database!`
      });
      setCsvContent('');
    } else {
      setCsvFeedback({
        success: false,
        message: 'CSV validation failed.',
        errors: result.errors
      });
    }
  };

  // Handle Add Service Alert
  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertForm.title || !newAlertForm.message) {
      alert('Please enter title and message.');
      return;
    }

    StorageService.addAlert({
      type: newAlertForm.type || 'advisory',
      title: newAlertForm.title!,
      message: newAlertForm.message!,
      affectedTrain: newAlertForm.affectedTrain || undefined,
      active: true,
      lastVerified: new Date().toISOString().replace('T', ' ').substring(0, 16),
      source: newAlertForm.source || 'Station Master Desk'
    });

    setNewAlertForm({
      type: 'advisory',
      title: '',
      message: '',
      affectedTrain: '',
      active: true,
      source: 'Ella Station Operations'
    });
    reloadData();
  };

  // If Not Authenticated, show Login Screen
  if (!auth.isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
          <div className="bg-[#1b4332] text-white p-6 text-center relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-emerald-200 hover:text-white font-bold p-1"
            >
              ✕
            </button>
            <div className="w-12 h-12 rounded-full bg-emerald-800 border border-amber-400/50 flex items-center justify-center text-amber-300 mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl font-bold">Station Master Portal</h2>
            <p className="text-xs text-emerald-200 mt-1">
              Ella Railway Station Administrator Login
            </p>
          </div>

          <div className="p-6">
            {loginError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800 leading-relaxed">
                {loginError}
              </div>
            )}

            {/* Initial Setup Credentials Guide Box */}
            <div className="mb-5 p-3 bg-amber-50 rounded border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
              <div className="font-bold flex items-center gap-1.5 text-amber-950 mb-1">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Initial Setup Credentials Notice:</span>
              </div>
              <div>Username: <strong className="font-mono">Admin</strong></div>
              <div>Initial Password: <strong className="font-mono">Admin1234</strong></div>
              <div className="text-[11px] text-amber-800 mt-1 italic">
                * You will be prompted to replace this initial setup password on your first successful sign-in.
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Admin"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter station password"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 pr-10 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-700 p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-2.5 px-4 bg-[#1b4332] hover:bg-[#143225] text-amber-300 font-bold rounded text-xs transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isLoggingIn ? 'Authenticating...' : 'Sign In to Station Console'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // If Must Change Password Modal is open
  if (mustChangePasswordModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900">Security Requirement: Change Initial Password</h3>
            <p className="text-xs text-slate-600 mt-1">
              For security, you must update the initial setup password (Admin1234) before accessing administrative functions.
            </p>
          </div>

          {changePasswordError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800">
              {changePasswordError}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">New Administrator Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#1b4332] hover:bg-[#143225] text-amber-300 font-bold rounded text-xs transition-colors cursor-pointer"
              >
                Save New Password & Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Full Dashboard View
  const unreadFeedbackCount = feedback.filter(f => f.status === 'Pending').length;
  const activeAlertsCount = alerts.filter(a => a.active).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Top Console Bar */}
        <div className="bg-[#1b4332] text-white px-5 py-3.5 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-emerald-800 text-amber-300 flex items-center justify-center">
              <TrainIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base leading-tight">Ella Railway Station — Admin Console</h2>
              <div className="text-[11px] text-emerald-300 flex items-center gap-2">
                <span>User: <strong>{auth.username}</strong></span>
                <span>·</span>
                <span>Database: SQLite / LocalStorage / Supabase Compatible</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-950/80 hover:bg-rose-900/80 text-rose-200 rounded transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
            <button
              onClick={onClose}
              className="text-emerald-200 hover:text-white p-1 text-lg font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="bg-[#0f281e] text-xs font-medium text-emerald-200 flex flex-wrap gap-1 px-4 py-2 border-b border-emerald-950 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded transition-colors ${activeTab === 'overview' ? 'bg-amber-400 text-emerald-950 font-bold' : 'hover:bg-emerald-900/60'}`}
          >
            A. Overview
          </button>
          <button
            onClick={() => setActiveTab('trains')}
            className={`px-3 py-1.5 rounded transition-colors ${activeTab === 'trains' ? 'bg-amber-400 text-emerald-950 font-bold' : 'hover:bg-emerald-900/60'}`}
          >
            B. Trains ({trains.length})
          </button>
          <button
            onClick={() => setActiveTab('csv')}
            className={`px-3 py-1.5 rounded transition-colors ${activeTab === 'csv' ? 'bg-amber-400 text-emerald-950 font-bold' : 'hover:bg-emerald-900/60'}`}
          >
            C. Timetable / CSV
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3 py-1.5 rounded transition-colors ${activeTab === 'alerts' ? 'bg-amber-400 text-emerald-950 font-bold' : 'hover:bg-emerald-900/60'}`}
          >
            D. Alerts ({activeAlertsCount} active)
          </button>
          <button
            onClick={() => setActiveTab('fares')}
            className={`px-3 py-1.5 rounded transition-colors ${activeTab === 'fares' ? 'bg-amber-400 text-emerald-950 font-bold' : 'hover:bg-emerald-900/60'}`}
          >
            E. Fares ({fares.length})
          </button>
          <button
            onClick={() => setActiveTab('attractions')}
            className={`px-3 py-1.5 rounded transition-colors ${activeTab === 'attractions' ? 'bg-amber-400 text-emerald-950 font-bold' : 'hover:bg-emerald-900/60'}`}
          >
            F. Attractions ({attractions.length})
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-3 py-1.5 rounded transition-colors ${activeTab === 'feedback' ? 'bg-amber-400 text-emerald-950 font-bold' : 'hover:bg-emerald-900/60'}`}
          >
            G. Feedback {unreadFeedbackCount > 0 && `(${unreadFeedbackCount} new)`}
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-3 py-1.5 rounded transition-colors ${activeTab === 'contacts' ? 'bg-amber-400 text-emerald-950 font-bold' : 'hover:bg-emerald-900/60'}`}
          >
            H. Contacts ({contacts.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded transition-colors ${activeTab === 'settings' ? 'bg-amber-400 text-emerald-950 font-bold' : 'hover:bg-emerald-900/60'}`}
          >
            I. Settings
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded transition-colors ${activeTab === 'audit' ? 'bg-amber-400 text-emerald-950 font-bold' : 'hover:bg-emerald-900/60'}`}
          >
            J. Audit Logs ({auditLogs.length})
          </button>
        </div>

        {/* Tab Body View */}
        <div className="flex-1 overflow-y-auto p-5 bg-[#fdfbf7]">
          {/* TAB A: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500">Scheduled Trains</div>
                  <div className="text-2xl font-serif font-bold text-slate-900 mt-1">{trains.length}</div>
                  <div className="text-[11px] text-emerald-700 mt-1">Main Line Services</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500">Active Service Alerts</div>
                  <div className="text-2xl font-serif font-bold text-amber-700 mt-1">{activeAlertsCount}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Visible on home banner</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500">Unread Feedback</div>
                  <div className="text-2xl font-serif font-bold text-indigo-700 mt-1">{unreadFeedbackCount}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Passenger submissions</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500">Verified Station Fares</div>
                  <div className="text-2xl font-serif font-bold text-emerald-900 mt-1">{fares.length}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Official tariff pairs</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-5 rounded-lg border border-slate-200">
                <h3 className="font-serif font-bold text-sm text-slate-900 mb-3">Administrative Shortcuts</h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => {
                      setIsAddTrainOpen(true);
                      setActiveTab('trains');
                    }}
                    className="px-3 py-2 bg-[#1b4332] text-amber-300 font-semibold rounded flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Train Schedule</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('csv')}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Import Timetable CSV</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('alerts')}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Post Service Delay Notice</span>
                  </button>
                  <a
                    href="./ella-train-times-github-pages.zip"
                    download="ella-train-times-github-pages.zip"
                    className="px-3 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Project ZIP (GitHub Pages Ready)</span>
                  </a>
                </div>
              </div>

              {/* Latest Audit Logs summary */}
              <div className="bg-white p-5 rounded-lg border border-slate-200">
                <h3 className="font-serif font-bold text-sm text-slate-900 mb-3">Recent Security & Audit Trail</h3>
                <div className="space-y-2 text-xs font-mono">
                  {auditLogs.slice(0, 5).map(log => (
                    <div key={log.id} className="p-2 bg-slate-50 rounded border border-slate-100 flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-emerald-900">{log.action}: </span>
                        <span className="text-slate-700">{log.details}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB B: TRAIN MANAGEMENT */}
          {activeTab === 'trains' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={trainSearchQuery}
                    onChange={(e) => setTrainSearchQuery(e.target.value)}
                    placeholder="Search trains..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded"
                  />
                </div>
                <button
                  onClick={() => {
                    setEditingTrain(null);
                    setTrainForm({
                      trainNumber: '',
                      name: '',
                      direction: 'to_badulla',
                      originStation: 'Colombo Fort (FOT)',
                      destinationStation: 'Badulla (BDA)',
                      arrivalTimeElla: '12:00',
                      departureTimeElla: '12:05',
                      operatingDays: ['Daily'],
                      classes: ['2nd Class Reserved', '3rd Class Unreserved'],
                      currentStatus: 'On Time',
                      platform: 'Platform 1',
                      source: 'Station Working Schedule'
                    });
                    setIsAddTrainOpen(true);
                  }}
                  className="px-3 py-1.5 bg-[#1b4332] text-amber-300 text-xs font-semibold rounded flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Train Record</span>
                </button>
              </div>

              {/* Trains Table */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">No.</th>
                      <th className="py-2.5 px-3">Name</th>
                      <th className="py-2.5 px-3">Route</th>
                      <th className="py-2.5 px-3 text-center">Arr. Ella</th>
                      <th className="py-2.5 px-3 text-center">Dep. Ella</th>
                      <th className="py-2.5 px-3">Days</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {trains
                      .filter(tr =>
                        tr.trainNumber.includes(trainSearchQuery) ||
                        tr.name.toLowerCase().includes(trainSearchQuery.toLowerCase())
                      )
                      .map(tr => (
                        <tr key={tr.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">#{tr.trainNumber}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-800">{tr.name}</td>
                          <td className="py-2.5 px-3 text-slate-600">{tr.originStation.split(' ')[0]} → {tr.destinationStation.split(' ')[0]}</td>
                          <td className="py-2.5 px-3 text-center font-mono">{tr.arrivalTimeElla}</td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-900">{tr.departureTimeElla}</td>
                          <td className="py-2.5 px-3 text-slate-500">{tr.operatingDays.join(', ')}</td>
                          <td className="py-2.5 px-3">
                            <span className="font-medium text-slate-800">{tr.currentStatus}</span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingTrain(tr);
                                  setTrainForm(tr);
                                  setIsAddTrainOpen(true);
                                }}
                                className="p-1 text-slate-600 hover:text-emerald-800"
                                title="Edit Train"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(tr.id)}
                                className="p-1 text-slate-600 hover:text-rose-700"
                                title="Delete Train"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Delete confirmation modal */}
              {deleteConfirmId && (
                <div className="p-4 bg-rose-50 border border-rose-300 rounded text-xs text-rose-900 flex items-center justify-between">
                  <div>
                    <strong>Confirm deletion:</strong> Are you sure you want to remove this train service from the timetable?
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        StorageService.deleteTrain(deleteConfirmId);
                        setDeleteConfirmId(null);
                        reloadData();
                      }}
                      className="px-3 py-1 bg-rose-700 text-white font-bold rounded"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-3 py-1 bg-slate-200 text-slate-800 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TRAIN ADD / EDIT MODAL */}
          {isAddTrainOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 text-xs sm:text-sm">
                <h3 className="font-serif font-bold text-base text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  {editingTrain ? `Edit Train #${editingTrain.trainNumber}` : 'Add New Train Service'}
                </h3>
                <form onSubmit={handleSaveTrain} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Train Number *</label>
                      <input
                        type="text"
                        required
                        value={trainForm.trainNumber}
                        onChange={(e) => setTrainForm({ ...trainForm, trainNumber: e.target.value })}
                        placeholder="e.g. 1005"
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Train Name *</label>
                      <input
                        type="text"
                        required
                        value={trainForm.name}
                        onChange={(e) => setTrainForm({ ...trainForm, name: e.target.value })}
                        placeholder="e.g. Podi Menike"
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Origin Station</label>
                      <input
                        type="text"
                        value={trainForm.originStation}
                        onChange={(e) => setTrainForm({ ...trainForm, originStation: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Destination Station</label>
                      <input
                        type="text"
                        value={trainForm.destinationStation}
                        onChange={(e) => setTrainForm({ ...trainForm, destinationStation: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Ella Arrival Time (HH:MM)</label>
                      <input
                        type="text"
                        value={trainForm.arrivalTimeElla}
                        onChange={(e) => setTrainForm({ ...trainForm, arrivalTimeElla: e.target.value })}
                        placeholder="15:14"
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Ella Departure Time (HH:MM)</label>
                      <input
                        type="text"
                        value={trainForm.departureTimeElla}
                        onChange={(e) => setTrainForm({ ...trainForm, departureTimeElla: e.target.value })}
                        placeholder="15:17"
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Platform</label>
                      <input
                        type="text"
                        value={trainForm.platform}
                        onChange={(e) => setTrainForm({ ...trainForm, platform: e.target.value })}
                        placeholder="Platform 1"
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Current Status</label>
                      <select
                        value={trainForm.currentStatus}
                        onChange={(e) => setTrainForm({ ...trainForm, currentStatus: e.target.value as any })}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                      >
                        <option value="On Time">On Time</option>
                        <option value="Delayed">Delayed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Scheduled">Scheduled</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Source of Information</label>
                    <input
                      type="text"
                      value={trainForm.source}
                      onChange={(e) => setTrainForm({ ...trainForm, source: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsAddTrainOpen(false)}
                      className="px-3 py-1.5 bg-slate-200 text-slate-800 rounded text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#1b4332] text-amber-300 font-bold rounded text-xs"
                    >
                      Save Train Record
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB C: TIMETABLE / CSV IMPORT & EXPORT */}
          {activeTab === 'csv' && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-4">
                <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-800" />
                  <span>Timetable CSV Import & Export</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bulk import train timetable schedules from a CSV format. The system automatically validates headers and mandatory data columns before saving.
                </p>

                {csvFeedback && (
                  <div
                    className={`p-3 rounded text-xs leading-relaxed ${
                      csvFeedback.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
                    }`}
                  >
                    <div>{csvFeedback.message}</div>
                    {csvFeedback.errors && (
                      <ul className="list-disc pl-4 mt-1 space-y-0.5">
                        {csvFeedback.errors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Paste CSV Data or Choose File:
                  </label>
                  <textarea
                    rows={6}
                    value={csvContent}
                    onChange={(e) => setCsvContent(e.target.value)}
                    placeholder={`"trainNumber","name","direction","originStation","destinationStation","arrivalTimeElla","departureTimeElla","operatingDays","platform","currentStatus","source"
"1005","Podi Menike","to_badulla","Colombo Fort (FOT)","Badulla (BDA)","15:14","15:17","Daily","Platform 1","On Time","SLR Main Line Timetable"`}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-xs font-mono text-slate-900"
                  ></textarea>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCSVImport}
                      className="px-4 py-2 bg-[#1b4332] text-amber-300 font-bold rounded text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Validate & Import CSV</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const csv = StorageService.exportTrainsToCSV();
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `ella-timetable-${new Date().toISOString().substring(0, 10)}.csv`;
                        a.click();
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-xs flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Current Timetable (CSV)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB D: SERVICE ALERTS */}
          {activeTab === 'alerts' && (
            <div className="space-y-6">
              {/* Add Alert Form */}
              <div className="bg-white p-5 rounded-lg border border-slate-200">
                <h3 className="font-serif font-bold text-sm text-slate-900 mb-3">Post New Service Announcement / Delay Notice</h3>
                <form onSubmit={handleAddAlert} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Notice Type</label>
                      <select
                        value={newAlertForm.type}
                        onChange={(e) => setNewAlertForm({ ...newAlertForm, type: e.target.value as any })}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                      >
                        <option value="advisory">Passenger Advisory</option>
                        <option value="delay">Train Delay Announcement</option>
                        <option value="cancellation">Train Cancellation</option>
                        <option value="maintenance">Track Maintenance Notice</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Headline Title *</label>
                      <input
                        type="text"
                        required
                        value={newAlertForm.title}
                        onChange={(e) => setNewAlertForm({ ...newAlertForm, title: e.target.value })}
                        placeholder="e.g. Ella Odyssey Monsoon Speed Restriction"
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Affected Train (Optional)</label>
                      <input
                        type="text"
                        value={newAlertForm.affectedTrain}
                        onChange={(e) => setNewAlertForm({ ...newAlertForm, affectedTrain: e.target.value })}
                        placeholder="e.g. Train 1041"
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Detailed Message *</label>
                    <textarea
                      rows={2}
                      required
                      value={newAlertForm.message}
                      onChange={(e) => setNewAlertForm({ ...newAlertForm, message: e.target.value })}
                      placeholder="Enter verified advisory message..."
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                    ></textarea>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#1b4332] text-amber-300 font-bold rounded text-xs"
                    >
                      Publish Announcement
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Alerts List */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="p-3 bg-slate-100 font-semibold text-xs text-slate-800 border-b border-slate-200">
                  Current Service Alerts ({alerts.length})
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {alerts.map(al => (
                    <div key={al.id} className="p-4 flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${al.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                            {al.active ? 'ACTIVE ON SITE' : 'INACTIVE'}
                          </span>
                          <strong className="text-slate-900">{al.title}</strong>
                          {al.affectedTrain && <span className="text-slate-500 font-mono">[{al.affectedTrain}]</span>}
                        </div>
                        <p className="text-slate-600 leading-relaxed">{al.message}</p>
                        <div className="text-[11px] text-slate-400">
                          Source: {al.source} · Last verified: {al.lastVerified}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            StorageService.updateAlert({ ...al, active: !al.active });
                            reloadData();
                          }}
                          className={`px-2.5 py-1 rounded text-xs font-semibold ${al.active ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'}`}
                        >
                          {al.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            StorageService.deleteAlert(al.id);
                            reloadData();
                          }}
                          className="p-1 text-slate-400 hover:text-rose-700"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB E: FARES */}
          {activeTab === 'fares' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">From</th>
                      <th className="py-2.5 px-3">To Destination</th>
                      <th className="py-2.5 px-3 text-center">Distance</th>
                      <th className="py-2.5 px-3 text-right">3rd Class</th>
                      <th className="py-2.5 px-3 text-right">2nd Class</th>
                      <th className="py-2.5 px-3 text-right">1st Class</th>
                      <th className="py-2.5 px-3">Source & Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fares.map(f => (
                      <tr key={f.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-semibold text-slate-900">{f.fromStation}</td>
                        <td className="py-2 px-3 text-slate-800">{f.toStation}</td>
                        <td className="py-2 px-3 text-center font-mono">{f.distanceKm} km</td>
                        <td className="py-2 px-3 text-right font-mono">LKR {f.thirdClassFare}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-emerald-900">LKR {f.secondClassFare}</td>
                        <td className="py-2 px-3 text-right font-mono">{f.firstClassFare ? `LKR ${f.firstClassFare}` : '—'}</td>
                        <td className="py-2 px-3 text-slate-500 text-[11px]">{f.source} ({f.lastVerified})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB F: ATTRACTIONS */}
          {activeTab === 'attractions' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attractions.map(attr => (
                  <div key={attr.id} className="bg-white p-4 rounded-lg border border-slate-200 flex gap-4 text-xs">
                    <img src={attr.imageUrl} alt={attr.name} className="w-24 h-24 object-cover rounded shrink-0 bg-slate-100" />
                    <div className="flex-1 space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm">{attr.name}</h4>
                      <p className="text-slate-600 line-clamp-2">{attr.description}</p>
                      <div className="text-slate-500 font-medium">Distance: {attr.distanceKm} km from Ella Station</div>
                      <div className="text-[10px] text-slate-400 truncate">{attr.imageAttribution}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB G: FEEDBACK MANAGEMENT */}
          {activeTab === 'feedback' && (
            <div className="space-y-4">
              {feedback.length === 0 ? (
                <div className="p-8 bg-white rounded-lg border border-slate-200 text-center text-slate-500 text-xs">
                  No passenger feedback or inquiries submitted yet.
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  {feedback.map(fb => (
                    <div key={fb.id} className="bg-white p-4 rounded-lg border border-slate-200 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            <span>{fb.name}</span>
                            <span className="text-xs font-normal text-slate-500">&lt;{fb.email}&gt;</span>
                            {fb.contactNumber && <span className="text-xs text-slate-500 font-mono">({fb.contactNumber})</span>}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Category: <strong className="text-slate-700">{fb.category}</strong> · Submitted: {fb.submittedAt}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={fb.status}
                            onChange={(e) => {
                              StorageService.updateFeedbackStatus(fb.id, e.target.value as any, fb.adminNotes);
                              reloadData();
                            }}
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              fb.status === 'Resolved' ? 'bg-emerald-100 text-emerald-900' :
                              fb.status === 'In Progress' ? 'bg-blue-100 text-blue-900' : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded border border-slate-100 text-slate-800 leading-relaxed">
                        {fb.message}
                      </div>

                      {/* Internal Admin Private Note */}
                      <div className="pt-2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Internal Station Master Note (Private - Not exposed to visitors):
                        </label>
                        <input
                          type="text"
                          defaultValue={fb.adminNotes || ''}
                          onBlur={(e) => {
                            StorageService.updateFeedbackStatus(fb.id, fb.status, e.target.value);
                            reloadData();
                          }}
                          placeholder="Add private investigation or resolution notes..."
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-900"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB H: CONTACTS */}
          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {contacts.map(c => (
                  <div key={c.id} className="bg-white p-4 rounded-lg border border-slate-200 space-y-1.5">
                    <div className="font-bold text-slate-900 text-sm">{c.serviceName}</div>
                    <div className="font-mono text-emerald-900 font-bold">{c.phoneNumber}</div>
                    <p className="text-slate-600">{c.description}</p>
                    <div className="text-[11px] text-slate-500">Location: {c.location} · Hours: {c.operatingHours}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB I: WEBSITE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white p-5 rounded-lg border border-slate-200 max-w-2xl space-y-4 text-xs sm:text-sm">
              <h3 className="font-serif font-bold text-base text-slate-900">Website Configuration Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Station Master Enquiry Recipient Email</label>
                  <input
                    type="email"
                    value={settings.stationMasterEmail}
                    onChange={(e) => setSettings({ ...settings, stationMasterEmail: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Official Sri Lanka Railways Portal Link</label>
                  <input
                    type="url"
                    value={settings.officialRailwayUrl}
                    onChange={(e) => setSettings({ ...settings, officialRailwayUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Google Maps Directions URL</label>
                  <input
                    type="url"
                    value={settings.googleMapsDirectionsUrl}
                    onChange={(e) => setSettings({ ...settings, googleMapsDirectionsUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Station Telephone Hotline</label>
                  <input
                    type="text"
                    value={settings.emergencyHotline}
                    onChange={(e) => setSettings({ ...settings, emergencyHotline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      StorageService.saveSettings(settings);
                      alert('Website settings saved successfully!');
                      reloadData();
                    }}
                    className="px-4 py-2 bg-[#1b4332] text-amber-300 font-bold rounded text-xs"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB J: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden text-xs">
              <div className="p-3 bg-slate-100 font-semibold text-slate-800 border-b border-slate-200">
                Security & Administrative Audit Records (Chronological)
              </div>
              <div className="divide-y divide-slate-100 font-mono">
                {auditLogs.map(log => (
                  <div key={log.id} className="p-3 flex items-start justify-between gap-3 hover:bg-slate-50">
                    <div>
                      <div className="font-bold text-emerald-950 flex items-center gap-2">
                        <span>[{log.action}]</span>
                        <span className="font-normal text-slate-600">by {log.user}</span>
                      </div>
                      <div className="text-slate-800 font-sans mt-0.5">{log.details}</div>
                    </div>
                    <div className="text-[11px] text-slate-400 shrink-0">{log.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
