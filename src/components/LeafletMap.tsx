'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { Area, Country, City } from '@/lib/countryData';

interface LeafletMapProps {
    selectedArea: Area | null;
    selectedCountry: Country | null;
    onCountryClick: (country: Country) => void;
    onCityClick: (city: City, country: Country) => void;
    onMapClick?: (lat: number, lng: number) => void;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
    interface Window {
        L: any;
    }
}

// Antique sepia color palette
const ANTIQUE_COLORS = {
    country: { fill: '#c8a96e', stroke: '#8b6914', opacity: 0.5 },
    city: { fill: '#8b3a3a', stroke: '#5c1c1c' },
    selected: { fill: '#d4a017', stroke: '#8b6914' },
};

export default function LeafletMap({
    selectedArea,
    selectedCountry,
    onCountryClick,
    onCityClick,
    onMapClick,
}: LeafletMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const isInitialized = useRef(false);

    const clearMarkers = useCallback(() => {
        markersRef.current.forEach(m => {
            try { m.remove(); } catch { /* ignore */ }
        });
        markersRef.current = [];
    }, []);

    // Initialize map once
    useEffect(() => {
        if (isInitialized.current || !mapContainerRef.current) return;

        const initLeaflet = () => {
            if (!window.L || !mapContainerRef.current) return;
            isInitialized.current = true;

            const L = window.L;

            const map = L.map(mapContainerRef.current, {
                center: [20, 10],
                zoom: 2,
                zoomControl: true,
                attributionControl: true,
                minZoom: 2,
                maxZoom: 16,
            });

            // Retro/antique tile layer using CartoDB Voyager
            L.tileLayer(
                'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
                {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    subdomains: 'abcd',
                    maxZoom: 20,
                }
            ).addTo(map);

            mapRef.current = map;

            // Map background click → fire onMapClick (skip marker clicks)
            map.on('click', (e: any) => {
                // If the original event target has the marker class, skip
                const target = e.originalEvent?.target as HTMLElement | null;
                if (target && (
                    target.closest('.leaflet-antique-marker') ||
                    target.closest('.leaflet-marker-icon')
                )) return;
                if (onMapClick) {
                    onMapClick(e.latlng.lat, e.latlng.lng);
                }
            });
        };

        // Load Leaflet CSS + JS dynamically
        if (!document.querySelector('link[href*="leaflet"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }

        if (window.L) {
            initLeaflet();
        } else if (!document.querySelector('script[src*="leaflet"]')) {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = initLeaflet;
            document.head.appendChild(script);
        }
    }, []);

    // Create a custom div icon for country/city markers
    const createCountryMarker = useCallback((country: Country) => {
        if (!window.L) return null;
        const L = window.L;

        const html = `
            <div class="leaflet-antique-marker country-marker" title="${country.name}">
                <span class="marker-flag">${country.flag}</span>
                <span class="marker-name">${country.name}</span>
            </div>`;

        const icon = L.divIcon({
            html,
            className: '',
            iconSize: [120, 44],
            iconAnchor: [60, 22],
        });

        return L.marker([country.lat, country.lng], { icon });
    }, []);

    const createCityMarker = useCallback((city: City, country: Country) => {
        if (!window.L) return null;
        const L = window.L;

        const html = `
            <div class="leaflet-antique-marker city-marker" title="${city.name}">
                <div class="city-dot"></div>
                <span class="marker-name">${city.nameJa}</span>
            </div>`;

        const icon = L.divIcon({
            html,
            className: '',
            iconSize: [100, 36],
            iconAnchor: [50, 18],
        });

        return L.marker([city.lat, city.lng], { icon }).on('click', () => {
            onCityClick(city, country);
        });
    }, [onCityClick]);

    // React to area selection: zoom and show country markers
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !window.L) return;

        clearMarkers();

        if (!selectedArea) {
            map.flyTo([20, 10], 2, { duration: 1.5, easing: (t: number) => t });
            return;
        }

        // Fly to the selected area
        map.flyTo([selectedArea.lat, selectedArea.lng], selectedArea.zoom, {
            duration: 1.8,
            easeLinearity: 0.25,
        });

        // Add country markers after fly animation
        const timeout = setTimeout(() => {
            selectedArea.countries.forEach(country => {
                const marker = createCountryMarker(country);
                if (!marker) return;
                marker.on('click', () => onCountryClick(country));
                marker.addTo(map);
                markersRef.current.push(marker);
            });
        }, 1900);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedArea]);

    // React to country selection: zoom and show city markers
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !window.L) return;

        clearMarkers();

        if (!selectedCountry) return;

        // Fly to country
        map.flyTo([selectedCountry.lat, selectedCountry.lng], selectedCountry.zoom, {
            duration: 1.5,
            easeLinearity: 0.25,
        });

        // Add city markers after fly animation
        const timeout = setTimeout(() => {
            selectedCountry.cities.forEach(city => {
                const marker = createCityMarker(city, selectedCountry);
                if (!marker) return;
                marker.addTo(map);
                markersRef.current.push(marker);
            });
        }, 1600);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCountry]);

    return (
        <div className="relative w-full h-full">
            {/* The antique sepia overlay */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 60%, rgba(60,30,5,0.45) 100%)',
                    mixBlendMode: 'multiply',
                }}
            />
            <div
                ref={mapContainerRef}
                className="absolute inset-0 w-full h-full leaflet-antique"
            />
        </div>
    );
}
/* eslint-enable @typescript-eslint/no-explicit-any */
