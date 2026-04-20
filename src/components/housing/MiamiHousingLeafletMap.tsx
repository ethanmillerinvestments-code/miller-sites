"use client";

import { useEffect } from "react";

import L from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Popup,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";

import {
  buildRecurringAllInSummary,
  getSourceConfidenceLabel,
  getUnitTypeLabel,
  miamiOxfordCampusAnchor,
  type HousingOption,
} from "@/lib/housing/miamiOxfordHousing";

type MiamiHousingLeafletMapProps = {
  options: HousingOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function markerFill(confidence: HousingOption["sourceConfidence"], selected: boolean) {
  if (selected) return "#274b39";
  if (confidence === "high") return "#708f66";
  if (confidence === "medium") return "#af8660";
  return "#c67a62";
}

function markerStroke(confidence: HousingOption["sourceConfidence"], selected: boolean) {
  if (selected) return "#f4ead7";
  if (confidence === "high") return "#eff5e7";
  if (confidence === "medium") return "#f8efe3";
  return "#f7ddd1";
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
      map.flyToBounds(
        [
          [selectedOption.latitude, selectedOption.longitude],
          [miamiOxfordCampusAnchor.latitude, miamiOxfordCampusAnchor.longitude],
        ],
        {
          animate: true,
          duration: 0.7,
          maxZoom: 15,
          padding: [64, 64],
        },
      );
      return;
    }

    const bounds = L.latLngBounds(
      options.map((option) => [option.latitude, option.longitude] as [number, number]),
    );
    bounds.extend([miamiOxfordCampusAnchor.latitude, miamiOxfordCampusAnchor.longitude]);

    map.fitBounds(bounds, {
      animate: true,
      maxZoom: 14,
      padding: [40, 40],
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

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#c8bca5] bg-[#ede3d1] shadow-[0_22px_58px_rgba(79,63,41,0.12)]">
      <div className="pointer-events-none absolute left-3 right-3 top-3 z-[500] flex flex-wrap items-center justify-between gap-2 rounded-[1.2rem] border border-[#d2c5ae] bg-[rgba(247,241,228,0.9)] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#52624c] backdrop-blur sm:left-4 sm:right-4 sm:text-[11px]">
        <span>Campus anchor stays fixed at Armstrong.</span>
        <span>Pin color = source confidence.</span>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-3 z-[500] rounded-full border border-[#d2c5ae] bg-[rgba(247,241,228,0.9)] px-3 py-1.5 text-[11px] text-[#655641] backdrop-blur sm:bottom-4 sm:left-4">
        Tap a pin to sync the shortlist and draw the campus line.
      </div>

      <MapContainer
        center={[miamiOxfordCampusAnchor.latitude, miamiOxfordCampusAnchor.longitude]}
        zoom={14}
        scrollWheelZoom={false}
        className="h-[20rem] w-full sm:h-[23rem] lg:h-[31rem] xl:h-[36rem]"
      >
        <MapViewport options={options} selectedOption={selectedOption} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CircleMarker
          center={[miamiOxfordCampusAnchor.latitude, miamiOxfordCampusAnchor.longitude]}
          radius={12}
          pathOptions={{
            color: "#f4ead7",
            fillColor: "#35533e",
            fillOpacity: 1,
            weight: 3,
          }}
        >
          <Tooltip direction="top" offset={[0, -10]} opacity={1}>
            <div className="space-y-1 text-[#1c241b]">
              <p className="text-xs font-semibold">{miamiOxfordCampusAnchor.label}</p>
              <p className="text-[11px]">{miamiOxfordCampusAnchor.address}</p>
            </div>
          </Tooltip>
          <Popup>
            <div className="space-y-2 text-[#1c241b]">
              <p className="text-sm font-semibold">{miamiOxfordCampusAnchor.name}</p>
              <p className="text-xs">Fixed comparison point for walk times and distance bands.</p>
            </div>
          </Popup>
        </CircleMarker>

        {selectedOption ? (
          <Polyline
            positions={[
              [miamiOxfordCampusAnchor.latitude, miamiOxfordCampusAnchor.longitude],
              [selectedOption.latitude, selectedOption.longitude],
            ]}
            pathOptions={{
              color: "#3f5f46",
              dashArray: "10 9",
              opacity: 0.72,
              weight: 3,
            }}
          />
        ) : null}

        {options.map((option) => {
          const isSelected = option.id === selectedId;
          const recurring = buildRecurringAllInSummary(option);

          return (
            <CircleMarker
              key={option.id}
              center={[option.latitude, option.longitude]}
              radius={isSelected ? 11 : 8}
              pathOptions={{
                color: markerStroke(option.sourceConfidence, isSelected),
                fillColor: markerFill(option.sourceConfidence, isSelected),
                fillOpacity: 0.98,
                weight: isSelected ? 3 : 2,
              }}
              eventHandlers={{
                click: () => onSelect(option.id),
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div className="space-y-1 text-[#1c241b]">
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
                <div className="space-y-2 text-[#1c241b]">
                  <p className="text-sm font-semibold">{option.propertyName}</p>
                  <p className="text-xs">
                    {getUnitTypeLabel(option.unitType)}
                    {" "}
                    ·
                    {" "}
                    {option.walkMinutes} min to campus anchor
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
