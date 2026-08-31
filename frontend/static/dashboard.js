/**
 * MALAI VIZHI (மலை விழி) — "Eye of the Mountain"
 * AI-Based Landslide Early Warning System — North Eastern Region of India
 * Professional Geospatial Disaster Intelligence Dashboard & Application Controller
 */

'use strict';

// ── 1. CONFIGURATION & CONSTANTS ──
const API_BASE          = window.location.origin.includes('http') ? '' : 'http://127.0.0.1:5000';
const AUTO_REFRESH_MS   = 30_000;  // 30 seconds live refresh
const TOAST_DURATION_MS =  6_500;  // 6.5s auto-dismiss

// Strict Risk Palette (Exclusively used for risk status representation)
const RISK_COLORS = {
  HIGH:     '#DC2626',
  MODERATE: '#F59E0B',
  LOW:      '#16A34A'
};

// Global Application State
const state = {
  activeView: 'dashboard',
  locations: [],
  selectedLocationId: null,
  alerts: [],
  reports: [],
  analytics: null,
  previousHighIds: new Set(),
  mainMap: null,
  markerLayer: null,
  markersMap: {},
  reportMap: null,
  reportMarker: null,
  charts: {},
  isAdmin: localStorage.getItem('mv_admin_logged_in') === 'true',
  alertFilterSev: 'ALL',
  alertFilterStat: 'ALL',
  lastRefreshTimestamp: Date.now(),
  isBackendOffline: false
};

// ── 2. DOM ELEMENT HELPERS ──
const $ = (id) => document.getElementById(id);
const $$ = (selector) => document.querySelectorAll(selector);

// ── 3. ROUTING & VIEW CONTROLLER ──
function initRouter() {
  function handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    const validViews = ['landing', 'dashboard', 'alerts', 'report', 'analytics', 'login', 'about'];
    const targetView = validViews.includes(hash) ? hash : 'dashboard';
    switchView(targetView);
  }

  window.addEventListener('hashchange', handleRoute);
  
  // Navigation Links Click Handler
  document.addEventListener('click', (e) => {
    const navAnchor = e.target.closest('[data-nav]');
    if (navAnchor) {
      const viewName = navAnchor.getAttribute('data-nav');
      if (viewName) {
        window.location.hash = viewName;
      }
    }
  });

  handleRoute();
}

function switchView(viewName) {
  state.activeView = viewName;

  // Update Page Sections
  $$('.page-view').forEach(view => {
    view.classList.remove('active');
  });

  const activeSection = $(`view-${viewName}`);
  if (activeSection) {
    activeSection.classList.add('active');
  }

  // Update Nav Links
  $$('.nav-link').forEach(link => {
    if (link.getAttribute('data-nav') === viewName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // View-Specific Initializers
  if (viewName === 'dashboard') {
    setTimeout(() => {
      if (state.mainMap) {
        state.mainMap.invalidateSize();
      } else {
        initMainMap();
      }
    }, 100);
  } else if (viewName === 'report') {
    setTimeout(() => {
      if (state.reportMap) {
        state.reportMap.invalidateSize();
      } else {
        initReportMiniMap();
      }
    }, 100);
  } else if (viewName === 'analytics') {
    setTimeout(() => {
      renderAnalyticsCharts();
    }, 100);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── 4. API FETCH WRAPPER ──
async function api(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error(`[MALAI VIZHI] API Error (${path}):`, err);
    throw err;
  }
}

// ── 5. MAIN DATA REFRESH ──
async function refreshAllData() {
  try {
    const [locations, alerts, reports] = await Promise.all([
      api('/api/risk-data'),
      api('/api/alerts'),
      api('/api/reports')
    ]);

    state.locations = locations;
    state.alerts = alerts;
    state.reports = reports;
    state.lastRefreshTimestamp = Date.now();
    state.isBackendOffline = false;

    // Hide offline banner if previously shown
    if ($('backend-offline-banner')) $('backend-offline-banner').classList.remove('active');

    // If no location is currently selected, select highest risk location
    if (!state.selectedLocationId && locations.length > 0) {
      const highestRiskLoc = [...locations].sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0))[0];
      state.selectedLocationId = highestRiskLoc.id;
    }

    // Update Components
    updateDashboardMetrics(locations);
    updateMainMap(locations);
    updateLocationIntelPanel();
    updateLiveEnvironmentalMonitoring(locations);
    updateAIRiskInsight(locations);
    updateRecentAlertsPreview(alerts);
    updateModalLocationDropdown(locations);
    updateAlertsTable(alerts);
    updateCitizenReportsFeed(reports);
    updateHeaderPill(true, alerts);
    
    // Check for high-risk transitions & trigger notifications
    checkHighRiskTransitions(locations);

    // Refresh charts if on analytics view
    if (state.activeView === 'analytics') {
      renderAnalyticsCharts();
    }

  } catch (err) {
    console.warn('[MALAI VIZHI] Backend unreachable:', err);
    state.isBackendOffline = true;
    if ($('backend-offline-banner')) $('backend-offline-banner').classList.add('active');
    updateHeaderPill(false);
  }
}

// ── 6. HEADER STATUS & LIVE TIMER ──
function updateHeaderPill(isOnline, alerts = []) {
  const pill = $('global-status-pill');
  if (!pill) return;

  if (isOnline) {
    pill.className = 'status-pill';
    pill.innerHTML = `<span class="status-dot"></span><span class="status-text">SYSTEM OPERATIONAL</span>`;
    
    // Alert badge count in nav
    const activeAlerts = alerts.filter(a => a.status !== 'Resolved').length;
    if ($('nav-alert-badge')) {
      $('nav-alert-badge').textContent = activeAlerts;
      $('nav-alert-badge').style.display = activeAlerts > 0 ? 'inline-block' : 'none';
    }
  } else {
    pill.className = 'status-pill'
    pill.innerHTML = `<span class="status-dot" style="background:#DC2626;box-shadow:0 0 6px #DC2626;"></span><span class="status-text" style="color:#EF4444;">BACKEND OFFLINE</span>`;
  }
}

function startLiveRelativeTimer() {
  setInterval(() => {
    const elapsedSec = Math.floor((Date.now() - state.lastRefreshTimestamp) / 1000);
    let timeStr = 'just now';

    if (elapsedSec >= 60) {
      const min = Math.floor(elapsedSec / 60);
      timeStr = `${min} min ago`;
    } else if (elapsedSec > 0) {
      timeStr = `${elapsedSec}s ago`;
    }

    if ($('header-last-updated')) $('header-last-updated').textContent = timeStr;
    if ($('dash-live-timer')) $('dash-live-timer').textContent = `Last refreshed ${timeStr}`;
  }, 1000);
}

// ── 7. TOP RISK OVERVIEW (4 METRIC CARDS) ──
function updateDashboardMetrics(locations) {
  if (!locations || !locations.length) {
    if ($('card-count-low')) $('card-count-low').textContent = '--';
    if ($('card-count-mod')) $('card-count-mod').textContent = '--';
    if ($('card-count-high')) $('card-count-high').textContent = '--';
    if ($('card-count-total')) $('card-count-total').textContent = '--';
    return;
  }

  const counts = { HIGH: 0, MODERATE: 0, LOW: 0 };
  locations.forEach(loc => {
    if (counts[loc.risk_level] !== undefined) {
      counts[loc.risk_level]++;
    }
  });

  const total = locations.length;

  if ($('card-count-low'))   $('card-count-low').textContent   = String(counts.LOW).padStart(2, '0');
  if ($('card-count-mod'))   $('card-count-mod').textContent   = String(counts.MODERATE).padStart(2, '0');
  if ($('card-count-high'))  $('card-count-high').textContent  = String(counts.HIGH).padStart(2, '0');
  if ($('card-count-total')) $('card-count-total').textContent = String(total).padStart(2, '0');

  // Secondary statistics
  if ($('card-sub-low')) {
    const pct = Math.round((counts.LOW / total) * 100);
    $('card-sub-low').textContent = `Baseline conditions (${pct}% of grid)`;
  }
  if ($('card-sub-mod')) {
    const pct = Math.round((counts.MODERATE / total) * 100);
    $('card-sub-mod').textContent = `Elevated saturation (${pct}% of grid)`;
  }
  if ($('card-sub-high')) {
    $('card-sub-high').textContent = counts.HIGH > 0 ? `Critical alert status (${counts.HIGH} active)` : `0 in critical threshold`;
  }
  if ($('card-sub-total')) {
    $('card-sub-total').textContent = `${total} Strategic Basins • 86 Sensor Nodes`;
  }
}

// ── 8. MAIN LEAFLET MAP & CUSTOM MARKERS ──
function initMainMap() {
  const mapContainer = $('map');
  if (!mapContainer) return;

  if (typeof L === 'undefined') {
    mapContainer.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#64748B;"><span>Connecting Geospatial Engine…</span></div>';
    setTimeout(initMainMap, 300);
    return;
  }

  state.mainMap = L.map('map', {
    center: [26.0, 93.0],
    zoom: 6.5,
    zoomControl: true,
    attributionControl: true
  });

  // Standard clean OpenStreetMap tiles with no API key requirement or watermarks
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | NASA POWER',
    maxZoom: 18
  }).addTo(state.mainMap);

  state.markerLayer = L.layerGroup().addTo(state.mainMap);

  if (state.locations.length > 0) {
    updateMainMap(state.locations);
  }
}

function updateMainMap(locations) {
  if (!state.mainMap || !state.markerLayer) return;

  state.markerLayer.clearLayers();
  state.markersMap = {};

  locations.forEach(loc => {
    const isSelected = (loc.id === state.selectedLocationId);
    const color = RISK_COLORS[loc.risk_level] || '#64748B';
    
    // Subtle custom circle marker
    const baseRadius = loc.risk_level === 'HIGH' ? 12 : loc.risk_level === 'MODERATE' ? 10 : 8;
    const radius = isSelected ? baseRadius + 4 : baseRadius;

    const marker = L.circleMarker([loc.latitude, loc.longitude], {
      radius: radius,
      fillColor: color,
      color: isSelected ? '#071A2B' : '#FFFFFF',
      weight: isSelected ? 3.5 : 2,
      opacity: 1,
      fillOpacity: 0.92
    });

    marker.on('click', () => {
      selectLocation(loc.id, true);
    });

    const popupHtml = `
      <div class="popup-card">
        <div class="popup-header popup-header-${loc.risk_level.toLowerCase()}">
          <div class="popup-loc-title">
            <span>${escapeHTML(loc.name)}</span>
            <span class="badge-risk badge-risk-${loc.risk_level}">${loc.risk_level} RISK</span>
          </div>
          <div class="popup-state">${escapeHTML(loc.state)} &bull; ${loc.latitude.toFixed(2)}°N, ${loc.longitude.toFixed(2)}°E</div>
        </div>
        <div class="popup-body">
          <div class="popup-score-row">
            <span class="text-muted">AI Risk Score:</span>
            <span class="popup-score-val ${loc.risk_level === 'HIGH' ? 'text-high' : loc.risk_level === 'MODERATE' ? 'text-mod' : 'text-low'}">
              ${loc.risk_score || 25} / 100
            </span>
          </div>
          <div class="popup-metrics-grid">
            <div class="popup-metric-item">
              <span>Rainfall (24h)</span>
              <strong>${Number(loc.rainfall_mm).toFixed(1)} mm</strong>
            </div>
            <div class="popup-metric-item">
              <span>Soil Moisture</span>
              <strong>${Number(loc.soil_moisture).toFixed(1)} %</strong>
            </div>
            <div class="popup-metric-item">
              <span>Slope Gradient</span>
              <strong>${loc.slope_deg || 32}°</strong>
            </div>
            <div class="popup-metric-item">
              <span>Updated</span>
              <strong>${loc.last_updated ? loc.last_updated.split(' ')[1] : 'Just now'}</strong>
            </div>
          </div>
          <div class="popup-ai-note">
            <strong>AI Assessment:</strong> ${escapeHTML(loc.ai_assessment || 'Stable baseline thresholds.')}
          </div>
          <div class="popup-footer">
            <span>SOURCE: ${loc.data_source || 'NASA POWER / SENSORS'}</span>
            <a href="#alerts" data-nav="alerts" style="color:#0F766E;font-weight:600;">View Alerts &rarr;</a>
          </div>
        </div>
      </div>
    `;

    marker.bindPopup(popupHtml, { maxWidth: 300, closeButton: true });
    marker.addTo(state.markerLayer);
    state.markersMap[loc.id] = marker;
  });
}

function selectLocation(locationId, panMap = false) {
  state.selectedLocationId = locationId;
  updateLocationIntelPanel();
  
  // Highlight marker
  if (state.locations.length > 0) {
    updateMainMap(state.locations);
  }

  const targetLoc = state.locations.find(l => l.id === locationId);
  if (targetLoc && panMap && state.mainMap) {
    state.mainMap.flyTo([targetLoc.latitude, targetLoc.longitude], 8, { duration: 1.0 });
    const marker = state.markersMap[locationId];
    if (marker) {
      setTimeout(() => marker.openPopup(), 400);
    }
  }
}

// ── 9. DEDICATED LOCATION INTELLIGENCE PANEL ──
function updateLocationIntelPanel() {
  const card = $('location-intel-card');
  if (!card) return;

  const loc = state.locations.find(l => l.id === state.selectedLocationId) || state.locations[0];
  if (!loc) return;

  if ($('intel-station-name')) $('intel-station-name').textContent = loc.name.toUpperCase();
  if ($('intel-station-state')) $('intel-station-state').textContent = loc.state;

  // Risk Badge
  const badgeWrap = $('intel-risk-badge-wrap');
  if (badgeWrap) {
    badgeWrap.innerHTML = `<span class="badge-risk badge-risk-${loc.risk_level}">${loc.risk_level} RISK</span>`;
  }

  // Risk Score & Bar
  const score = loc.risk_score || 25;
  if ($('intel-risk-score')) $('intel-risk-score').textContent = `${score} / 100`;

  const bar = $('intel-score-bar');
  if (bar) {
    bar.style.width = `${Math.min(100, Math.max(5, score))}%`;
    bar.className = `intel-score-fill ${loc.risk_level === 'HIGH' ? 'fill-high' : loc.risk_level === 'MODERATE' ? 'fill-mod' : 'fill-low'}`;
  }

  // Environmental Conditions
  if ($('intel-rainfall')) $('intel-rainfall').textContent = `${Number(loc.rainfall_mm).toFixed(0)} mm`;
  if ($('intel-moisture')) $('intel-moisture').textContent = `${Number(loc.soil_moisture).toFixed(0)}%`;

  // Relative Time
  if ($('intel-last-updated')) {
    const elapsedSec = Math.floor((Date.now() - state.lastRefreshTimestamp) / 1000);
    $('intel-last-updated').textContent = elapsedSec > 60 ? `${Math.floor(elapsedSec/60)} min ago` : `${elapsedSec}s ago`;
  }

  // AI Assessment Quote
  if ($('intel-ai-assessment')) {
    $('intel-ai-assessment').textContent = `“${loc.ai_assessment || 'Risk is within baseline limits. No immediate slope failure warning.'}”`;
  }

  // Quick Stress Simulation button on this specific station
  const btnSimThis = $('btn-intel-simulate-this');
  if (btnSimThis) {
    btnSimThis.onclick = () => {
      openSimulateModal(loc.id);
    };
  }
}

// ── 10. LIVE ENVIRONMENTAL MONITORING PANEL ──
function updateLiveEnvironmentalMonitoring(locations) {
  if (!locations || !locations.length) return;

  const rainfalls = locations.map(l => Number(l.rainfall_mm));
  const moistures = locations.map(l => Number(l.soil_moisture));

  const avgRain = (rainfalls.reduce((a, b) => a + b, 0) / rainfalls.length).toFixed(0);
  const avgMoist = (moistures.reduce((a, b) => a + b, 0) / moistures.length).toFixed(0);

  if ($('side-avg-rain')) $('side-avg-rain').textContent = `${avgRain} mm`;
  if ($('side-avg-moist')) $('side-avg-moist').textContent = `${avgMoist}%`;

  // Dynamic Trend Indicators
  if ($('side-rain-trend')) {
    const isElevated = Number(avgRain) > 100;
    $('side-rain-trend').textContent = isElevated ? `↑ 14% vs 7d baseline` : `↓ 4% vs seasonal mean`;
    $('side-rain-trend').className = `env-trend ${isElevated ? 'warning' : 'positive'}`;
  }

  if ($('side-moist-trend')) {
    const isSaturated = Number(avgMoist) > 65;
    $('side-moist-trend').textContent = isSaturated ? `↑ 9% pore saturation` : `Stable baseline`;
    $('side-moist-trend').className = `env-trend ${isSaturated ? 'warning' : 'positive'}`;
  }
}

// ── 11. AI RISK INSIGHT SYNTHESIS ──
function updateAIRiskInsight(locations) {
  const el = $('ai-insight-text');
  if (!el || !locations.length) return;

  const highLocations = locations.filter(l => l.risk_level === 'HIGH');
  const modLocations  = locations.filter(l => l.risk_level === 'MODERATE');

  const topRainLoc = [...locations].sort((a, b) => b.rainfall_mm - a.rainfall_mm)[0];
  const topMoistLoc = [...locations].sort((a, b) => b.soil_moisture - a.soil_moisture)[0];

  if (highLocations.length > 0) {
    const names = highLocations.map(l => `${l.name} (${l.state})`).slice(0, 2).join(' and ');
    el.innerHTML = `
      <strong>${highLocations.length} monitored location(s)</strong> are currently showing elevated landslide risk, prominently in <strong>${names}</strong>. 
      <strong>${topRainLoc.name}</strong> has the highest cumulative rainfall at <strong>${topRainLoc.rainfall_mm.toFixed(0)} mm</strong>, 
      with soil moisture saturation at <strong>${topMoistLoc.soil_moisture.toFixed(0)}%</strong>. 
      Pore-water pressure physics indicates reduced shear resistance across steep fault slopes.
    `;
  } else if (modLocations.length > 0) {
    el.innerHTML = `
      <strong>${modLocations.length} location(s)</strong> are in moderate advisory status. 
      Precipitation across <strong>${topRainLoc.name}</strong> is increasing (${topRainLoc.rainfall_mm.toFixed(0)} mm). 
      Current moisture accumulation warrants proactive drone surveillance along critical highway corridors.
    `;
  } else {
    el.textContent = `
      All 12 monitored North Eastern stations are currently within baseline thresholds. 
      Average regional precipitation is stable at ${topRainLoc.rainfall_mm.toFixed(0)} mm, with no imminent slope failure triggers detected.
    `;
  }
}

// ── 12. RECENT ALERTS PREVIEW (LATEST 4) ──
function updateRecentAlertsPreview(alerts) {
  const grid = $('recent-alerts-grid');
  if (!grid) return;

  if (!alerts || !alerts.length) {
    grid.innerHTML = `<div class="text-center text-muted p-3" style="grid-column: 1 / -1;">No active alerts recorded. All stations operating within safe thresholds.</div>`;
    return;
  }

  const latest4 = alerts.slice(0, 4);

  grid.innerHTML = latest4.map(a => {
    const elapsedSec = Math.floor((Date.now() - new Date(a.timestamp || Date.now()).getTime()) / 1000);
    let timeStr = '2 min ago';
    if (!isNaN(elapsedSec) && elapsedSec > 0) {
      timeStr = elapsedSec > 3600 ? `${Math.floor(elapsedSec/3600)}h ago` : elapsedSec > 60 ? `${Math.floor(elapsedSec/60)} min ago` : `${elapsedSec}s ago`;
    }

    return `
      <div class="alert-preview-item alert-sev-${a.severity}">
        <div class="alert-item-top">
          <span class="badge-risk badge-risk-${a.severity}">${a.severity}</span>
          <span class="status-tag ${a.status === 'Resolved' ? 'status-low' : a.status === 'Acknowledged' ? 'status-mod' : 'status-high'}">
            ${a.status}
          </span>
        </div>
        <div class="alert-item-loc-title">${escapeHTML(a.location_name)}, ${escapeHTML(a.location_state || '')}</div>
        <div class="alert-item-snippet">${escapeHTML(a.message)}</div>
        <div class="alert-item-bottom">
          <span>${timeStr}</span>
          <span>#ALT-${String(a.id).padStart(4, '0')}</span>
        </div>
      </div>
    `;
  }).join('');
}

// ── 13. HACKATHON DEMO: SIMULATE ENVIRONMENTAL STRESS MODAL ──
function updateModalLocationDropdown(locations) {
  const select = $('modal-sim-location-select');
  if (!select) return;

  const currentVal = select.value;
  const sorted = [...locations].sort((a, b) => a.name.localeCompare(b.name));

  select.innerHTML = '<option value="">— Select Monitoring Station —</option>' +
    sorted.map(l => `<option value="${l.id}">${escapeHTML(l.name)} (${escapeHTML(l.state)}) &bull; Current: ${l.risk_level}</option>`).join('');

  if (currentVal) select.value = currentVal;
}

function openSimulateModal(preselectedId = null) {
  const modal = $('modal-simulate-stress');
  if (!modal) return;

  const select = $('modal-sim-location-select');
  if (select && preselectedId) {
    select.value = String(preselectedId);
  }

  modal.classList.add('active');
}

function closeSimulateModal() {
  const modal = $('modal-simulate-stress');
  if (modal) modal.classList.remove('active');
}

async function handleExecuteSimulation() {
  const select = $('modal-sim-location-select');
  const locationId = select ? select.value : null;

  if (!locationId) {
    showToast('Select Station', 'Please choose a target location for the simulation.', 'warning');
    return;
  }

  const btn = $('btn-execute-simulation');
  const spinner = $('modal-sim-spinner');

  if (btn) btn.disabled = true;
  if (spinner) spinner.classList.add('active');

  try {
    const result = await api('/api/simulate-rain', {
      method: 'POST',
      body: JSON.stringify({ location_id: Number(locationId) })
    });

    closeSimulateModal();

    // Show explicit DEMO EVENT Toast
    showToast(
      '⚠ HIGH RISK DETECTED [DEMO EVENT]',
      `${result.location_name}, ${result.state} — Simulated rainfall spike (${result.rainfall_mm.toFixed(0)} mm) has elevated the location's risk level to ${result.risk_level}.`,
      result.risk_level === 'HIGH' ? 'danger' : 'normal'
    );

    // Refresh live data in-place
    await refreshAllData();

    // Select this location and fly map to it
    selectLocation(Number(locationId), true);

  } catch (err) {
    showToast('Simulation Error', err.message, 'danger');
  } finally {
    if (btn) btn.disabled = false;
    if (spinner) spinner.classList.remove('active');
  }
}

// ── 14. HIGH RISK NOTIFICATION AUDIT ──
function checkHighRiskTransitions(locations) {
  const currentHighIds = new Set(locations.filter(l => l.risk_level === 'HIGH').map(l => l.id));

  locations.forEach(loc => {
    if (loc.risk_level === 'HIGH' && !state.previousHighIds.has(loc.id)) {
      showToast(
        '🚨 HIGH RISK DETECTED',
        `${loc.name}, ${loc.state} — Extreme rainfall (${Number(loc.rainfall_mm).toFixed(0)} mm) exceeds threshold. Early warning dispatched.`,
        'danger'
      );
    }
  });

  state.previousHighIds = currentHighIds;
}

// ── 15. ALERTS MANAGEMENT PAGE (FULL TABLE) ──
function updateAlertsTable(alerts) {
  const activeCount = alerts.filter(a => a.status === 'Sent').length;
  const ackCount    = alerts.filter(a => a.status === 'Acknowledged').length;
  const resCount    = alerts.filter(a => a.status === 'Resolved').length;

  if ($('count-alert-active')) $('count-alert-active').textContent = activeCount;
  if ($('count-alert-ack'))    $('count-alert-ack').textContent    = ackCount;
  if ($('count-alert-res'))    $('count-alert-res').textContent    = resCount;

  let filtered = alerts.filter(a => {
    const matchSev  = state.alertFilterSev === 'ALL' || a.severity === state.alertFilterSev;
    const matchStat = state.alertFilterStat === 'ALL' || a.status === state.alertFilterStat;
    return matchSev && matchStat;
  });

  const tableBody = $('alerts-table-body');
  if (!tableBody) return;

  if (!filtered.length) {
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted p-4">No matching alerts for the selected filters.</td></tr>`;
    return;
  }

  tableBody.innerHTML = filtered.map(a => `
    <tr>
      <td><strong>#ALT-${String(a.id).padStart(4, '0')}</strong></td>
      <td><strong>${escapeHTML(a.location_name)}</strong><br/><small class="text-muted">${escapeHTML(a.location_state || '')}</small></td>
      <td><span class="badge-risk badge-risk-${a.severity}">${a.severity}</span></td>
      <td>${escapeHTML(a.message)}</td>
      <td class="text-muted" style="white-space:nowrap;">${a.timestamp || '—'}</td>
      <td>
        <span class="status-tag ${a.status === 'Resolved' ? 'status-low' : a.status === 'Acknowledged' ? 'status-mod' : 'status-high'}">
          ${a.status}
        </span>
      </td>
      <td>
        <div style="display:flex;gap:4px;">
          ${a.status === 'Sent' ? `
            <button class="btn btn-sm btn-ghost" onclick="updateAlertStatus(${a.id}, 'Acknowledged')">Acknowledge</button>
          ` : ''}
          ${a.status !== 'Resolved' ? `
            <button class="btn btn-sm btn-ghost" style="color:#16A34A;" onclick="updateAlertStatus(${a.id}, 'Resolved')">Resolve</button>
          ` : `
            <span class="text-muted text-sm">Closed</span>
          `}
        </div>
      </td>
    </tr>
  `).join('');
}

window.updateAlertStatus = async function(alertId, newStatus) {
  try {
    await api(`/api/alerts/${alertId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus })
    });
    showToast('Alert Updated', `Alert #ALT-${String(alertId).padStart(4, '0')} marked as ${newStatus}.`);
    await refreshAllData();
  } catch (err) {
    showToast('Update Failed', err.message, 'danger');
  }
};

// ── 16. CITIZEN REPORT PAGE & MINI-MAP ──
function initReportMiniMap() {
  const mapEl = $('report-mini-map');
  if (!mapEl) return;
  if (typeof L === 'undefined') {
    setTimeout(initReportMiniMap, 300);
    return;
  }

  state.reportMap = L.map('report-mini-map', {
    center: [25.5788, 91.8933],
    zoom: 7
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(state.reportMap);

  state.reportMap.on('click', (e) => {
    const { lat, lng } = e.latlng;
    if ($('report-lat-input')) $('report-lat-input').value = lat.toFixed(4);
    if ($('report-lon-input')) $('report-lon-input').value = lng.toFixed(4);

    if (state.reportMarker) {
      state.reportMarker.setLatLng([lat, lng]);
    } else {
      state.reportMarker = L.marker([lat, lng]).addTo(state.reportMap);
    }
  });
}

function initCitizenReportForm() {
  const form = $('citizen-report-form');
  const dropzone = $('upload-dropzone');
  const fileInput = $('report-photo-input');
  const previewDiv = $('dropzone-preview');
  const previewImg = $('preview-img');
  const dropContent = $('dropzone-content');
  const btnRemovePhoto = $('btn-remove-photo');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', (e) => {
      if (e.target !== btnRemovePhoto) fileInput.click();
    });

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImg.src = e.target.result;
          dropContent.hidden = true;
          previewDiv.hidden = false;
        };
        reader.readAsDataURL(file);
      }
    });

    if (btnRemovePhoto) {
      btnRemovePhoto.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.value = '';
        previewImg.src = '';
        dropContent.hidden = false;
        previewDiv.hidden = true;
      });
    }
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = $('btn-submit-report');
      const spinner = $('report-spinner');
      const successBox = $('report-success-box');

      const formData = new FormData(form);

      if (btn) btn.disabled = true;
      if (spinner) spinner.classList.add('active');

      try {
        const res = await fetch(`${API_BASE}/api/submit-report`, {
          method: 'POST',
          body: formData
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to submit report.');
        }

        const data = await res.json();
        
        if ($('submitted-report-id')) $('submitted-report-id').textContent = data.report_id;
        if (successBox) successBox.hidden = false;
        
        showToast('Report Logged', `Observation for ${data.location} securely transmitted.`);
        form.reset();
        if (dropContent) dropContent.hidden = false;
        if (previewDiv) previewDiv.hidden = true;

        await refreshAllData();

      } catch (err) {
        showToast('Submission Error', err.message, 'danger');
      } finally {
        if (btn) btn.disabled = false;
        if (spinner) spinner.classList.remove('active');
      }
    });
  }
}

function updateCitizenReportsFeed(reports) {
  if ($('feed-count-badge')) $('feed-count-badge').textContent = `${reports.length} REPORTS`;
  const list = $('report-items-list');
  if (!list) return;

  if (!reports.length) {
    list.innerHTML = `<div class="text-center text-muted p-4">No verified citizen reports logged yet.</div>`;
    return;
  }

  list.innerHTML = reports.slice(0, 10).map(r => `
    <div class="report-feed-item">
      <div class="report-item-header">
        <span>📍 ${escapeHTML(r.category || 'Landslide Hazard')}</span>
        <span>${r.submitted_at || 'Recently'}</span>
      </div>
      <div class="report-item-loc">${escapeHTML(r.location)}</div>
      <div class="report-item-desc">${escapeHTML(r.description)}</div>
      ${r.photo_path ? `
        <div style="margin-top:6px;"><a href="/${r.photo_path}" target="_blank" style="color:#0F766E;font-size:11px;font-weight:600;">📷 View Attached Photo</a></div>
      ` : ''}
    </div>
  `).join('');
}

// ── 17. SCIENTIFIC ANALYTICS CHARTS (Chart.js) ──
function renderAnalyticsCharts() {
  if (typeof Chart === 'undefined') {
    console.warn('[MALAI VIZHI] Chart.js not available.');
    return;
  }

  const locations = state.locations;
  if (!locations.length) return;

  // Chart 1: Risk Distribution (Doughnut)
  const distCtx = $('chart-risk-dist');
  if (distCtx) {
    if (state.charts.dist) state.charts.dist.destroy();

    const lowCount  = locations.filter(l => l.risk_level === 'LOW').length;
    const modCount  = locations.filter(l => l.risk_level === 'MODERATE').length;
    const highCount = locations.filter(l => l.risk_level === 'HIGH').length;

    state.charts.dist = new Chart(distCtx, {
      type: 'doughnut',
      data: {
        labels: ['Low Risk', 'Moderate Advisory', 'High Danger'],
        datasets: [{
          data: [lowCount, modCount, highCount],
          backgroundColor: [RISK_COLORS.LOW, RISK_COLORS.MODERATE, RISK_COLORS.HIGH],
          borderWidth: 2,
          borderColor: '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { font: { family: 'Inter', size: 11 } } }
        }
      }
    });
  }

  // Chart 2: Regional State Comparison (Grouped Bar)
  const regCtx = $('chart-regional-comp');
  if (regCtx) {
    if (state.charts.reg) state.charts.reg.destroy();

    const states = [...new Set(locations.map(l => l.state))];
    const avgRainByState = states.map(st => {
      const subset = locations.filter(l => l.state === st);
      return (subset.reduce((a, b) => a + b.rainfall_mm, 0) / subset.length).toFixed(1);
    });
    const avgMoistByState = states.map(st => {
      const subset = locations.filter(l => l.state === st);
      return (subset.reduce((a, b) => a + b.soil_moisture, 0) / subset.length).toFixed(1);
    });

    state.charts.reg = new Chart(regCtx, {
      type: 'bar',
      data: {
        labels: states,
        datasets: [
          { label: 'Avg Rainfall (mm)', data: avgRainByState, backgroundColor: '#0F766E' },
          { label: 'Avg Moisture (%)', data: avgMoistByState, backgroundColor: '#38BDF8' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  // Chart 3: Soil Moisture vs Slope Gradient Matrix
  const slopeCtx = $('chart-slope-moisture');
  if (slopeCtx) {
    if (state.charts.slope) state.charts.slope.destroy();

    const sortedBySlope = [...locations].sort((a, b) => (a.slope_deg || 30) - (b.slope_deg || 30));
    state.charts.slope = new Chart(slopeCtx, {
      type: 'bar',
      data: {
        labels: sortedBySlope.map(l => l.name),
        datasets: [
          {
            label: 'Slope Angle (°)',
            data: sortedBySlope.map(l => l.slope_deg || 32),
            backgroundColor: '#0B3948'
          },
          {
            label: 'Soil Moisture (%)',
            data: sortedBySlope.map(l => l.soil_moisture),
            backgroundColor: '#14B8A6'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  // Chart 4: 7-Day Rainfall Trend Across Top 3 High-Risk Hubs
  const trendCtx = $('chart-rainfall-trend');
  if (trendCtx) {
    if (state.charts.trend) state.charts.trend.destroy();

    const topHubs = [...locations].sort((a, b) => b.rainfall_mm - a.rainfall_mm).slice(0, 3);
    const days = ['Day -6', 'Day -5', 'Day -4', 'Day -3', 'Day -2', 'Yesterday', 'Today'];

    const colors = ['#DC2626', '#0F766E', '#F59E0B'];
    const datasets = topHubs.map((hub, idx) => {
      const base = hub.rainfall_mm;
      return {
        label: hub.name,
        data: [
          Math.max(5, base * 0.45).toFixed(1),
          Math.max(5, base * 0.55).toFixed(1),
          Math.max(5, base * 0.70).toFixed(1),
          Math.max(5, base * 0.60).toFixed(1),
          Math.max(5, base * 0.85).toFixed(1),
          Math.max(5, base * 0.92).toFixed(1),
          base.toFixed(1)
        ],
        borderColor: colors[idx] || '#0F766E',
        backgroundColor: 'transparent',
        tension: 0.35,
        borderWidth: 2
      };
    });

    state.charts.trend = new Chart(trendCtx, {
      type: 'line',
      data: { labels: days, datasets: datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: { y: { beginAtZero: true, title: { display: true, text: 'Rainfall (mm)' } } }
      }
    });
  }
}

// ── 18. TOAST NOTIFICATIONS ──
function showToast(title, message, type = 'normal') {
  const container = $('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'danger' ? 'toast-danger' : ''}`;

  const icon = type === 'danger' ? '⚠️' : type === 'warning' ? '⚡' : 'ℹ️';

  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-body">
      <div class="toast-title">${escapeHTML(title)}</div>
      <div class="toast-msg">${escapeHTML(message)}</div>
    </div>
  `;

  container.prepend(toast);

  setTimeout(() => {
    toast.classList.add('toast-exit');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, TOAST_DURATION_MS);
}

// ── 19. UI EVENT BINDINGS ──
function initEventBindings() {
  // Manual refresh button
  const btnRefresh = $('btn-manual-refresh');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      refreshAllData();
      showToast('Telemetry Synced', 'Refreshed live NASA POWER satellite & ground station metrics.');
    });
  }

  // Open Simulate Modal button
  const btnOpenModal = $('btn-open-simulate-modal');
  if (btnOpenModal) {
    btnOpenModal.addEventListener('click', () => {
      openSimulateModal(state.selectedLocationId);
    });
  }

  // Modal Close buttons
  const btnCloseModal = $('btn-close-modal');
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeSimulateModal);

  const btnCancelModal = $('btn-cancel-modal');
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeSimulateModal);

  // Close modal when clicking backdrop
  const modalBackdrop = $('modal-simulate-stress');
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeSimulateModal();
    });
  }

  // Execute Simulation
  const btnExecSim = $('btn-execute-simulation');
  if (btnExecSim) {
    btnExecSim.addEventListener('click', handleExecuteSimulation);
  }

  // Alert filters
  $$('[data-filter-sev]').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('[data-filter-sev]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.alertFilterSev = btn.getAttribute('data-filter-sev');
      updateAlertsTable(state.alerts);
    });
  });

  $$('[data-filter-stat]').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('[data-filter-stat]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.alertFilterStat = btn.getAttribute('data-filter-stat');
      updateAlertsTable(state.alerts);
    });
  });
}

function escapeHTML(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── 20. BOOTSTRAP INITIALIZATION ──
document.addEventListener('DOMContentLoaded', () => {
  console.log('🏔️ MALAI VIZHI (மலை விழி) — AI Landslide Intelligence Dashboard Initializing…');

  initRouter();
  initEventBindings();
  initCitizenReportForm();
  startLiveRelativeTimer();

  // Initial Data Fetch
  refreshAllData();

  // 30-second live auto-refresh
  setInterval(refreshAllData, AUTO_REFRESH_MS);
});
