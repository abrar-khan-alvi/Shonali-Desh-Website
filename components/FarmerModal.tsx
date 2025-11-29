import React from 'react';
import { Download, MapPin, Shield, Star, X, Sparkles, Zap, CheckCircle2 } from 'lucide-react';

interface FarmerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FarmerModal: React.FC<FarmerModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-black/80 via-primary/20 to-black/80 backdrop-blur-md"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-gradient-to-br from-white via-green-50/50 to-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn border border-green-200/50">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-300/10 to-transparent rounded-full blur-3xl"></div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 hover:rotate-90 duration-300 group"
                >
                    <X size={20} className="text-gray-700 group-hover:text-primary" />
                </button>

                {/* Hero Section */}
                <div className="relative py-16 px-8 overflow-hidden">
                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                                <Sparkles className="text-primary" size={16} />
                                <span className="text-primary font-semibold text-sm">Coming Soon</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                                আপনার হাতের মুঠোয় <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-600">
                                    খামারের ভবিষ্যৎ
                                </span>
                            </h1>

                            <p className="text-lg text-gray-600 leading-relaxed">
                                Join thousands of farmers securing their income with AI-powered warnings and expert advice.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button className="group relative overflow-hidden bg-black text-white px-8 py-4 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-green-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative flex items-center justify-center gap-3">
                                        <Download size={20} />
                                        <div className="text-left">
                                            <div className="text-xs opacity-80">Get it on</div>
                                            <div className="font-bold">Google Play</div>
                                        </div>
                                    </div>
                                </button>

                                <button className="group relative overflow-hidden bg-black text-white px-8 py-4 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-green-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative flex items-center justify-center gap-3">
                                        <Download size={20} />
                                        <div className="text-left">
                                            <div className="text-xs opacity-80">Download on</div>
                                            <div className="font-bold">App Store</div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Right - Phone Mockup */}
                        <div className="relative flex justify-center">
                            <div className="relative">
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-green-400/30 rounded-[3rem] blur-2xl"></div>

                                {/* Phone */}
                                <div className="relative w-72 h-[600px] bg-gradient-to-br from-gray-900 to-black rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-500">
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20"></div>

                                    <div className="w-full h-full bg-gradient-to-br from-white to-green-50 flex flex-col">
                                        {/* App Header */}
                                        <div className="h-1/3 bg-gradient-to-br from-primary to-green-600 p-6 flex flex-col justify-end text-white relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                            <div className="relative">
                                                <div className="text-2xl font-bold mb-1">Shonali Desh</div>
                                                <div className="text-sm opacity-90">Welcome back, Karim</div>
                                            </div>
                                        </div>

                                        {/* App Content */}
                                        <div className="p-4 space-y-3 flex-1">
                                            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4 border border-green-200">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <Zap className="text-white" size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-green-900">Weather Alert</div>
                                                        <div className="text-xs text-green-700 mt-1">Heavy rain in 2 days. Prepare drainage.</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-100 rounded-2xl h-24 animate-pulse"></div>
                                            <div className="bg-gray-100 rounded-2xl h-24 animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How It Works Section */}
                <div className="relative py-16 px-8 bg-gradient-to-br from-green-50/50 to-white">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            মাত্র ৩টি সহজ ধাপে শুরু করুন
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-primary to-green-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            { icon: Download, title: "Download App", desc: "Install from your app store", color: "from-blue-500 to-blue-600" },
                            { icon: MapPin, title: "Set Location", desc: "Get precise weather alerts", color: "from-purple-500 to-purple-600" },
                            { icon: Shield, title: "Protect Crops", desc: "Receive AI warnings", color: "from-green-500 to-green-600" }
                        ].map((step, i) => (
                            <div key={i} className="group relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-green-100/50 rounded-2xl transform group-hover:scale-105 transition-transform"></div>
                                <div className="relative p-8 text-center space-y-4">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto transform group-hover:rotate-6 transition-transform shadow-lg`}>
                                        <step.icon className="text-white" size={28} />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">Step {i + 1}</div>
                                    <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
                                    <p className="text-gray-600">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Testimonial Section */}
                <div className="relative py-16 px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative bg-gradient-to-br from-white to-green-50 p-10 rounded-3xl shadow-xl border border-green-100">
                            {/* Quote Icon */}
                            <div className="absolute -top-6 left-10 w-12 h-12 bg-gradient-to-br from-primary to-green-600 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white text-2xl">"</span>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                    K
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 text-lg">Karim Mia</div>
                                    <div className="text-sm text-gray-600">Sunamganj, Bangladesh</div>
                                </div>
                                <div className="ml-auto flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} fill="currentColor" className="text-yellow-400" size={18} />
                                    ))}
                                </div>
                            </div>

                            <blockquote className="text-xl text-gray-700 leading-relaxed italic">
                                "Shonali Desh saved my Boro harvest... I saved over 80,000 Taka by following their early flood warning."
                            </blockquote>

                            <div className="mt-6 flex items-center gap-2 text-primary">
                                <CheckCircle2 size={20} />
                                <span className="font-semibold">Verified Farmer</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmerModal;
