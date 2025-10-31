import React, { useState, useEffect } from "react";

const PropertyCard = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [property?._id]);

  if (!property) return null;

  const images = (property.images || []).map((u) => (typeof u === 'string' ? u.trim() : u));
  const hasImages = images.length > 0;

  const nextImage = (e) => {
    e.stopPropagation();
    if (currentImageIndex < images.length - 1) setCurrentImageIndex(currentImageIndex + 1);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (currentImageIndex > 0) setCurrentImageIndex(currentImageIndex - 1);
  };

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return amount;
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
  };

  const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "");

  const busStops = Array.isArray(property.nearestBmtcstop)
    ? property.nearestBmtcstop
        .map((stop) => stop?.properties?.NAME || stop?.NAME)
        .filter(Boolean)
        .join(", ")
    : (property.nearestBmtcstop?.properties?.NAME || property.nearestBmtcstop?.NAME);

  const metroNames = Array.isArray(property.nearestMetrostation)
    ? property.nearestMetrostation
        .map((m) => m?.properties?.name || m?.name)
        .filter(Boolean)
        .join(", ")
    : (property.nearestMetrostation?.properties?.name || property.nearestMetrostation?.name);

  return (
    <div className="bg-white/0 backdrop-blur-md rounded-lg shadow-lg border border-white/30 transition duration-200 h-[25vh] min-h-[25vh] max-h-[25vh] flex overflow-hidden">
      {/* Left: Image Carousel */}
      {hasImages && (
        <div className="w-2/5 relative flex-shrink-0">
          <div className="relative w-full h-[25vh] bg-gray-200 rounded-l-lg overflow-hidden">
            <img src={images[currentImageIndex]} alt={`Property ${currentImageIndex + 1}`} className="w-full h-full object-contain" />

            {/* Counter */}
            <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
              {currentImageIndex + 1} / {images.length}
            </div>

            {/* Nav */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  disabled={currentImageIndex === 0}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white z-20 ${
                    currentImageIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-black/80"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  disabled={currentImageIndex === images.length - 1}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white z-20 ${
                    currentImageIndex === images.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-black/80"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Right: Details */}
      <div className={`${hasImages ? "w-3/5" : "w-full"} p-4 overflow-y-auto`}>
        <div className="mb-2">
          <h2 className="text-lg font-bold text-black">
            {capitalize(property.type)} for {capitalize(property.availableFor)}
          </h2>
          <p className="text-xl font-bold text-blue-600 mt-1">{formatCurrency(property.amount)}</p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex gap-2">
            <span className="font-semibold text-black min-w-fit">Location:</span>
            <span className="text-black">{property.address}{property.pincode ? `, Pincode: ${property.pincode}` : ''}</span>
          </div>

          {property.description && (
            <div className="flex gap-2">
              <span className="font-semibold text-black min-w-fit">Description:</span>
              <span className="text-black">{property.description}</span>
            </div>
          )}

          {typeof property.numberOfCctv !== 'undefined' && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-black min-w-fit">CCTV:</span>
              <span className="text-black">{property.numberOfCctv} within 500m</span>
            </div>
          )}

          {busStops && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-black min-w-fit">Nearest BMTC:</span>
              <span className="text-black">{busStops}</span>
            </div>
          )}

          {metroNames && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-black min-w-fit">Nearest Metro:</span>
              <span className="text-black">{metroNames}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;


