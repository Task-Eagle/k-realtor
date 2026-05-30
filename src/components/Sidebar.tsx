import React, { useState } from 'react';
import { 
  User, Settings, Bell, LogOut, LogIn, X, Plus, Trash2, 
  Sliders, Shield, Mail, Check, RefreshCw, MapPin, DollarSign
} from 'lucide-react';
import { UserProfile, EmailAlert } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  alerts: EmailAlert[];
  onSaveAlert: (alert: Omit<EmailAlert, 'id' | 'createdAt' | 'isActive'>) => void;
  onDeleteAlert: (id: string) => void;
  onToggleAlert: (id: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onRefreshData: () => void;
  loading: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout,
  alerts,
  onSaveAlert,
  onDeleteAlert,
  onToggleAlert,
  theme,
  onToggleTheme,
  onRefreshData,
  loading
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'alerts' | 'settings'>('profile');
  
  // Alert Form State
  const [alertName, setAlertName] = useState('');
  const [alertLocation, setAlertLocation] = useState('Austin');
  const [alertMinPrice, setAlertMinPrice] = useState(300000);
  const [alertMaxPrice, setAlertMaxPrice] = useState(2000000);
  const [alertType, setAlertType] = useState('House');
  const [alertFreq, setAlertFreq] = useState<'Instant' | 'Daily' | 'Weekly'>('Instant');
  const [showAddAlert, setShowAddAlert] = useState(false);

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertName || !alertLocation) return;
    
    onSaveAlert({
      name: alertName,
      location: alertLocation,
      minPrice: alertMinPrice,
      maxPrice: alertMaxPrice,
      propertyType: alertType,
      frequency: alertFreq
    });

    // Reset form
    setAlertName('');
    setShowAddAlert(false);
  };

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-[2000] w-full sm:w-[420px] bg-[#171717] border-r border-[#2F2F2F] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="p-5 border-b border-[#2F2F2F] flex items-center justify-between bg-gradient-to-r from-[#171717] to-[#262626]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#9E7FFF] to-[#38bdf8] flex items-center justify-center shadow-lg shadow-[#9E7FFF]/20">
            <Sliders className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">Control Center</h2>
            <p className="text-xs text-neutral-400">Manage alerts & preferences</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-xl bg-[#262626] hover:bg-[#2F2F2F] text-neutral-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#2F2F2F] bg-[#1E1E1E] p-1.5 gap-1">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'profile' 
              ? 'bg-[#262626] text-white shadow-sm border border-[#2F2F2F]' 
              : 'text-neutral-400 hover:text-white hover:bg-[#262626]/50'
          }`}
        >
          <User className="h-4 w-4" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'alerts' 
              ? 'bg-[#262626] text-white shadow-sm border border-[#2F2F2F]' 
              : 'text-neutral-400 hover:text-white hover:bg-[#262626]/50'
          }`}
        >
          <Bell className="h-4 w-4" />
          Email Alerts
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'settings' 
              ? 'bg-[#262626] text-white shadow-sm border border-[#2F2F2F]' 
              : 'text-neutral-400 hover:text-white hover:bg-[#262626]/50'
          }`}
        >
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {user ? (
              <div className="space-y-6">
                {/* User Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#262626] to-[#1E1E1E] border border-[#2F2F2F] flex items-center gap-4">
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName} 
                    className="h-14 w-14 rounded-full border-2 border-[#9E7FFF] shadow-md"
                  />
                  <div>
                    <h3 className="font-bold text-white text-base">{user.displayName}</h3>
                    <p className="text-xs text-neutral-400">{user.email}</p>
                    <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-[#10b981]/10 text-[#10b981] text-[10px] font-medium border border-[#10b981]/20">
                      <Shield className="h-3 w-3" /> Verified Account
                    </span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-[#1E1E1E] border border-[#2F2F2F]">
                    <p className="text-xs text-neutral-400">Active Alerts</p>
                    <p className="text-2xl font-bold text-white mt-1">{alerts.filter(a => a.isActive).length}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#1E1E1E] border border-[#2F2F2F]">
                    <p className="text-xs text-neutral-400">Saved Searches</p>
                    <p className="text-2xl font-bold text-white mt-1">4</p>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="w-full py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="h-16 w-16 rounded-full bg-[#262626] border border-[#2F2F2F] flex items-center justify-center mx-auto">
                  <User className="h-8 w-8 text-neutral-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Sign in to Sync</h3>
                  <p className="text-xs text-neutral-400 max-w-xs mx-auto mt-1">
                    Save custom alerts, sync preferences across devices, and receive real-time email notifications.
                  </p>
                </div>
                <button
                  onClick={onLogin}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#9E7FFF] to-[#38bdf8] hover:opacity-90 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#9E7FFF]/20"
                >
                  <LogIn className="h-4 w-4" />
                  Sign in with Google
                </button>
              </div>
            )}
          </div>
        )}

        {/* EMAIL ALERTS TAB */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Your Saved Alerts</h3>
              <button
                onClick={() => setShowAddAlert(!showAddAlert)}
                className="py-1.5 px-3 rounded-lg bg-[#262626] hover:bg-[#2F2F2F] text-xs font-medium text-white border border-[#2F2F2F] flex items-center gap-1.5 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                New Alert
              </button>
            </div>

            {/* Add Alert Form */}
            {showAddAlert && (
              <form onSubmit={handleAddAlert} className="p-4 rounded-xl bg-[#1E1E1E] border border-[#2F2F2F] space-y-4">
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Create Email Alert</h4>
                
                <div className="space-y-1.5">
                  <label className="text-[11px] text-neutral-400 font-medium">Alert Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Austin Luxury Condos"
                    value={alertName}
                    onChange={(e) => setAlertName(e.target.value)}
                    className="w-full bg-[#171717] border border-[#2F2F2F] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#9E7FFF]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-neutral-400 font-medium">Location</label>
                    <select 
                      value={alertLocation}
                      onChange={(e) => setAlertLocation(e.target.value)}
                      className="w-full bg-[#171717] border border-[#2F2F2F] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#9E7FFF]"
                    >
                      <option value="Austin">Austin</option>
                      <option value="San Francisco">San Francisco</option>
                      <option value="Los Angeles">Los Angeles</option>
                      <option value="Seattle">Seattle</option>
                      <option value="Miami">Miami</option>
                      <option value="New York">New York</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-neutral-400 font-medium">Property Type</label>
                    <select 
                      value={alertType}
                      onChange={(e) => setAlertType(e.target.value)}
                      className="w-full bg-[#171717] border border-[#2F2F2F] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#9E7FFF]"
                    >
                      <option value="House">House</option>
                      <option value="Condo">Condo</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Apartment">Apartment</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-neutral-400 font-medium">Min Price</label>
                    <input 
                      type="number" 
                      value={alertMinPrice}
                      onChange={(e) => setAlertMinPrice(Number(e.target.value))}
                      className="w-full bg-[#171717] border border-[#2F2F2F] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#9E7FFF]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-neutral-400 font-medium">Max Price</label>
                    <input 
                      type="number" 
                      value={alertMaxPrice}
                      onChange={(e) => setAlertMaxPrice(Number(e.target.value))}
                      className="w-full bg-[#171717] border border-[#2F2F2F] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#9E7FFF]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-neutral-400 font-medium">Frequency</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Instant', 'Daily', 'Weekly'] as const).map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setAlertFreq(freq)}
                        className={`py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          alertFreq === freq 
                            ? 'bg-[#9E7FFF]/10 border-[#9E7FFF] text-[#9E7FFF]' 
                            : 'bg-[#171717] border-[#2F2F2F] text-neutral-400 hover:text-white'
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAlert(false)}
                    className="flex-1 py-2 rounded-lg bg-[#262626] hover:bg-[#2F2F2F] text-xs font-medium text-neutral-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#9E7FFF] to-[#38bdf8] text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Save Alert
                  </button>
                </div>
              </form>
            )}

            {/* Alerts List */}
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-[#2F2F2F] rounded-2xl">
                  <Mail className="h-8 w-8 text-neutral-500 mx-auto mb-2" />
                  <p className="text-xs text-neutral-400">No saved alerts yet.</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={`p-4 rounded-xl border transition-all ${
                      alert.isActive 
                        ? 'bg-[#1E1E1E] border-[#2F2F2F]' 
                        : 'bg-[#171717]/50 border-[#2F2F2F]/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-bold text-white text-sm">{alert.name}</h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 mt-0.5">
                          <MapPin className="h-3 w-3 text-[#38bdf8]" />
                          <span>{alert.location}</span>
                          <span className="w-1 h-1 rounded-full bg-neutral-600" />
                          <span>{alert.propertyType}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {/* Toggle Switch */}
                        <button
                          onClick={() => onToggleAlert(alert.id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            alert.isActive ? 'bg-[#10b981]' : 'bg-neutral-700'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              alert.isActive ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => onDeleteAlert(alert.id)}
                          className="p-1 rounded hover:bg-red-500/10 text-neutral-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-neutral-400 border-t border-[#2F2F2F]/50 pt-2 mt-2">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-[#10b981]" />
                        <span>
                          {alert.minPrice.toLocaleString()} - {alert.maxPrice.toLocaleString()}
                        </span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-[#262626] text-[9px] font-medium text-neutral-300">
                        {alert.frequency}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base">App Preferences</h3>
              
              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#1E1E1E] border border-[#2F2F2F]">
                <div>
                  <p className="text-xs font-semibold text-white">Dark Mode</p>
                  <p className="text-[10px] text-neutral-400">Toggle dark/light interface</p>
                </div>
                <button
                  onClick={onToggleTheme}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    theme === 'dark' ? 'bg-[#9E7FFF]' : 'bg-neutral-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Refresh Data */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#1E1E1E] border border-[#2F2F2F]">
                <div>
                  <p className="text-xs font-semibold text-white">Force Refresh Data</p>
                  <p className="text-[10px] text-neutral-400">Fetch fresh listings immediately</p>
                </div>
                <button
                  onClick={onRefreshData}
                  disabled={loading}
                  className="p-2 rounded-lg bg-[#262626] hover:bg-[#2F2F2F] text-neutral-300 hover:text-white transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Cloudflare Worker Info */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#262626] to-[#1E1E1E] border border-[#2F2F2F] space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
                Cloudflare Worker Integration
              </h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                This app is fully prepared to connect to a Cloudflare Worker. Simply update the <code className="text-[#38bdf8] bg-[#171717] px-1 py-0.5 rounded">CLOUDFLARE_WORKER_API</code> constant in <code className="text-[#38bdf8] bg-[#171717] px-1 py-0.5 rounded">usePropertyData.ts</code> to fetch live scraped data and trigger real-time email alerts.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
