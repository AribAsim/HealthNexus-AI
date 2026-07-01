import type { Facility } from '../store';

// Alwar district bounding box: ~27.15°N–28.20°N, 76.10°E–77.40°E
// Data represents realistic PHC/CHC profiles for Alwar district, Rajasthan

export interface FacilityWithCoords extends Facility {
  lat: number;
  lng: number;
  block: string; // tehsil/block name
  contactPhone: string;
  moName: string; // Medical Officer name
  riskScore?: number;
  riskLevel?: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  riskExplanation?: string;
  riskAction?: string;
}

export const alwarFacilities: FacilityWithCoords[] = [
  // ── ALWAR CITY BLOCK ─────────────────────────────────────────────────────
  {
    id: 'phc-alpha',
    name: 'PHC Alpha (Mundawar)',
    nameHi: 'प्राथमिक स्वास्थ्य केंद्र अल्फा (मुंडावर)',
    type: 'PHC',
    location: 'Mundawar, Alwar',
    block: 'Alwar City',
    lat: 27.5630, lng: 76.5950,
    contactPhone: '+91-144-2700101',
    moName: 'Dr. Ravi Shankar',
    status: 'CRITICAL',
    beds: { total: 6, occupied: 6, available: 0, icuTotal: 0, icuOccupied: 0 },
    staff: { doctorsExpected: 2, doctorsPresent: 1, nursesExpected: 4, nursesPresent: 3, attendanceRate: 75 },
    footfall: { currentQueue: 38, dailyTotal: 142, estimatedWaitMinutes: 45, triageUrgent: 6 },
    inventory: [
      { id: 'inv-a1', name: 'Amoxicillin 500mg', nameHi: 'एमोक्सिसिलिन 500mg', category: 'Antibiotics', stock: 12, minThreshold: 50, unit: 'boxes', expiryDate: '2025-09-30', status: 'CRITICAL' },
      { id: 'inv-a2', name: 'ORS Sachets', nameHi: 'ओआरएस पाउच', category: 'Essential', stock: 22, minThreshold: 100, unit: 'packs', expiryDate: '2026-03-15', status: 'LOW' },
      { id: 'inv-a3', name: 'Paracetamol 500mg', nameHi: 'पैरासिटामोल 500mg', category: 'Analgesics', stock: 180, minThreshold: 100, unit: 'strips', expiryDate: '2026-12-31', status: 'OPTIMAL' },
      { id: 'inv-a4', name: 'IV Fluids (NS)', nameHi: 'IV फ्लूइड', category: 'Emergency', stock: 8, minThreshold: 20, unit: 'bottles', expiryDate: '2026-06-30', status: 'CRITICAL' },
    ],
  },
  {
    id: 'chc-beta',
    name: 'CHC Beta (Tijara)',
    nameHi: 'सामुदायिक स्वास्थ्य केंद्र बीटा (तिजारा)',
    type: 'CHC',
    location: 'Tijara, Alwar',
    block: 'Tijara',
    lat: 27.9320, lng: 76.8210,
    contactPhone: '+91-144-2700102',
    moName: 'Dr. Meena Gupta',
    status: 'OPTIMAL',
    beds: { total: 30, occupied: 18, available: 12, icuTotal: 4, icuOccupied: 2 },
    staff: { doctorsExpected: 5, doctorsPresent: 5, nursesExpected: 10, nursesPresent: 9, attendanceRate: 97 },
    footfall: { currentQueue: 12, dailyTotal: 198, estimatedWaitMinutes: 12, triageUrgent: 1 },
    inventory: [
      { id: 'inv-b1', name: 'Amoxicillin 500mg', nameHi: 'एमोक्सिसिलिन 500mg', category: 'Antibiotics', stock: 220, minThreshold: 80, unit: 'boxes', expiryDate: '2026-08-15', status: 'OPTIMAL' },
      { id: 'inv-b2', name: 'ORS Sachets', nameHi: 'ओआरएस पाउच', category: 'Essential', stock: 310, minThreshold: 100, unit: 'packs', expiryDate: '2026-09-01', status: 'OPTIMAL' },
      { id: 'inv-b3', name: 'Paracetamol 500mg', nameHi: 'पैरासिटामोल 500mg', category: 'Analgesics', stock: 520, minThreshold: 100, unit: 'strips', expiryDate: '2027-01-31', status: 'OPTIMAL' },
      { id: 'inv-b4', name: 'IV Fluids (NS)', nameHi: 'IV फ्लूइड', category: 'Emergency', stock: 65, minThreshold: 20, unit: 'bottles', expiryDate: '2026-11-30', status: 'OPTIMAL' },
    ],
  },
  {
    id: 'phc-gamma',
    name: 'PHC Gamma (Kishangarh Bas)',
    nameHi: 'प्राथमिक स्वास्थ्य केंद्र गामा (किशनगढ़ बास)',
    type: 'PHC',
    location: 'Kishangarh Bas, Alwar',
    block: 'Kishangarh Bas',
    lat: 27.8400, lng: 76.5900,
    contactPhone: '+91-144-2700103',
    moName: 'Dr. Suresh Yadav',
    status: 'WARNING',
    beds: { total: 6, occupied: 5, available: 1, icuTotal: 0, icuOccupied: 0 },
    staff: { doctorsExpected: 2, doctorsPresent: 2, nursesExpected: 4, nursesPresent: 3, attendanceRate: 83 },
    footfall: { currentQueue: 24, dailyTotal: 118, estimatedWaitMinutes: 28, triageUrgent: 3 },
    inventory: [
      { id: 'inv-c1', name: 'Amoxicillin 500mg', nameHi: 'एमोक्सिसिलिन 500mg', category: 'Antibiotics', stock: 45, minThreshold: 50, unit: 'boxes', expiryDate: '2026-05-20', status: 'LOW' },
      { id: 'inv-c2', name: 'ORS Sachets', nameHi: 'ओआरएस पाउच', category: 'Essential', stock: 88, minThreshold: 100, unit: 'packs', expiryDate: '2026-07-01', status: 'LOW' },
      { id: 'inv-c3', name: 'Paracetamol 500mg', nameHi: 'पैरासिटामोल 500mg', category: 'Analgesics', stock: 240, minThreshold: 100, unit: 'strips', expiryDate: '2026-10-31', status: 'OPTIMAL' },
      { id: 'inv-c4', name: 'IV Fluids (NS)', nameHi: 'IV फ्लूइड', category: 'Emergency', stock: 15, minThreshold: 20, unit: 'bottles', expiryDate: '2026-08-15', status: 'LOW' },
    ],
  },
  // ── BEHROR BLOCK ─────────────────────────────────────────────────────────
  {
    id: 'chc-epsilon',
    name: 'CHC Epsilon (Behror)',
    nameHi: 'सामुदायिक स्वास्थ्य केंद्र एप्सिलॉन (बहरोड़)',
    type: 'CHC',
    location: 'Behror, Alwar',
    block: 'Behror',
    lat: 27.8900, lng: 76.3200,
    contactPhone: '+91-144-2700104',
    moName: 'Dr. Anjali Sharma',
    status: 'OPTIMAL',
    beds: { total: 30, occupied: 14, available: 16, icuTotal: 4, icuOccupied: 1 },
    staff: { doctorsExpected: 5, doctorsPresent: 4, nursesExpected: 10, nursesPresent: 10, attendanceRate: 96 },
    footfall: { currentQueue: 8, dailyTotal: 155, estimatedWaitMinutes: 10, triageUrgent: 0 },
    inventory: [
      { id: 'inv-e1', name: 'Amoxicillin 500mg', nameHi: 'एमोक्सिसिलिन 500mg', category: 'Antibiotics', stock: 195, minThreshold: 80, unit: 'boxes', expiryDate: '2026-09-30', status: 'OPTIMAL' },
      { id: 'inv-e2', name: 'ORS Sachets', nameHi: 'ओआरएस पाउच', category: 'Essential', stock: 280, minThreshold: 100, unit: 'packs', expiryDate: '2026-11-15', status: 'OPTIMAL' },
      { id: 'inv-e3', name: 'Paracetamol 500mg', nameHi: 'पैरासिटामोल 500mg', category: 'Analgesics', stock: 410, minThreshold: 100, unit: 'strips', expiryDate: '2027-02-28', status: 'OPTIMAL' },
      { id: 'inv-e4', name: 'IV Fluids (NS)', nameHi: 'IV फ्लूइड', category: 'Emergency', stock: 55, minThreshold: 20, unit: 'bottles', expiryDate: '2026-12-31', status: 'OPTIMAL' },
    ],
  },
  {
    id: 'phc-behror-2',
    name: 'PHC Rewasan',
    nameHi: 'प्राथमिक स्वास्थ्य केंद्र रेवासन',
    type: 'PHC',
    location: 'Rewasan, Behror',
    block: 'Behror',
    lat: 27.9100, lng: 76.2900,
    contactPhone: '+91-144-2700120',
    moName: 'Dr. Pankaj Verma',
    status: 'WARNING',
    beds: { total: 6, occupied: 4, available: 2, icuTotal: 0, icuOccupied: 0 },
    staff: { doctorsExpected: 2, doctorsPresent: 1, nursesExpected: 4, nursesPresent: 4, attendanceRate: 83 },
    footfall: { currentQueue: 18, dailyTotal: 89, estimatedWaitMinutes: 22, triageUrgent: 2 },
    inventory: [
      { id: 'inv-r1', name: 'Amoxicillin 500mg', nameHi: 'एमोक्सिसिलिन 500mg', category: 'Antibiotics', stock: 30, minThreshold: 50, unit: 'boxes', expiryDate: '2026-06-30', status: 'LOW' },
      { id: 'inv-r2', name: 'ORS Sachets', nameHi: 'ओआरएस पाउच', category: 'Essential', stock: 120, minThreshold: 100, unit: 'packs', expiryDate: '2026-08-15', status: 'OPTIMAL' },
      { id: 'inv-r3', name: 'Paracetamol 500mg', nameHi: 'पैरासिटामोल 500mg', category: 'Analgesics', stock: 160, minThreshold: 100, unit: 'strips', expiryDate: '2026-11-30', status: 'OPTIMAL' },
      { id: 'inv-r4', name: 'IV Fluids (NS)', nameHi: 'IV फ्लूइड', category: 'Emergency', stock: 18, minThreshold: 20, unit: 'bottles', expiryDate: '2026-07-31', status: 'LOW' },
    ],
  },
  // ── KOTKASIM BLOCK ───────────────────────────────────────────────────────
  {
    id: 'phc-kotkasim',
    name: 'PHC Kotkasim',
    nameHi: 'प्राथमिक स्वास्थ्य केंद्र कोटकासिम',
    type: 'PHC',
    location: 'Kotkasim, Alwar',
    block: 'Kotkasim',
    lat: 27.7500, lng: 76.4800,
    contactPhone: '+91-144-2700105',
    moName: 'Dr. Harish Bhandari',
    status: 'CRITICAL',
    beds: { total: 6, occupied: 6, available: 0, icuTotal: 0, icuOccupied: 0 },
    staff: { doctorsExpected: 2, doctorsPresent: 2, nursesExpected: 4, nursesPresent: 2, attendanceRate: 75 },
    footfall: { currentQueue: 42, dailyTotal: 176, estimatedWaitMinutes: 55, triageUrgent: 8 },
    inventory: [
      { id: 'inv-k1', name: 'Amoxicillin 500mg', nameHi: 'एमोक्सिसिलिन 500mg', category: 'Antibiotics', stock: 8, minThreshold: 50, unit: 'boxes', expiryDate: '2026-05-15', status: 'CRITICAL' },
      { id: 'inv-k2', name: 'ORS Sachets', nameHi: 'ओआरएस पाउच', category: 'Essential', stock: 15, minThreshold: 100, unit: 'packs', expiryDate: '2026-08-01', status: 'CRITICAL' },
      { id: 'inv-k3', name: 'Paracetamol 500mg', nameHi: 'पैरासिटामोल 500mg', category: 'Analgesics', stock: 60, minThreshold: 100, unit: 'strips', expiryDate: '2026-10-31', status: 'LOW' },
      { id: 'inv-k4', name: 'IV Fluids (NS)', nameHi: 'IV फ्लूइड', category: 'Emergency', stock: 5, minThreshold: 20, unit: 'bottles', expiryDate: '2026-06-15', status: 'CRITICAL' },
    ],
  },
  // ── RAJGARH BLOCK ────────────────────────────────────────────────────────
  {
    id: 'phc-rajgarh',
    name: 'PHC Rajgarh',
    nameHi: 'प्राथमिक स्वास्थ्य केंद्र राजगढ़',
    type: 'PHC',
    location: 'Rajgarh, Alwar',
    block: 'Rajgarh',
    lat: 27.2400, lng: 76.6200,
    contactPhone: '+91-144-2700106',
    moName: 'Dr. Seema Joshi',
    status: 'OPTIMAL',
    beds: { total: 6, occupied: 3, available: 3, icuTotal: 0, icuOccupied: 0 },
    staff: { doctorsExpected: 2, doctorsPresent: 2, nursesExpected: 4, nursesPresent: 4, attendanceRate: 100 },
    footfall: { currentQueue: 6, dailyTotal: 78, estimatedWaitMinutes: 8, triageUrgent: 0 },
    inventory: [
      { id: 'inv-rg1', name: 'Amoxicillin 500mg', nameHi: 'एमोक्सिसिलिन 500mg', category: 'Antibiotics', stock: 110, minThreshold: 50, unit: 'boxes', expiryDate: '2026-11-30', status: 'OPTIMAL' },
      { id: 'inv-rg2', name: 'ORS Sachets', nameHi: 'ओआरएस पाउच', category: 'Essential', stock: 200, minThreshold: 100, unit: 'packs', expiryDate: '2027-01-15', status: 'OPTIMAL' },
      { id: 'inv-rg3', name: 'Paracetamol 500mg', nameHi: 'पैरासिटामोल 500mg', category: 'Analgesics', stock: 320, minThreshold: 100, unit: 'strips', expiryDate: '2027-03-31', status: 'OPTIMAL' },
      { id: 'inv-rg4', name: 'IV Fluids (NS)', nameHi: 'IV फ्लूइड', category: 'Emergency', stock: 35, minThreshold: 20, unit: 'bottles', expiryDate: '2026-12-15', status: 'OPTIMAL' },
    ],
  },
  // ── LAXMANGARH BLOCK ─────────────────────────────────────────────────────
  {
    id: 'chc-laxmangarh',
    name: 'CHC Laxmangarh',
    nameHi: 'सामुदायिक स्वास्थ्य केंद्र लक्ष्मणगढ़',
    type: 'CHC',
    location: 'Laxmangarh, Alwar',
    block: 'Laxmangarh',
    lat: 27.8150, lng: 75.0200,
    contactPhone: '+91-144-2700107',
    moName: 'Dr. Vikram Singh',
    status: 'WARNING',
    beds: { total: 30, occupied: 22, available: 8, icuTotal: 4, icuOccupied: 3 },
    staff: { doctorsExpected: 5, doctorsPresent: 3, nursesExpected: 10, nursesPresent: 8, attendanceRate: 73 },
    footfall: { currentQueue: 30, dailyTotal: 245, estimatedWaitMinutes: 32, triageUrgent: 5 },
    inventory: [
      { id: 'inv-lx1', name: 'Amoxicillin 500mg', nameHi: 'एमोक्सिसिलिन 500mg', category: 'Antibiotics', stock: 55, minThreshold: 80, unit: 'boxes', expiryDate: '2026-07-15', status: 'LOW' },
      { id: 'inv-lx2', name: 'ORS Sachets', nameHi: 'ओआरएस पाउच', category: 'Essential', stock: 90, minThreshold: 100, unit: 'packs', expiryDate: '2026-09-30', status: 'LOW' },
      { id: 'inv-lx3', name: 'Paracetamol 500mg', nameHi: 'पैरासिटामोल 500mg', category: 'Analgesics', stock: 285, minThreshold: 100, unit: 'strips', expiryDate: '2026-12-31', status: 'OPTIMAL' },
      { id: 'inv-lx4', name: 'IV Fluids (NS)', nameHi: 'IV फ्लूइड', category: 'Emergency', stock: 12, minThreshold: 20, unit: 'bottles', expiryDate: '2026-08-31', status: 'LOW' },
    ],
  },
  // ── RAMGARH BLOCK ────────────────────────────────────────────────────────
  {
    id: 'phc-ramgarh',
    name: 'PHC Ramgarh',
    nameHi: 'प्राथमिक स्वास्थ्य केंद्र रामगढ़',
    type: 'PHC',
    location: 'Ramgarh, Alwar',
    block: 'Ramgarh',
    lat: 27.2700, lng: 76.9500,
    contactPhone: '+91-144-2700108',
    moName: 'Dr. Pradeep Kumar',
    status: 'OPTIMAL',
    beds: { total: 6, occupied: 2, available: 4, icuTotal: 0, icuOccupied: 0 },
    staff: { doctorsExpected: 2, doctorsPresent: 2, nursesExpected: 4, nursesPresent: 4, attendanceRate: 100 },
    footfall: { currentQueue: 4, dailyTotal: 62, estimatedWaitMinutes: 6, triageUrgent: 0 },
    inventory: [
      { id: 'inv-rm1', name: 'Amoxicillin 500mg', nameHi: 'एमोक्सिसिलिन 500mg', category: 'Antibiotics', stock: 95, minThreshold: 50, unit: 'boxes', expiryDate: '2026-10-31', status: 'OPTIMAL' },
      { id: 'inv-rm2', name: 'ORS Sachets', nameHi: 'ओआरएस पाउच', category: 'Essential', stock: 155, minThreshold: 100, unit: 'packs', expiryDate: '2026-12-15', status: 'OPTIMAL' },
      { id: 'inv-rm3', name: 'Paracetamol 500mg', nameHi: 'पैरासिटामोल 500mg', category: 'Analgesics', stock: 280, minThreshold: 100, unit: 'strips', expiryDate: '2027-01-31', status: 'OPTIMAL' },
      { id: 'inv-rm4', name: 'IV Fluids (NS)', nameHi: 'IV फ्लूइड', category: 'Emergency', stock: 28, minThreshold: 20, unit: 'bottles', expiryDate: '2027-02-28', status: 'OPTIMAL' },
    ],
  },
  // ── NEEMRANA BLOCK ───────────────────────────────────────────────────────
  {
    id: 'chc-neemrana',
    name: 'CHC Neemrana',
    nameHi: 'सामुदायिक स्वास्थ्य केंद्र नीमराना',
    type: 'CHC',
    location: 'Neemrana, Alwar',
    block: 'Neemrana',
    lat: 27.9950, lng: 76.3840,
    contactPhone: '+91-144-2700109',
    moName: 'Dr. Kavita Rawat',
    status: 'OPTIMAL',
    beds: { total: 30, occupied: 16, available: 14, icuTotal: 4, icuOccupied: 2 },
    staff: { doctorsExpected: 5, doctorsPresent: 5, nursesExpected: 10, nursesPresent: 10, attendanceRate: 100 },
    footfall: { currentQueue: 10, dailyTotal: 178, estimatedWaitMinutes: 11, triageUrgent: 1 },
    inventory: [
      { id: 'inv-nm1', name: 'Amoxicillin 500mg', nameHi: 'एमोक्सिसिलिन 500mg', category: 'Antibiotics', stock: 160, minThreshold: 80, unit: 'boxes', expiryDate: '2026-11-30', status: 'OPTIMAL' },
      { id: 'inv-nm2', name: 'ORS Sachets', nameHi: 'ओआरएस पाउच', category: 'Essential', stock: 240, minThreshold: 100, unit: 'packs', expiryDate: '2027-01-31', status: 'OPTIMAL' },
      { id: 'inv-nm3', name: 'Paracetamol 500mg', nameHi: 'पैरासिटामोल 500mg', category: 'Analgesics', stock: 390, minThreshold: 100, unit: 'strips', expiryDate: '2027-03-15', status: 'OPTIMAL' },
      { id: 'inv-nm4', name: 'IV Fluids (NS)', nameHi: 'IV फ्लूइड', category: 'Emergency', stock: 48, minThreshold: 20, unit: 'bottles', expiryDate: '2027-01-15', status: 'OPTIMAL' },
    ],
  },
  // ── BANSUR BLOCK ─────────────────────────────────────────────────────────
  {
    id: 'phc-bansur',
    name: 'PHC Bansur',
    nameHi: 'प्राथमिक स्वास्थ्य केंद्र बांसूर',
    type: 'PHC',
    location: 'Bansur, Alwar',
    block: 'Bansur',
    lat: 27.6920, lng: 76.3430,
    contactPhone: '+91-144-2700110',
    moName: 'Dr. Ajay Mathur',
    status: 'WARNING',
    beds: { total: 6, occupied: 5, available: 1, icuTotal: 0, icuOccupied: 0 },
    staff: { doctorsExpected: 2, doctorsPresent: 1, nursesExpected: 4, nursesPresent: 3, attendanceRate: 67 },
    footfall: { currentQueue: 22, dailyTotal: 94, estimatedWaitMinutes: 26, triageUrgent: 2 },
    inventory: [
      { id: 'inv-bn1', name: 'Amoxicillin 500mg', nameHi: 'एमोक्सिसिलिन 500mg', category: 'Antibiotics', stock: 38, minThreshold: 50, unit: 'boxes', expiryDate: '2026-07-31', status: 'LOW' },
      { id: 'inv-bn2', name: 'ORS Sachets', nameHi: 'ओआरएस पाउच', category: 'Essential', stock: 75, minThreshold: 100, unit: 'packs', expiryDate: '2026-09-15', status: 'LOW' },
      { id: 'inv-bn3', name: 'Paracetamol 500mg', nameHi: 'पैरासिटामोल 500mg', category: 'Analgesics', stock: 145, minThreshold: 100, unit: 'strips', expiryDate: '2026-10-31', status: 'OPTIMAL' },
      { id: 'inv-bn4', name: 'IV Fluids (NS)', nameHi: 'IV फ्लूइड', category: 'Emergency', stock: 10, minThreshold: 20, unit: 'bottles', expiryDate: '2026-08-31', status: 'LOW' },
    ],
  },
  // ── THANAGAZI BLOCK ──────────────────────────────────────────────────────
  {
    id: 'phc-thanagazi',
    name: 'PHC Thanagazi',
    nameHi: 'प्राथमिक स्वास्थ्य केंद्र थानागाज़ी',
    type: 'PHC',
    location: 'Thanagazi, Alwar',
    block: 'Thanagazi',
    lat: 27.3800, lng: 76.4500,
    contactPhone: '+91-144-2700111',
    moName: 'Dr. Neha Jain',
    status: 'OPTIMAL',
    beds: { total: 6, occupied: 2, available: 4, icuTotal: 0, icuOccupied: 0 },
    staff: { doctorsExpected: 2, doctorsPresent: 2, nursesExpected: 4, nursesPresent: 4, attendanceRate: 100 },
    footfall: { currentQueue: 5, dailyTotal: 55, estimatedWaitMinutes: 7, triageUrgent: 0 },
    inventory: [
      { id: 'inv-th1', name: 'Amoxicillin 500mg', nameHi: 'एमोक्सिसिलिन 500mg', category: 'Antibiotics', stock: 80, minThreshold: 50, unit: 'boxes', expiryDate: '2026-12-31', status: 'OPTIMAL' },
      { id: 'inv-th2', name: 'ORS Sachets', nameHi: 'ओआरएस पाउच', category: 'Essential', stock: 130, minThreshold: 100, unit: 'packs', expiryDate: '2027-02-28', status: 'OPTIMAL' },
      { id: 'inv-th3', name: 'Paracetamol 500mg', nameHi: 'पैरासिटामोल 500mg', category: 'Analgesics', stock: 210, minThreshold: 100, unit: 'strips', expiryDate: '2027-01-15', status: 'OPTIMAL' },
      { id: 'inv-th4', name: 'IV Fluids (NS)', nameHi: 'IV फ्लूइड', category: 'Emergency', stock: 22, minThreshold: 20, unit: 'bottles', expiryDate: '2026-11-30', status: 'OPTIMAL' },
    ],
  },
  // ── TAPUKARA BLOCK ───────────────────────────────────────────────────────
  {
    id: 'phc-tapukara',
    name: 'PHC Tapukara',
    nameHi: 'प्राथमिक स्वास्थ्य केंद्र तापूकड़ा',
    type: 'PHC',
    location: 'Tapukara, Alwar',
    block: 'Tapukara',
    lat: 28.0500, lng: 76.5600,
    contactPhone: '+91-144-2700112',
    moName: 'Dr. Rohit Kaushik',
    status: 'CRITICAL',
    beds: { total: 6, occupied: 6, available: 0, icuTotal: 0, icuOccupied: 0 },
    staff: { doctorsExpected: 2, doctorsPresent: 0, nursesExpected: 4, nursesPresent: 3, attendanceRate: 50 },
    footfall: { currentQueue: 35, dailyTotal: 130, estimatedWaitMinutes: 60, triageUrgent: 7 },
    inventory: [
      { id: 'inv-tp1', name: 'Amoxicillin 500mg', nameHi: 'एमोक्सिसिलिन 500mg', category: 'Antibiotics', stock: 5, minThreshold: 50, unit: 'boxes', expiryDate: '2026-06-15', status: 'CRITICAL' },
      { id: 'inv-tp2', name: 'ORS Sachets', nameHi: 'ओआरएस पाउच', category: 'Essential', stock: 10, minThreshold: 100, unit: 'packs', expiryDate: '2026-07-31', status: 'CRITICAL' },
      { id: 'inv-tp3', name: 'Paracetamol 500mg', nameHi: 'पैरासिटामोल 500mg', category: 'Analgesics', stock: 40, minThreshold: 100, unit: 'strips', expiryDate: '2026-09-30', status: 'LOW' },
      { id: 'inv-tp4', name: 'IV Fluids (NS)', nameHi: 'IV फ्लूइड', category: 'Emergency', stock: 3, minThreshold: 20, unit: 'bottles', expiryDate: '2026-07-15', status: 'CRITICAL' },
    ],
  },
  // ── REMAINING 30 FACILITIES (spread across Alwar district) ───────────────
  ...generateRemainingFacilities(),
];

function generateRemainingFacilities(): FacilityWithCoords[] {
  const blocks = [
    'Alwar City', 'Tijara', 'Behror', 'Kotkasim', 'Rajgarh',
    'Laxmangarh', 'Ramgarh', 'Neemrana', 'Bansur', 'Thanagazi',
    'Tapukara', 'Umren', 'Govindgarh', 'Khairthal', 'Malakheda'
  ];
  const moNames = [
    'Dr. Sunita Agarwal', 'Dr. Mahesh Chand', 'Dr. Pooja Dixit', 'Dr. Ramesh Saini',
    'Dr. Nandini Sharma', 'Dr. Arun Kumar', 'Dr. Rekha Singh', 'Dr. Dinesh Gupta',
    'Dr. Shalini Mishra', 'Dr. Vivek Bansal', 'Dr. Usha Rani', 'Dr. Karan Meena',
    'Dr. Anita Chauhan', 'Dr. Subhash Bhatnagar', 'Dr. Deepika Solanki',
    'Dr. Ghanshyam Yadav', 'Dr. Pratibha Mittal', 'Dr. Rakesh Sharma',
    'Dr. Sneha Rathore', 'Dr. Vijay Kumar', 'Dr. Archana Jain', 'Dr. Bhupesh Verma',
    'Dr. Kamala Gupta', 'Dr. Narendra Singh', 'Dr. Preeti Sharma',
    'Dr. Sanjay Yadav', 'Dr. Ritu Agarwal', 'Dr. Hemant Sharma',
    'Dr. Geeta Kumari', 'Dr. Lokesh Bhandari'
  ];

  const facilities: FacilityWithCoords[] = [];
  const baseCoords = [
    [27.45, 76.55], [27.52, 76.80], [27.60, 76.92], [27.68, 77.10], [27.72, 76.72],
    [27.80, 76.98], [27.88, 77.05], [27.95, 76.68], [28.02, 76.45], [28.10, 76.72],
    [27.35, 76.78], [27.28, 76.88], [27.42, 77.02], [27.58, 77.18], [27.65, 77.28],
    [27.72, 77.35], [27.82, 77.20], [27.90, 77.30], [28.00, 77.08], [28.12, 77.18],
    [27.38, 76.35], [27.48, 76.28], [27.55, 76.15], [27.65, 76.08], [27.75, 76.15],
    [27.85, 76.25], [27.95, 76.18], [28.05, 76.28], [28.15, 76.35], [28.18, 76.58],
  ];

  const statusPool: Array<'OPTIMAL' | 'WARNING' | 'CRITICAL'> = [
    'OPTIMAL', 'OPTIMAL', 'OPTIMAL', 'WARNING', 'WARNING', 'CRITICAL'
  ];

  for (let i = 0; i < 30; i++) {
    const idx = i + 13; // ids 13–42
    const status = statusPool[i % statusPool.length];
    const type: 'PHC' | 'CHC' = i % 5 === 0 ? 'CHC' : 'PHC';
    const block = blocks[i % blocks.length];
    const [lat, lng] = baseCoords[i];
    const bedTotal = type === 'CHC' ? 30 : 6;
    const bedOccupied = status === 'CRITICAL' ? bedTotal : status === 'WARNING' ? Math.floor(bedTotal * 0.75) : Math.floor(bedTotal * 0.45);
    const stockAmox = status === 'CRITICAL' ? Math.floor(Math.random() * 15) + 3 : status === 'WARNING' ? Math.floor(Math.random() * 25) + 30 : Math.floor(Math.random() * 100) + 80;
    const stockAmoxStatus: 'CRITICAL' | 'LOW' | 'OPTIMAL' = stockAmox < 20 ? 'CRITICAL' : stockAmox < 50 ? 'LOW' : 'OPTIMAL';
    const attendanceRate = status === 'CRITICAL' ? Math.floor(Math.random() * 30) + 55 : status === 'WARNING' ? Math.floor(Math.random() * 20) + 70 : Math.floor(Math.random() * 10) + 90;

    facilities.push({
      id: `phc-${idx.toString().padStart(2, '0')}`,
      name: `${type} ${block} ${idx}`,
      nameHi: `${type === 'CHC' ? 'सामुदायिक' : 'प्राथमिक'} स्वास्थ्य केंद्र ${block} ${idx}`,
      type,
      location: `${block}, Alwar`,
      block,
      lat: lat + (Math.random() - 0.5) * 0.05,
      lng: lng + (Math.random() - 0.5) * 0.05,
      contactPhone: `+91-144-27001${(idx).toString().padStart(2, '0')}`,
      moName: moNames[i],
      status,
      beds: {
        total: bedTotal,
        occupied: bedOccupied,
        available: bedTotal - bedOccupied,
        icuTotal: type === 'CHC' ? 4 : 0,
        icuOccupied: type === 'CHC' ? Math.min(bedOccupied, 2) : 0,
      },
      staff: {
        doctorsExpected: type === 'CHC' ? 5 : 2,
        doctorsPresent: Math.max(1, Math.floor((type === 'CHC' ? 5 : 2) * attendanceRate / 100)),
        nursesExpected: type === 'CHC' ? 10 : 4,
        nursesPresent: Math.max(1, Math.floor((type === 'CHC' ? 10 : 4) * attendanceRate / 100)),
        attendanceRate,
      },
      footfall: {
        currentQueue: status === 'CRITICAL' ? Math.floor(Math.random() * 20) + 25 : status === 'WARNING' ? Math.floor(Math.random() * 15) + 12 : Math.floor(Math.random() * 10) + 3,
        dailyTotal: Math.floor(Math.random() * 80) + 60,
        estimatedWaitMinutes: status === 'CRITICAL' ? Math.floor(Math.random() * 25) + 35 : status === 'WARNING' ? Math.floor(Math.random() * 15) + 18 : Math.floor(Math.random() * 8) + 5,
        triageUrgent: status === 'CRITICAL' ? Math.floor(Math.random() * 5) + 3 : status === 'WARNING' ? Math.floor(Math.random() * 3) + 1 : 0,
      },
      inventory: [
        { id: `inv-${idx}-1`, name: 'Amoxicillin 500mg', nameHi: 'एमोक्सिसिलिन 500mg', category: 'Antibiotics', stock: stockAmox, minThreshold: type === 'CHC' ? 80 : 50, unit: 'boxes', expiryDate: '2026-09-30', status: stockAmoxStatus },
        { id: `inv-${idx}-2`, name: 'ORS Sachets', nameHi: 'ओआरएस पाउच', category: 'Essential', stock: status === 'CRITICAL' ? Math.floor(Math.random() * 30) + 5 : status === 'WARNING' ? Math.floor(Math.random() * 50) + 60 : Math.floor(Math.random() * 150) + 120, minThreshold: 100, unit: 'packs', expiryDate: '2026-10-31', status: status === 'CRITICAL' ? 'LOW' : 'OPTIMAL' },
        { id: `inv-${idx}-3`, name: 'Paracetamol 500mg', nameHi: 'पैरासिटामोल 500mg', category: 'Analgesics', stock: Math.floor(Math.random() * 200) + 100, minThreshold: 100, unit: 'strips', expiryDate: '2027-01-31', status: 'OPTIMAL' },
        { id: `inv-${idx}-4`, name: 'IV Fluids (NS)', nameHi: 'IV फ्लूइड', category: 'Emergency', stock: status === 'CRITICAL' ? Math.floor(Math.random() * 8) + 2 : status === 'WARNING' ? Math.floor(Math.random() * 12) + 8 : Math.floor(Math.random() * 30) + 20, minThreshold: 20, unit: 'bottles', expiryDate: '2026-11-30', status: status === 'CRITICAL' ? 'CRITICAL' : status === 'WARNING' ? 'LOW' : 'OPTIMAL' },
      ],
    });
  }

  return facilities;
}

// Derived summary stats
export const districtSummary = {
  totalFacilities: 42,
  totalPHCs: alwarFacilities.filter(f => f.type === 'PHC').length,
  totalCHCs: alwarFacilities.filter(f => f.type === 'CHC').length,
  criticalCount: alwarFacilities.filter(f => f.status === 'CRITICAL').length,
  warningCount: alwarFacilities.filter(f => f.status === 'WARNING').length,
  optimalCount: alwarFacilities.filter(f => f.status === 'OPTIMAL').length,
  districtBounds: {
    north: 28.20,
    south: 27.15,
    east: 77.40,
    west: 76.10,
    center: [27.565, 76.625] as [number, number],
  },
};
