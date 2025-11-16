"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Mail, CheckCircle, X } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import {
  connectMentor,
  disconnectMentor,
  getMentorsWithConnection,
} from "@/components/utils/progressUtils";
import { Mentor } from "@/components/utils/mockData";
import {
  getMentorById,
  convertApplicationToMentor,
} from "@/components/utils/mentorUtils";

export default function MentorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const mentorId = params?.id as string;

  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadMentor = async () => {
      if (!mentorId) {
        setLoading(false);
        return;
      }

      try {
        const mentorSchema = await getMentorById(mentorId);
        if (!mentorSchema) {
          setMentor(null);
          return;
        }

        const convertedMentor = convertApplicationToMentor(mentorSchema);
        const [mentorWithConnection] = await getMentorsWithConnection([
          convertedMentor,
        ]);
        setMentor(mentorWithConnection);
      } catch (error) {
        console.error("Error loading mentor:", error);
        setMentor(null);
      } finally {
        setLoading(false);
      }
    };

    loadMentor();
  }, [mentorId]);

  const handleConnectMentor = async () => {
    if (mentor && message.trim()) {
      try {
        await connectMentor(mentor.id);
        setMentor({ ...mentor, connected: true });
        setRequestSent(true);
        setTimeout(() => {
          setShowRequestModal(false);
          setRequestSent(false);
          setMessage("");
        }, 2000);
      } catch (error) {
        console.error("Error connecting to mentor:", error);
      }
    }
  };

  const handleDisconnect = async () => {
    if (mentor) {
      try {
        await disconnectMentor(mentor.id);
        setMentor({ ...mentor, connected: false });
      } catch (error) {
        console.error("Error disconnecting from mentor:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600">Loading mentor profile...</p>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600 mb-4">Mentor not found</p>
          <button
            onClick={() => router.push("/mentors")}
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700"
          >
            Back to Mentors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push("/mentors")}
            className="text-stone-600 hover:text-stone-900 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            <span>Back to Mentors</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-8">
              <div className="h-80 overflow-hidden">
                {mentor.photo_url && mentor.photo_url.trim() !== "" ? (
                  <ImageWithFallback
                    src={mentor.photo_url}
                    alt={mentor.display_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-stone-200">
                    <span className="text-6xl text-stone-400">👤</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h1 className="text-2xl text-amber-900 mb-2">
                  {mentor.display_name}
                </h1>

                {/* Expertise/Title */}
                {mentor.techField && (
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-sm">
                      {mentor.techField}
                    </span>
                  </div>
                )}

                {/* Region - from schema */}
                {mentor.region && (
                  <div className="mb-4">
                    <p className="text-sm text-stone-600">Region</p>
                    <p className="text-stone-900">{mentor.region}</p>
                  </div>
                )}

                {/* Band - from schema */}
                {mentor.band && mentor.band.trim() !== "" && (
                  <div className="mb-6">
                    <p className="text-sm text-stone-600">Band</p>
                    <p className="text-stone-900">{mentor.band}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  {mentor.connected ? (
                    <>
                      <button
                        onClick={handleDisconnect}
                        className="w-full bg-stone-200 text-stone-700 px-6 py-3 rounded-lg hover:bg-stone-300 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={20} />
                        Connected
                      </button>
                      <button className="w-full bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2">
                        <Mail size={20} />
                        Send Message
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowRequestModal(true)}
                      className="w-full bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Mail size={20} />
                      Request Mentorship
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Section - from schema */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-amber-900 mb-4">About</h2>
              {mentor.bio ? (
                <p className="text-stone-700 leading-relaxed">{mentor.bio}</p>
              ) : (
                <p className="text-stone-500 italic">No biography available.</p>
              )}
            </div>

            {/* Expertise Section - from schema */}
            {mentor.expertise && mentor.expertise.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-amber-900 mb-4">Areas of Expertise</h2>
                <div className="flex flex-wrap gap-3">
                  {mentor.expertise.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="bg-amber-100 text-amber-900 px-4 py-2 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Why Connect Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-amber-900 mb-4">
                Why Connect with {mentor.display_name.split(" ")[0]}?
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 mt-1">✓</span>
                  <span className="text-stone-700">
                    Gain insights from an experienced{" "}
                    {mentor.techField.toLowerCase()} professional
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 mt-1">✓</span>
                  <span className="text-stone-700">
                    Learn how to integrate cultural values with technical skills
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 mt-1">✓</span>
                  <span className="text-stone-700">
                    Get guidance on career paths in technology
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 mt-1">✓</span>
                  <span className="text-stone-700">
                    Connect with the Indigenous tech community
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Request Mentorship Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
            {requestSent ? (
              <div className="text-center">
                <CheckCircle
                  className="mx-auto text-green-500 mb-4"
                  size={64}
                />
                <h2 className="text-green-900 mb-2">Request Sent!</h2>
                <p className="text-stone-700">
                  Your mentorship request has been sent to {mentor.display_name}
                  . They will respond soon.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-amber-900">Request Mentorship</h2>
                  <button
                    onClick={() => {
                      setShowRequestModal(false);
                      setMessage("");
                    }}
                    className="text-stone-400 hover:text-stone-600"
                  >
                    <X size={24} />
                  </button>
                </div>
                <p className="text-stone-700 mb-6">
                  Send a mentorship request to {mentor.display_name}. Introduce
                  yourself and explain what you hope to learn.
                </p>
                <textarea
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4"
                  rows={6}
                  placeholder="Hi! I'm interested in learning about..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowRequestModal(false);
                      setMessage("");
                    }}
                    className="flex-1 bg-stone-200 text-stone-700 px-6 py-3 rounded-lg hover:bg-stone-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConnectMentor}
                    disabled={!message.trim()}
                    className="flex-1 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
                  >
                    Send Request
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
