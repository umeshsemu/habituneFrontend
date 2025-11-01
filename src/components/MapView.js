import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import Markers from "./Markers";
import PropertyDetails from "./PropertyDetails";
import { setSelectedProperty } from "../store/appSlice";

// Component to recenter map when center prop changes

const MapView = () => {
  const { center, data, properties, selectedProperty } = useSelector((state) => state.app);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [layerToggles, setLayerToggles] = useState({});
  const [previousToggles, setPreviousToggles] = useState(null);

  const ChangeView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      if (center) {
        map.flyTo([center.lat, center.lng], 15, { duration: 1.5 });
      }
    }, [center?.lat, center?.lng]);
    return null;
  };
  // Update layer toggles when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const newToggles = {};
      data.forEach((featureCollection) => {
        const layerName = featureCollection.name?.toLowerCase() || "unknown";
        // Set to true by default if not already in state
        if (!(layerName in layerToggles)) {
          newToggles[layerName] = true;
        }
      });
      if (Object.keys(newToggles).length > 0) {
        setLayerToggles((prev) => ({ ...prev, ...newToggles }));
      }
    }
  }, [data,layerToggles]);

  // Toggle layers when property is selected or deselected
  useEffect(() => {
    if (selectedProperty) {
      // Store current toggles
      setPreviousToggles({ ...layerToggles });
      // Turn off all layers
      const allOff = {};
      Object.keys(layerToggles).forEach(key => {
        allOff[key] = false;
      });
      setLayerToggles(allOff);
    } else if (previousToggles) {
      // Restore previous toggles
      setLayerToggles(previousToggles);
      setPreviousToggles(null);
    }
  }, [selectedProperty]);

  const handlePostAd = () => {
    if (isAuthenticated && user) {
      const username = user.name.toLowerCase().replace(/\s+/g, '-');
      navigate(`/${username}/dashboard`);
    } else {
      navigate("/login");
    }
  };

  const toggleLayer = (layerName) => {
    setLayerToggles((prev) => ({
      ...prev,
      [layerName]: !prev[layerName],
    }));
  };

  return (
    <div className="h-full w-full relative">
      {/* Property Details */}
      {selectedProperty && (
        <PropertyDetails
          property={selectedProperty}
          onClose={() => dispatch(setSelectedProperty(null))}
        />
      )}

      <button
        onClick={handlePostAd}
        className="absolute top-4 right-4 bg-white/0 backdrop-blur-md hover:bg-white/30 text-black font-semibold px-6 py-3 rounded-lg shadow-lg border border-white/30 z-[1000] transition duration-200 flex items-center gap-2"
      >
        Post Ad
      </button>

      {/* Layer Toggle Controls */}
      {data && data.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white/0 backdrop-blur-md rounded-lg shadow-lg border border-white/30 z-[1000] p-2.5 transition duration-200">
          <h3 className="font-semibold text-black mb-2 text-xs">Layers</h3>
          <div className="space-y-1">
            {data.map((featureCollection, index) => {
              const layerName = featureCollection.name?.toLowerCase() || "unknown";
              const displayName = featureCollection.name || "Unknown Layer";
              const isVisible = layerToggles[layerName] !== false;

              return (
                <label
                  key={`${layerName}-${index}`}
                  className="flex items-center gap-1.5 cursor-pointer hover:bg-white/30 p-1.5 rounded transition duration-200"
                >
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() => toggleLayer(layerName)}
                    className="w-3.5 h-3.5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <img
                    src={`/${layerName}.svg`}
                    alt={displayName}
                    className="w-4 h-4"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span className="text-xs text-black font-medium">{displayName}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      <MapContainer center={center} zoom={15} className="h-full w-full">
        <ChangeView center={center} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Markers
          data={data}
          properties={properties}
          layerToggles={layerToggles}
          selectedProperty={selectedProperty}
          onPropertyClick={(property) => dispatch(setSelectedProperty(property))}
        />
      </MapContainer>
    </div>
  );
};

export default MapView;
