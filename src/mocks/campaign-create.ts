// src/mocks/campaign-create.ts

import type { Property } from "@/types";

/**
 * Simulates the extracted property data after PDF upload.
 * In production, this comes from the backend after AI extraction.
 */
export const mockExtractedProperty: Property = {
  id: "prop-001",
  name: "Marina Heights Tower",
  document_type: "fact_sheet",
  file_name: "marina-heights-brochure.pdf",
  file_url: "/uploads/marina-heights-brochure.pdf",
  file_size: 2457600,
  description:
    "Marina Heights Tower is a premium 45-storey residential development offering breathtaking views of Dubai Marina and the Arabian Gulf. Featuring world-class amenities including an infinity pool, state-of-the-art fitness center, private cinema, and 24/7 concierge service. Each unit is designed with floor-to-ceiling windows, Italian marble finishes, and smart home technology.",
  location: "Dubai Marina, Dubai, UAE",
  price_range: "AED 1,200,000 – AED 4,500,000",
  starting_price: 1200000,
  currency: "AED",
  property_type: "Apartment",
  bedrooms: "Studio, 1BR, 2BR, 3BR",
  amenities: [
    "Infinity Pool",
    "Gym & Fitness Center",
    "Private Cinema",
    "Concierge Service",
    "Kids Play Area",
    "Covered Parking",
    "Landscaped Gardens",
    "BBQ Area",
  ],
  developer: "Emaar Properties",
  completion_date: "Q4 2026",
  payment_plan: {
    booking: "10%",
    during_construction: "50%",
    on_handover: "40%",
  },
  extraction_status: "completed",
  created_at: "2025-06-13T10:30:00Z",
  updated_at: "2025-06-13T10:32:00Z",
};

/**
 * Simulates a delay for "uploading and extracting" a PDF.
 */
export function simulateUploadAndExtract(
  _file: File
): Promise<Property> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockExtractedProperty);
    }, 2500);
  });
}