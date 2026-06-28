import { create } from 'zustand';

export interface InventoryItem {
  id: string;
  name: string;
  nameHi: string;
  category: string;
  stock: number;
  minThreshold: number;
  unit: string;
  expiryDate: string;
  status: 'OPTIMAL' | 'LOW' | 'CRITICAL';
}

export interface BedStatus {
  total: number;
  occupied: number;
  available: number;
  icuTotal: number;
  icuOccupied: number;
}

export interface StaffStatus {
  doctorsExpected: number;
  doctorsPresent: number;
  nursesExpected: number;
  nursesPresent: number;
  attendanceRate: number;
}

export interface FootfallStatus {
  currentQueue: number;
  dailyTotal: number;
  estimatedWaitMinutes: number;
  triageUrgent: number;
}

export interface Facility {
  id: string;
  name: string;
  nameHi: string;
  type: 'PHC' | 'CHC';
  location: string;
  inventory: InventoryItem[];
  beds: BedStatus;
  staff: StaffStatus;
  footfall: FootfallStatus;
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'INFO' | 'ALERT' | 'TRANSFER' | 'SYNC' | 'MAINTENANCE' | 'STAFF';
  message: string;
  messageHi: string;
  facility: string;
}

export interface OfflineEvent {
  id: string;
  timestamp: string;
  type: 'CONSUMPTION' | 'PATIENT_TRIAGE';
  facilityId: string;
  summary: string;
}

export interface DiagnosticTest {
  id: string;
  facilityId: string;
  facilityName: string;
  testName: string;
  testNameHi: string;
  category: string;
  equipmentStatus: 'OPERATIONAL' | 'MAINTENANCE_REQUIRED' | 'LOW_REAGENTS';
  testsConductedToday: number;
  avgTurnaroundMinutes: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Medical Officer' | 'General Physician' | 'Senior Nurse' | 'Lab Technician';
  assignedFacility: string;
  assignedFacilityName: string;
  attendanceStatus: 'PRESENT' | 'ABSENT' | 'ON_LEAVE';
  biometricTimestamp: string;
}

interface HealthStore {
  role: 'Admin' | 'Pharmacist' | 'Doctor';
  language: 'en' | 'hi' | 'reg';
  activeTab: 'dashboard' | 'inventory' | 'patients' | 'beds' | 'staff' | 'tests' | 'analytics';
  offlineMode: boolean;
  offlineQueue: OfflineEvent[];
  syncNotification: string | null;
  crisisMode: boolean;
  transferApproved: boolean;
  facilities: Facility[];
  logs: LogEntry[];
  diagnosticTests: DiagnosticTest[];
  staffMembers: StaffMember[];
  
  setRole: (role: 'Admin' | 'Pharmacist' | 'Doctor') => void;
  setLanguage: (language: 'en' | 'hi' | 'reg') => void;
  setActiveTab: (tab: 'dashboard' | 'inventory' | 'patients' | 'beds' | 'staff' | 'tests' | 'analytics') => void;
  toggleOfflineMode: () => void;
  clearSyncNotification: () => void;
  logDailyConsumption: (facilityId: string, itemId: string, qty: number) => void;
  logPatientFootfall: (facilityId: string, urgent: boolean) => void;
  simulateCrisis: () => void;
  approveTransfer: () => void;
  allocateBed: (facilityId: string, isIcu: boolean) => void;
  releaseBed: (facilityId: string, isIcu: boolean) => void;
  redeployStaff: (staffId: string, targetFacilityId: string, targetFacilityName: string) => void;
  requestMaintenance: (testId: string) => void;
  addLog: (type: 'INFO' | 'ALERT' | 'TRANSFER' | 'SYNC' | 'MAINTENANCE' | 'STAFF', message: string, messageHi: string, facility: string) => void;
}

const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'phc-alpha',
    name: 'PHC Alpha (Mundawar)',
    nameHi: 'प्राथमिक स्वास्थ्य केंद्र अल्फा (मुंडावर)',
    type: 'PHC',
    location: 'North District Zone',
    status: 'OPTIMAL',
    inventory: [
      { id: 'amox', name: 'Amoxicillin 500mg', nameHi: 'एमोक्सिसिलिन 500mg', category: 'Antibiotics', stock: 65, minThreshold: 50, unit: 'Boxes', expiryDate: '2027-08', status: 'OPTIMAL' },
      { id: 'para', name: 'Paracetamol 650mg', nameHi: 'पैरासिटामोल 650mg', category: 'Antipyretics', stock: 120, minThreshold: 40, unit: 'Boxes', expiryDate: '2028-01', status: 'OPTIMAL' },
      { id: 'ors', name: 'ORS Packets', nameHi: 'ओआरएस पैकेट्स', category: 'Electrolytes', stock: 250, minThreshold: 100, unit: 'Packs', expiryDate: '2027-12', status: 'OPTIMAL' },
      { id: 'iv', name: 'IV Fluids (RL)', nameHi: 'आईवी फ्लुइड्स', category: 'Fluids', stock: 45, minThreshold: 30, unit: 'Bottles', expiryDate: '2026-11', status: 'OPTIMAL' }
    ],
    beds: { total: 10, occupied: 7, available: 3, icuTotal: 0, icuOccupied: 0 },
    staff: { doctorsExpected: 3, doctorsPresent: 3, nursesExpected: 5, nursesPresent: 5, attendanceRate: 100 },
    footfall: { currentQueue: 14, dailyTotal: 86, estimatedWaitMinutes: 22, triageUrgent: 2 }
  },
  {
    id: 'chc-beta',
    name: 'CHC Beta (Tijara)',
    nameHi: 'सामुदायिक स्वास्थ्य केंद्र बीटा (तिजारा)',
    type: 'CHC',
    location: 'Central District Zone',
    status: 'OPTIMAL',
    inventory: [
      { id: 'amox', name: 'Amoxicillin 500mg', nameHi: 'एमोक्सिसिलिन 500mg', category: 'Antibiotics', stock: 220, minThreshold: 80, unit: 'Boxes', expiryDate: '2027-10', status: 'OPTIMAL' },
      { id: 'para', name: 'Paracetamol 650mg', nameHi: 'पैरासिटामोल 650mg', category: 'Antipyretics', stock: 350, minThreshold: 100, unit: 'Boxes', expiryDate: '2028-04', status: 'OPTIMAL' },
      { id: 'ors', name: 'ORS Packets', nameHi: 'ओआरएस पैकेट्स', category: 'Electrolytes', stock: 600, minThreshold: 200, unit: 'Packs', expiryDate: '2028-02', status: 'OPTIMAL' },
      { id: 'iv', name: 'IV Fluids (RL)', nameHi: 'आईवी फ्लुइड्स', category: 'Fluids', stock: 180, minThreshold: 50, unit: 'Bottles', expiryDate: '2027-05', status: 'OPTIMAL' }
    ],
    beds: { total: 40, occupied: 28, available: 12, icuTotal: 8, icuOccupied: 5 },
    staff: { doctorsExpected: 12, doctorsPresent: 11, nursesExpected: 24, nursesPresent: 22, attendanceRate: 92 },
    footfall: { currentQueue: 28, dailyTotal: 245, estimatedWaitMinutes: 18, triageUrgent: 6 }
  },
  {
    id: 'phc-gamma',
    name: 'PHC Gamma (Kotkasim)',
    nameHi: 'प्राथमिक स्वास्थ्य केंद्र गामा (कोटकासिम)',
    type: 'PHC',
    location: 'East District Zone',
    status: 'WARNING',
    inventory: [
      { id: 'amox', name: 'Amoxicillin 500mg', nameHi: 'एमोक्सिसिलिन 500mg', category: 'Antibiotics', stock: 48, minThreshold: 50, unit: 'Boxes', expiryDate: '2027-04', status: 'LOW' },
      { id: 'para', name: 'Paracetamol 650mg', nameHi: 'पैरासिटामोल 650mg', category: 'Antipyretics', stock: 95, minThreshold: 40, unit: 'Boxes', expiryDate: '2027-09', status: 'OPTIMAL' },
      { id: 'ors', name: 'ORS Packets', nameHi: 'ओआरएस पैकेट्स', category: 'Electrolytes', stock: 120, minThreshold: 100, unit: 'Packs', expiryDate: '2027-11', status: 'OPTIMAL' },
      { id: 'iv', name: 'IV Fluids (RL)', nameHi: 'आईवी फ्लुइड्स', category: 'Fluids', stock: 25, minThreshold: 30, unit: 'Bottles', expiryDate: '2026-10', status: 'LOW' }
    ],
    beds: { total: 12, occupied: 11, available: 1, icuTotal: 0, icuOccupied: 0 },
    staff: { doctorsExpected: 4, doctorsPresent: 3, nursesExpected: 6, nursesPresent: 5, attendanceRate: 80 },
    footfall: { currentQueue: 22, dailyTotal: 140, estimatedWaitMinutes: 34, triageUrgent: 4 }
  },
  {
    id: 'phc-delta',
    name: 'PHC Delta (Bansur)',
    nameHi: 'प्राथमिक स्वास्थ्य केंद्र डेल्टा (बानसूर)',
    type: 'PHC',
    location: 'West District Zone',
    status: 'OPTIMAL',
    inventory: [
      { id: 'amox', name: 'Amoxicillin 500mg', nameHi: 'एमोक्सिसिलिन 500mg', category: 'Antibiotics', stock: 85, minThreshold: 50, unit: 'Boxes', expiryDate: '2027-11', status: 'OPTIMAL' },
      { id: 'para', name: 'Paracetamol 650mg', nameHi: 'पैरासिटामोल 650mg', category: 'Antipyretics', stock: 140, minThreshold: 40, unit: 'Boxes', expiryDate: '2028-02', status: 'OPTIMAL' },
      { id: 'ors', name: 'ORS Packets', nameHi: 'ओआरएस पैकेट्स', category: 'Electrolytes', stock: 310, minThreshold: 100, unit: 'Packs', expiryDate: '2028-06', status: 'OPTIMAL' },
      { id: 'iv', name: 'IV Fluids (RL)', nameHi: 'आईवी फ्लुइड्स', category: 'Fluids', stock: 60, minThreshold: 30, unit: 'Bottles', expiryDate: '2027-01', status: 'OPTIMAL' }
    ],
    beds: { total: 15, occupied: 9, available: 6, icuTotal: 0, icuOccupied: 0 },
    staff: { doctorsExpected: 4, doctorsPresent: 4, nursesExpected: 8, nursesPresent: 8, attendanceRate: 100 },
    footfall: { currentQueue: 10, dailyTotal: 95, estimatedWaitMinutes: 15, triageUrgent: 1 }
  },
  {
    id: 'chc-epsilon',
    name: 'CHC Epsilon (Behror)',
    nameHi: 'सामुदायिक स्वास्थ्य केंद्र एप्सिलॉन (बहरोड़)',
    type: 'CHC',
    location: 'South District Zone',
    status: 'OPTIMAL',
    inventory: [
      { id: 'amox', name: 'Amoxicillin 500mg', nameHi: 'एमोक्सिसिलिन 500mg', category: 'Antibiotics', stock: 190, minThreshold: 80, unit: 'Boxes', expiryDate: '2027-09', status: 'OPTIMAL' },
      { id: 'para', name: 'Paracetamol 650mg', nameHi: 'पैरासिटामोल 650mg', category: 'Antipyretics', stock: 280, minThreshold: 100, unit: 'Boxes', expiryDate: '2028-03', status: 'OPTIMAL' },
      { id: 'ors', name: 'ORS Packets', nameHi: 'ओआरएस पैकेट्स', category: 'Electrolytes', stock: 450, minThreshold: 200, unit: 'Packs', expiryDate: '2028-01', status: 'OPTIMAL' },
      { id: 'iv', name: 'IV Fluids (RL)', nameHi: 'आईवी फ्लुइड्स', category: 'Fluids', stock: 140, minThreshold: 50, unit: 'Bottles', expiryDate: '2027-04', status: 'OPTIMAL' }
    ],
    beds: { total: 50, occupied: 32, available: 18, icuTotal: 10, icuOccupied: 7 },
    staff: { doctorsExpected: 15, doctorsPresent: 14, nursesExpected: 30, nursesPresent: 29, attendanceRate: 95 },
    footfall: { currentQueue: 35, dailyTotal: 310, estimatedWaitMinutes: 20, triageUrgent: 5 }
  }
];

const INITIAL_LOGS: LogEntry[] = [
  { id: 'log-1', timestamp: new Date(Date.now() - 3600000 * 3).toLocaleTimeString(), type: 'INFO', message: 'All 5 health centres finished morning telemetry sync successfully.', messageHi: 'सभी 5 स्वास्थ्य केंद्रों ने सुबह का टेलीमेट्री सिंक सफलतापूर्वक पूरा किया।', facility: 'District HQ' },
  { id: 'log-2', timestamp: new Date(Date.now() - 3600000 * 2).toLocaleTimeString(), type: 'INFO', message: 'Doctor biometric attendance captured across district (94% active coverage).', messageHi: 'जिले भर में डॉक्टर बायोमेट्रिक उपस्थिति दर्ज की गई (94% सक्रिय कवरेज)।', facility: 'District HQ' },
  { id: 'log-3', timestamp: new Date(Date.now() - 3600000 * 1).toLocaleTimeString(), type: 'ALERT', message: 'PHC Gamma bed occupancy reached 91%. Monitoring overflow protocol.', messageHi: 'पीएचसी गामा में बिस्तर अधिभोग 91% तक पहुँच गया। अतिप्रवाह प्रोटोकॉल की निगरानी।', facility: 'PHC Gamma' }
];

const INITIAL_DIAGNOSTICS: DiagnosticTest[] = [
  { id: 'diag-1', facilityId: 'phc-alpha', facilityName: 'PHC Alpha (Mundawar)', testName: 'CBC Blood Analyser', testNameHi: 'सीबीसी रक्त विश्लेषक', category: 'Pathology', equipmentStatus: 'OPERATIONAL', testsConductedToday: 24, avgTurnaroundMinutes: 15 },
  { id: 'diag-2', facilityId: 'phc-alpha', facilityName: 'PHC Alpha (Mundawar)', testName: 'Blood Sugar & HbA1c Kits', testNameHi: 'ब्लड शुगर एवं HbA1c किट्स', category: 'Biochemistry', equipmentStatus: 'LOW_REAGENTS', testsConductedToday: 45, avgTurnaroundMinutes: 5 },
  { id: 'diag-3', facilityId: 'chc-beta', facilityName: 'CHC Beta (Tijara)', testName: 'Digital X-Ray Unit', testNameHi: 'डिजिटल एक्स-रे यूनिट', category: 'Radiology', equipmentStatus: 'OPERATIONAL', testsConductedToday: 38, avgTurnaroundMinutes: 25 },
  { id: 'diag-4', facilityId: 'chc-beta', facilityName: 'CHC Beta (Tijara)', testName: 'Advanced ECG Machine', testNameHi: 'उन्नत ईसीजी मशीन', category: 'Cardiology', equipmentStatus: 'OPERATIONAL', testsConductedToday: 18, avgTurnaroundMinutes: 10 },
  { id: 'diag-5', facilityId: 'phc-gamma', facilityName: 'PHC Gamma (Kotkasim)', testName: 'Dengue & Malaria Rapid Kits', testNameHi: 'डेंगू एवं मलेरिया रैपिड किट्स', category: 'Pathology', equipmentStatus: 'OPERATIONAL', testsConductedToday: 32, avgTurnaroundMinutes: 15 },
  { id: 'diag-6', facilityId: 'phc-delta', facilityName: 'PHC Delta (Bansur)', testName: 'Semi-Auto Biochemistry Analyser', testNameHi: 'सेमी-ऑटो बायोकेमिस्ट्री एनालाइजर', category: 'Biochemistry', equipmentStatus: 'MAINTENANCE_REQUIRED', testsConductedToday: 0, avgTurnaroundMinutes: 0 },
  { id: 'diag-7', facilityId: 'chc-epsilon', facilityName: 'CHC Epsilon (Behror)', testName: 'Digital Ultrasound Scanner', testNameHi: 'डिजिटल अल्ट्रासाउंड स्कैनर', category: 'Radiology', equipmentStatus: 'OPERATIONAL', testsConductedToday: 29, avgTurnaroundMinutes: 30 }
];

const INITIAL_STAFF: StaffMember[] = [
  { id: 'staff-1', name: 'Dr. Ramesh Sharma', role: 'Medical Officer', assignedFacility: 'phc-alpha', assignedFacilityName: 'PHC Alpha (Mundawar)', attendanceStatus: 'PRESENT', biometricTimestamp: '07:58 AM' },
  { id: 'staff-2', name: 'Dr. Sunita Rao', role: 'General Physician', assignedFacility: 'phc-alpha', assignedFacilityName: 'PHC Alpha (Mundawar)', attendanceStatus: 'PRESENT', biometricTimestamp: '08:05 AM' },
  { id: 'staff-3', name: 'Rajesh Kumar, RN', role: 'Senior Nurse', assignedFacility: 'phc-alpha', assignedFacilityName: 'PHC Alpha (Mundawar)', attendanceStatus: 'PRESENT', biometricTimestamp: '07:45 AM' },
  { id: 'staff-4', name: 'Dr. Arvind Patel', role: 'Medical Officer', assignedFacility: 'chc-beta', assignedFacilityName: 'CHC Beta (Tijara)', attendanceStatus: 'PRESENT', biometricTimestamp: '07:50 AM' },
  { id: 'staff-5', name: 'Dr. Meena Gupta', role: 'General Physician', assignedFacility: 'chc-beta', assignedFacilityName: 'CHC Beta (Tijara)', attendanceStatus: 'PRESENT', biometricTimestamp: '08:12 AM' },
  { id: 'staff-6', name: 'Vikram Singh, LT', role: 'Lab Technician', assignedFacility: 'chc-beta', assignedFacilityName: 'CHC Beta (Tijara)', attendanceStatus: 'ON_LEAVE', biometricTimestamp: 'N/A' },
  { id: 'staff-7', name: 'Dr. Suresh Yadav', role: 'Medical Officer', assignedFacility: 'phc-gamma', assignedFacilityName: 'PHC Gamma (Kotkasim)', attendanceStatus: 'ABSENT', biometricTimestamp: 'Unverified' },
  { id: 'staff-8', name: 'Pooja Verma, RN', role: 'Senior Nurse', assignedFacility: 'phc-gamma', assignedFacilityName: 'PHC Gamma (Kotkasim)', attendanceStatus: 'PRESENT', biometricTimestamp: '08:01 AM' },
  { id: 'staff-9', name: 'Dr. Alok Verma', role: 'Medical Officer', assignedFacility: 'phc-delta', assignedFacilityName: 'PHC Delta (Bansur)', attendanceStatus: 'PRESENT', biometricTimestamp: '07:55 AM' },
  { id: 'staff-10', name: 'Dr. Neha Chouhan', role: 'Medical Officer', assignedFacility: 'chc-epsilon', assignedFacilityName: 'CHC Epsilon (Behror)', attendanceStatus: 'PRESENT', biometricTimestamp: '07:59 AM' }
];

export const useHealthStore = create<HealthStore>((set, get) => ({
  role: 'Admin',
  language: 'en',
  activeTab: 'dashboard',
  offlineMode: false,
  offlineQueue: [],
  syncNotification: null,
  crisisMode: false,
  transferApproved: false,
  facilities: INITIAL_FACILITIES,
  logs: INITIAL_LOGS,
  diagnosticTests: INITIAL_DIAGNOSTICS,
  staffMembers: INITIAL_STAFF,

  setRole: (role) => set({ role }),
  setLanguage: (language) => set({ language }),
  setActiveTab: (activeTab) => set({ activeTab }),
  
  toggleOfflineMode: () => {
    const { offlineMode, offlineQueue } = get();
    if (offlineMode) {
      const queueCount = offlineQueue.length;
      set({ 
        offlineMode: false, 
        offlineQueue: [], 
        syncNotification: queueCount > 0 ? `Successfully synced ${queueCount} offline telemetry events to Central NHM Cloud!` : null
      });
      if (queueCount > 0) {
        get().addLog('SYNC', `Synced ${queueCount} cached local events to central cloud server upon connection restoration.`, `कनेक्शन बहाल होने पर ${queueCount} कैश्ड स्थानीय घटनाओं को सेंट्रल क्लाउड सर्वर से सिंक किया गया।`, 'Local Facility');
      }
    } else {
      set({ offlineMode: true, syncNotification: null });
    }
  },

  clearSyncNotification: () => set({ syncNotification: null }),

  logDailyConsumption: (facilityId, itemId, qty) => {
    const { offlineMode, offlineQueue, facilities } = get();
    if (offlineMode) {
      const newEvent: OfflineEvent = {
        id: `off-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'CONSUMPTION',
        facilityId,
        summary: `Logged consumption of ${qty} units for item #${itemId}`
      };
      set({ offlineQueue: [...offlineQueue, newEvent] });
    } else {
      const updatedFacilities = facilities.map(f => {
        if (f.id === facilityId) {
          const updatedInventory = f.inventory.map(item => {
            if (item.id === itemId) {
              const newStock = Math.max(0, item.stock - qty);
              const status = (newStock <= item.minThreshold / 2 ? 'CRITICAL' : newStock <= item.minThreshold ? 'LOW' : 'OPTIMAL') as 'CRITICAL' | 'LOW' | 'OPTIMAL';
              return { ...item, stock: newStock, status };
            }
            return item;
          });
          const hasCritical = updatedInventory.some(i => i.status === 'CRITICAL');
          const hasLow = updatedInventory.some(i => i.status === 'LOW');
          const status = (hasCritical ? 'CRITICAL' : hasLow ? 'WARNING' : 'OPTIMAL') as 'CRITICAL' | 'WARNING' | 'OPTIMAL';
          return { ...f, inventory: updatedInventory, status };
        }
        return f;
      });
      set({ facilities: updatedFacilities });
      get().addLog('INFO', `Deducted ${qty} units of item #${itemId} at ${facilityId}.`, `${facilityId} पर आइटम #${itemId} की ${qty} इकाइयाँ घटाई गईं।`, facilityId);
    }
  },

  logPatientFootfall: (facilityId, urgent) => {
    const { offlineMode, offlineQueue, facilities } = get();
    if (offlineMode) {
      const newEvent: OfflineEvent = {
        id: `off-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'PATIENT_TRIAGE',
        facilityId,
        summary: `Logged patient arrival (Triage: ${urgent ? 'Urgent' : 'General'})`
      };
      set({ offlineQueue: [...offlineQueue, newEvent] });
    } else {
      const updatedFacilities = facilities.map(f => {
        if (f.id === facilityId) {
          const newQueue = f.footfall.currentQueue + 1;
          const newTotal = f.footfall.dailyTotal + 1;
          const newUrgent = f.footfall.triageUrgent + (urgent ? 1 : 0);
          const newWait = Math.round(newQueue * 1.5);
          return { ...f, footfall: { currentQueue: newQueue, dailyTotal: newTotal, estimatedWaitMinutes: newWait, triageUrgent: newUrgent } };
        }
        return f;
      });
      set({ facilities: updatedFacilities });
      get().addLog('INFO', `Registered new patient check-in at ${facilityId} (Triage: ${urgent ? 'Urgent' : 'General'}).`, `${facilityId} पर नए रोगी का पंजीकरण (ट्रिएज: ${urgent ? 'तत्काल' : 'सामान्य'})।`, facilityId);
    }
  },

  simulateCrisis: () => {
    const { facilities } = get();
    const updatedFacilities = facilities.map(f => {
      if (f.id === 'phc-alpha') {
        const updatedInventory = f.inventory.map(item => {
          if (item.id === 'amox') {
            return { ...item, stock: 12, status: 'CRITICAL' as const };
          }
          return item;
        });
        return { 
          ...f, 
          status: 'CRITICAL' as const, 
          inventory: updatedInventory,
          footfall: { currentQueue: 42, dailyTotal: 184, estimatedWaitMinutes: 65, triageUrgent: 11 }
        };
      }
      return f;
    });

    set({ facilities: updatedFacilities, crisisMode: true, transferApproved: false, activeTab: 'dashboard' });
    get().addLog('ALERT', 'CRISIS SIMULATION: Sudden respiratory surge detected at PHC Alpha. Amoxicillin stock depleted to 12 boxes (Forecast: stock-out in 5 days).', 'संकट सिमुलेशन: पीएचसी अल्फा में अचानक श्वसन मामलों में वृद्धि। एमोक्सिसिलिन स्टॉक 12 बॉक्स तक घट गया (पूर्वानुमान: 5 दिनों में स्टॉक-आउट)।', 'PHC Alpha');
  },

  approveTransfer: () => {
    const { facilities } = get();
    const updatedFacilities = facilities.map(f => {
      if (f.id === 'phc-alpha') {
        const updatedInventory = f.inventory.map(item => {
          if (item.id === 'amox') {
            return { ...item, stock: 62, status: 'OPTIMAL' as const };
          }
          return item;
        });
        return { ...f, status: 'OPTIMAL' as const, inventory: updatedInventory };
      }
      if (f.id === 'chc-beta') {
        const updatedInventory = f.inventory.map(item => {
          if (item.id === 'amox') {
            return { ...item, stock: 170, status: 'OPTIMAL' as const };
          }
          return item;
        });
        return { ...f, inventory: updatedInventory };
      }
      return f;
    });

    set({ facilities: updatedFacilities, transferApproved: true });
    get().addLog('TRANSFER', 'TRANSFER EXECUTED: District Admin authorized redistribution of 50 Amoxicillin boxes from CHC Beta to PHC Alpha. Transport dispatched.', 'स्थानांतरण निष्पादित: जिला व्यवस्थापक ने सीएचसी बीटा से पीएचसी अल्फा में 50 एमोक्सिसिलिन बॉक्स के पुनर्वितरण को मंजूरी दी। परिवहन रवाना।', 'District HQ');
  },

  allocateBed: (facilityId, isIcu) => {
    const { facilities } = get();
    const updatedFacilities = facilities.map(f => {
      if (f.id === facilityId) {
        if (isIcu) {
          if (f.beds.icuOccupied < f.beds.icuTotal) {
            return { ...f, beds: { ...f.beds, icuOccupied: f.beds.icuOccupied + 1 } };
          }
        } else {
          if (f.beds.occupied < f.beds.total) {
            return { ...f, beds: { ...f.beds, occupied: f.beds.occupied + 1, available: f.beds.available - 1 } };
          }
        }
      }
      return f;
    });
    set({ facilities: updatedFacilities });
    get().addLog('INFO', `Allocated 1 ${isIcu ? 'ICU' : 'General'} bed at ${facilityId}.`, `${facilityId} पर 1 ${isIcu ? 'ICU' : 'सामान्य'} बिस्तर आबंटित किया गया।`, facilityId);
  },

  releaseBed: (facilityId, isIcu) => {
    const { facilities } = get();
    const updatedFacilities = facilities.map(f => {
      if (f.id === facilityId) {
        if (isIcu) {
          if (f.beds.icuOccupied > 0) {
            return { ...f, beds: { ...f.beds, icuOccupied: f.beds.icuOccupied - 1 } };
          }
        } else {
          if (f.beds.occupied > 0) {
            return { ...f, beds: { ...f.beds, occupied: f.beds.occupied - 1, available: f.beds.available + 1 } };
          }
        }
      }
      return f;
    });
    set({ facilities: updatedFacilities });
    get().addLog('INFO', `Released 1 ${isIcu ? 'ICU' : 'General'} bed at ${facilityId}.`, `${facilityId} पर 1 ${isIcu ? 'ICU' : 'सामान्य'} बिस्तर रिक्त किया गया।`, facilityId);
  },

  redeployStaff: (staffId, targetFacilityId, targetFacilityName) => {
    const { staffMembers } = get();
    const updatedStaff = staffMembers.map(s => {
      if (s.id === staffId) {
        return { ...s, assignedFacility: targetFacilityId, assignedFacilityName: targetFacilityName, attendanceStatus: 'PRESENT' as const, biometricTimestamp: 'Just Now (Redeployed)' };
      }
      return s;
    });
    set({ staffMembers: updatedStaff });
    get().addLog('STAFF', `STAFF REDEPLOYMENT: Reallocated healthcare worker #${staffId} to ${targetFacilityName} to manage high patient queue.`, `स्टाफ पुनर्नियोजन: उच्च मरीज कतार प्रबंधित करने के लिए स्वास्थ्यकर्मी #${staffId} को ${targetFacilityName} में पुनः नियुक्त किया गया।`, targetFacilityName);
  },

  requestMaintenance: (testId) => {
    const { diagnosticTests } = get();
    const updatedTests = diagnosticTests.map(t => {
      if (t.id === testId) {
        return { ...t, equipmentStatus: 'OPERATIONAL' as const };
      }
      return t;
    });
    set({ diagnosticTests: updatedTests });
    get().addLog('MAINTENANCE', `MAINTENANCE DISPATCH: Emergency biomedical engineering crew dispatched for diagnostic unit #${testId}. Status restored to OPERATIONAL.`, `रखरखाव प्रेषण: डायग्नोस्टिक यूनिट #${testId} के लिए आपातकालीन बायोमेडिकल इंजीनियरिंग टीम रवाना की गई। स्थिति पुनः चालू (OPERATIONAL) कर दी गई।`, 'District HQ');
  },

  addLog: (type, message, messageHi, facility) => {
    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      messageHi,
      facility
    };
    set({ logs: [newLog, ...get().logs] });
  }
}));
