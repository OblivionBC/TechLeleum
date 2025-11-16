'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback'; 
import { UserPlus, Mail, Phone, MapPin, Briefcase, GraduationCap, Heart, CheckCircle, ArrowLeft } from 'lucide-react';
import { Badge } from './ui/badge';

interface MentorApplicationForm {
  onNavigate: (section: string, id?: string) => void;
}

export function MentorApplicationForm({ onNavigate }: MentorApplicationForm) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    region: '',
    techField: '',
    expertise: '',
    experience: '',
    culturalBackground: '',
    motivation: '',
    availability: 'available' as 'available' | 'limited' | 'unavailable',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.region.trim()) newErrors.region = 'Region is required';
    if (!formData.techField.trim()) newErrors.techField = 'Technology field is required';
    if (!formData.expertise.trim()) newErrors.expertise = 'Expertise is required';
    if (!formData.experience.trim()) newErrors.experience = 'Experience is required';
    if (!formData.motivation.trim()) newErrors.motivation = 'Motivation is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Store application in localStorage (pending review)
    const applications = localStorage.getItem('mentorApplications');
    const existingApplications = applications ? JSON.parse(applications) : [];
    
    const newApplication = {
      ...formData,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'pending',
      approved: false,
    };

    existingApplications.push(newApplication);
    localStorage.setItem('mentorApplications', JSON.stringify(existingApplications));

    setSubmitted(true);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-green-300 shadow-xl bg-white">
            <CardHeader className="bg-gradient-to-br from-green-50 to-emerald-50 border-b-2 border-green-200">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-center text-green-900">
                Application Submitted Successfully!
              </CardTitle>
              <CardDescription className="text-center text-green-800">
                Thank you for your interest in becoming a mentor
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6">
                <h3 className="text-amber-950 mb-3">What happens next?</h3>
                <ul className="space-y-3 text-amber-900">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">1.</span>
                    <span>Our team will review your application within 3-5 business days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">2.</span>
                    <span>We may reach out for additional information or to schedule an interview</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">3.</span>
                    <span>Once approved, you'll receive login credentials and access to the mentor dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">4.</span>
                    <span>Your profile will be added to our Mentors page for students to connect with you</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <h3 className="text-blue-950 mb-2">Application Summary</h3>
                <div className="space-y-2 text-sm text-blue-900">
                  <p><strong>Name:</strong> {formData.name}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Tech Field:</strong> {formData.techField}</p>
                  <p><strong>Region:</strong> {formData.region}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => onNavigate('home')}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                >
                  Return to Home
                </Button>
                <Button 
                  onClick={() => onNavigate('mentors')}
                  variant="outline"
                  className="flex-1 border-2 border-amber-600 text-amber-900 hover:bg-amber-50"
                >
                  View Mentors
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative h-[40vh] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1606239763507-f44d0c248629?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZ2Vub3VzJTIweW91dGglMjBsZWFybmluZ3xlbnwxfHx8fDE3NjMyNTgzOTd8MA&w=1080"
          alt="Indigenous community gathering"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/60 via-amber-900/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <UserPlus className="w-16 h-16 mx-auto mb-4 text-amber-200" />
            <h1 className="text-5xl mb-4 text-amber-50">Become a Mentor</h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              Share your knowledge and guide the next generation
            </p>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Button
            onClick={() => onNavigate('mentor-signin')}
            variant="ghost"
            className="mb-6 text-amber-900 hover:bg-amber-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Button>

          <Card className="border-2 border-amber-200 shadow-xl bg-white/95 backdrop-blur">
            <CardHeader className="bg-gradient-to-br from-amber-50 to-orange-50 border-b-2 border-amber-200">
              <CardTitle className="text-amber-950">Mentor Application Form</CardTitle>
              <CardDescription className="text-amber-900">
                Help us get to know you and your expertise. All fields marked with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-amber-200">
                    <UserPlus className="w-5 h-5 text-amber-700" />
                    <h3 className="text-amber-950">Personal Information</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-amber-950">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className={`border-amber-300 focus:border-amber-500 focus:ring-amber-500 ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-amber-950 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className={`border-amber-300 focus:border-amber-500 focus:ring-amber-500 ${errors.email ? 'border-red-500' : ''}`}
                      />
                      {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-amber-950 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region" className="text-amber-950 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Region/Territory *
                    </Label>
                    <Input
                      id="region"
                      placeholder="e.g., Pacific Northwest, British Columbia, Vancouver Island"
                      value={formData.region}
                      onChange={(e) => handleChange('region', e.target.value)}
                      className={`border-amber-300 focus:border-amber-500 focus:ring-amber-500 ${errors.region ? 'border-red-500' : ''}`}
                    />
                    {errors.region && <p className="text-sm text-red-600">{errors.region}</p>}
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-amber-200">
                    <Briefcase className="w-5 h-5 text-amber-700" />
                    <h3 className="text-amber-950">Professional Experience</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="techField" className="text-amber-950">
                      Technology Field *
                    </Label>
                    <Input
                      id="techField"
                      placeholder="e.g., Web Development, Data Science, Cybersecurity"
                      value={formData.techField}
                      onChange={(e) => handleChange('techField', e.target.value)}
                      className={`border-amber-300 focus:border-amber-500 focus:ring-amber-500 ${errors.techField ? 'border-red-500' : ''}`}
                    />
                    {errors.techField && <p className="text-sm text-red-600">{errors.techField}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expertise" className="text-amber-950 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Areas of Expertise *
                    </Label>
                    <Input
                      id="expertise"
                      placeholder="e.g., React, Python, Cloud Computing, UX Design (comma-separated)"
                      value={formData.expertise}
                      onChange={(e) => handleChange('expertise', e.target.value)}
                      className={`border-amber-300 focus:border-amber-500 focus:ring-amber-500 ${errors.expertise ? 'border-red-500' : ''}`}
                    />
                    {errors.expertise && <p className="text-sm text-red-600">{errors.expertise}</p>}
                    <p className="text-sm text-amber-700">List your technical skills and areas of expertise</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-amber-950">
                      Professional Experience *
                    </Label>
                    <Textarea
                      id="experience"
                      placeholder="Tell us about your professional background, years of experience, notable projects, and any teaching or mentoring experience..."
                      value={formData.experience}
                      onChange={(e) => handleChange('experience', e.target.value)}
                      rows={4}
                      className={`border-amber-300 focus:border-amber-500 focus:ring-amber-500 resize-none ${errors.experience ? 'border-red-500' : ''}`}
                    />
                    {errors.experience && <p className="text-sm text-red-600">{errors.experience}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability" className="text-amber-950">
                      Availability
                    </Label>
                    <select
                      id="availability"
                      value={formData.availability}
                      onChange={(e) => handleChange('availability', e.target.value)}
                      className="w-full px-3 py-2 border border-amber-300 rounded-md focus:border-amber-500 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="available">Available</option>
                      <option value="limited">Limited Availability</option>
                      <option value="unavailable">Currently Unavailable</option>
                    </select>
                    <p className="text-sm text-amber-700">How much time can you commit to mentoring?</p>
                  </div>
                </div>

                {/* Cultural & Personal */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-amber-200">
                    <Heart className="w-5 h-5 text-amber-700" />
                    <h3 className="text-amber-950">Cultural Background & Motivation</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="culturalBackground" className="text-amber-950">
                      Cultural Background
                    </Label>
                    <Textarea
                      id="culturalBackground"
                      placeholder="Share about your cultural background, community connections, and how you integrate cultural knowledge with technology..."
                      value={formData.culturalBackground}
                      onChange={(e) => handleChange('culturalBackground', e.target.value)}
                      rows={3}
                      className="border-amber-300 focus:border-amber-500 focus:ring-amber-500 resize-none"
                    />
                    <p className="text-sm text-amber-700">Optional but helps us understand your perspective</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="motivation" className="text-amber-950">
                      Why do you want to become a mentor? *
                    </Label>
                    <Textarea
                      id="motivation"
                      placeholder="Tell us why you're passionate about mentoring Indigenous youth and what you hope to contribute to this community..."
                      value={formData.motivation}
                      onChange={(e) => handleChange('motivation', e.target.value)}
                      rows={4}
                      className={`border-amber-300 focus:border-amber-500 focus:ring-amber-500 resize-none ${errors.motivation ? 'border-red-500' : ''}`}
                    />
                    {errors.motivation && <p className="text-sm text-red-600">{errors.motivation}</p>}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t-2 border-amber-200">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg py-6"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Submit Application
                  </Button>
                  <p className="text-sm text-center text-amber-700 mt-4">
                    By submitting this application, you agree to our mentorship guidelines and commitment to supporting Indigenous youth in technology.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Decorative Elements */}
      <div className="fixed bottom-8 right-8 opacity-10 pointer-events-none hidden lg:block">
        <div className="w-24 h-48 bg-gradient-to-b from-amber-800 to-amber-950 rounded-lg"></div>
      </div>
    </div>
  );
}