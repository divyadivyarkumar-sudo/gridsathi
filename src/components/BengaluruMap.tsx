/// <reference types="google.maps" />
import React, { useCallback, useEffect, useState } from 'react';
import {
  AdvancedMarker,
  APILoadingStatus,
  InfoWindow,
  Map as GoogleMap,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { LocateFixed, Truck, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import {
  BENGALURU_CENTER,
  SAMPLE_FEEDERS,
  SAMPLE_TRANSFORMERS,
} from '../data/bengaluruData';
import { Incident, LatLng, RepairCrew, TransformerNode } from '../types';
import { getStatusBadgeStyle } from '../utils/statusStyles';

interface MapPolylineProps {
  path: LatLng[];
  strokeColor: string;
  strokeOpacity: number;
  strokeWeight: number;
  zIndex?: number;
}

const MapPolyline: React.FC<MapPolylineProps> = ({
  path,
  strokeColor,
  strokeOpacity,
  strokeWeight,
  zIndex = 1,
}) => {
  const map = useMap();
  const mapsLib = useMapsLibrary('maps');
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!mapsLib) return;
    const line = new mapsLib.Polyline();
    setPolyline(line);
    return () => {
      line.setMap(null);
    };
  }, [mapsLib]);

  useEffect(() => {
    if (!polyline) return;
    polyline.setOptions({
      path,
      strokeColor,
      strokeOpacity,
      strokeWeight,
      zIndex,
    });
  }, [polyline, path, strokeColor, strokeOpacity, strokeWeight, zIndex]);

  useEffect(() => {
    if (!map || !polyline) return;
    polyline.setMap(map);
    return () => {
      polyline.setMap(null);
    };
  }, [map, polyline]);

  return null;
};

interface MapCircleProps {
  center: LatLng;
  radius: number;
  strokeColor: string;
  strokeOpacity: number;
  strokeWeight: number;
  fillColor: string;
  fillOpacity: number;
  zIndex?: number;
}

const MapCircle: React.FC<MapCircleProps> = ({
  center,
  radius,
  strokeColor,
  strokeOpacity,
  strokeWeight,
  fillColor,
  fillOpacity,
  zIndex = 1,
}) => {
  const map = useMap();
  const mapsLib = useMapsLibrary('maps');
  const [circle, setCircle] = useState<google.maps.Circle | null>(null);

  useEffect(() => {
    if (!mapsLib) return;
    const c = new mapsLib.Circle();
    setCircle(c);
    return () => {
      c.setMap(null);
    };
  }, [mapsLib]);

  useEffect(() => {
    if (!circle) return;
    circle.setOptions({
      center,
      radius,
      strokeColor,
      strokeOpacity,
      strokeWeight,
      fillColor,
      fillOpacity,
      zIndex,
      clickable: false,
    });
  }, [
    circle,
    center,
    radius,
    strokeColor,
    strokeOpacity,
    strokeWeight,
    fillColor,
    fillOpacity,
    zIndex,
  ]);

  useEffect(() => {
    if (!map || !circle) return;
    circle.setMap(map);
    return () => {
      circle.setMap(null);
    };
  }, [map, circle]);

  return null;
};

interface CameraControllerProps {
  focusCenter: LatLng | null;
  focusZoom: number;
  resetTrigger: number;
}

const CameraController: React.FC<CameraControllerProps> = ({
  focusCenter,
  focusZoom,
  resetTrigger,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !focusCenter) return;
    map.panTo(focusCenter);
    map.setZoom(focusZoom);
  }, [map, focusCenter, focusZoom, resetTrigger]);

  return null;
};

type InfoTarget =
  | { kind: 'incident'; data: Incident }
  | { kind: 'crew'; data: RepairCrew }
  | { kind: 'transformer'; data: TransformerNode };

interface MarkerWithInfoProps {
  position: LatLng;
  zIndex: number;
  title: string;
  onSelect: (marker: google.maps.marker.AdvancedMarkerElement) => void;
  children: React.ReactNode;
}

const InteractiveAdvancedMarker: React.FC<MarkerWithInfoProps> = ({
  position,
  zIndex,
  title,
  onSelect,
  children,
}) => {
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <AdvancedMarker
      ref={markerRef}
      position={position}
      zIndex={zIndex}
      title={title}
      onClick={() => {
        if (marker) {
          onSelect(marker);
        }
      }}
    >
      {children}
    </AdvancedMarker>
  );
};

interface BengaluruMapProps {
  incidents: Incident[];
  crews: RepairCrew[];
  selectedIncidentId: string | null;
  onSelectIncident?: (incidentId: string) => void;
  focusCenter?: LatLng | null;
  focusZoom?: number;
  compactMode?: boolean;
  heightClassName?: string;
}

export const BengaluruMap: React.FC<BengaluruMapProps> = ({
  incidents,
  crews,
  selectedIncidentId,
  onSelectIncident,
  focusCenter = null,
  focusZoom = 12,
  compactMode = false,
  heightClassName = 'h-[430px] lg:h-[600px]',
}) => {
  const loadingStatus = useApiLoadingStatus();
  const [showFeeders, setShowFeeders] = useState(true);
  const [showTransformers, setShowTransformers] = useState(true);
  const [showCrews, setShowCrews] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [manualFocus, setManualFocus] = useState<{
    center: LatLng;
    zoom: number;
  } | null>(null);

  const [activeInfo, setActiveInfo] = useState<{
    target: InfoTarget;
    anchor: google.maps.marker.AdvancedMarkerElement;
  } | null>(null);

  const selectedIncident =
    incidents.find((inc) => inc.id === selectedIncidentId) ?? null;

  const effectiveCenter =
    manualFocus?.center ??
    (selectedIncident ? selectedIncident.center : focusCenter);
  const effectiveZoom =
    manualFocus?.zoom ?? (selectedIncident ? 14 : focusZoom);

  // Clear manual override whenever caller selects a different incident or area
  useEffect(() => {
    setManualFocus(null);
  }, [selectedIncidentId, focusCenter]);

  const handleResetCity = useCallback(() => {
    setManualFocus({ center: BENGALURU_CENTER, zoom: 12 });
    setResetTrigger((prev) => prev + 1);
    setActiveInfo(null);
  }, []);

  // Build lookup objects using plain Record (avoid shadowing global Map)
  const openIncidentByTransformer: Record<string, Incident> = {};
  const openIncidentByFeeder: Record<string, Incident> = {};
  for (const inc of incidents) {
    if (inc.status !== 'Restored') {
      openIncidentByTransformer[inc.transformerId] = inc;
      openIncidentByFeeder[inc.feederId] = inc;
    }
  }

  const hasApiError =
    loadingStatus === APILoadingStatus.FAILED ||
    loadingStatus === APILoadingStatus.AUTH_FAILURE;

  return (
    <div className="relative w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
      {/* Compact Top Map Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">
            Bengaluru Live Grid Map
          </span>
          <span className="text-xs text-slate-400" aria-hidden="true">
            ·
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Demo data
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {!compactMode && (
            <>
              <button
                type="button"
                onClick={() => setShowFeeders((v) => !v)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 ${
                  showFeeders
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                Feeders
              </button>
              <button
                type="button"
                onClick={() => setShowTransformers((v) => !v)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 ${
                  showTransformers
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                Transformers
              </button>
              <button
                type="button"
                onClick={() => setShowCrews((v) => !v)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 ${
                  showCrews
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                Crews
              </button>
            </>
          )}
          <button
            type="button"
            onClick={handleResetCity}
            title="Reset map to all of Bengaluru"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
          >
            <LocateFixed className="w-3.5 h-3.5" />
            All Bengaluru
          </button>
        </div>
      </div>

      {/* Map Viewport (explicit height prevents 0x0 collapse) */}
      <div
        className={`relative w-full ${heightClassName} bg-slate-100 dark:bg-slate-800`}
      >
        {hasApiError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-900">
            <AlertTriangle className="w-8 h-8 text-amber-600 mb-2" />
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Google Map could not load
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm">
              Check your Google Maps API key or quota settings. Incident controls
              remain active.
            </p>
          </div>
        ) : (
          <GoogleMap
            defaultCenter={BENGALURU_CENTER}
            defaultZoom={compactMode ? 13 : 12}
            mapId="DEMO_MAP_ID"
            gestureHandling="greedy"
            disableDefaultUI={compactMode}
            zoomControl={true}
            mapTypeControl={false}
            streetViewControl={false}
            fullscreenControl={!compactMode}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            className="w-full h-full"
          >
            <CameraController
              focusCenter={effectiveCenter}
              focusZoom={effectiveZoom}
              resetTrigger={resetTrigger}
            />

            {/* Feeder lines along Bengaluru corridors */}
            {showFeeders &&
              SAMPLE_FEEDERS.map((feeder) => {
                const linkedIncident = openIncidentByFeeder[feeder.id];
                const isSelected =
                  selectedIncident?.feederId === feeder.id;
                const strokeColor = isSelected
                  ? '#DC2626'
                  : linkedIncident
                  ? '#EA580C'
                  : '#0284C7';
                return (
                  <MapPolyline
                    key={feeder.id}
                    path={feeder.path}
                    strokeColor={strokeColor}
                    strokeOpacity={isSelected ? 0.95 : linkedIncident ? 0.85 : 0.55}
                    strokeWeight={isSelected ? 6 : linkedIncident ? 4 : 3}
                    zIndex={isSelected ? 20 : 5}
                  />
                );
              })}

            {/* Outage affected radius circles */}
            {incidents.map((inc) => {
              const isSelected = inc.id === selectedIncidentId;
              const isRestored = inc.status === 'Restored';
              if (isRestored && !isSelected) return null;

              const color = isRestored
                ? '#16A34A'
                : inc.status === 'New'
                ? '#DC2626'
                : '#EA580C';

              return (
                <MapCircle
                  key={`zone-${inc.id}`}
                  center={inc.center}
                  radius={isSelected ? inc.radiusMeters + 120 : inc.radiusMeters}
                  strokeColor={color}
                  strokeOpacity={isSelected ? 0.9 : 0.6}
                  strokeWeight={isSelected ? 2.5 : 1.5}
                  fillColor={color}
                  fillOpacity={isSelected ? 0.22 : 0.12}
                  zIndex={isSelected ? 15 : 8}
                />
              );
            })}

            {/* Transformers */}
            {showTransformers &&
              SAMPLE_TRANSFORMERS.map((tx) => {
                const openInc = openIncidentByTransformer[tx.id];
                const isSelected =
                  selectedIncident?.transformerId === tx.id;
                return (
                  <InteractiveAdvancedMarker
                    key={tx.id}
                    position={tx.position}
                    zIndex={isSelected ? 90 : 30}
                    title={`${tx.code}: ${tx.name}`}
                    onSelect={(anchor) =>
                      setActiveInfo({
                        target: { kind: 'transformer', data: tx },
                        anchor,
                      })
                    }
                  >
                    <div
                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[11px] font-mono-code font-semibold shadow-sm transition-transform ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 scale-110'
                          : openInc
                          ? 'bg-amber-50 text-amber-900 border-amber-400'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      <Zap
                        className={`w-3 h-3 ${
                          openInc ? 'text-amber-600' : 'text-emerald-600'
                        }`}
                      />
                      <span>{tx.code}</span>
                    </div>
                  </InteractiveAdvancedMarker>
                );
              })}

            {/* Outage incident pins */}
            {incidents.map((inc) => {
              const isSelected = inc.id === selectedIncidentId;
              const isRestored = inc.status === 'Restored';
              const style = getStatusBadgeStyle(inc.status);

              return (
                <InteractiveAdvancedMarker
                  key={inc.id}
                  position={inc.center}
                  zIndex={isSelected ? 120 : isRestored ? 40 : 80}
                  title={`${inc.areaName} — ${inc.status}`}
                  onSelect={(anchor) => {
                    onSelectIncident?.(inc.id);
                    setActiveInfo({
                      target: { kind: 'incident', data: inc },
                      anchor,
                    });
                  }}
                >
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border shadow-md cursor-pointer transition-transform ${
                      isSelected ? 'scale-110 ring-2 ring-slate-900' : ''
                    } ${
                      isRestored
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : inc.status === 'New'
                        ? 'bg-red-600 text-white border-red-700'
                        : 'bg-amber-600 text-white border-amber-700'
                    }`}
                    style={{ borderColor: isSelected ? '#0f172a' : style.mapColor }}
                  >
                    {isRestored ? (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span className="text-xs font-semibold whitespace-nowrap">
                      {inc.areaName.split(' (')[0]}
                    </span>
                    {!isRestored && (
                      <span className="text-[11px] font-mono-code bg-black/20 px-1.5 py-0.2 rounded">
                        {inc.reportCount}
                      </span>
                    )}
                  </div>
                </InteractiveAdvancedMarker>
              );
            })}

            {/* Repair Crew lively markers */}
            {showCrews &&
              crews.map((crew) => {
                const isBusy = crew.status !== 'Available';
                return (
                  <InteractiveAdvancedMarker
                    key={crew.id}
                    position={crew.currentPosition}
                    zIndex={100}
                    title={`${crew.name} (${crew.status})`}
                    onSelect={(anchor) =>
                      setActiveInfo({
                        target: { kind: 'crew', data: crew },
                        anchor,
                      })
                    }
                  >
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg border shadow-md cursor-pointer ${
                        crew.status === 'En route'
                          ? 'bg-blue-700 text-white border-blue-900'
                          : crew.status === 'On site'
                          ? 'bg-slate-900 text-white border-slate-950'
                          : 'bg-white text-slate-800 border-slate-400'
                      }`}
                    >
                      <Truck
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isBusy ? 'text-amber-300' : 'text-emerald-600'
                        }`}
                      />
                      <span className="text-[11px] font-semibold whitespace-nowrap">
                        {crew.name}
                      </span>
                    </div>
                  </InteractiveAdvancedMarker>
                );
              })}

            {/* Clean InfoWindow on marker click */}
            {activeInfo && (
              <InfoWindow
                anchor={activeInfo.anchor}
                onCloseClick={() => setActiveInfo(null)}
                pixelOffset={[0, -6]}
              >
                {activeInfo.target.kind === 'incident' && (
                  <div className="p-1 min-w-[200px] text-slate-900">
                    <p className="text-sm font-semibold">
                      {activeInfo.target.data.areaName}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Status: <strong>{activeInfo.target.data.status}</strong> ·{' '}
                      {activeInfo.target.data.reportCount} reports
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {activeInfo.target.data.equipmentLabel}
                    </p>
                  </div>
                )}
                {activeInfo.target.kind === 'crew' && (
                  <div className="p-1 min-w-[180px] text-slate-900">
                    <p className="text-sm font-semibold">
                      {activeInfo.target.data.name}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Lead: {activeInfo.target.data.lead}
                    </p>
                    <p className="text-xs text-slate-600">
                      Status: <strong>{activeInfo.target.data.status}</strong> ·{' '}
                      {activeInfo.target.data.areaLabel}
                    </p>
                  </div>
                )}
                {activeInfo.target.kind === 'transformer' && (
                  <div className="p-1 min-w-[180px] text-slate-900">
                    <p className="text-sm font-semibold">
                      {activeInfo.target.data.code}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {activeInfo.target.data.name}
                    </p>
                  </div>
                )}
              </InfoWindow>
            )}
          </GoogleMap>
        )}

        {/* Compact Map Legend Overlay */}
        {!compactMode && (
          <div className="absolute bottom-3 left-3 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 shadow-sm pointer-events-auto">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-700 dark:text-slate-200">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-red-600 inline-block" />
                Outage
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 inline-block" />
                Restored
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-sky-600 inline-block" />
                Feeder
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                Transformer
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Truck className="w-3 h-3 text-blue-700 dark:text-blue-400" />
                Crew
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
