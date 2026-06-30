export type MarketPack = {
  id: string;
  name: string;
  icon: string;
  industries: string[];
};

export const MARKET_PACKS: MarketPack[] = [
  {
    id: "healthcare",
    name: "Healthcare",
    icon: "🏥",
    industries: [
      "Pediatric Surgeons",
      "Cardiologists",
      "Orthopedic Surgeons",
      "Oral and Maxillofacial Surgeons",
      "Radiologists",
      "Dermatologists",
      "Anesthesiologists",
      "Emergency Medicine Physicians",
      "Ophthalmologists",
      "Neurologists",
      "OB/GYNs",
      "Psychiatrists",
      "Pathologists",
      "Internal Medicine Physicians",
      "Family Medicine Physicians",
      "Orthodontists",
      "Dentists",
      "Nurse Anesthetists",
    ],
  },
  {
    id: "legal",
    name: "Legal",
    icon: "⚖️",
    industries: [
      "Lawyers",
      "Corporate Attorneys",
      "Estate Planning Attorneys",
      "Personal Injury Attorneys",
      "Family Law Attorneys",
      "Real Estate Attorneys",
      "Tax Attorneys",
    ],
  },
  {
    id: "aviation",
    name: "Aviation",
    icon: "✈️",
    industries: [
      "Airline Pilots",
      "Corporate Pilots",
      "Flight Engineers",
      "Private Aviation Executives",
    ],
  },
  {
    id: "executives",
    name: "Executives",
    icon: "🏢",
    industries: [
      "Chief Executives",
      "Financial Managers",
      "Technology Executives",
      "Engineering Managers",
      "Sales Executives",
      "Private Company Executives",
    ],
  },
];