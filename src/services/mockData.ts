import { Property } from '../types';

// High-quality stock photos of luxury and modern homes from Pexels
const HOUSE_IMAGES = [
  "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/206172/pexels-photo-206172.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/53610/pexels-photo-53610.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800"
];

const REALTORS = [
  { name: "Sarah Jenkins", phone: "(555) 124-5678" },
  { name: "Michael Chang", phone: "(555) 987-6543" },
  { name: "Elena Rostova", phone: "(555) 456-7890" },
  { name: "David Vance", phone: "(555) 222-3344" }
];

const CITIES = [
  { name: "San Francisco", state: "CA", lat: 37.7749, lng: -122.4194, zip: "94102" },
  { name: "Los Angeles", state: "CA", lat: 34.0522, lng: -118.2437, zip: "90012" },
  { name: "Seattle", state: "WA", lat: 47.6062, lng: -122.3321, zip: "98101" },
  { name: "Austin", state: "TX", lat: 30.2672, lng: -97.7431, zip: "78701" },
  { name: "Miami", state: "FL", lat: 25.7617, lng: -80.1918, zip: "33101" },
  { name: "New York", state: "NY", lat: 40.7128, lng: -74.0060, zip: "10001" }
];

const DESCRIPTIONS = [
  "Stunning modern architectural masterpiece featuring panoramic views, high-end custom finishes, and an expansive open-concept living space perfect for entertaining.",
  "Charming and beautifully updated home nestled in a highly desirable neighborhood. Features a gourmet kitchen, private landscaped backyard, and abundant natural light.",
  "Luxurious urban living at its finest. This high-rise residence boasts floor-to-ceiling windows, premium smart home automation, and world-class building amenities.",
  "Exquisite estate offering unparalleled privacy and elegance. Highlights include a resort-style pool, custom wine cellar, and a magnificent master suite retreat."
];

export const generateMockProperties = (): Property[] => {
  const properties: Property[] = [];
  let idCounter = 1;

  CITIES.forEach((city) => {
    // Generate 8-12 properties per city to ensure a rich dataset
    const count = Math.floor(Math.random() * 5) + 8;
    
    for (let i = 0; i < count; i++) {
      // Add slight random offset to coordinates so they don't stack on top of each other
      const latOffset = (Math.random() - 0.5) * 0.08;
      const lngOffset = (Math.random() - 0.5) * 0.08;
      
      const price = Math.floor(Math.random() * 4500000) + 350000; // $350k to $4.85M
      const beds = Math.floor(Math.random() * 5) + 1; // 1 to 5 beds
      const baths = Math.floor(Math.random() * 4) + 1; // 1 to 4 baths
      const sqft = Math.floor(Math.random() * 4500) + 800; // 800 to 5300 sqft
      const source = ['Zillow', 'Realtor.com', 'Redfin'][Math.floor(Math.random() * 3)] as Property['source'];
      const type = ['House', 'Condo', 'Townhouse', 'Apartment'][Math.floor(Math.random() * 4)] as Property['type'];
      const status = ['For Sale', 'Pending', 'New Construction'][Math.floor(Math.random() * 3)] as Property['status'];
      const realtor = REALTORS[Math.floor(Math.random() * REALTORS.length)];
      const image = HOUSE_IMAGES[Math.floor(Math.random() * HOUSE_IMAGES.length)];
      const desc = DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)];

      properties.push({
        id: `prop-${idCounter++}`,
        title: `${beds} Bed ${type} in ${city.name}`,
        price,
        beds,
        baths,
        sqft,
        address: `${Math.floor(Math.random() * 9000) + 100} Grandview Ave`,
        city: city.name,
        state: city.state,
        zipCode: (parseInt(city.zip) + Math.floor(Math.random() * 10)).toString(),
        latitude: city.lat + latOffset,
        longitude: city.lng + lngOffset,
        imageUrl: image,
        source,
        type,
        status,
        yearBuilt: Math.floor(Math.random() * 70) + 1955,
        pricePerSqft: Math.round(price / sqft),
        description: desc,
        lastUpdated: new Date(Date.now() - Math.random() * 10000000).toISOString(),
        realtorName: realtor.name,
        realtorPhone: realtor.phone
      });
    }
  });

  return properties;
};
