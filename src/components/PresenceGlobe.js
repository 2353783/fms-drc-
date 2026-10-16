'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import createGlobe from 'cobe';

// Location coordinates
export const LOCATIONS = [
  {
    id: 'kinshasa',
    city: 'Kinshasa',
    country: 'RDC',
    countryFull: 'République Démocratique du Congo',
    flag: '🇨🇩',
    lat: -4.4419,
    lng: 15.2663,
    role: 'Siège Principal & Direction Générale',
    roleEn: 'Headquarters & General Management',
    address: 'Avenue Citronnier 4, 5ème étage, Gombe',
    tag: 'Siège',
    tagEn: 'HQ',
    highlight: true,
  },
  {
    id: 'lubumbashi',
    city: 'Lubumbashi',
    country: 'RDC',
    countryFull: 'République Démocratique du Congo',
    flag: '🇨🇩',
    lat: -11.6876,
    lng: 27.5026,
    role: 'Bureau Régional — Haut-Katanga',
    roleEn: 'Regional Office — Haut-Katanga',
    address: 'Pôle Minier & Industriel',
    tag: 'Régional',
    tagEn: 'Regional',
    highlight: false,
  },
  {
    id: 'kolwezi',
    city: 'Kolwezi',
    country: 'RDC',
    countryFull: 'République Démocratique du Congo',
    flag: '🇨🇩',
    lat: -10.7167,
    lng: 25.4667,
    role: 'Bureau Opérationnel — Lualaba',
    roleEn: 'Operational Office — Lualaba',
    address: 'Pôle Minier du Lualaba',
    tag: 'Opérationnel',
    tagEn: 'Operations',
    highlight: false,
  },
  {
    id: 'nairobi',
    city: 'Nairobi',
    country: 'Kenya',
    countryFull: 'Kenya',
    flag: '🇰🇪',
    lat: -1.2921,
    lng: 36.8219,
    role: 'Bureau Régional — East Africa',
    roleEn: 'Regional Office — East Africa',
    address: 'Hub Régional & Développement Panafricain',
    tag: 'International',
    tagEn: 'International',
    highlight: true,
  },
  {
    id: 'brazzaville',
    city: 'Brazzaville',
    country: 'Congo',
    countryFull: 'République du Congo',
    flag: '🇨🇬',
    lat: -3.5,
    lng: 14.2,
    role: 'Bureau Régional — Afrique Centrale',
    roleEn: 'Regional Office — Central Africa',
    address: 'Centre d’Affaires — Brazzaville',
    tag: 'Régional',
    tagEn: 'Regional',
    highlight: true,
  },
];

// Project lat/lng to 2D percentage coordinates on the globe
function projectPoint(lat, lng, phi, theta, scale = 1.0) {
  const PI = Math.PI;
  const p = 0.05;
  const baseR = (0.8 + p) * scale;

  const r = (lat * PI) / 180;
  const a = (lng * PI) / 180 - PI;
  const o = Math.cos(r);
  const t = [-o * Math.cos(a), Math.sin(r), o * Math.sin(a)];
  const pt = [t[0] * baseR, t[1] * baseR, t[2] * baseR];

  const rCos = Math.cos(theta);
  const aCos = Math.cos(phi);
  const rSin = Math.sin(theta);
  const aSin = Math.sin(phi);

  const c = aCos * pt[0] + aSin * pt[2];
  const s = aSin * rSin * pt[0] + rCos * pt[1] - aCos * rSin * pt[2];

  const x = ((c + 1) / 2) * 100;
  const y = ((-s + 1) / 2) * 100;
  const z = -aSin * rCos * pt[0] + rSin * pt[1] + aCos * rCos * pt[2];

  const normalizedZ = z / (scale || 1.0);
  return { x, y, z, visible: normalizedZ >= 0.06 };
}

export default function PresenceGlobe({ lang = 'fr' }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const phiRef = useRef(0.2); // Start centered roughly near Africa
  const thetaRef = useRef(0.18); // Slight downward tilt for perspective
  const scaleRef = useRef(1.0); // Globe zoom scale (1.0 default)
  const targetScaleRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const targetPhiRef = useRef(null);
  const targetThetaRef = useRef(null);
  const lastTouchDistRef = useRef(null);

  const [activeLocation, setActiveLocation] = useState('kinshasa');
  const [pinPositions, setPinPositions] = useState({});
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Focus globe on a specific location
  const focusLocation = useCallback((loc) => {
    setActiveLocation(loc.id);
    setIsAutoRotating(false);

    // Calculate phi to bring longitude into front view (facing camera)
    const targetPhi = -(loc.lng * Math.PI) / 180 + Math.PI / 2;
    const targetTheta = (loc.lat * Math.PI) / 180 * -0.5 + 0.15;

    targetPhiRef.current = targetPhi;
    targetThetaRef.current = Math.max(-0.4, Math.min(0.5, targetTheta));
    // Gentle focus zoom
    targetScaleRef.current = 1.15;
  }, []);

  // Zoom control helpers
  const zoomIn = useCallback(() => {
    setIsAutoRotating(false);
    const cur = targetScaleRef.current ?? scaleRef.current;
    targetScaleRef.current = Math.min(2.1, cur + 0.25);
  }, []);

  const zoomOut = useCallback(() => {
    setIsAutoRotating(false);
    const cur = targetScaleRef.current ?? scaleRef.current;
    targetScaleRef.current = Math.max(0.65, cur - 0.25);
  }, []);

  const resetView = useCallback(() => {
    targetScaleRef.current = 1.0;
    targetPhiRef.current = 0.2;
    targetThetaRef.current = 0.18;
    setIsAutoRotating(true);
  }, []);

  useEffect(() => {
    let globe;
    let animationFrameId;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas) return;

    let width = 0;
    const updateSize = () => {
      if (containerRef.current) {
        width = containerRef.current.offsetWidth;
      }
    };
    updateSize();

    // Markers for cobe
    const markers = LOCATIONS.map((loc) => ({
      location: [loc.lat, loc.lng],
      size: loc.id === 'kinshasa' ? 0.09 : 0.075,
      color:
        loc.id === 'nairobi'
          ? [0.95, 0.45, 0.15]
          : loc.id === 'brazzaville'
          ? [0.05, 0.68, 0.45]
          : [0.15, 0.45, 0.95],
    }));

    // Interconnecting arcs between FMS offices
    const arcs = [
      // Kinshasa <-> Brazzaville (Twin capitals across the Congo River)
      { from: [-4.4419, 15.2663], to: [-3.5, 14.2], color: [0.05, 0.68, 0.45] },
      // Kinshasa <-> Nairobi
      { from: [-4.4419, 15.2663], to: [-1.2921, 36.8219], color: [0.2, 0.55, 0.95] },
      // Kinshasa <-> Lubumbashi
      { from: [-4.4419, 15.2663], to: [-11.6876, 27.5026], color: [0.15, 0.45, 0.95] },
      // Brazzaville <-> Nairobi
      { from: [-3.5, 14.2], to: [-1.2921, 36.8219], color: [0.1, 0.65, 0.55] },
      // Lubumbashi <-> Kolwezi
      { from: [-11.6876, 27.5026], to: [-10.7167, 25.4667], color: [0.2, 0.6, 1.0] },
      // Nairobi <-> Lubumbashi
      { from: [-1.2921, 36.8219], to: [-11.6876, 27.5026], color: [0.35, 0.5, 0.95] },
    ];

    try {
      globe = createGlobe(canvas, {
        devicePixelRatio: 2,
        width: (width || 600) * 2,
        height: (width || 600) * 2,
        phi: phiRef.current,
        theta: thetaRef.current,
        dark: 0,
        diffuse: 1.25,
        mapSamples: 18000,
        mapBrightness: 5.5,
        baseColor: [0.92, 0.95, 0.98],
        markerColor: [0.12, 0.45, 0.95],
        glowColor: [0.85, 0.92, 1.0],
        scale: scaleRef.current,
        offset: [0, 0],
        markers,
        arcs,
        arcColor: [0.2, 0.5, 0.95],
        arcWidth: 1.2,
        arcHeight: 0.22,
        markerElevation: 0.05,
        opacity: 0.96,
      });
    } catch (e) {
      console.error('Failed to init globe:', e);
      return;
    }

    // Wheel zoom on canvas with preventDefault (non-passive)
    const handleWheel = (e) => {
      e.preventDefault();
      const delta = -e.deltaY * 0.0016;
      const cur = targetScaleRef.current ?? scaleRef.current;
      const next = Math.max(0.65, Math.min(2.1, cur + delta));
      targetScaleRef.current = next;
    };

    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    // Animation loop
    const animate = () => {
      // Smooth focus transition if target is set
      if (targetPhiRef.current !== null) {
        // Find shortest angle distance
        let diff = targetPhiRef.current - phiRef.current;
        // Normalize diff to [-PI, PI]
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;

        if (Math.abs(diff) > 0.005) {
          phiRef.current += diff * 0.08;
        } else {
          phiRef.current = targetPhiRef.current;
          targetPhiRef.current = null;
        }
      } else if (isAutoRotating && !isDraggingRef.current) {
        phiRef.current += 0.0035;
      }

      if (targetThetaRef.current !== null) {
        const diffT = targetThetaRef.current - thetaRef.current;
        if (Math.abs(diffT) > 0.005) {
          thetaRef.current += diffT * 0.08;
        } else {
          thetaRef.current = targetThetaRef.current;
          targetThetaRef.current = null;
        }
      }

      // Smooth zoom transition if target is set
      if (targetScaleRef.current !== null) {
        const diffS = targetScaleRef.current - scaleRef.current;
        if (Math.abs(diffS) > 0.004) {
          scaleRef.current += diffS * 0.15;
        } else {
          scaleRef.current = targetScaleRef.current;
          targetScaleRef.current = null;
        }
      }

      // Update globe state
      globe.update({
        phi: phiRef.current,
        theta: thetaRef.current,
        scale: scaleRef.current,
      });

      // Compute 2D screen positions for all logo pins
      const positions = {};
      LOCATIONS.forEach((loc) => {
        positions[loc.id] = projectPoint(
          loc.lat,
          loc.lng,
          phiRef.current,
          thetaRef.current,
          scaleRef.current
        );
      });
      setPinPositions(positions);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (containerRef.current && globe) {
        const newWidth = containerRef.current.offsetWidth;
        globe.update({
          width: newWidth * 2,
          height: newWidth * 2,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (globe) globe.destroy();
    };
  }, [isAutoRotating]);

  // Pointer interactions for dragging the globe
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    targetPhiRef.current = null;
    targetThetaRef.current = null;
    setIsAutoRotating(false);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    phiRef.current += dx * 0.005;
    thetaRef.current = Math.max(-0.4, Math.min(0.5, thetaRef.current - dy * 0.005));
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Touch pinch-to-zoom gestures
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchDistRef.current = dist;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && lastTouchDistRef.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / lastTouchDistRef.current;
      lastTouchDistRef.current = dist;
      const cur = targetScaleRef.current ?? scaleRef.current;
      targetScaleRef.current = Math.max(0.65, Math.min(2.1, cur * factor));
    }
  };

  const handleTouchEnd = () => {
    lastTouchDistRef.current = null;
  };

  return (
    <div className="presence-globe-layout">
      {/* 3D Globe Visual Container */}
      <div className="globe-viewport-card">
        <div
          ref={containerRef}
          className="globe-canvas-wrapper"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: isDraggingRef.current ? 'grabbing' : 'grab' }}
          title={lang === 'fr' ? 'Glissez pour tourner • Molette ou boutons pour zoomer' : 'Drag to rotate • Scroll or buttons to zoom'}
        >
          {/* Subtle Ambient Glow behind globe */}
          <div className="globe-ambient-glow" />

          {/* WebGL Canvas */}
          <canvas
            ref={canvasRef}
            className="globe-canvas"
            style={{ width: '100%', height: '100%', aspectRatio: '1', display: 'block' }}
          />

          {/* Real-time HTML Pins with FMS Logo */}
          {LOCATIONS.map((loc) => {
            const pos = pinPositions[loc.id];
            if (!pos) return null;

            const isVisible = pos.visible;
            const opacity = isVisible ? Math.min(1, Math.max(0, (pos.z - 0.05) * 4)) : 0;
            const isActive = activeLocation === loc.id;

            return (
              <div
                key={loc.id}
                className={`globe-logo-pin ${isActive ? 'active' : ''}`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  opacity: opacity,
                  transform: `translate(-50%, -100%) scale(${isActive ? 1.15 : 1})`,
                  pointerEvents: isVisible ? 'auto' : 'none',
                  zIndex: isActive ? 20 : 10,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  focusLocation(loc);
                }}
              >
                {/* Logo badge */}
                <div className="globe-pin-badge">
                  <div className="globe-pin-logo-box">
                    <Image
                      src="/logo.png"
                      alt="FMS"
                      width={22}
                      height={22}
                      className="globe-pin-logo-img"
                    />
                  </div>
                  {/* Pulse aura */}
                  <div className="globe-pin-pulse" />
                </div>

                {/* Needle pointer */}
                <div className="globe-pin-needle" />

                {/* City Label */}
                <div className="globe-pin-label">
                  <span className="globe-pin-flag">{loc.flag}</span>
                  <span className="globe-pin-city">{loc.city}</span>
                </div>
              </div>
            );
          })}

          {/* Interactive hints & zoom controls overlay */}
          <div className="globe-hint-pill">
            <span className="globe-hint-dot" />
            <span className="globe-hint-caption">
              {lang === 'fr'
                ? 'Globe 3D interactif • Glissez & Molette'
                : 'Interactive 3D Globe • Drag & Scroll'}
            </span>

            {/* Controls: Zoom In, Zoom Out, Reset, Pause/Play */}
            <div className="globe-controls-group">
              <button
                type="button"
                className="globe-ctrl-btn"
                onClick={zoomIn}
                title={lang === 'fr' ? 'Zoomer (+)' : 'Zoom in (+)'}
                aria-label="Zoom in"
              >
                +
              </button>
              <button
                type="button"
                className="globe-ctrl-btn"
                onClick={zoomOut}
                title={lang === 'fr' ? 'Dézoomer (−)' : 'Zoom out (−)'}
                aria-label="Zoom out"
              >
                −
              </button>
              <button
                type="button"
                className="globe-ctrl-btn"
                onClick={resetView}
                title={lang === 'fr' ? 'Réinitialiser la vue' : 'Reset view'}
                aria-label="Reset view"
              >
                ↺
              </button>
              <button
                type="button"
                className="globe-autorotate-btn"
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                title={isAutoRotating ? 'Pause rotation' : 'Reprendre la rotation'}
                aria-label="Toggle auto rotation"
              >
                {isAutoRotating ? '⏸' : '▶'}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Country Pills: RDC, Kenya, then Congo-Brazzaville */}
        <div className="globe-country-tabs">
          <button
            type="button"
            className="globe-country-badge rdc"
            onClick={() => focusLocation(LOCATIONS[0])}
            title={lang === 'fr' ? 'Centrer sur la RDC' : 'Focus on DRC'}
          >
            <span className="flag">🇨🇩</span>
            <span className="country-title">RDC</span>
            <span className="country-sub">Kinshasa • Lubumbashi • Kolwezi</span>
          </button>
          <button
            type="button"
            className="globe-country-badge kenya"
            onClick={() => {
              const nb = LOCATIONS.find((l) => l.id === 'nairobi');
              if (nb) focusLocation(nb);
            }}
            title={lang === 'fr' ? 'Centrer sur le Kenya' : 'Focus on Kenya'}
          >
            <span className="flag">🇰🇪</span>
            <span className="country-title">Kenya</span>
            <span className="country-sub">Nairobi</span>
          </button>
          <button
            type="button"
            className="globe-country-badge congo"
            onClick={() => {
              const bz = LOCATIONS.find((l) => l.id === 'brazzaville');
              if (bz) focusLocation(bz);
            }}
            title={lang === 'fr' ? 'Centrer sur le Congo' : 'Focus on Congo'}
          >
            <span className="flag">🇨🇬</span>
            <span className="country-title">Congo</span>
            <span className="country-sub">Brazzaville</span>
          </button>
        </div>
      </div>

      {/* Locations Detailed List / Cards */}
      <div className="presence-info-panel">
        <div className="presence-header-badge">
          <span className="presence-tag-dot" />
          <span className="presence-tag-text">
            {lang === 'fr' ? 'Implantations Stratégiques' : 'Strategic Hubs'}
          </span>
          <span className="presence-count-pill">
            {lang === 'fr' ? '3 Pays • 5 Hubs' : '3 Countries • 5 Hubs'}
          </span>
        </div>

        <p className="presence-intro-text">
          {lang === 'fr'
            ? "FMS déploie ses services de conseil RH, fiscalité, comptabilité et accompagnement d'entreprises en RDC, en République du Congo (Brazzaville) et au Kenya."
            : 'FMS provides specialized HR, tax, accounting, and advisory solutions across the DRC, the Republic of the Congo (Brazzaville), and Kenya.'}
        </p>

        {/* Location cards */}
        <div className="presence-cards-grid">
          {LOCATIONS.map((loc) => {
            const isActive = activeLocation === loc.id;
            return (
              <div
                key={loc.id}
                className={`presence-loc-card ${isActive ? 'is-active' : ''} ${
                  loc.country === 'Kenya' ? 'is-kenya' : loc.id === 'brazzaville' ? 'is-congo' : ''
                }`}
                onClick={() => focusLocation(loc)}
              >
                <div className="presence-loc-card-header">
                  <div className="presence-loc-flag-box">
                    <span className="loc-flag">{loc.flag}</span>
                  </div>
                  <div className="presence-loc-heading">
                    <div className="presence-loc-city-row">
                      <h4 className="presence-loc-city">{loc.city}</h4>
                      <span className={`presence-loc-tag ${loc.id}`}>
                        {lang === 'fr' ? loc.tag : loc.tagEn}
                      </span>
                    </div>
                    <span className="presence-loc-country">{loc.countryFull}</span>
                  </div>
                </div>

                <div className="presence-loc-body">
                  <p className="presence-loc-role">
                    {lang === 'fr' ? loc.role : loc.roleEn}
                  </p>
                  <p className="presence-loc-address">{loc.address}</p>
                </div>

                <div className="presence-loc-footer">
                  <button
                    type="button"
                    className="presence-loc-focus-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      focusLocation(loc);
                    }}
                  >
                    <span>{lang === 'fr' ? 'Voir sur le globe' : 'Locate on globe'}</span>
                    <span className="arrow">→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
