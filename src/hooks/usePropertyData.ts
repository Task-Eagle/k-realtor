import { useState, useEffect, useCallback } from 'react';
import { Property, EmailAlert } from '../types';
import { generateMockProperties } from '../services/mockData';

const STORAGE_KEY = 'k_realtor_properties';
const LAST_FETCH_KEY = 'k_realtor_last_fetch';
const ALERTS_KEY = 'k_realtor_alerts';

// Placeholder for Cloudflare Worker API URL
// Swap this with your actual Cloudflare Worker endpoint when ready:
// const CLOUDFLARE_WORKER_API = 'https://your-worker.your-subdomain.workers.dev/api/properties';
const CLOUDFLARE_WORKER_API = null;

export const usePropertyData = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<EmailAlert[]>([]);

  // Fetch properties (either from Cloudflare Worker, LocalStorage, or generate fresh mock data)
  const fetchProperties = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      // 1. If Cloudflare Worker API is configured, attempt to fetch real scraped data
      if (CLOUDFLARE_WORKER_API) {
        const response = await fetch(CLOUDFLARE_WORKER_API);
        if (!response.ok) throw new Error('Failed to fetch from Cloudflare Worker');
        const data = await response.json();
        setProperties(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        localStorage.setItem(LAST_FETCH_KEY, Date.now().toString());
        setLoading(false);
        return;
      }

      // 2. Fallback to LocalStorage or generate fresh mock data
      const cachedData = localStorage.getItem(STORAGE_KEY);
      const lastFetch = localStorage.getItem(LAST_FETCH_KEY);
      const threeHours = 3 * 60 * 60 * 1000;

      if (cachedData && lastFetch && !forceRefresh && (Date.now() - parseInt(lastFetch) < threeHours)) {
        setProperties(JSON.parse(cachedData));
      } else {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        const freshData = generateMockProperties();
        setProperties(freshData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(freshData));
        localStorage.setItem(LAST_FETCH_KEY, Date.now().toString());
      }
    } catch (err: any) {
      console.error('Error fetching properties:', err);
      setError(err.message || 'An error occurred while fetching properties.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load alerts from LocalStorage
  useEffect(() => {
    const savedAlerts = localStorage.getItem(ALERTS_KEY);
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    } else {
      // Default mock alerts
      const defaultAlerts: EmailAlert[] = [
        {
          id: 'alert-1',
          name: 'Austin Luxury Homes',
          location: 'Austin',
          minPrice: 1000000,
          maxPrice: 4000000,
          propertyType: 'House',
          frequency: 'Instant',
          createdAt: new Date().toISOString(),
          isActive: true
        },
        {
          id: 'alert-2',
          name: 'SF Condos',
          location: 'San Francisco',
          minPrice: 500000,
          maxPrice: 1500000,
          propertyType: 'Condo',
          frequency: 'Daily',
          createdAt: new Date().toISOString(),
          isActive: true
        }
      ];
      setAlerts(defaultAlerts);
      localStorage.setItem(ALERTS_KEY, JSON.stringify(defaultAlerts));
    }
    fetchProperties();
  }, [fetchProperties]);

  // Save alert (and trigger Cloudflare Worker notification if configured)
  const saveAlert = async (alert: Omit<EmailAlert, 'id' | 'createdAt' | 'isActive'>) => {
    const newAlert: EmailAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    const updatedAlerts = [...alerts, newAlert];
    setAlerts(updatedAlerts);
    localStorage.setItem(ALERTS_KEY, JSON.stringify(updatedAlerts));

    // Cloudflare Worker Integration Placeholder for Email Alerts
    if (CLOUDFLARE_WORKER_API) {
      try {
        await fetch(`${CLOUDFLARE_WORKER_API}/alerts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAlert)
        });
      } catch (err) {
        console.error('Failed to sync alert with Cloudflare Worker:', err);
      }
    }
  };

  // Delete alert
  const deleteAlert = (id: string) => {
    const updatedAlerts = alerts.filter(a => a.id !== id);
    setAlerts(updatedAlerts);
    localStorage.setItem(ALERTS_KEY, JSON.stringify(updatedAlerts));
  };

  // Toggle alert active status
  const toggleAlert = (id: string) => {
    const updatedAlerts = alerts.map(a => 
      a.id === id ? { ...a, isActive: !a.isActive } : a
    );
    setAlerts(updatedAlerts);
    localStorage.setItem(ALERTS_KEY, JSON.stringify(updatedAlerts));
  };

  return {
    properties,
    loading,
    error,
    alerts,
    saveAlert,
    deleteAlert,
    toggleAlert,
    refreshData: () => fetchProperties(true)
  };
};
