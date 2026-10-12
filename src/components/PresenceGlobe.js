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
];

// Project lat/lng to 2D percentage coordinates on the globe
function projectPoint(lat, lng, phi, theta) {
  const PI = Math.PI;
  const p = 0.05;
  const baseR = 0.8 + p;

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

  return { x, y, z, visible: z >= 0.08 };
}

export default function PresenceGlobe({ lang = 'fr' }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const phiRef = useRef(0.2); // Start centered roughly near Africa
  const thetaRef = useRef(0.18); // Slight downward tilt for perspective
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const targetPhiRef = useRef(null);
  const targetThetaRef = useRef(null);

  const [activeLocation, setActiveLocation] = useState('kinshasa');
  const [pinPositions, setPinPositions] = useState({});
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Focus globe on a specific location
  const focusLocation = useCallback((loc) => {
    setActiveLocation(loc.id);
    setIsAutoRotating(false);

    // Calculate phi to bring longitude into front view (facing camera)
    // When lng + phi_deg = 0 => phi_rad = -lng * PI / 180 + PI/2 (centered)
    const targetPhi = -(loc.lng * Math.PI) / 180 + Math.PI / 2;
    const targetTheta = (loc.lat * Math.PI) / 180 * -0.5 + 0.15;

    targetPhiRef.current = targetPhi;
    targetThetaRef.current = Math.max(-0.4, Math.min(0.5, targetTheta));
  }, []);

  useEffect(() => {
    let globe;
    let animationFrameId;
    const canvas = canvasRef.current;
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
      color: loc.id === 'nairobi' ? [0.95, 0.45, 0.15] : [0.15, 0.45, 0.95],
    }));

    // Interconnecting arcs between FMS offices
    const arcs = [
      // Kinshasa <-> Nairobi
      { from: [-4.4419, 15.2663], to: [-1.2921, 36.8219], color: [0.2, 0.55, 0.95] },
      // Kinshasa <-> Lubumbashi
      { from: [-4.4419, 15.2663], to: [-11.6876, 27.5026], color: [0.15, 0.45, 0.95] },
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
        scale: 1,
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

      // Update globe state
      globe.update({
        phi: phiRef.current,
        theta: thetaRef.current,
      });

      // Compute 2D screen positions for all logo pins
      const positions = {};
      LOCATIONS.forEach((loc) => {
        positions[loc.id] = projectPoint(loc.lat, loc.lng, phiRef.current, thetaRef.current);
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
          style={{ cursor: isDraggingRef.current ? 'grabbing' : 'grab' }}
          title={lang === 'fr' ? 'Cliquez et glissez pour faire tourner le globe' : 'Click and drag to rotate the globe'}
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

          {/* Interactive hints overlay */}
          <div className="globe-hint-pill">
            <span className="globe-hint-dot" />
            <span>
              {lang === 'fr'
                ? 'Globe 3D interactif • Glissez pour explorer'
                : 'Interactive 3D Globe • Drag to explore'}
            </span>
            <button
              type="button"
              className="globe-autorotate-btn"
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              title={isAutoRotating ? 'Pause rotation' : 'Reprendre la rotation'}
            >
              {isAutoRotating ? '⏸' : '▶'}
            </button>
          </div>
        </div>

        {/* Quick Country Pills */}
        <div className="globe-country-tabs">
          <div className="globe-country-badge rdc">
            <span className="flag">🇨🇩</span>
            <span className="country-title">RDC</span>
            <span className="country-sub">Kinshasa • Lubumbashi • Kolwezi</span>
          </div>
          <div className="globe-country-badge kenya">
            <span className="flag">🇰🇪</span>
            <span className="country-title">Kenya</span>
            <span className="country-sub">Nairobi</span>
          </div>
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
            {lang === 'fr' ? '2 Pays • 4 Hubs' : '2 Countries • 4 Hubs'}
          </span>
        </div>

        <p className="presence-intro-text">
          {lang === 'fr'
            ? "FMS déploie ses services de conseil RH, fiscalité, comptabilité et accompagnement d'entreprises à travers la RDC et en Afrique de l'Est via notre bureau au Kenya."
            : 'FMS provides specialized HR, tax, accounting, and advisory solutions across the DRC and in East Africa through our Kenya regional office.'}
        </p>

        {/* Location cards */}
        <div className="presence-cards-grid">
          {LOCATIONS.map((loc) => {
            const isActive = activeLocation === loc.id;
            return (
              <div
                key={loc.id}
                className={`presence-loc-card ${isActive ? 'is-active' : ''} ${
                  loc.country === 'Kenya' ? 'is-kenya' : ''
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
