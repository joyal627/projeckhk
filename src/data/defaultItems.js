// The exact 12 housekeeping supply items requested by the user:
// Broom, Mop, Gloves, Dental Kit, Shaving Kit, Shower Cap, Soap, Shampoo, Moisturiser, Cleaning Chemicals, Toilet Roll, Restaurant Tissue

export const DEFAULT_ITEMS = [
  {
    id: "item-1",
    name: "Broom",
    nameMl: "ചൂൽ (Broom)",
    category: "Cleaning Tools",
    quantity: 6,
    minThreshold: 4,
    unit: "Nos",
    location: "Housekeeping Store",
    notes: "Room & corridor sweeping"
  },
  {
    id: "item-2",
    name: "Mop",
    nameMl: "മോപ്പ് (Mop)",
    category: "Cleaning Tools",
    quantity: 5,
    minThreshold: 4,
    unit: "Nos",
    location: "Housekeeping Store",
    notes: "Floor wet mopping"
  },
  {
    id: "item-3",
    name: "Gloves",
    nameMl: "ഗ്ലൗസ് (Gloves)",
    category: "Cleaning Tools",
    quantity: 3,
    minThreshold: 5,
    unit: "Pairs",
    location: "Safety Shelf",
    notes: "Rubber cleaning gloves - Low stock"
  },
  {
    id: "item-4",
    name: "Dental Kit",
    nameMl: "ഡെന്റൽ കിറ്റ് (Dental Kit)",
    category: "Guest Amenities",
    quantity: 45,
    minThreshold: 50,
    unit: "Packets",
    location: "Amenities Rack A",
    notes: "Toothbrush + Toothpaste - Running low"
  },
  {
    id: "item-5",
    name: "Shaving Kit",
    nameMl: "ഷേവിംഗ് കിറ്റ് (Shaving Kit)",
    category: "Guest Amenities",
    quantity: 0,
    minThreshold: 25,
    unit: "Packets",
    location: "Amenities Rack A",
    notes: "Out of stock! Restock urgently"
  },
  {
    id: "item-6",
    name: "Shower Cap",
    nameMl: "ഷവർ ക്യാപ്പ് (Shower Cap)",
    category: "Guest Amenities",
    quantity: 55,
    minThreshold: 30,
    unit: "Packets",
    location: "Amenities Rack B",
    notes: "Disposable caps"
  },
  {
    id: "item-7",
    name: "Soap",
    nameMl: "സോപ്പ് (Guest Soap)",
    category: "Guest Amenities",
    quantity: 80,
    minThreshold: 40,
    unit: "Nos",
    location: "Amenities Rack B",
    notes: "Guest room mini soaps"
  },
  {
    id: "item-8",
    name: "Shampoo",
    nameMl: "ഷാംപൂ (Shampoo)",
    category: "Guest Amenities",
    quantity: 18,
    minThreshold: 35,
    unit: "Bottles",
    location: "Amenities Rack B",
    notes: "Mini 30ml bottles - Running low"
  },
  {
    id: "item-9",
    name: "Moisturiser",
    nameMl: "മോയ്സ്ചറൈസർ (Moisturiser)",
    category: "Guest Amenities",
    quantity: 22,
    minThreshold: 30,
    unit: "Bottles",
    location: "Amenities Rack B",
    notes: "Body lotion 30ml"
  },
  {
    id: "item-10",
    name: "Cleaning Chemicals",
    nameMl: "ക്ലീനിംഗ് കെമിക്കൽസ് (Cleaning Chemicals)",
    category: "Cleaning Supplies",
    quantity: 4,
    minThreshold: 6,
    unit: "Cans",
    location: "Chemical Locker",
    notes: "5L cans for floor & washroom"
  },
  {
    id: "item-11",
    name: "Toilet Roll",
    nameMl: "ടോയ്‌ലറ്റ് റോൾ (Toilet Roll)",
    category: "Paper Supplies",
    quantity: 15,
    minThreshold: 40,
    unit: "Rolls",
    location: "Store Shelf P",
    notes: "2-Ply rolls - Low stock"
  },
  {
    id: "item-12",
    name: "Restaurant Tissue",
    nameMl: "റെസ്റ്റോറന്റ് ടിഷ്യു (Restaurant Tissue)",
    category: "Paper Supplies",
    quantity: 12,
    minThreshold: 20,
    unit: "Packets",
    location: "Store Shelf P",
    notes: "Table napkin tissue packets"
  }
];

export const CATEGORIES = [
  "All",
  "Cleaning Tools",
  "Guest Amenities",
  "Cleaning Supplies",
  "Paper Supplies"
];

export const UNITS = [
  "Nos",
  "Pairs",
  "Packets",
  "Bottles",
  "Cans",
  "Rolls",
  "Boxes",
  "Litres"
];
