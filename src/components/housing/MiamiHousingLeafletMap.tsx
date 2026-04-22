"use client";

import { useEffect, useMemo, useRef } from "react";

import L from "leaflet";

import {
  buildRecurringAllInSummary,
  getArmstrongDistance,
  getRecCenterDistance,
  getSourceConfidenceLabel,
  getUnitTypeLabel,
  miamiOxfordCampusAnchor,
  miamiOxfordRecCenterAnchor,
  type HousingAnchor,
  type HousingOption,
} from "@/lib/housing/miamiOxfordHousing";

type MiamiHousingLeafletMapProps = {
  options: HousingOption[];
  selectedId: string | null;
  hoveredId: string | null;
  sidebarOpen?: boolean;
  onSelect: (id: string) => void;
  onHoverChange: (id: string | null) => void;
};

function createAnchorIcon(kind: "armstrong" | "rec") {
  return L.divIcon({
    className: "housing-campus-marker-icon",
    html: [
      `<span class="housing-campus-marker-shell is-${kind}">`,
      '<span class="housing-campus-marker-core"></span>',
      '<span class="housing-campus-marker-pin"></span>',
      "</span>",
    ].join(""),
    iconSize: [36, 46],
    iconAnchor: [18, 38],
    tooltipAnchor: [0, -24],
  });
}

function createListingIcon(
  confidence: HousingOption["sourceConfidence"],
  state: "default" | "hovered" | "selected",
) {
  return L.divIcon({
    className: "housing-listing-marker-icon",
    html: [
      `<span class="housing-map-marker-shell confidence-${confidence} is-${state}">`,
      '<span class="housing-map-marker-core"></span>',
      '<span class="housing-map-marker-pulse"></span>',
      "</span>",
    ].join(""),
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    tooltipAnchor: [0, -18],
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function anchorTooltip(title: string, note: string) {
  return [
    '<div class="max-w-[12rem] rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-slate-900 shadow-lg">',
    `<p class="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">${escapeHtml(title)}</p>`,
    `<p class="mt-1 text-xs leading-4 text-slate-700">${escapeHtml(note)}</p>`,
    "</div>",
  ].join("");
}

function listingTooltip(option: HousingOption) {
  const recurring = buildRecurringAllInSummary(option);
  const armstrong = getArmstrongDistance(option);
  const rec = getRecCenterDistance(option);

  return [
    '<div class="w-[14rem] rounded-2xl border border-slate-200 bg-white/95 p-3 text-slate-900 shadow-xl">',
    '<div class="flex items-start justify-between gap-2">',
    '<div class="min-w-0">',
    `<p class="truncate text-sm font-semibold">${escapeHtml(option.propertyName)}</p>`,
    `<p class="mt-1 text-[11px] text-slate-500">${escapeHtml(getUnitTypeLabel(option.unitType))} · ${escapeHtml(recurring.label)}</p>`,
    "</div>",
    `<span class="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-600">${escapeHtml(getSourceConfidenceLabel(option.sourceConfidence))}</span>`,
    "</div>",
    '<div class="mt-3 grid grid-cols-2 gap-2 text-[11px]">',
    '<div class="rounded-xl bg-blue-50 px-2.5 py-2 text-blue-900">',
    `<p class="font-bold">${armstrong.walkMinutes} min</p>`,
    `<p>${armstrong.distanceMiles.toFixed(2)} mi to class</p>`,
    "</div>",
    '<div class="rounded-xl bg-orange-50 px-2.5 py-2 text-orange-900">',
    `<p class="font-bold">${rec.walkMinutes} min</p>`,
    `<p>${rec.distanceMiles.toFixed(2)} mi to Rec</p>`,
    "</div>",
    "</div>",
    "</div>",
  ].join("");
}

function addAnchorMarker(
  group: L.LayerGroup,
  anchor: HousingAnchor,
  kind: "armstrong" | "rec",
  title: string,
  note: string,
) {
  L.marker([anchor.latitude, anchor.longitude], {
    icon: createAnchorIcon(kind),
    zIndexOffset: 1200,
  })
    .bindTooltip(anchorTooltip(title, note), {
      permanent: true,
      direction: "top",
      offset: [0, -24],
      className: "housing-map-tooltip",
      opacity: 1,
    })
    .addTo(group);
}

function addRouteLines(group: L.LayerGroup, option: HousingOption, dashed = false) {
  const common: L.PolylineOptions = {
    opacity: dashed ? 0.56 : 0.72,
    weight: dashed ? 2.5 : 3.25,
    dashArray: dashed ? "7 8" : undefined,
  };

  L.polyline(
    [
      [miamiOxfordCampusAnchor.latitude, miamiOxfordCampusAnchor.longitude],
      [option.latitude, option.longitude],
    ],
    {
      ...common,
      color: "#2563eb",
    },
  ).addTo(group);

  L.polyline(
    [
      [miamiOxfordRecCenterAnchor.latitude, miamiOxfordRecCenterAnchor.longitude],
      [option.latitude, option.longitude],
    ],
    {
      ...common,
      color: "#c2410c",
    },
  ).addTo(group);
}

export default function MiamiHousingLeafletMap({
  options,
  selectedId,
  hoveredId,
  sidebarOpen = false,
  onSelect,
  onHoverChange,
}: MiamiHousingLeafletMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const selectedOption = selectedId
    ? options.find((option) => option.id === selectedId) ?? null
    : null;
  const hoveredOption = hoveredId
    ? options.find((option) => option.id === hoveredId) ?? null
    : null;
  const previewOption = selectedOption ?? hoveredOption;
  const optionsKey = useMemo(() => options.map((option) => option.id).join("|"), [options]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined;

    const container = containerRef.current as HTMLDivElement & { _leaflet_id?: number };
    delete container._leaflet_id;

    const map = L.map(container, {
      center: [miamiOxfordCampusAnchor.latitude, miamiOxfordCampusAnchor.longitude],
      zoom: 15,
      zoomControl: false,
      scrollWheelZoom: true,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution:
        'Powered by <a href="https://www.esri.com/en-us/home" target="_blank" rel="noreferrer">Esri</a> | Imagery + labels',
    }).addTo(map);
    L.tileLayer(
      "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
      { opacity: 0.9 },
    ).addTo(map);
    L.tileLayer(
      "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      { opacity: 0.96 },
    ).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    mapRef.current = map;
    layerGroupRef.current = layerGroup;

    const resizeTimer = window.setTimeout(() => map.invalidateSize(), 120);

    return () => {
      window.clearTimeout(resizeTimer);
      layerGroup.clearLayers();
      map.remove();
      mapRef.current = null;
      layerGroupRef.current = null;
      delete container._leaflet_id;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();
    const compactTooltips =
      typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches;

    addAnchorMarker(
      group,
      miamiOxfordCampusAnchor,
      "armstrong",
      "Class Anchor",
      "Armstrong Student Center",
    );
    addAnchorMarker(
      group,
      miamiOxfordRecCenterAnchor,
      "rec",
      "Rec Anchor",
      "Recreational Sports Center",
    );

    if (selectedOption) {
      addRouteLines(group, selectedOption);
    } else if (hoveredOption) {
      addRouteLines(group, hoveredOption, true);
    }

    options.forEach((option) => {
      const isSelected = option.id === selectedId;
      const isHovered = option.id === hoveredId;
      const marker = L.marker([option.latitude, option.longitude], {
        icon: createListingIcon(
          option.sourceConfidence,
          isSelected ? "selected" : isHovered ? "hovered" : "default",
        ),
        zIndexOffset: isSelected ? 900 : isHovered ? 800 : 500,
      })
        .on("click", () => onSelect(option.id))
        .on("mouseover", () => onHoverChange(option.id))
        .on("mouseout", () => onHoverChange(null))
        .addTo(group);

      if ((isSelected || isHovered) && !compactTooltips) {
        marker.bindTooltip(listingTooltip(option), {
          permanent: true,
          direction: "top",
          offset: [0, -18],
          className: "housing-map-tooltip",
          opacity: 1,
        });
      }
    });
  }, [hoveredId, hoveredOption, onHoverChange, onSelect, options, selectedId, selectedOption]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !options.length) return;

    const isDesktop =
      typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;
    const paddingTopLeft: [number, number] = isDesktop ? [52, 52] : [26, 86];
    const paddingBottomRight: [number, number] = isDesktop
      ? [sidebarOpen ? 72 : 52, 52]
      : [34, 42];
    const points: [number, number][] = [
      [miamiOxfordCampusAnchor.latitude, miamiOxfordCampusAnchor.longitude],
      [miamiOxfordRecCenterAnchor.latitude, miamiOxfordRecCenterAnchor.longitude],
    ];

    if (selectedOption) {
      points.push([selectedOption.latitude, selectedOption.longitude]);
    } else {
      points.push(...options.map((option) => [option.latitude, option.longitude] as [number, number]));
    }

    const timer = window.setTimeout(() => {
      map.invalidateSize();
      map.flyToBounds(L.latLngBounds(points), {
        animate: true,
        duration: selectedOption ? 0.55 : 0.35,
        maxZoom: selectedOption ? 16 : 15,
        paddingTopLeft,
        paddingBottomRight,
      });
    }, 60);

    return () => window.clearTimeout(timer);
  }, [options, optionsKey, selectedOption, sidebarOpen]);

  return (
    <div className="housing-atlas-map relative h-full min-h-[26rem] overflow-hidden bg-slate-200">
      <div className="pointer-events-none absolute left-3 top-3 z-[500] hidden max-w-[18rem] rounded-2xl border border-white/60 bg-white/90 p-3 text-slate-800 shadow-xl backdrop-blur lg:block">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
          Map Context
        </p>
        <div className="mt-2 grid gap-1.5 text-xs leading-5">
          <p>
            <span className="font-semibold text-blue-700">Blue</span> routes point to Armstrong,
            used here as the class anchor.
          </p>
          <p>
            <span className="font-semibold text-orange-700">Orange</span> routes point to the Rec
            Center.
          </p>
        </div>
      </div>

      <div ref={containerRef} className="h-full min-h-[26rem] w-full" />

      {previewOption ? (
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-[500] rounded-2xl border border-white/60 bg-white/92 p-3 text-xs text-slate-700 shadow-xl backdrop-blur sm:left-auto sm:w-[20rem]">
          <p className="font-semibold text-slate-950">{previewOption.propertyName}</p>
          <p className="mt-1">
            {getArmstrongDistance(previewOption).walkMinutes} min to class ·{" "}
            {getRecCenterDistance(previewOption).walkMinutes} min to Rec, approximate
          </p>
        </div>
      ) : null}
    </div>
  );
}
