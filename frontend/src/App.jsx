/* eslint-disable react/prop-types */
import { Play, FastForward, Globe, Linkedin, Github } from "lucide-react";
import Header from "./components/Header";
import FeatureCard from "./components/FeatureCard";
import PricingCard from "./components/PricingCard";
import VideoUploader from "./components/VideoUploader";

export default function App() {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            <Header />
            <main>
                <section className="py-20 px-6">
                    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between">
                        <div className="lg:w-1/2 mb-10 lg:mb-0">
                            <h1 className="text-4xl lg:text-5xl font-light mb-6">
                                Transform Your Videos with HLS Transcoding
                            </h1>
                            <p className="text-xl text-gray-400 mb-8 font-light">
                                Upload your videos and get HLS transcoded links
                                instantly. Perfect for streaming and adaptive
                                bitrate playback.
                            </p>
                        </div>
                        <VideoUploader />
                    </div>
                </section>

                <section id="features" className="py-20 px-6 bg-gray-800">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-light text-center mb-12">
                            Features
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<Play className="w-12 h-12" />}
                                title="Instant Transcoding"
                                description="Upload your video and get an HLS link within minutes, ready for streaming."
                            />
                            <FeatureCard
                                icon={<FastForward className="w-12 h-12" />}
                                title="Adaptive Bitrate"
                                description="Our HLS streams adapt to your viewers' network conditions for smooth playback."
                            />
                            <FeatureCard
                                icon={<Globe className="w-12 h-12" />}
                                title="Global CDN"
                                description="Deliver your content quickly to viewers around the world with our global CDN."
                            />
                        </div>
                    </div>
                </section>

                <section id="pricing" className="py-20 px-6">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-light text-center mb-12">
                            Pricing
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <PricingCard
                                title="Basic"
                                price="$29/mo"
                                features={[
                                    "100 GB Storage",
                                    "1 TB Bandwidth",
                                    "720p Transcoding",
                                    "Email Support",
                                ]}
                            />
                            <PricingCard
                                title="Pro"
                                price="$99/mo"
                                features={[
                                    "500 GB Storage",
                                    "5 TB Bandwidth",
                                    "1080p Transcoding",
                                    "Priority Support",
                                ]}
                            />
                            <PricingCard
                                title="Enterprise"
                                price="Custom"
                                features={[
                                    "Unlimited Storage",
                                    "Unlimited Bandwidth",
                                    "4K Transcoding",
                                    "24/7 Phone Support",
                                ]}
                            />
                        </div>
                    </div>
                </section>

                <section id="about" className="py-20 px-6 bg-gray-800">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-light mb-6">
                            About the Developer
                        </h2>
                        <p className="text-xl text-gray-400 mb-8 font-light">
                            StreamForge is developed by a passionate software
                            engineer dedicated to creating efficient video
                            streaming solutions. Connect with me to learn more
                            about this project or discuss potential
                            collaborations.
                        </p>
                        <div className="flex justify-center space-x-6">
                            <a
                                href="https://www.linkedin.com/in/yourusername"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-gray-100 rounded-full font-light hover:bg-blue-700 transition-colors"
                            >
                                <Linkedin className="w-5 h-5 mr-2" />
                                LinkedIn
                            </a>
                            <a
                                href="https://github.com/anshraiyani"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-gray-700 text-gray-100 rounded-full font-light hover:bg-gray-600 transition-colors"
                            >
                                <Github className="w-5 h-5 mr-2" />
                                GitHub
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-gray-800 py-8 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
                    <div className="text-gray-400 mb-4 md:mb-0 font-light">
                        © 2023 StreamForge. All rights reserved.
                    </div>
                    <nav>
                        <ul className="flex space-x-6">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-gray-100 transition-colors font-light"
                                >
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-gray-100 transition-colors font-light"
                                >
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
