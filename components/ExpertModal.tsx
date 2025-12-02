import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { CheckCircle, Upload, ChevronRight, ChevronLeft, FileText, X, Sparkles, Award, Shield } from 'lucide-react';
import { db } from '../firebaseConfig';
import { ref as dbRef, set } from 'firebase/database';

interface ExpertModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface DistrictData {
    district: string;
    upazilla: string[];
}

const ExpertModal: React.FC<ExpertModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Location Data State
    const [divisions, setDivisions] = useState<string[]>([]);
    const [districts, setDistricts] = useState<DistrictData[]>([]);
    const [upazilas, setUpazilas] = useState<string[]>([]);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        // Personal Details
        fullName: '',
        mobileNumber: '',
        email: '',

        // Location Info
        division: '',
        district: '',
        upazila: '',
        address: '',

        // Professional Details
        qualification: '',
        affiliation: '',
        experience: '',
        specializations: [] as string[],

        // Credentials (Files)
        degreeFile: null as File | null,
        nidFile: null as File | null,

        // Finalize
        profilePicture: null as File | null,
        bio: '',
        agreedToTerms: false
    });

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [isOpen]);

    // Fetch Divisions on Mount
    useEffect(() => {
        const fetchDivisions = async () => {
            try {
                const response = await fetch('https://bdapis.com/api/v1.2/divisions');
                const data = await response.json();
                if (data.data) {
                    setDivisions(data.data.map((d: any) => d.division));
                }
            } catch (error) {
                console.error("Failed to fetch divisions:", error);
            }
        };
        fetchDivisions();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'degreeFile' | 'nidFile' | 'profilePicture') => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, [fieldName]: e.target.files![0] }));
        }
    };

    const handleDivisionChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const division = e.target.value;
        setFormData(prev => ({ ...prev, division, district: '', upazila: '' }));
        setDistricts([]);
        setUpazilas([]);

        if (division) {
            setIsLoadingLocation(true);
            try {
                const response = await fetch(`https://bdapis.com/api/v1.2/division/${division}`);
                const data = await response.json();
                if (data.data) {
                    setDistricts(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch districts:", error);
            } finally {
                setIsLoadingLocation(false);
            }
        }
    };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const districtName = e.target.value;
        setFormData(prev => ({ ...prev, district: districtName, upazila: '' }));

        const selectedDistrict = districts.find(d => d.district === districtName);
        if (selectedDistrict) {
            setUpazilas(selectedDistrict.upazilla);
        } else {
            setUpazilas([]);
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        if (name === 'agreedToTerms') {
            setFormData(prev => ({ ...prev, agreedToTerms: checked }));
        } else {
            // Handle specializations array
            const spec = name;
            setFormData(prev => {
                const newSpecs = checked
                    ? [...prev.specializations, spec]
                    : prev.specializations.filter(s => s !== spec);
                return { ...prev, specializations: newSpecs };
            });
        }
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    // Helper to convert file to Base64
    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const expertId = `EXPERT_${Date.now()}_${formData.fullName.replace(/\s+/g, '_').toUpperCase()}`;

            // Convert Files to Base64
            let profilePhotoBase64 = "default_avatar.png";
            let degreeCertificateBase64 = "";
            let professionalIdBase64 = "";

            if (formData.profilePicture) {
                profilePhotoBase64 = await convertFileToBase64(formData.profilePicture);
            }
            if (formData.degreeFile) {
                degreeCertificateBase64 = await convertFileToBase64(formData.degreeFile);
            }
            if (formData.nidFile) {
                professionalIdBase64 = await convertFileToBase64(formData.nidFile);
            }

            // Construct Data Object
            const expertData = {
                name: formData.fullName,
                phone: formData.mobileNumber,
                email: formData.email,
                profilePhotoUrl: profilePhotoBase64, // Storing Base64 directly
                bio: formData.bio,
                locationInfo: {
                    region: formData.division,
                    district: formData.district,
                    upazila: formData.upazila,
                    village: formData.address
                },
                educationalQualification: formData.qualification,
                currentAffiliation: formData.affiliation,
                yearsOfExperience: formData.experience,
                areasOfSpecialization: formData.specializations,
                credentials: {
                    degreeCertificateUrl: degreeCertificateBase64, // Storing Base64 directly
                    professionalIdUrl: professionalIdBase64 // Storing Base64 directly
                },
                paymentPerReport: 50,
                hasAvailable: true,
                verificationStatus: "pending",
                metadata: {
                    createdAt: new Date().toISOString()
                },
                updatedAt: new Date().toISOString(),
                ratingAvg: 0
            };

            // Save to Realtime Database
            await set(dbRef(db, 'Experts/' + expertId), expertData);

            // Send Email Notification
            try {
                const serviceId = 'service_5x4bm17';
                const templateId = 'template_ovcm6qs';
                const publicKey = 'q2yKc_DIR2YJFyWEi';

                // Initialize EmailJS with public key
                emailjs.init(publicKey);

                const templateParams = {
                    to_name: formData.fullName,
                    to_email: formData.email,
                    mobile_number: formData.mobileNumber,
                    division: formData.division,
                    district: formData.district,
                    upazila: formData.upazila,
                    qualification: formData.qualification,
                    affiliation: formData.affiliation,
                    experience: formData.experience,
                    specializations: formData.specializations.join(', '),
                    bio: formData.bio,
                    submission_date: new Date().toLocaleString(),
                };

                await emailjs.send(serviceId, templateId, templateParams);
                console.log('Email sent successfully');
            } catch (emailError) {
                console.error('Failed to send email:', emailError);
                // Note: We don't block the success UI if email fails, but we log the error
            }

            setIsSubmitted(true);
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("There was an error submitting your application. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setIsSubmitted(false);
        setFormData({
            fullName: '',
            mobileNumber: '',
            email: '',
            division: '',
            district: '',
            upazila: '',
            address: '',
            qualification: '',
            affiliation: '',
            experience: '',
            specializations: [],
            degreeFile: null,
            nidFile: null,
            profilePicture: null,
            bio: '',
            agreedToTerms: false
        });
        onClose();
    };

    if (!isOpen) return null;

    if (isSubmitted) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-primary/20 to-black/80 backdrop-blur-md" onClick={handleClose}></div>

                <div className="relative bg-gradient-to-br from-white via-green-50 to-white rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center animate-scaleIn border border-green-200">
                    {/* Success Animation Circle */}
                    <div className="relative mx-auto mb-8">
                        <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                            <CheckCircle size={64} className="text-white" />
                        </div>
                        <div className="absolute inset-0 bg-green-400/30 rounded-full blur-2xl animate-pulse"></div>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Application Submitted! 🎉
                    </h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Thank you for joining our expert network. Our team will review your credentials and get back to you within <span className="font-semibold text-primary">3-5 business days</span>.
                    </p>

                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
                        <div className="flex items-center gap-3 text-green-800">
                            <Shield className="flex-shrink-0" size={24} />
                            <p className="text-sm text-left">
                                You'll receive a confirmation email shortly with next steps and verification details.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="w-full bg-gradient-to-r from-primary to-green-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-primary/20 to-black/80 backdrop-blur-md" onClick={handleClose}></div>

            <div className="relative bg-gradient-to-br from-white via-green-50/30 to-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] animate-scaleIn border border-green-200/50 modal-content">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-300/10 to-transparent rounded-full blur-3xl"></div>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 hover:rotate-90 duration-300 group"
                >
                    <X size={20} className="text-gray-700 group-hover:text-primary" />
                </button>

                {/* Header */}
                <div className="relative bg-gradient-to-r from-primary to-green-600 p-8 text-white overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                                    <Award className="text-white" size={24} />
                                </div>
                                <div>
                                    <div className="text-3xl font-bold">Expert Application</div>
                                    <div className="text-green-100 text-sm">Join our verified network</div>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-white h-2 rounded-full transition-all duration-500 ease-out shadow-lg"
                                style={{ width: `${(step / 3) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="relative z-10 p-8 overflow-y-auto max-h-[calc(90vh-200px)]">

                    {/* Step 1 */}
                    {step === 1 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">1</div>
                                <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Full Name *</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all hover:border-gray-300"
                                        placeholder="Dr. Rahim Uddin"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Mobile Number *</label>
                                    <input
                                        type="tel"
                                        name="mobileNumber"
                                        value={formData.mobileNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all hover:border-gray-300"
                                        placeholder="+880 1XXX XXXXXX"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all hover:border-gray-300"
                                    placeholder="rahim@example.com"
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Division *</label>
                                    <select
                                        name="division"
                                        value={formData.division}
                                        onChange={handleDivisionChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white hover:border-gray-300 transition-all"
                                        required
                                    >
                                        <option value="">Select Division</option>
                                        {divisions.map((div) => (
                                            <option key={div} value={div}>{div}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">District *</label>
                                    <select
                                        name="district"
                                        value={formData.district}
                                        onChange={handleDistrictChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white hover:border-gray-300 transition-all disabled:bg-gray-100"
                                        required
                                        disabled={!formData.division || isLoadingLocation}
                                    >
                                        <option value="">
                                            {isLoadingLocation ? "Loading..." : "Select District"}
                                        </option>
                                        {districts.map((dist) => (
                                            <option key={dist.district} value={dist.district}>{dist.district}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Upazila *</label>
                                    <select
                                        name="upazila"
                                        value={formData.upazila}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white hover:border-gray-300 transition-all disabled:bg-gray-100"
                                        required
                                        disabled={!formData.district}
                                    >
                                        <option value="">Select Upazila</option>
                                        {upazilas.map((upz) => (
                                            <option key={upz} value={upz}>{upz}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Address (Village/Area) *</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all hover:border-gray-300"
                                    placeholder="Enter your village or area name"
                                    required
                                />
                            </div>

                            <div className="pt-6 flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-green-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    Next: Professional Details <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">2</div>
                                <h3 className="text-2xl font-bold text-gray-900">Professional Details</h3>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Highest Educational Qualification *</label>
                                <input
                                    type="text"
                                    name="qualification"
                                    value={formData.qualification}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all hover:border-gray-300"
                                    placeholder="e.g. PhD in Agronomy"
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Current Affiliation *</label>
                                    <input
                                        type="text"
                                        name="affiliation"
                                        value={formData.affiliation}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all hover:border-gray-300"
                                        placeholder="e.g. BARI"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Years of Experience *</label>
                                    <input
                                        type="number"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all hover:border-gray-300"
                                        placeholder="e.g. 10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-gray-700">Areas of Specialization *</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Soil Science', 'Pest Management', 'Crop Disease', 'Irrigation', 'Organic Farming', 'Agro-Economics'].map((spec) => (
                                        <label key={spec} className="group relative flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-green-50 has-[:checked]:shadow-md">
                                            <input
                                                type="checkbox"
                                                name={spec}
                                                checked={formData.specializations.includes(spec)}
                                                onChange={handleCheckboxChange}
                                                className="w-5 h-5 text-primary rounded focus:ring-primary accent-primary cursor-pointer"
                                            />
                                            <span className="text-gray-700 font-medium text-sm">{spec}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <label className="block text-sm font-semibold text-gray-700">Upload Credentials *</label>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="group relative border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-primary transition-all cursor-pointer bg-gradient-to-br from-gray-50 to-white hover:from-green-50 hover:to-white">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => handleFileChange(e, 'degreeFile')}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Upload className="text-white" size={24} />
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700">
                                            {formData.degreeFile ? formData.degreeFile.name : "Degree Certificate"}
                                        </span>
                                        <span className="text-xs text-gray-500 mt-2">PDF or JPG (Max 5MB)</span>
                                    </div>

                                    <div className="group relative border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-primary transition-all cursor-pointer bg-gradient-to-br from-gray-50 to-white hover:from-green-50 hover:to-white">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => handleFileChange(e, 'nidFile')}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <FileText className="text-white" size={24} />
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700">
                                            {formData.nidFile ? formData.nidFile.name : "Professional ID / NID"}
                                        </span>
                                        <span className="text-xs text-gray-500 mt-2">Front & Back</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-between">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-all"
                                >
                                    <ChevronLeft size={20} /> Back
                                </button>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-green-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    Next: Finalize <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3 */}
                    {step === 3 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold">3</div>
                                <h3 className="text-2xl font-bold text-gray-900">Finalize Your Profile</h3>
                            </div>

                            <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200">
                                <div className="relative w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-400 group-hover:border-primary transition-all cursor-pointer overflow-hidden">
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        onChange={(e) => handleFileChange(e, 'profilePicture')}
                                        accept=".jpg,.jpeg,.png"
                                    />
                                    {formData.profilePicture ? (
                                        <img
                                            src={URL.createObjectURL(formData.profilePicture)}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Upload size={32} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <button type="button" className="text-sm font-semibold text-primary border-2 border-primary px-6 py-3 rounded-xl hover:bg-green-50 transition-all pointer-events-none">
                                        {formData.profilePicture ? "Change Profile Picture" : "Upload Profile Picture"}
                                    </button>
                                    <p className="text-xs text-gray-500 mt-2">Square JPG/PNG, at least 400x400px</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Short Bio *</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-32 resize-none transition-all hover:border-gray-300"
                                    placeholder="Tell us about your expertise and why you want to join..."
                                    required
                                ></textarea>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
                                <div className="flex items-start gap-4">
                                    <input
                                        id="terms-checkbox"
                                        type="checkbox"
                                        name="agreedToTerms"
                                        checked={formData.agreedToTerms}
                                        onChange={handleCheckboxChange}
                                        className="mt-1 w-5 h-5 text-primary rounded focus:ring-primary accent-primary cursor-pointer"
                                        required
                                    />
                                    <label htmlFor="terms-checkbox" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                                        I agree to the <a href="#" className="text-primary font-semibold hover:underline relative z-20" onClick={(e) => e.stopPropagation()}>Expert Terms of Service</a> and confirm that all provided information is accurate. I understand that providing false information may lead to account termination.
                                    </label>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-between">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-all"
                                >
                                    <ChevronLeft size={20} /> Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-green-600 text-white px-10 py-4 rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={20} />
                                            Submit Application
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ExpertModal;
