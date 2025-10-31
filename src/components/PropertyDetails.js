import React, { useState, useEffect } from "react";

const PropertyDetails = ({ property, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset image index when property ID changes (not object reference)
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [property?._id]);

  if (!property) return null;

  const images = (property.images || []).map(url => url.trim());

  const hasImages = images.length > 0;

  const nextImage = (e) => {
    e.stopPropagation();
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const capitalize = (str) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  };

  return (
    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-[1001] w-full max-w-6xl px-4">
      <div className="bg-white/0 backdrop-blur-md rounded-lg shadow-lg border border-white/30 transition duration-200 h-[25vh] min-h-[25vh] max-h-[25vh] flex overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/30 transition duration-200 z-10"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5 text-black"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        {/* Left Side - Image Carousel */}
        {hasImages && (
          <div className="w-2/5 relative flex-shrink-0">
            <div className="relative w-full h-[25vh] bg-gray-200 rounded-l-lg overflow-hidden">
              <img
                src={images[currentImageIndex]}
                alt={`Property ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
              />

              {/* Image Counter */}
              <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                {currentImageIndex + 1} / {images.length}
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                    className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white transition duration-200 z-20 ${
                      currentImageIndex === 0
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-black/80"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>

                  <button
                    onClick={nextImage}
                    disabled={currentImageIndex === images.length - 1}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white transition duration-200 z-20 ${
                      currentImageIndex === images.length - 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-black/80"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Right Side - Property Details */}
        <div className={`${hasImages ? "w-3/5" : "w-full"} p-4 overflow-y-auto`}>
          {/* Header */}
          <div className="mb-3">
            <h2 className="text-lg font-bold text-black">
              {capitalize(property.type)} for {capitalize(property.availableFor)}
            </h2>
            <p className="text-xl font-bold text-blue-600 mt-1">
              {formatCurrency(property.amount)}
            </p>
          </div>

          {/* Details in horizontal flow */}
          <div className="space-y-2 text-sm">
            {/* Location */}
            <div className="flex gap-2">
              <span className="font-semibold text-black min-w-fit">Location:</span>
              <span className="text-black">{property.address}, Pincode: {property.pincode}</span>
            </div>

            {/* Description */}
            {property.description && (
              <div className="flex gap-2">
                <span className="font-semibold text-black min-w-fit">Description:</span>
                <span className="text-black">{property.description}</span>
              </div>
            )}

            {/* CCTV Count */}
            {property.numberOfCctv !== undefined && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-black flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                <span className="text-black">{property.numberOfCctv} CCTV cameras within 500m</span>
              </div>
            )}

            {/* Nearest BMTC Stops */}
            {property.nearestBmtcstop && Array.isArray(property.nearestBmtcstop) && property.nearestBmtcstop.length > 0 && (
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-black flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
                <span className="text-black">
                  Nearest BMTC: {property.nearestBmtcstop.map((stop, idx) => 
                    stop?.properties?.NAME || stop?.NAME
                  ).filter(Boolean).join(", ")}
                </span>
              </div>
            )}

            {/* Nearest Metro Station */}
            {(property.nearestMetrostation?.properties?.name || property.nearestMetrostation?.name) && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-black flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span className="text-black">
                  Nearest Metro: {property.nearestMetrostation?.properties?.name || property.nearestMetrostation?.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;

