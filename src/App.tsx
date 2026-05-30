import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, SlidersHorizontal, Map, List, Compass, Bell, 
  User, Sun, Moon, RefreshCw, ChevronRight, X, Mail, 
  ExternalLink, Phone, Heart, Sparkles, ArrowUpDown
} from 'lucide-react';
import { usePropertyData } from './hooks/usePropertyData';
import { Property, UserProfile } from './types';
import { PropertyCard } from './components/PropertyCard';
import { InteractiveMap } from './components/InteractiveMap';
import { Sidebar } from './components/Sidebar';
import { signInWithGoogle, logout, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const CITIES_COORDINATES: Record<string, [number, number]> = {
  'San Francisco': [37.7749, -122.4194],
  'Los Angeles': [34.0522, -118.2437],
  'Seattle': [47.6062, -122.3321],
  'Austin': [30.2672, -97.7431],
  'Miami': [25.7617, -80.1918],
  'New York': [40.7128, -74.0060]
};

function App() {
  const { 
    properties, 
    loading, 
    alerts, 
    saveAlert, 
    deleteAlert, 
    toggleAlert, 
    refreshData 
  } = usePropertyData();

  // UI States
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Austin');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000000);
  const [propertyType, setPropertyType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest'>('newest');

  // Map States
  const [mapCenter, setMapCenter] = useState<[number, number]>(CITIES_COORDINATES['Austin']);
  const [mapZoom, setMapZoom] = useState<number>(12);

  // Listen to Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          displayName: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
          preferences: {
            theme: 'dark',
            defaultLocation: 'Austin',
            defaultMinPrice: 0,
            defaultMaxPrice: 5000000,
            notificationsEnabled: true
          }
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle Google Login
  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed, using mock user profile");
      // Fallback mock user for demo purposes if Firebase config is blocked/unconfigured
      setUser({
        displayName: "Alex Mercer",
        email: "alex.mercer@example.com",
        photoURL: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
        preferences: {
          theme: 'dark',
          defaultLocation: 'Austin',
          defaultMinPrice: 0,
          defaultMaxPrice: 5000000,
          notificationsEnabled: true
        }
      });
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed");
    }
    setUser(null);
  };

  // Handle City Change & Map Centering
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    if (CITIES_COORDINATES[city]) {
      setMapCenter(CITIES_COORDINATES[city]);
      setMapZoom(12);
    }
  };

  // Handle Search Submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Find matching city from search query
    const matchedCity = Object.keys(CITIES_COORDINATES).find(
      city => city.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (matchedCity) {
      handleCityChange(matchedCity);
    }
  };

  // Filter & Sort Properties
  const filteredProperties = useMemo(() => {
    return properties
      .filter(prop => {
        const matchesCity = prop.city === selectedCity;
        const matchesPrice = prop.price >= minPrice && prop.price <= maxPrice;
        const matchesType = propertyType === 'All' || prop.type === propertyType;
        const matchesSearch = searchQuery === '' || 
          prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prop.address.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesCity && matchesPrice && matchesType && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      });
  }, [properties, selectedCity, minPrice, maxPrice, propertyType, searchQuery, sortBy]);

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#171717] text-white' : 'bg-neutral-50 text-neutral-900'
    }`}>
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-[1000] border-b border-[#2F2F2F] bg-[#171717]/80 backdrop-blur-md px-4 lg:px-8 py-4 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#9E7FFF] to-[#38bdf8] flex items-center justify-center shadow-lg shadow-[#9E7FFF]/20">
            <Compass className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-extrabold text-white text-lg tracking-tight flex items-center gap-1.5">
              K-REALTOR <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20">AGGREGATOR</span>
            </h1>
            <p className="text-[10px] text-neutral-400">Real-time Zillow, Realtor & Redfin Feed</p>
          </div>
        </div>

        {/* Search & Quick Filters */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search city (e.g. Austin, Miami, Seattle)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#262626] border border-[#2F2F2F] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#9E7FFF] transition-colors"
            />
          </div>
        </form>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-[#262626] hover:bg-[#2F2F2F] text-neutral-400 hover:text-white transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Control Center Trigger */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2.5 rounded-xl bg-[#262626] hover:bg-[#2F2F2F] text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
            title="Control Center"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="text-xs font-medium hidden lg:inline">Control Center</span>
          </button>

          {/* User Profile / Login */}
          {user ? (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 p-1.5 rounded-xl bg-[#262626] border border-[#2F2F2F] hover:border-[#9E7FFF]/50 transition-all"
            >
              <img 
                src={user.photoURL} 
                alt={user.displayName} 
                className="h-7 w-7 rounded-full object-cover"
              />
              <span className="text-xs font-medium text-white hidden sm:inline pr-1.5">{user.displayName.split(' ')[0]}</span>
            </button>
          ) : (
            <button 
              onClick={handleLogin}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#9E7FFF] to-[#38bdf8] hover:opacity-90 text-white font-semibold text-xs transition-all shadow-lg shadow-[#9E7FFF]/10"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Mobile Search Bar */}
      <div className="p-4 md:hidden border-b border-[#2F2F2F] bg-[#171717]">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search city (e.g. Austin, Miami)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#262626] border border-[#2F2F2F] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#9E7FFF]"
          />
        </form>
      </div>

      {/* Filter Bar */}
      <section className="bg-[#1E1E1E] border-b border-[#2F2F2F] px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* City Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-neutral-400 font-medium">City:</span>
            <select 
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="bg-[#262626] border border-[#2F2F2F] rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-[#38bdf8]"
            >
              {Object.keys(CITIES_COORDINATES).map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-neutral-400 font-medium">Type:</span>
            <select 
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="bg-[#262626] border border-[#2F2F2F] rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-[#38bdf8]"
            >
              <option value="All">All Types</option>
              <option value="House">House</option>
              <option value="Condo">Condo</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Apartment">Apartment</option>
            </select>
          </div>

          {/* Price Range Slider/Inputs */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-medium">Price:</span>
            <div className="flex items-center gap-1">
              <input 
                type="number" 
                placeholder="Min"
                value={minPrice || ''}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-20 bg-[#262626] border border-[#2F2F2F] rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#38bdf8]"
              />
              <span className="text-neutral-500 text-xs">-</span>
              <input 
                type="number" 
                placeholder="Max"
                value={maxPrice || ''}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 bg-[#262626] border border-[#2F2F2F] rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#38bdf8]"
              />
            </div>
          </div>
        </div>

        {/* Sort & View Mode Controls */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#262626] border border-[#2F2F2F] rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-[#38bdf8]"
            >
              <option value="newest">Newest Listings</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="bg-[#262626] p-1 rounded-lg border border-[#2F2F2F] flex gap-1">
            <button
              onClick={() => setViewMode('split')}
              className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'split' ? 'bg-[#9E7FFF] text-white' : 'text-neutral-400 hover:text-white'
              }`}
              title="Split View"
            >
              <Sparkles className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'map' ? 'bg-[#9E7FFF] text-white' : 'text-neutral-400 hover:text-white'
              }`}
              title="Map View"
            >
              <Map className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'list' ? 'bg-[#9E7FFF] text-white' : 'text-neutral-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 flex relative overflow-hidden">
        
        {/* Left Side: Property List */}
        {(viewMode === 'split' || viewMode === 'list') && (
          <div className={`flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 transition-all duration-300 ${
            viewMode === 'split' ? 'max-w-full lg:max-w-[45%] xl:max-w-[40%] border-r border-[#2F2F2F]' : 'max-w-full'
          }`}>
            {/* Header Info */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  Listings in {selectedCity}
                  <span className="text-xs font-normal text-neutral-400">({filteredProperties.length} found)</span>
                </h2>
                <p className="text-xs text-neutral-400">Updated every 3 hours from top platforms</p>
              </div>
            </div>

            {/* Properties Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <RefreshCw className="h-8 w-8 text-[#9E7FFF] animate-spin" />
                <p className="text-sm text-neutral-400">Aggregating real-time listings...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-[#2F2F2F] rounded-2xl">
                <Compass className="h-12 w-12 text-neutral-500 mx-auto mb-3" />
                <h3 className="font-bold text-white text-base">No properties match your filters</h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                  Try adjusting your price range, selecting a different city, or clearing your search query.
                </p>
              </div>
            ) : (
              <div className={`grid gap-4 ${
                viewMode === 'list' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'
              }`}>
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onSelect={(prop) => {
                      setSelectedProperty(prop);
                      if (CITIES_COORDINATES[prop.city]) {
                        setMapCenter([prop.latitude, prop.longitude]);
                        setMapZoom(14);
                      }
                    }}
                    isSelected={selectedProperty?.id === property.id}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Right Side: Interactive Map */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div className="flex-1 h-full relative">
            <InteractiveMap
              properties={filteredProperties}
              selectedProperty={selectedProperty}
              onSelectProperty={(prop) => setSelectedProperty(prop)}
              mapCenter={mapCenter}
              mapZoom={mapZoom}
              theme={theme}
            />
          </div>
        )}

        {/* Property Detail Modal / Slide-over */}
        {selectedProperty && (
          <div className="fixed inset-0 z-[3000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1E1E1E] border border-[#2F2F2F] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              {/* Image Header */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img 
                  src={selectedProperty.imageUrl} 
                  alt={selectedProperty.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <button 
                  onClick={() => setSelectedProperty(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/10 backdrop-blur-md transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#9E7FFF]/20 text-[#9E7FFF] border border-[#9E7FFF]/30 text-xs font-semibold backdrop-blur-md mb-2 inline-block">
                      {selectedProperty.source}
                    </span>
                    <h3 className="text-xl font-extrabold text-white drop-shadow-md">
                      {selectedProperty.title}
                    </h3>
                  </div>
                  <p className="text-2xl font-black text-white drop-shadow-md">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0
                    }).format(selectedProperty.price)}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Specs Grid */}
                <div className="grid grid-cols-4 gap-4 p-4 rounded-xl bg-[#171717] border border-[#2F2F2F] text-center">
                  <div>
                    <p className="text-xs text-neutral-400">Beds</p>
                    <p className="text-lg font-bold text-white mt-0.5">{selectedProperty.beds}</p>
                  </div>
                  <div className="border-l border-[#2F2F2F]">
                    <p className="text-xs text-neutral-400">Baths</p>
                    <p className="text-lg font-bold text-white mt-0.5">{selectedProperty.baths}</p>
                  </div>
                  <div className="border-l border-[#2F2F2F]">
                    <p className="text-xs text-neutral-400">Sq Ft</p>
                    <p className="text-lg font-bold text-white mt-0.5">{selectedProperty.sqft.toLocaleString()}</p>
                  </div>
                  <div className="border-l border-[#2F2F2F]">
                    <p className="text-xs text-neutral-400">Built</p>
                    <p className="text-lg font-bold text-white mt-0.5">{selectedProperty.yearBuilt}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h4 className="font-bold text-white text-sm">Property Description</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {selectedProperty.description}
                  </p>
                </div>

                {/* Realtor & Contact */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#171717] border border-[#2F2F2F]">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#9E7FFF] to-[#38bdf8] flex items-center justify-center text-white font-bold text-xs">
                      {selectedProperty.realtorName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{selectedProperty.realtorName}</p>
                      <p className="text-[10px] text-neutral-400">Listing Agent &bull; {selectedProperty.source}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={`tel:${selectedProperty.realtorPhone}`}
                      className="py-2 px-4 rounded-xl bg-[#262626] hover:bg-[#2F2F2F] text-xs font-semibold text-white border border-[#2F2F2F] flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      Call Agent
                    </a>
                    <button 
                      onClick={() => {
                        alert(`Inquiry sent to ${selectedProperty.realtorName} for ${selectedProperty.title}!`);
                      }}
                      className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#9E7FFF] to-[#38bdf8] text-xs font-bold text-white transition-opacity hover:opacity-90"
                    >
                      Send Inquiry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Sidebar / Control Center */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        alerts={alerts}
        onSaveAlert={saveAlert}
        onDeleteAlert={deleteAlert}
        onToggleAlert={toggleAlert}
        theme={theme}
        onToggleTheme={toggleTheme}
        onRefreshData={refreshData}
        loading={loading}
      />

    </div>
  );
}

export default App;
