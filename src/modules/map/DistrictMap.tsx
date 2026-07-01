/**
 * DistrictMap — HealthNexus AI
 * 
 * Interactive Leaflet map of all 42 PHC/CHC facilities in Alwar district.
 * Color-coded by AI risk level. Clicking opens a popup with live stats.
 * Layer toggles: Inventory / Beds / Staff / Footfall view modes.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { alwarFacilities, districtSummary, type FacilityWithCoords } from '../../data/alwarFacilities';
import { computeLocalRisk, riskColors, type RiskOutput } from '../ai/riskEngine';

// Fix Leaflet default marker icon path (Vite issue)
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type LayerMode = 'risk' | 'inventory' | 'beds' | 'staff' | 'footfall';

interface MapFacility extends FacilityWithCoords {
  risk: RiskOutput;
}

function getMarkerColor(facility: MapFacility, mode: LayerMode): string {
  if (mode === 'risk') return riskColors[facility.risk.level].map;

  if (mode === 'inventory') {
    const critCount = facility.inventory.filter(i => i.status === 'CRITICAL').length;
    const lowCount = facility.inventory.filter(i => i.status === 'LOW').length;
    if (critCount > 0) return '#DC2626';
    if (lowCount > 0) return '#F59E0B';
    return '#22C55E';
  }

  if (mode === 'beds') {
    const rate = facility.beds.total > 0 ? facility.beds.occupied / facility.beds.total : 0;
    if (rate >= 1) return '#DC2626';
    if (rate >= 0.8) return '#F59E0B';
    return '#22C55E';
  }

  if (mode === 'staff') {
    const rate = facility.staff.attendanceRate;
    if (rate < 70) return '#DC2626';
    if (rate < 85) return '#F59E0B';
    return '#22C55E';
  }

  if (mode === 'footfall') {
    const wait = facility.footfall.estimatedWaitMinutes;
    if (wait > 40) return '#DC2626';
    if (wait > 20) return '#F59E0B';
    return '#22C55E';
  }

  return '#22C55E';
}

function createCircleMarker(facility: MapFacility, mode: LayerMode): L.CircleMarker {
  const color = getMarkerColor(facility, mode);
  const isPHC = facility.type === 'PHC';

  return L.circleMarker([facility.lat, facility.lng], {
    radius: isPHC ? 8 : 12,
    fillColor: color,
    color: '#fff',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.88,
  });
}

function buildPopupHTML(facility: MapFacility): string {
  const bedRate = Math.round((facility.beds.occupied / facility.beds.total) * 100);
  const critItems = facility.inventory.filter(i => i.status === 'CRITICAL').map(i => i.name);
  const riskBadgeColor = facility.risk.level === 'CRITICAL' ? '#DC2626' : facility.risk.level === 'HIGH' ? '#F97316' : facility.risk.level === 'MODERATE' ? '#F59E0B' : '#22C55E';

  return `
    <div style="font-family:Inter,sans-serif;min-width:240px;max-width:280px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <div>
          <strong style="font-size:13px;color:#1e3a5f">${facility.name}</strong><br/>
          <span style="font-size:11px;color:#6b7280">${facility.block} Block · ${facility.type}</span>
        </div>
        <span style="background:${riskBadgeColor};color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px">${facility.risk.level}</span>
      </div>

      <div style="background:#f8faff;border:1px solid #e2e8f0;border-radius:8px;padding:8px;margin-bottom:8px">
        <div style="display:flex;align-items:center;gap:4px;margin-bottom:4px">
          <span style="font-size:11px;font-weight:700;color:#00478d">AI Risk Score: ${facility.risk.score}/100</span>
        </div>
        <div style="width:100%;height:4px;background:#e2e8f0;border-radius:2px;overflow:hidden">
          <div style="width:${facility.risk.score}%;height:100%;background:${riskBadgeColor};border-radius:2px"></div>
        </div>
        <p style="font-size:11px;color:#374151;margin:6px 0 0">${facility.risk.explanation || facility.risk.reasons[0] || ''}</p>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px">
        <div style="background:#f1f5f9;border-radius:6px;padding:6px;text-align:center">
          <div style="font-size:14px;font-weight:700;color:#00478d">${facility.beds.occupied}/${facility.beds.total}</div>
          <div style="font-size:10px;color:#64748b">Beds (${bedRate}%)</div>
        </div>
        <div style="background:#f1f5f9;border-radius:6px;padding:6px;text-align:center">
          <div style="font-size:14px;font-weight:700;color:#00478d">${facility.staff.attendanceRate}%</div>
          <div style="font-size:10px;color:#64748b">Staff Present</div>
        </div>
        <div style="background:#f1f5f9;border-radius:6px;padding:6px;text-align:center">
          <div style="font-size:14px;font-weight:700;color:#00478d">${facility.footfall.estimatedWaitMinutes}m</div>
          <div style="font-size:10px;color:#64748b">Wait Time</div>
        </div>
        <div style="background:#f1f5f9;border-radius:6px;padding:6px;text-align:center">
          <div style="font-size:14px;font-weight:700;color:${critItems.length > 0 ? '#DC2626' : '#22C55E'}">${critItems.length}</div>
          <div style="font-size:10px;color:#64748b">Critical Stock</div>
        </div>
      </div>

      ${critItems.length > 0 ? `
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:6px;margin-bottom:8px">
        <div style="font-size:10px;font-weight:700;color:#DC2626;margin-bottom:2px">⚠ Critical Stockouts</div>
        <div style="font-size:11px;color:#374151">${critItems.join(', ')}</div>
      </div>` : ''}

      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:6px">
        <div style="font-size:10px;font-weight:700;color:#1d4ed8;margin-bottom:2px">▸ Recommended Action</div>
        <div style="font-size:11px;color:#374151">${facility.risk.recommendedAction || 'No immediate action required.'}</div>
      </div>

      <div style="margin-top:8px;text-align:right">
        <span style="font-size:10px;color:#9ca3af">MO: ${facility.moName} · ${facility.contactPhone}</span>
      </div>
    </div>
  `;
}

// ── Main Component ────────────────────────────────────────────────────────

interface DistrictMapProps {
  language?: string;
  onFacilitySelect?: (facility: FacilityWithCoords) => void;
}

export default function DistrictMap({ language = 'en', onFacilitySelect }: DistrictMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const [layerMode, setLayerMode] = useState<LayerMode>('risk');
  const [facilities] = useState<MapFacility[]>(() =>
    alwarFacilities.map(f => ({ ...f, risk: { ...computeLocalRisk(f), explanation: '', recommendedAction: '' } }))
  );
  const [selectedFacility, setSelectedFacility] = useState<MapFacility | null>(null);
  const [statsVisible, setStatsVisible] = useState(true);

  const isHi = language === 'hi';

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: districtSummary.districtBounds.center,
      zoom: 9,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
    }).addTo(map);

    // Attribution bottom-right minimal
    L.control.attribution({ prefix: '© OpenStreetMap' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Draw/update markers whenever layerMode changes
  const drawMarkers = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    facilities.forEach(facility => {
      const marker = createCircleMarker(facility, layerMode);
      marker.addTo(map);
      marker.bindPopup(buildPopupHTML(facility), { maxWidth: 300 });

      marker.on('click', () => {
        setSelectedFacility(facility);
        onFacilitySelect?.(facility);
      });

      // Hover tooltip
      marker.on('mouseover', function() {
        marker.setStyle({ weight: 3, fillOpacity: 1 });
      });
      marker.on('mouseout', function() {
        marker.setStyle({ weight: 2, fillOpacity: 0.88 });
      });

      markersRef.current.push(marker);
    });
  }, [facilities, layerMode, onFacilitySelect]);

  useEffect(() => {
    drawMarkers();
  }, [drawMarkers]);

  const layers: { key: LayerMode; label: string; labelHi: string; icon: string }[] = [
    { key: 'risk',      label: 'AI Risk',    labelHi: 'जोखिम',     icon: 'psychology' },
    { key: 'inventory', label: 'Inventory',  labelHi: 'इन्वेंटरी', icon: 'inventory_2' },
    { key: 'beds',      label: 'Beds',       labelHi: 'बिस्तर',    icon: 'bed' },
    { key: 'staff',     label: 'Staff',      labelHi: 'कर्मचारी',  icon: 'group' },
    { key: 'footfall',  label: 'Footfall',   labelHi: 'मरीज',      icon: 'groups' },
  ];

  const critCount = facilities.filter(f => f.risk.level === 'CRITICAL').length;
  const highCount = facilities.filter(f => f.risk.level === 'HIGH').length;
  const modCount  = facilities.filter(f => f.risk.level === 'MODERATE').length;
  const lowCount  = facilities.filter(f => f.risk.level === 'LOW').length;

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-outline-variant shadow-sm">

      {/* Layer Toggle Bar */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] flex bg-white/95 backdrop-blur-sm border border-outline-variant rounded-xl shadow-md p-1 gap-1">
        {layers.map(l => (
          <button
            key={l.key}
            onClick={() => setLayerMode(l.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              layerMode === l.key
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-base">{l.icon}</span>
            {isHi ? l.labelHi : l.label}
          </button>
        ))}
      </div>

      {/* Stats Legend */}
      {statsVisible && (
        <div className="absolute top-16 right-3 z-[1000] bg-white/95 backdrop-blur-sm border border-outline-variant rounded-xl shadow-md p-3 min-w-[160px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-primary">District Summary</span>
            <button onClick={() => setStatsVisible(false)} className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          <div className="space-y-1.5">
            {[
              { label: 'Critical', count: critCount, color: '#DC2626' },
              { label: 'High Risk', count: highCount, color: '#F97316' },
              { label: 'Moderate', count: modCount,  color: '#F59E0B' },
              { label: 'Low Risk', count: lowCount,   color: '#22C55E' },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full border border-white shadow-sm" style={{ background: color }} />
                  <span className="text-xs text-on-surface-variant">{label}</span>
                </div>
                <span className="text-xs font-bold text-on-surface">{count}</span>
              </div>
            ))}
            <div className="border-t border-outline-variant pt-1.5 mt-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-variant">Total Facilities</span>
                <span className="text-xs font-bold text-primary">42</span>
              </div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-outline-variant space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
              <div className="w-3 h-3 rounded-full border-2 border-white shadow-sm bg-primary" style={{ width: 10, height: 10 }} />
              <span>● Small = PHC</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
              <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm bg-primary" style={{ width: 14, height: 14 }} />
              <span>◉ Large = CHC</span>
            </div>
          </div>
        </div>
      )}

      {!statsVisible && (
        <button
          onClick={() => setStatsVisible(true)}
          className="absolute top-16 right-3 z-[1000] bg-white/95 border border-outline-variant rounded-xl shadow-md p-2"
        >
          <span className="material-symbols-outlined text-primary text-base">legend_toggle</span>
        </button>
      )}

      {/* Selected facility detail strip at bottom */}
      {selectedFacility && (
        <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white/97 backdrop-blur-sm border-t border-outline-variant p-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              selectedFacility.risk.level === 'CRITICAL' ? 'bg-error text-white' :
              selectedFacility.risk.level === 'HIGH' ? 'bg-orange-500 text-white' :
              selectedFacility.risk.level === 'MODERATE' ? 'bg-amber-400 text-amber-900' :
              'bg-green-500 text-white'
            }`}>
              {selectedFacility.risk.score}/100
            </div>
            <div>
              <div className="text-sm font-bold text-primary">{selectedFacility.name}</div>
              <div className="text-xs text-on-surface-variant">{selectedFacility.moName} · {selectedFacility.contactPhone}</div>
            </div>
          </div>
          <div className="text-xs text-on-surface-variant bg-primary-container/20 rounded-lg px-3 py-1.5 max-w-xs">
            {selectedFacility.risk.reasons[0]}
          </div>
          <button onClick={() => setSelectedFacility(null)}>
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>
      )}

      {/* Leaflet map container */}
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: '400px' }} />
    </div>
  );
}
