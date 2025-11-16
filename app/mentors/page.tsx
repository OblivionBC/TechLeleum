"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Filter, ChevronDown, CheckCircle } from "lucide-react";
import { Mentor } from "@/components/utils/mockData";

import { loadMentorsWithConnection } from "@/components/utils/mentorUtils";

export default function Mentors() {
  const router = useRouter();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const [selectedField, setSelectedField] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedAvailability, setSelectedAvailability] =
    useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadMentors = async () => {
      try {
        const mentorsWithConnection = await loadMentorsWithConnection();
        setMentors(mentorsWithConnection);
        setFilteredMentors(mentorsWithConnection);
      } catch (error) {
        console.error("Error loading mentors:", error);
        setMentors([]);
        setFilteredMentors([]);
      }
    };

    loadMentors();
  }, []);

  useEffect(() => {
    let filtered = [...mentors];

    if (selectedField !== "all") {
      filtered = filtered.filter((m) => m.techField === selectedField);
    }

    if (selectedRegion !== "all") {
      filtered = filtered.filter((m) => m.region === selectedRegion);
    }

    if (selectedAvailability !== "all") {
      filtered = filtered.filter(
        (m) => m.availability === selectedAvailability
      );
    }

    setFilteredMentors(filtered);
  }, [selectedField, selectedRegion, selectedAvailability, mentors]);

  const techFields = useMemo(
    () => ["all", ...Array.from(new Set(mentors.map((m) => m.techField)))],
    [mentors]
  );
  const regions = useMemo(
    () => ["all", ...Array.from(new Set(mentors.map((m) => m.region)))],
    [mentors]
  );
  const availabilities = ["all", "available", "limited", "unavailable"];

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-amber-900 mb-4">Indigenous Tech Mentors</h1>
          <p className="text-stone-700 max-w-3xl mx-auto text-lg">
            Connect with experienced Indigenous professionals in technology who
            can guide your learning journey and career development.
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-amber-900 mb-4 md:mb-0 hover:text-amber-700"
          >
            <Filter size={20} />
            <span>Filters</span>
            <ChevronDown
              size={20}
              className={`transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>

          {showFilters && (
            <div className="grid md:grid-cols-3 gap-6 mt-4 pt-4 border-t border-stone-200">
              {/* Tech Field Filter */}
              <div>
                <label className="block text-sm text-stone-700 mb-2">
                  Tech Field
                </label>
                <select
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {techFields.map((field) => (
                    <option key={field} value={field}>
                      {field === "all" ? "All Fields" : field}
                    </option>
                  ))}
                </select>
              </div>

              {/* Region Filter */}
              <div>
                <label className="block text-sm text-stone-700 mb-2">
                  Region
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region === "all" ? "All Regions" : region}
                    </option>
                  ))}
                </select>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-sm text-stone-700 mb-2">
                  Availability
                </label>
                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {availabilities.map((avail) => (
                    <option key={avail} value={avail}>
                      {avail === "all"
                        ? "All"
                        : avail.charAt(0).toUpperCase() + avail.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-stone-600">
            Showing {filteredMentors.length}{" "}
            {filteredMentors.length === 1 ? "mentor" : "mentors"}
          </p>
        </div>

        {/* Mentors Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden cursor-pointer group"
              onClick={() => router.push(`/mentors/${mentor.id}`)}
            >
              {/* Image */}
              <div className="relative h-32 overflow-hidden">
                {mentor.photo_url && mentor.photo_url.trim() !== "" ? (
                  <ImageWithFallback
                    src={mentor.photo_url}
                    alt={mentor.display_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-stone-200">
                    <span className="text-4xl text-stone-400">👤</span>
                  </div>
                )}
                {mentor.connected && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                    <CheckCircle size={14} />
                  </div>
                )}
                <div
                  className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-xs ${
                    mentor.availability === "available"
                      ? "bg-green-500 text-white"
                      : mentor.availability === "limited"
                      ? "bg-yellow-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {mentor.availability.charAt(0).toUpperCase() +
                    mentor.availability.slice(1)}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Name & Title */}
                <h3 className="text-amber-900 mb-1 group-hover:text-amber-700 transition-colors text-sm">
                  {mentor.display_name}
                </h3>

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {mentor.expertise.slice(0, 2).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                  {mentor.expertise.length > 2 && (
                    <span className="text-xs text-stone-500">
                      +{mentor.expertise.length - 2}
                    </span>
                  )}
                </div>

                {/* Region & Band */}
                <div className="pt-2 border-t border-stone-200 space-y-1">
                  <p className="text-xs text-stone-600">
                    <span className="text-stone-500">Region:</span>{" "}
                    {mentor.region}
                  </p>
                  {mentor.band && (
                    <p className="text-xs text-stone-600">
                      <span className="text-stone-500">Band:</span>{" "}
                      {mentor.band}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredMentors.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-stone-600 mb-4">
              No mentors found matching your criteria
            </p>
            <button
              onClick={() => {
                setSelectedField("all");
                setSelectedRegion("all");
                setSelectedAvailability("all");
              }}
              className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
            {/* Footer */}
            <footer className="footer">
                <p>© 2025 Indigenous Youth Code. All rights reserved.</p>
                <p>Built with respect for Coast Salish traditions and territories.</p>
            </footer>
    </div>
  );
}
