export type Trip = {
  id: string;
  date: string; // ISO date
  route: string;
  agencyName: string;
  busName: string;
  seats: string; // e.g., 12-25
  status: 'Confirmed' | 'Cancelled' | 'Completed';
};

export const upcomingTrips: Trip[] = [
  {
    id: 't1',
    date: '2025-08-25',
    route: 'Kigali → Musanze',
    agencyName: 'Ritco LTD',
    busName: 'Ritco Luxury Coach',
    seats: '12–25',
    status: 'Confirmed',
  },
  {
    id: 't2',
    date: '2025-08-28',
    route: 'Kigali → Nyungwe',
    agencyName: 'Nyungwe Adventures',
    busName: 'Forest Adventure Bus',
    seats: '1–20',
    status: 'Confirmed',
  },
  {
    id: 't3',
    date: '2025-09-02',
    route: 'Kigali → Kibuye',
    agencyName: 'Kibuye Lake Tours',
    busName: 'Lake View Tour Bus',
    seats: '5–15',
    status: 'Confirmed',
  },
  {
    id: 't4',
    date: '2025-09-05',
    route: 'Kigali → Gisenyi',
    agencyName: 'Gisenyi Shuttle Services',
    busName: 'Gisenyi Shuttle Van',
    seats: '1–8',
    status: 'Confirmed',
  },
  {
    id: 't5',
    date: '2025-09-10',
    route: 'Kigali → Butare',
    agencyName: 'Butare Express',
    busName: 'Butare Local',
    seats: '10–25',
    status: 'Confirmed',
  },
];

export const pastTrips: Trip[] = [
  {
    id: 't6',
    date: '2025-07-01',
    route: 'Kigali → Nyungwe',
    agencyName: 'Horizon ltd',
    busName: 'Horizon Standard',
    seats: '1–18',
    status: 'Completed',
  },
  {
    id: 't7',
    date: '2025-06-15',
    route: 'Kigali → Musanze',
    agencyName: 'Volcano Express',
    busName: 'Volcano Luxury',
    seats: '5–30',
    status: 'Completed',
  },
  {
    id: 't8',
    date: '2025-06-08',
    route: 'Kigali → Kibuye',
    agencyName: 'Rwanda Tours & Travel',
    busName: 'Safari Tour Bus',
    seats: '1–25',
    status: 'Completed',
  },
  {
    id: 't9',
    date: '2025-05-20',
    route: 'Kigali → Gisenyi',
    agencyName: 'Stella Express',
    busName: 'Stella Premium',
    seats: '8–20',
    status: 'Completed',
  },
  {
    id: 't10',
    date: '2025-05-12',
    route: 'Kigali → Ruhengeri',
    agencyName: 'Ruhengeri Mini Bus',
    busName: 'Ruhengeri Mini Local',
    seats: '1–12',
    status: 'Completed',
  },
  {
    id: 't11',
    date: '2025-04-28',
    route: 'Kigali → Butare',
    agencyName: 'Kigali Coach Services',
    busName: 'Kigali Elite Coach',
    seats: '15–40',
    status: 'Completed',
  },
  {
    id: 't12',
    date: '2025-04-15',
    route: 'Kigali → Musanze',
    agencyName: 'Musanze Transport Co.',
    busName: 'Musanze Express',
    seats: '10–30',
    status: 'Cancelled',
  },
];


