import React from "react";
import { GeoJSON, Marker } from "react-leaflet";
import L from "leaflet";

const Markers = ({ data, properties, layerToggles, onPropertyClick }) => {
  // Create custom marker icon dynamically based on layer name
  const createIcon = (layerName) => {
    return L.icon({
      iconUrl: `/${layerName}.svg`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  // Custom point to layer function
  const pointToLayer = (feature, latlng, layerName) => {
    const icon = createIcon(layerName);
    return L.marker(latlng, { icon });
  };

  // Add popup to each feature
  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      const props = feature.properties;
      const popupContent = Object.entries(props)
        .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
        .join("<br/>");
      layer.bindPopup(popupContent);
    }
  };

  return (
    <>
      {/* Render GeoJSON Layers */}
      {data &&
        data.map((featureCollection, index) => {
          const layerName = featureCollection.name?.toLowerCase() || "unknown";
          const isVisible = layerToggles[layerName] !== false;

          if (!isVisible) return null;

          return (
            <GeoJSON
              key={`${layerName}-${index}-${JSON.stringify(featureCollection.features?.[0]?.properties)}`}
              data={featureCollection}
              pointToLayer={(feature, latlng) =>
                pointToLayer(feature, latlng, layerName)
              }
              onEachFeature={onEachFeature}
            />
          );
        })}

      {/* Render Property Markers */}
      {properties &&
        properties.map((property) => (
          <Marker
            key={property._id}
            position={[property.lat, property.lng]}
            icon={createIcon("property")}
            eventHandlers={{
              click: () => onPropertyClick && onPropertyClick(property),
            }}
          />
        ))}
    </>
  );
};

export default Markers;

