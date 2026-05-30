export interface Property {
  id: string;
  title: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  source: 'Zillow' | 'Realtor.com' | 'Redfin';
  type: 'House' | 'Condo' | 'Townhouse' | 'Apartment';
  status: 'For Sale' | 'Pending' | 'New Construction';
  yearBuilt: number;
  pricePerSqft: number;
  description: string;
  lastUpdated: string;
  realtorName: string;
  realtorPhone: string;
}

export interface EmailAlert {
  id: string;
  name: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  propertyType: string;
  frequency: 'Instant' | 'Daily' | 'Weekly';
  createdAt: string;
  isActive: boolean;
}

export interface UserProfile {
  displayName: string;
  email: string;
  photoURL: string;
  preferences: {
    theme: 'light' | 'dark';
    defaultLocation: string;
    defaultMinPrice: number;
    defaultMaxPrice: number;
    notificationsEnabled: boolean;
  };
}
