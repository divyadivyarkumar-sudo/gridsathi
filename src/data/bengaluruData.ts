import {
  AreaInfo,
  FeederLine,
  Incident,
  LatLng,
  RepairCrew,
  TransformerNode,
} from '../types';

export const BENGALURU_CENTER: LatLng = { lat: 12.9565, lng: 77.6245 };

export const BENGALURU_AREAS: AreaInfo[] = [
  {
    id: 'indiranagar',
    name: 'Indiranagar (100 Feet Rd)',
    shortName: 'Indiranagar',
    streetHint: '100 Feet Rd & 12th Main',
    center: { lat: 12.9718, lng: 77.6412 },
    feederId: 'FDR-IND-04',
    transformerId: 'TX-104',
  },
  {
    id: 'koramangala',
    name: 'Koramangala (4th Block)',
    shortName: 'Koramangala',
    streetHint: '80 Feet Rd & 1st Cross',
    center: { lat: 12.9352, lng: 77.6245 },
    feederId: 'FDR-KRM-02',
    transformerId: 'TX-218',
  },
  {
    id: 'whitefield',
    name: 'Whitefield (ITPL Main Rd)',
    shortName: 'Whitefield',
    streetHint: 'ITPL Main Rd & Hoodi Circle',
    center: { lat: 12.9795, lng: 77.7285 },
    feederId: 'FDR-WFD-11',
    transformerId: 'TX-412',
  },
  {
    id: 'malleshwaram',
    name: 'Malleshwaram (8th Cross)',
    shortName: 'Malleshwaram',
    streetHint: 'Sampige Rd & 8th Cross',
    center: { lat: 13.0035, lng: 77.5712 },
    feederId: 'FDR-MLM-03',
    transformerId: 'TX-509',
  },
  {
    id: 'jayanagar',
    name: 'Jayanagar (4th Block)',
    shortName: 'Jayanagar',
    streetHint: '11th Main & 30th Cross',
    center: { lat: 12.9279, lng: 77.5838 },
    feederId: 'FDR-JYN-07',
    transformerId: 'TX-305',
  },
  {
    id: 'hsr-layout',
    name: 'HSR Layout (Sector 2)',
    shortName: 'HSR Layout',
    streetHint: '27th Main Rd & 19th Cross',
    center: { lat: 12.9121, lng: 77.6446 },
    feederId: 'FDR-HSR-09',
    transformerId: 'TX-601',
  },
  {
    id: 'btm-layout',
    name: 'BTM Layout (2nd Stage)',
    shortName: 'BTM Layout',
    streetHint: '16th Main Rd & Udupi Garden',
    center: { lat: 12.9166, lng: 77.6101 },
    feederId: 'FDR-BTM-05',
    transformerId: 'TX-614',
  },
  {
    id: 'jp-nagar',
    name: 'JP Nagar (6th Phase)',
    shortName: 'JP Nagar',
    streetHint: '15th Cross & Outer Ring Rd',
    center: { lat: 12.9063, lng: 77.5857 },
    feederId: 'FDR-JPN-08',
    transformerId: 'TX-322',
  },
  {
    id: 'electronic-city',
    name: 'Electronic City (Phase 1)',
    shortName: 'Electronic City',
    streetHint: 'Hosur Rd & Infosys Ave',
    center: { lat: 12.8452, lng: 77.6602 },
    feederId: 'FDR-ELC-12',
    transformerId: 'TX-708',
  },
  {
    id: 'marathahalli',
    name: 'Marathahalli (ORR)',
    shortName: 'Marathahalli',
    streetHint: 'Outer Ring Rd & Bridge',
    center: { lat: 12.9591, lng: 77.6974 },
    feederId: 'FDR-MRT-06',
    transformerId: 'TX-429',
  },
  {
    id: 'bellandur',
    name: 'Bellandur (Ecospace Rd)',
    shortName: 'Bellandur',
    streetHint: 'Sarjapur ORR & Bellandur Gate',
    center: { lat: 12.926, lng: 77.6762 },
    feederId: 'FDR-BLD-10',
    transformerId: 'TX-633',
  },
  {
    id: 'rajajinagar',
    name: 'Rajajinagar (3rd Block)',
    shortName: 'Rajajinagar',
    streetHint: 'Dr Rajkumar Rd & 10th Main',
    center: { lat: 12.9915, lng: 77.5529 },
    feederId: 'FDR-RJN-01',
    transformerId: 'TX-515',
  },
  {
    id: 'yelahanka',
    name: 'Yelahanka (New Town)',
    shortName: 'Yelahanka',
    streetHint: 'Doddaballapur Rd & 4th Phase',
    center: { lat: 13.1007, lng: 77.5963 },
    feederId: 'FDR-YLK-14',
    transformerId: 'TX-802',
  },
  {
    id: 'hebbal',
    name: 'Hebbal (Ring Rd)',
    shortName: 'Hebbal',
    streetHint: 'Bellary Rd & Flyover',
    center: { lat: 13.0358, lng: 77.597 },
    feederId: 'FDR-HBL-03',
    transformerId: 'TX-819',
  },
  {
    id: 'banashankari',
    name: 'Banashankari (3rd Stage)',
    shortName: 'Banashankari',
    streetHint: 'Kathriguppe Main & 100 Ft Ring Rd',
    center: { lat: 12.9255, lng: 77.5468 },
    feederId: 'FDR-BSK-04',
    transformerId: 'TX-341',
  },
  {
    id: 'basavanagudi',
    name: 'Basavanagudi (Gandhi Bazaar)',
    shortName: 'Basavanagudi',
    streetHint: 'DVG Rd & Bull Temple Rd',
    center: { lat: 12.9406, lng: 77.5738 },
    feederId: 'FDR-BSG-02',
    transformerId: 'TX-310',
  },
  {
    id: 'mg-road',
    name: 'MG Road (Trinity Circle)',
    shortName: 'MG Road',
    streetHint: 'MG Rd & Brigade Rd',
    center: { lat: 12.9756, lng: 77.6197 },
    feederId: 'FDR-MGR-01',
    transformerId: 'TX-102',
  },
  {
    id: 'ulsoor',
    name: 'Ulsoor (Cambridge Rd)',
    shortName: 'Ulsoor',
    streetHint: 'Ulsoor Lake & Cambridge Rd',
    center: { lat: 12.9817, lng: 77.6285 },
    feederId: 'FDR-ULS-05',
    transformerId: 'TX-118',
  },
  {
    id: 'kalyan-nagar',
    name: 'Kalyan Nagar (HRBR Layout)',
    shortName: 'Kalyan Nagar',
    streetHint: '80 Feet Rd & CMR Rd',
    center: { lat: 13.028, lng: 77.6408 },
    feederId: 'FDR-KLN-09',
    transformerId: 'TX-845',
  },
  {
    id: 'sarjapur-road',
    name: 'Sarjapur Road (Kaikondrahalli)',
    shortName: 'Sarjapur Road',
    streetHint: 'Sarjapur Main Rd & Carmelaram',
    center: { lat: 12.9102, lng: 77.6805 },
    feederId: 'FDR-SRJ-15',
    transformerId: 'TX-650',
  },
  {
    id: 'vijayanagar',
    name: 'Vijayanagar (Chord Rd)',
    shortName: 'Vijayanagar',
    streetHint: 'Chord Rd & Club Rd',
    center: { lat: 12.9719, lng: 77.5327 },
    feederId: 'FDR-VJN-07',
    transformerId: 'TX-530',
  },
  {
    id: 'kr-puram',
    name: 'KR Puram (Old Madras Rd)',
    shortName: 'KR Puram',
    streetHint: 'Old Madras Rd & Tin Factory',
    center: { lat: 13.0012, lng: 77.6961 },
    feederId: 'FDR-KRP-13',
    transformerId: 'TX-455',
  },
];

export const SAMPLE_FEEDERS: FeederLine[] = BENGALURU_AREAS.map((area) => ({
  id: area.feederId,
  name: `${area.shortName} Feeder`,
  areaId: area.id,
  path: [
    { lat: area.center.lat + 0.0055, lng: area.center.lng - 0.002 },
    { lat: area.center.lat + 0.002, lng: area.center.lng - 0.0005 },
    { lat: area.center.lat, lng: area.center.lng },
    { lat: area.center.lat - 0.0045, lng: area.center.lng + 0.0015 },
  ],
}));

export const SAMPLE_TRANSFORMERS: TransformerNode[] = BENGALURU_AREAS.map(
  (area) => ({
    id: area.transformerId,
    code: area.transformerId,
    name: `${area.shortName} Distribution Transformer`,
    areaId: area.id,
    position: {
      lat: area.center.lat + 0.0006,
      lng: area.center.lng + 0.0006,
    },
  })
);

export const INITIAL_CREWS: RepairCrew[] = [
  {
    id: 'crew-alpha',
    name: 'Crew Alpha',
    lead: 'Ramesh K.',
    status: 'On site',
    assignedIncidentId: 'inc-indiranagar',
    areaLabel: 'Indiranagar 100 Ft Rd',
    homeBase: { lat: 12.9752, lng: 77.638 },
    currentPosition: { lat: 12.9718, lng: 77.6412 },
  },
  {
    id: 'crew-beta',
    name: 'Crew Beta',
    lead: 'Suresh M.',
    status: 'En route',
    assignedIncidentId: 'inc-koramangala',
    areaLabel: 'Heading to Koramangala',
    homeBase: { lat: 12.9485, lng: 77.6115 },
    currentPosition: { lat: 12.9412, lng: 77.6184 },
  },
  {
    id: 'crew-gamma',
    name: 'Crew Gamma',
    lead: 'Karthik N.',
    status: 'Available',
    assignedIncidentId: null,
    areaLabel: 'BTM / HSR Depot',
    homeBase: { lat: 12.9195, lng: 77.6245 },
    currentPosition: { lat: 12.9195, lng: 77.6245 },
  },
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc-indiranagar',
    areaId: 'indiranagar',
    areaName: 'Indiranagar (100 Feet Rd)',
    streetSummary: '100 Feet Rd, 12th Main & HAL 2nd Stage',
    center: { lat: 12.9718, lng: 77.6412 },
    radiusMeters: 480,
    reportedAtLabel: '09:42 AM',
    updatedAtLabel: '10:18 AM',
    reportCount: 14,
    estimatedCustomers: 340,
    priority: 'High',
    status: 'Repairing',
    equipmentLabel: 'Transformer TX-104 · Feeder FDR-IND-04',
    transformerId: 'TX-104',
    feederId: 'FDR-IND-04',
    assignedCrewId: 'crew-alpha',
    timeline: [
      {
        id: 't1',
        timeLabel: '09:42 AM',
        message: 'First outage reports received near 12th Main',
      },
      {
        id: 't2',
        timeLabel: '09:47 AM',
        message: '14 nearby reports grouped into one incident',
      },
      {
        id: 't3',
        timeLabel: '09:54 AM',
        message: 'Crew Alpha assigned and dispatched by BESCOM Desk',
      },
      {
        id: 't4',
        timeLabel: '10:06 AM',
        message: 'Crew Alpha arrived on site at TX-104',
      },
      {
        id: 't5',
        timeLabel: '10:18 AM',
        message: 'Fuse replacement and line repair started',
      },
    ],
  },
  {
    id: 'inc-koramangala',
    areaId: 'koramangala',
    areaName: 'Koramangala (4th Block)',
    streetSummary: '80 Feet Rd & Sony Signal Junction',
    center: { lat: 12.9352, lng: 77.6245 },
    radiusMeters: 420,
    reportedAtLabel: '10:05 AM',
    updatedAtLabel: '10:22 AM',
    reportCount: 9,
    estimatedCustomers: 210,
    priority: 'High',
    status: 'Crew assigned',
    equipmentLabel: 'Transformer TX-218 · Feeder FDR-KRM-02',
    transformerId: 'TX-218',
    feederId: 'FDR-KRM-02',
    assignedCrewId: 'crew-beta',
    timeline: [
      {
        id: 'k1',
        timeLabel: '10:05 AM',
        message: '9 customer reports grouped in 4th Block',
      },
      {
        id: 'k2',
        timeLabel: '10:12 AM',
        message: 'High priority flagged for main feeder line',
      },
      {
        id: 'k3',
        timeLabel: '10:22 AM',
        message: 'Crew Beta assigned by BESCOM Desk and on the way',
      },
    ],
  },
  {
    id: 'inc-whitefield',
    areaId: 'whitefield',
    areaName: 'Whitefield (ITPL Main Rd)',
    streetSummary: 'ITPL Main Rd & Hoodi Junction',
    center: { lat: 12.9795, lng: 77.7285 },
    radiusMeters: 380,
    reportedAtLabel: '10:24 AM',
    updatedAtLabel: '10:29 AM',
    reportCount: 5,
    estimatedCustomers: 145,
    priority: 'Medium',
    status: 'New',
    equipmentLabel: 'Transformer TX-412 · Feeder FDR-WFD-11',
    transformerId: 'TX-412',
    feederId: 'FDR-WFD-11',
    assignedCrewId: null,
    timeline: [
      {
        id: 'w1',
        timeLabel: '10:24 AM',
        message: 'First customer report received near Hoodi',
      },
      {
        id: 'w2',
        timeLabel: '10:29 AM',
        message: '5 nearby reports grouped automatically',
      },
    ],
  },
  {
    id: 'inc-malleshwaram',
    areaId: 'malleshwaram',
    areaName: 'Malleshwaram (8th Cross)',
    streetSummary: 'Sampige Rd & 8th Cross Market',
    center: { lat: 13.0035, lng: 77.5712 },
    radiusMeters: 340,
    reportedAtLabel: '08:15 AM',
    updatedAtLabel: '09:30 AM',
    reportCount: 6,
    estimatedCustomers: 110,
    priority: 'Low',
    status: 'Restored',
    equipmentLabel: 'Transformer TX-509 · Feeder FDR-MLM-03',
    transformerId: 'TX-509',
    feederId: 'FDR-MLM-03',
    assignedCrewId: null,
    timeline: [
      {
        id: 'm1',
        timeLabel: '08:15 AM',
        message: '6 outage reports grouped on Sampige Rd',
      },
      {
        id: 'm2',
        timeLabel: '08:30 AM',
        message: 'Crew Gamma assigned by BESCOM Desk and reached site',
      },
      {
        id: 'm3',
        timeLabel: '09:02 AM',
        message: 'Overhead line fault isolated and repaired',
      },
      {
        id: 'm4',
        timeLabel: '09:30 AM',
        message: 'Power restored to all affected homes',
      },
    ],
  },
];

export function formatCurrentTimeLabel(): string {
  const now = new Date();
  return now
    .toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    .toUpperCase();
}

export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  return 2 * R * Math.asin(Math.sqrt(h));
}
