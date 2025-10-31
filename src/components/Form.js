import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleOnSubmit } from "../store/appSlice";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

// 🧭 Map marker icon fix (Leaflet default marker issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const PropertyForm = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    type: "",
    availableFor: "",
    amount: "",
    pincode: "",
    address: "",
    description: "",
  });

  const [location, setLocation] = useState({ lat: null, lng: null });
  const [currentPosition, setCurrentPosition] = useState(null);
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 📍 Get current location on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentPosition([latitude, longitude]);
          setLocation({ lat: latitude, lng: longitude });
        },
        () => {
          setCurrentPosition([12.9716, 77.5946]); // Default: Bangalore
        }
      );
    }
  }, []);

  // 📍 Handle location click on map
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return location.lat && location.lng ? (
      <Marker position={[location.lat, location.lng]} />
    ) : null;
  };

  // 🖼️ Handle image upload & preview
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages(previews);
  };

  // 📝 Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🚀 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Step 1: Upload images to Cloudinary
      const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
      
      const imageUrls = [];

      
      for (const img of images) {
        const formImages = new FormData();
        formImages.append("file", img.file);
        formImages.append("upload_preset", uploadPreset);
        formImages.append("folder", "properties");
        
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formImages,
          {withCredentials: false}
        );
        
        imageUrls.push(response.data.secure_url);
      }

      // Step 2: Prepare data with image URLs
      const propertyData = {
        ...formData,
        lat: location.lat,
        lng: location.lng,
        images: imageUrls,
      };

       //Step 3: Send POST request to backend
      const result = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/property/add`,
        propertyData,
        {
          withCredentials: true
        }
      );

      if (result?.data?.message) {
        alert(result.data.message);
        dispatch(toggleOnSubmit());
      }
      
      // Reset form
      setFormData({
        type: "",
        availableFor: "",
        amount: "",
        pincode: "",
        address: "",
        description: "",
      });
      setImages([]);
      setLocation({ lat: null, lng: null });
      const username = (user?.name || "").toLowerCase().replace(/\s+/g, "-");
      navigate(username ? `/${username}/dashboard` : "/");
      
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to submit property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Add Property Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Property Type */}
        <div>
          <label className="block text-gray-700 mb-1">Property Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
          >
            <option value="">Select Type</option>
            {["house", "apartment", "villa", "plot", "land", "office", "shop", "other"].map(
              (t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              )
            )}
          </select>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-gray-700 mb-1">Available For</label>
          <select
            name="availableFor"
            value={formData.availableFor}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
          >
            <option value="">Select Option</option>
            {["rent", "sale", "lease"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-gray-700 mb-1">Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-gray-700 mb-1">Pincode</label>
          <input
            type="number"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-gray-700 mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="3"
            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
          ></textarea>
        </div>

        {/* Map Selector */}
        <div>
          <label className="block text-gray-700 mb-1">Set Location on Map</label>
          <div className="w-full h-64 rounded-lg overflow-hidden">
            {currentPosition && (
              <MapContainer
                center={currentPosition}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap contributors"
                />
                <LocationMarker />
              </MapContainer>
            )}
          </div>
          {location.lat && (
            <p className="text-sm text-gray-600 mt-2">
              📍 Lat: {location.lat.toFixed(5)}, Lng: {location.lng.toFixed(5)}
            </p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 mb-1">Upload Photos</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
          />

          {/* Preview */}
          <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {images.map((img, index) => (
              <div
                key={index}
                className="w-full h-24 rounded-lg overflow-hidden border"
              >
                <img
                  src={img.url}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Property"}
        </button>
      </form>
    </div>
  );
};

export default PropertyForm;
