import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Image } from "lucide-react";
import PrimaryButton from "../../Components/PrimaryButton";
import { Link } from "react-router-dom";
import { gallaryData } from "../../Shared/Jsondata";
import SectionHeader from "../../Components/SectionHeader";

const DentalGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const openLightbox = (image) => {
    setSelectedImage(image);
  };
  const closeLightbox = () => {
    setSelectedImage(null);
  };
  const goToPrevious = () => {
    const currentIndex = gallaryData.findIndex(
      (img) => img.id === selectedImage.id
    );
    const prevIndex =
      currentIndex === 0 ? gallaryData.length - 1 : currentIndex - 1;
    setSelectedImage(gallaryData[prevIndex]);
  };
  const goToNext = () => {
    const currentIndex = gallaryData.findIndex(
      (img) => img.id === selectedImage.id
    );
    const nextIndex =
      currentIndex === gallaryData.length - 1 ? 0 : currentIndex + 1;
    setSelectedImage(gallaryData[nextIndex]);
  };

  return (
    <div className="mt-32 px-4">
      <div className="max-w-7xl mx-auto px-2">
        <SectionHeader
          icon={Image}
          label="Gallery"
          title="Our Dental Office"
          subtitle="Take a virtual tour of our state-of-the-art facility"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {gallaryData.map((image) => (
            <div
              key={image.id}
              onClick={() => openLightbox(image)}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer aspect-square">
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="text-sm font-semibold mb-1">{image.title}</p>
                  <span className="inline-block bg-teal-500 text-xs px-2 py-1 rounded-full">
                    {image.category}
                  </span>
                </div>
              </div>

              <div className="absolute inset-0 border-4 border-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}>
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-teal-400 transition-colors z-10">
              <X className="w-8 h-8" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 text-white hover:text-teal-400 transition-colors z-10">
              <ChevronLeft className="w-10 h-10" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 text-white hover:text-teal-400 transition-colors z-10">
              <ChevronRight className="w-10 h-10" />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl max-h-[90vh] w-full">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-full object-contain rounded-lg"
              />

              <div className="mt-4 text-center">
                <h3 className="text-white text-2xl font-semibold mb-2">
                  {selectedImage.title}
                </h3>
                <span className="inline-block bg-teal-500 text-white text-sm px-4 py-1 rounded-full">
                  {selectedImage.category}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4 text-lg">
            Want to visit us in person?
          </p>
          <Link to={"/appointment"}>
            <PrimaryButton>Schedule a Visit</PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DentalGallery;
