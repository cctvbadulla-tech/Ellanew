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
import {
  INITIAL_TRAINS,
  INITIAL_ALERTS,
  INITIAL_FARES,
  INITIAL_ATTRACTIONS,
  INITIAL_CONTACTS,
  INITIAL_SETTINGS
} from '../data/initialData';

const STORAGE_KEYS = {
  TRAINS: 'ella_trains_v1',
  ALERTS: 'ella_alerts_v1',
  FARES: 'ella_fares_v1',
  ATTRACTIONS: 'ella_attractions_v1',
  CONTACTS: 'ella_contacts_v1',
  FEEDBACK: 'ella_feedback_v1',
  AUDIT_LOGS: 'ella_audit_logs_v1',
  SETTINGS: 'ella_settings_v1',
  ADMIN_AUTH: 'ella_admin_auth_v1',
  ADMIN_FAILED_ATTEMPTS: 'ella_admin_failed_attempts_v1'
};

interface AdminAuthState {
  isAuthenticated: boolean;
  username: string;
  mustChangePassword: boolean;
  passwordHash: string; // Stored securely
  sessionExpiry?: number;
}

// Initial hashed password for "Admin1234" (SHA-256 equivalent representation)
const INITIAL_ADMIN_HASH = 'c90eb2cf4b92b67e7c8ecad8708fd7976e8a4d46c8ab9741fd7790b5fc912389';

// Simple fast SHA-256 hash using crypto.subtle or fallback
async function sha256(message: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback hash
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    hash = (hash << 5) - hash + message.charCodeAt(i);
    hash |= 0;
  }
  return 'fb_' + Math.abs(hash).toString(16);
}

export const StorageService = {
  // --- Trains ---
  getTrains(): Train[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRAINS);
      return data ? JSON.parse(data) : INITIAL_TRAINS;
    } catch {
      return INITIAL_TRAINS;
    }
  },

  saveTrains(trains: Train[], user = 'Admin'): void {
    localStorage.setItem(STORAGE_KEYS.TRAINS, JSON.stringify(trains));
    this.addAuditLog(user, 'UPDATE_TRAINS', `Saved ${trains.length} trains to timetable database.`);
  },

  addTrain(train: Omit<Train, 'id'>, user = 'Admin'): Train {
    const trains = this.getTrains();
    const newTrain: Train = {
      ...train,
      id: `train-${Date.now()}`
    };
    trains.unshift(newTrain);
    this.saveTrains(trains, user);
    this.addAuditLog(user, 'CREATE_TRAIN', `Added train #${newTrain.trainNumber} - ${newTrain.name}`);
    return newTrain;
  },

  updateTrain(updatedTrain: Train, user = 'Admin'): void {
    const trains = this.getTrains();
    const index = trains.findIndex(t => t.id === updatedTrain.id);
    if (index !== -1) {
      trains[index] = updatedTrain;
      this.saveTrains(trains, user);
      this.addAuditLog(user, 'UPDATE_TRAIN', `Updated train #${updatedTrain.trainNumber} - ${updatedTrain.name}`);
    }
  },

  deleteTrain(id: string, user = 'Admin'): void {
    const trains = this.getTrains();
    const trainToDelete = trains.find(t => t.id === id);
    const filtered = trains.filter(t => t.id !== id);
    this.saveTrains(filtered, user);
    this.addAuditLog(user, 'DELETE_TRAIN', `Deleted train ${trainToDelete?.trainNumber || id}`);
  },

  // --- Alerts ---
  getAlerts(): ServiceAlert[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALERTS);
      return data ? JSON.parse(data) : INITIAL_ALERTS;
    } catch {
      return INITIAL_ALERTS;
    }
  },

  saveAlerts(alerts: ServiceAlert[], user = 'Admin'): void {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  },

  addAlert(alert: Omit<ServiceAlert, 'id' | 'publishedAt'>, user = 'Admin'): ServiceAlert {
    const alerts = this.getAlerts();
    const newAlert: ServiceAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      publishedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    alerts.unshift(newAlert);
    this.saveAlerts(alerts, user);
    this.addAuditLog(user, 'CREATE_ALERT', `Created service alert: "${newAlert.title}"`);
    return newAlert;
  },

  updateAlert(updatedAlert: ServiceAlert, user = 'Admin'): void {
    const alerts = this.getAlerts();
    const idx = alerts.findIndex(a => a.id === updatedAlert.id);
    if (idx !== -1) {
      alerts[idx] = updatedAlert;
      this.saveAlerts(alerts, user);
      this.addAuditLog(user, 'UPDATE_ALERT', `Updated alert status: "${updatedAlert.title}" (Active: ${updatedAlert.active})`);
    }
  },

  deleteAlert(id: string, user = 'Admin'): void {
    const alerts = this.getAlerts();
    const filtered = alerts.filter(a => a.id !== id);
    this.saveAlerts(filtered, user);
    this.addAuditLog(user, 'DELETE_ALERT', `Removed alert ID: ${id}`);
  },

  // --- Fares ---
  getFares(): FareRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FARES);
      return data ? JSON.parse(data) : INITIAL_FARES;
    } catch {
      return INITIAL_FARES;
    }
  },

  saveFares(fares: FareRecord[], user = 'Admin'): void {
    localStorage.setItem(STORAGE_KEYS.FARES, JSON.stringify(fares));
    this.addAuditLog(user, 'UPDATE_FARES', `Updated tariff table with ${fares.length} station pairs.`);
  },

  addFare(fare: Omit<FareRecord, 'id'>, user = 'Admin'): FareRecord {
    const fares = this.getFares();
    const newFare: FareRecord = {
      ...fare,
      id: `fare-${Date.now()}`
    };
    fares.push(newFare);
    this.saveFares(fares, user);
    return newFare;
  },

  updateFare(fare: FareRecord, user = 'Admin'): void {
    const fares = this.getFares();
    const idx = fares.findIndex(f => f.id === fare.id);
    if (idx !== -1) {
      fares[idx] = fare;
      this.saveFares(fares, user);
    }
  },

  deleteFare(id: string, user = 'Admin'): void {
    const fares = this.getFares();
    const filtered = fares.filter(f => f.id !== id);
    this.saveFares(filtered, user);
  },

  // --- Attractions ---
  getAttractions(): TouristAttraction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTRACTIONS);
      if (!data) return INITIAL_ATTRACTIONS;
      const list: TouristAttraction[] = JSON.parse(data);
      return list.map(item => {
        const initial = INITIAL_ATTRACTIONS.find(ia => ia.id === item.id);
        if (initial && (!item.imageUrl || item.imageUrl.includes('unsplash.com'))) {
          return { ...item, imageUrl: initial.imageUrl, imageAttribution: initial.imageAttribution };
        }
        return item;
      });
    } catch {
      return INITIAL_ATTRACTIONS;
    }
  },

  saveAttractions(attractions: TouristAttraction[], user = 'Admin'): void {
    localStorage.setItem(STORAGE_KEYS.ATTRACTIONS, JSON.stringify(attractions));
    this.addAuditLog(user, 'UPDATE_ATTRACTIONS', `Updated tourist attractions list (${attractions.length} spots).`);
  },

  addAttraction(attraction: Omit<TouristAttraction, 'id'>, user = 'Admin'): TouristAttraction {
    const attractions = this.getAttractions();
    const newAttr: TouristAttraction = {
      ...attraction,
      id: `attr-${Date.now()}`
    };
    attractions.push(newAttr);
    this.saveAttractions(attractions, user);
    return newAttr;
  },

  updateAttraction(attraction: TouristAttraction, user = 'Admin'): void {
    const attractions = this.getAttractions();
    const idx = attractions.findIndex(a => a.id === attraction.id);
    if (idx !== -1) {
      attractions[idx] = attraction;
      this.saveAttractions(attractions, user);
    }
  },

  deleteAttraction(id: string, user = 'Admin'): void {
    const attractions = this.getAttractions();
    const filtered = attractions.filter(a => a.id !== id);
    this.saveAttractions(filtered, user);
  },

  // --- Contacts ---
  getContacts(): EmergencyContact[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      return data ? JSON.parse(data) : INITIAL_CONTACTS;
    } catch {
      return INITIAL_CONTACTS;
    }
  },

  saveContacts(contacts: EmergencyContact[], user = 'Admin'): void {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  },

  addContact(contact: Omit<EmergencyContact, 'id'>, user = 'Admin'): EmergencyContact {
    const contacts = this.getContacts();
    const newContact: EmergencyContact = {
      ...contact,
      id: `contact-${Date.now()}`
    };
    contacts.push(newContact);
    this.saveContacts(contacts, user);
    this.addAuditLog(user, 'CREATE_CONTACT', `Added emergency contact: ${newContact.serviceName}`);
    return newContact;
  },

  updateContact(contact: EmergencyContact, user = 'Admin'): void {
    const contacts = this.getContacts();
    const idx = contacts.findIndex(c => c.id === contact.id);
    if (idx !== -1) {
      contacts[idx] = contact;
      this.saveContacts(contacts, user);
    }
  },

  deleteContact(id: string, user = 'Admin'): void {
    const contacts = this.getContacts();
    const filtered = contacts.filter(c => c.id !== id);
    this.saveContacts(filtered, user);
  },

  // --- Feedback ---
  getFeedback(): FeedbackSubmission[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  submitFeedback(
    submission: Omit<FeedbackSubmission, 'id' | 'submittedAt' | 'status' | 'notificationStatus'>
  ): FeedbackSubmission {
    const list = this.getFeedback();
    const item: FeedbackSubmission = {
      ...submission,
      id: `fb-${Date.now()}`,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Pending',
      notificationStatus: 'sent'
    };
    list.unshift(item);
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(list));

    // Simulated email delivery to configured station master
    const settings = this.getSettings();
    console.info(`[Email Dispatch Simulation] Feedback #${item.id} from ${item.name} dispatched to ${settings.stationMasterEmail}`);
    return item;
  },

  updateFeedbackStatus(id: string, status: FeedbackSubmission['status'], adminNotes?: string, user = 'Admin'): void {
    const list = this.getFeedback();
    const idx = list.findIndex(f => f.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      if (adminNotes !== undefined) {
        list[idx].adminNotes = adminNotes;
      }
      localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(list));
      this.addAuditLog(user, 'UPDATE_FEEDBACK', `Updated feedback #${id} status to ${status}`);
    }
  },

  // --- Settings ---
  getSettings(): WebsiteSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  saveSettings(settings: WebsiteSettings, user = 'Admin'): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    this.addAuditLog(user, 'UPDATE_SETTINGS', 'Updated website configuration parameters.');
  },

  // --- Audit Logs ---
  getAuditLogs(): AuditLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return data ? JSON.parse(data) : [
        {
          id: 'log-1',
          timestamp: '2026-10-09 18:00:00',
          user: 'System',
          action: 'INITIALIZE_TIMETABLE',
          details: 'Station schedules initialized with official Sri Lanka Railways Main Line working timetable.'
        }
      ];
    } catch {
      return [];
    }
  },

  addAuditLog(user: string, action: string, details: string): void {
    try {
      const logs = this.getAuditLogs();
      logs.unshift({
        id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user,
        action,
        details
      });
      // Keep last 100 logs
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 100)));
    } catch (e) {
      console.warn('Could not record audit log', e);
    }
  },

  // --- Admin Authentication ---
  getAdminAuth(): AdminAuthState {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
      if (data) {
        const state: AdminAuthState = JSON.parse(data);
        // check session expiry (2 hours)
        if (state.sessionExpiry && state.sessionExpiry < Date.now()) {
          return {
            isAuthenticated: false,
            username: 'Admin',
            mustChangePassword: state.mustChangePassword,
            passwordHash: state.passwordHash
          };
        }
        return state;
      }
    } catch {
      // ignore
    }
    return {
      isAuthenticated: false,
      username: 'Admin',
      mustChangePassword: true,
      passwordHash: INITIAL_ADMIN_HASH
    };
  },

  getFailedLoginAttempts(): { count: number; lockedUntil: number } {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ADMIN_FAILED_ATTEMPTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return { count: 0, lockedUntil: 0 };
  },

  recordFailedLogin(): { count: number; isLocked: boolean; lockTimeRemaining: number } {
    const current = this.getFailedLoginAttempts();
    const now = Date.now();
    const newCount = current.count + 1;
    let lockedUntil = current.lockedUntil;

    // Rate-limiting: lock out for 30 seconds after 3 failed attempts
    if (newCount >= 3) {
      lockedUntil = now + 30000;
    }

    const state = { count: newCount, lockedUntil };
    localStorage.setItem(STORAGE_KEYS.ADMIN_FAILED_ATTEMPTS, JSON.stringify(state));

    const isLocked = lockedUntil > now;
    const lockTimeRemaining = Math.max(0, Math.ceil((lockedUntil - now) / 1000));
    return { count: newCount, isLocked, lockTimeRemaining };
  },

  clearFailedLoginAttempts(): void {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_FAILED_ATTEMPTS);
  },

  async loginAdmin(username: string, passwordPlain: string): Promise<{ success: boolean; mustChangePassword?: boolean; message?: string }> {
    const failedStatus = this.getFailedLoginAttempts();
    const now = Date.now();
    if (failedStatus.lockedUntil > now) {
      const waitSec = Math.ceil((failedStatus.lockedUntil - now) / 1000);
      return {
        success: false,
        message: `Too many failed attempts. Security rate-limit active. Please wait ${waitSec}s.`
      };
    }

    const currentAuth = this.getAdminAuth();

    // Check username (case-insensitive for Admin)
    if (username.trim().toLowerCase() !== currentAuth.username.toLowerCase()) {
      const failed = this.recordFailedLogin();
      this.addAuditLog('Anonymous', 'FAILED_LOGIN', `Failed login attempt with username: ${username}`);
      return {
        success: false,
        message: failed.isLocked
          ? `Invalid credentials. Account locked for ${failed.lockTimeRemaining}s due to multiple failed attempts.`
          : 'Invalid username or password.'
      };
    }

    // Verify password hash
    const inputHash = await sha256(passwordPlain);
    let isMatch = false;

    // Direct check against stored hash or initial "Admin1234"
    if (currentAuth.passwordHash === INITIAL_ADMIN_HASH) {
      isMatch = passwordPlain === 'Admin1234' || inputHash === INITIAL_ADMIN_HASH;
    } else {
      isMatch = inputHash === currentAuth.passwordHash;
    }

    if (!isMatch) {
      const failed = this.recordFailedLogin();
      this.addAuditLog('Anonymous', 'FAILED_LOGIN', `Failed password attempt for user ${username}`);
      return {
        success: false,
        message: failed.isLocked
          ? `Invalid credentials. Account locked for ${failed.lockTimeRemaining}s.`
          : 'Invalid username or password.'
      };
    }

    // Success! Clear failed attempts
    this.clearFailedLoginAttempts();

    const newAuthState: AdminAuthState = {
      isAuthenticated: true,
      username: currentAuth.username,
      mustChangePassword: currentAuth.mustChangePassword,
      passwordHash: currentAuth.passwordHash,
      sessionExpiry: Date.now() + 2 * 60 * 60 * 1000 // 2 hours
    };
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(newAuthState));
    this.addAuditLog(currentAuth.username, 'ADMIN_LOGIN', 'Administrator signed into station control dashboard.');

    return {
      success: true,
      mustChangePassword: currentAuth.mustChangePassword
    };
  },

  async changeAdminPassword(newPasswordPlain: string): Promise<{ success: boolean; message?: string }> {
    if (!newPasswordPlain || newPasswordPlain.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters long.' };
    }
    if (newPasswordPlain === 'Admin1234') {
      return { success: false, message: 'Please select a new, strong password distinct from the initial setup password.' };
    }

    const currentAuth = this.getAdminAuth();
    const newHash = await sha256(newPasswordPlain);

    const updatedAuth: AdminAuthState = {
      ...currentAuth,
      passwordHash: newHash,
      mustChangePassword: false,
      isAuthenticated: true,
      sessionExpiry: Date.now() + 2 * 60 * 60 * 1000
    };

    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(updatedAuth));
    this.addAuditLog(currentAuth.username, 'PASSWORD_CHANGE', 'Administrator updated and secured station master credentials.');
    return { success: true };
  },

  logoutAdmin(): void {
    const current = this.getAdminAuth();
    localStorage.setItem(
      STORAGE_KEYS.ADMIN_AUTH,
      JSON.stringify({
        ...current,
        isAuthenticated: false,
        sessionExpiry: 0
      })
    );
    this.addAuditLog(current.username, 'ADMIN_LOGOUT', 'Administrator session closed.');
  },

  // --- CSV Import / Export for Timetable ---
  parseCSVToTrains(csvText: string): { success: boolean; trains?: Train[]; errors?: string[] } {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 2) {
      return { success: false, errors: ['CSV file is empty or missing data rows.'] };
    }

    const header = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const requiredColumns = ['trainnumber', 'name', 'direction', 'originstation', 'destinationstation', 'arrivaltimeella', 'departuretimeella', 'operatingdays'];

    for (const col of requiredColumns) {
      if (!header.some(h => h.includes(col))) {
        return { success: false, errors: [`Missing required column: "${col}". Found headers: ${header.join(', ')}`] };
      }
    }

    const importedTrains: Train[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Simple CSV regex splitter that respects quotes
      const values = line.match(/(?:[^\s",]+|"[^"]*")+/g) || line.split(',');
      const cleanVals = values.map(v => v.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));

      const trainNumber = cleanVals[header.findIndex(h => h.includes('trainnumber'))] || '';
      const name = cleanVals[header.findIndex(h => h.includes('name'))] || '';
      const directionRaw = (cleanVals[header.findIndex(h => h.includes('direction'))] || 'to_badulla').toLowerCase();
      const originStation = cleanVals[header.findIndex(h => h.includes('originstation'))] || 'Colombo Fort (FOT)';
      const destinationStation = cleanVals[header.findIndex(h => h.includes('destinationstation'))] || 'Badulla (BDA)';
      const arrivalTimeElla = cleanVals[header.findIndex(h => h.includes('arrivaltimeella'))] || '12:00';
      const departureTimeElla = cleanVals[header.findIndex(h => h.includes('departuretimeella'))] || '12:05';
      const operatingDaysRaw = cleanVals[header.findIndex(h => h.includes('operatingdays'))] || 'Daily';
      const platform = cleanVals[header.findIndex(h => h.includes('platform'))] || 'Platform 1';

      if (!trainNumber || !name) {
        errors.push(`Row ${i + 1}: Missing Train Number or Train Name.`);
        continue;
      }

      const direction: 'to_badulla' | 'to_colombo' | 'to_kandy' =
        directionRaw.includes('colombo') ? 'to_colombo' :
        directionRaw.includes('kandy') ? 'to_kandy' : 'to_badulla';

      importedTrains.push({
        id: `train-csv-${Date.now()}-${i}`,
        trainNumber,
        name,
        direction,
        originStation,
        destinationStation,
        arrivalTimeElla,
        departureTimeElla,
        operatingDays: operatingDaysRaw.split(';').map(d => d.trim()),
        classes: ['2nd Class Reserved', '3rd Class Unreserved'],
        currentStatus: 'On Time',
        platform,
        lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
        source: 'Imported via Administrator CSV'
      });
    }

    if (importedTrains.length === 0) {
      return { success: false, errors: errors.length > 0 ? errors : ['No valid train records found in CSV.'] };
    }

    return { success: true, trains: importedTrains, errors };
  },

  exportTrainsToCSV(): string {
    const trains = this.getTrains();
    const headers = [
      'trainNumber',
      'name',
      'direction',
      'originStation',
      'destinationStation',
      'arrivalTimeElla',
      'departureTimeElla',
      'operatingDays',
      'platform',
      'currentStatus',
      'source'
    ];

    const rows = trains.map(t => [
      `"${t.trainNumber}"`,
      `"${t.name}"`,
      `"${t.direction}"`,
      `"${t.originStation}"`,
      `"${t.destinationStation}"`,
      `"${t.arrivalTimeElla}"`,
      `"${t.departureTimeElla}"`,
      `"${t.operatingDays.join(';')}"`,
      `"${t.platform}"`,
      `"${t.currentStatus}"`,
      `"${t.source}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
};
