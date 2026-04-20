"use client";

import { useEffect } from "react";

import L from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";

import {
  buildRecurringAllInSummary,
  getSourceConfidenceLabel,
  getUnitTypeLabel,
  type HousingOption,
} from "@/lib/housing/miamiOxfordHousing";

type MiamiHousingLeafletMapProps = {
  options: HousingOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function markerFill(confidence: HousingOption["sourceConfidence"], selected: boolean) {
  if (selected) return "#f7e1b6";
  if (confidence === "high") return "#86d3c7";
  if (confidence === "medium") return "#d5a96b";
  return "#c96a61";
}

function markerStroke(confidence: HousingOption["sourceConfidence"], selected: boolean) {
  if (selected) return "#fff5e1";
  if (confidence === "high") return "#d7faf4";
  if (confidence === "medium") return "#f3d8ad";
  return "#f4c5bf";
}

function MapViewport({
  options,
  selectedOption,
}: {
  options: HousingOption[];
  selectedOption: HousingOption | undefined;
}) {
  const map = useMap();

  useEffect(() => {
    if (!options.length) return;

    if (selectedOption) {
      map.flyTo([selectedOption.latitude, selectedOption.longitude], 15, {
        animate: true,
        duration: 0.5,
      });
      return;
    }

    const bounds = L.latLngBounds(
      options.map((option) => [option.latitude, option.longitude] as [number, number]),
    );

    map.fitBounds(bounds, {
      padding: [28, 28],
      maxZoom: 14,
    });
  }, [map, options, selectedOption]);

  return null;
}

export default function MiamiHousingLeafletMap({
  options,
  selectedId,
  onSelect,
}: MiamiHousingLeafletMapProps) {
  const selectedOption = options.find((option) => option.id === selectedId) ?? options[0];
  const initialCenter: [number, number] = selectedOption
    ? [selectedOption.latitude, selectedOption.longitude]
    : [39.5077705, -84.7330794];

  return (
    <div className="relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-[#0f1319]">
      <div className="pointer-events-none absolute left-3 top-3 z-[500] rounded-2xl border border-white/10 bg-[rgba(8,10,14,0.82)] px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-stone-300 backdrop-blur">
        Pin color tracks source confidence. Cream ring = selected.
      </div>

      <MapContainer
        center={initialCenter}
        zoom={14}
        scrollWheelZoom={false}
        className="h-[22rem] w-full md:h-[34rem] xl:h-[38rem]"
      >
        <MapViewport options={options} selectedOption={selectedOption} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {options.map((option) => {
          const isSelected = option.id === selectedId;
          const recurring = buildRecurringAllInSummary(option);

          return (
            <CircleMarker
              key={option.id}
              center={[option.latitude, option.longitude]}
              radius={isSelected ? 12 : 9}
              pathOptions={{
                color: markerStroke(option.sourceConfidence, isSelected),
                fillColor: markerFill(option.sourceConfidence, isSelected),
                fillOpacity: 0.96,
                weight: isSelected ? 2.6 : 1.7,
              }}
              eventHandlers={{
                click: () => onSelect(option.id),
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div className="space-y-1 text-[#16181d]">
                  <p className="text-xs font-semibold">
                    {option.propertyName}
                    {" "}
                    ·
                    {" "}
                    {option.walkMinutes} min
                  </p>
                  <p className="text-[11px]">{recurring.label}</p>
                </div>
              </Tooltip>

              <Popup>
                <div className="space-y-2 text-[#16181d]">
                  <p className="text-sm font-semibold">{option.propertyName}</p>
                  <p className="text-xs">
                    {getUnitTypeLabel(option.unitType)}
                    {" "}
                    ·
                    {" "}
                    {option.walkMinutes} min walk
                  </p>
                  <p className="text-xs">{recurring.label}</p>
                  <p className="text-xs">{getSourceConfidenceLabel(option.sourceConfidence)}</p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
