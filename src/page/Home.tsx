import React from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  FileText, 
  Download, 
  Zap, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Sparkles className="text-pink-400" size={32} />,
      title: 'AI-Powered Enhancement',
      description: 'Enhance your resume with AI to make it more professional and impactful'
    },
    {
      icon: <FileText className="text-blue-400" size={32} />,
      title: 'Professional Templates',
      description: 'Choose from beautifully designed templates that stand out'
    },
    {
      icon: <Download className="text-green-400" size={32} />,
      title: 'Easy PDF Export',
      description: 'Download your resume as a high-quality PDF with one click'
    },
    {
      icon: <Zap className="text-yellow-400" size={32} />,
      title: 'Quick & Easy',
      description: 'Create a professional resume in minutes, not hours'
    },
    {
      icon: <Shield className="text-purple-400" size={32} />,
      title: 'Secure & Private',
      description: 'Your data is encrypted and stored securely'
    },
    {
      icon: <Clock className="text-orange-400" size={32} />,
      title: 'Save & Edit Anytime',
      description: 'Access your resumes from anywhere and edit them anytime'
    }
  ];

  const benefits = [
    'Stand out from other candidates',
    'Save time with AI-powered suggestions',
    'Professional formatting guaranteed',
    'Multiple resume versions for different jobs',
    'Track your resume history',
    'Mobile-friendly interface'
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Create Your Perfect Resume
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Build a professional resume in minutes with our AI-powered builder. 
              Stand out from the crowd and land your dream job.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-blue-500 hover:opacity-90 text-white shadow-lg text-lg px-8 py-6"
                onClick={() => navigate('/builder')}
              >
                Create Resume Now
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 hover:bg-white/10 text-white text-lg px-8 py-6"
                onClick={() => navigate('/history')}
              >
                View My Resumes
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all hover:scale-105"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
                Why Choose Us?
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4"
                >
                  <CheckCircle className="text-green-400 flex-shrink-0" size={24} />
                  <span className="text-white text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-pink-500/20 to-blue-500/20 backdrop-blur-xl border border-white/10 rounded-2xl p-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of professionals who have created their perfect resume
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-blue-500 hover:opacity-90 text-white shadow-lg text-lg px-10 py-6"
              onClick={() => navigate('/builder')}
            >
              Create Your Resume Now
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};
