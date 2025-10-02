/**
 * Landing/Home Page
 * Author: Ali Sohel <avesohel@gmail.com>
 */
import { Link } from "react-router-dom";
import {
  Youtube,
  Zap,
  Shield,
  TrendingUp,
  Clock,
  MessageSquare,
  Bot,
  Check,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Youtube className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">YTReply</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-indigo-600">
                Features
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-indigo-600">
                Pricing
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-indigo-600">
                How it Works
              </a>
              <Link
                to="/login"
                className="text-gray-700 hover:text-indigo-600">
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Automate Your YouTube Comments with{" "}
              <span className="text-indigo-600">AI</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Save hours every week with intelligent, context-aware auto-replies.
              Engage with your audience 24/7 while focusing on creating great
              content.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition">
                Watch Demo
              </a>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              ✨ Free forever plan available • No credit card required • Cancel
              anytime
            </p>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: "10K+", label: "Comments Replied" },
              { value: "500+", label: "Creators" },
              { value: "95%", label: "Time Saved" },
              { value: "4.9/5", label: "User Rating" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-bold text-indigo-600">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Creators
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to manage YouTube comments effortlessly
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Bot,
                title: "AI-Powered Responses",
                description:
                  "GPT-4 generates contextual replies based on your video content and comment sentiment",
              },
              {
                icon: Zap,
                title: "Real-Time Monitoring",
                description:
                  "Automatically checks for new comments every 5 minutes across all your videos",
              },
              {
                icon: MessageSquare,
                title: "Custom Templates",
                description:
                  "Create and save reply templates that match your brand voice and style",
              },
              {
                icon: Clock,
                title: "Save Hours Weekly",
                description:
                  "Spend less time on repetitive replies, more time creating amazing content",
              },
              {
                icon: Shield,
                title: "Smart Filtering",
                description:
                  "Sentiment analysis ensures appropriate responses for every comment type",
              },
              {
                icon: TrendingUp,
                title: "Analytics Dashboard",
                description:
                  "Track reply stats, engagement rates, and audience sentiment trends",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition">
                <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Connect Your Channel",
                description:
                  "Sign up and connect your YouTube channel with one click using Google OAuth",
              },
              {
                step: "2",
                title: "Add Your Videos",
                description:
                  "Select which videos you want to enable auto-replies for. We'll transcribe them automatically",
              },
              {
                step: "3",
                title: "Let AI Handle It",
                description:
                  "Our AI monitors comments and responds intelligently 24/7 while you focus on content",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative text-center">
                <div className="bg-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-indigo-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade as you grow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                features: [
                  "1 YouTube channel",
                  "25 auto-replies/month",
                  "3 video transcriptions",
                  "Basic templates",
                ],
              },
              {
                name: "Pro",
                price: "$49",
                popular: true,
                features: [
                  "5 YouTube channels",
                  "500 auto-replies/month",
                  "50 transcriptions/month",
                  "Custom templates",
                  "Priority support",
                ],
              },
              {
                name: "Business",
                price: "$149",
                features: [
                  "Unlimited channels",
                  "2,500 replies/month",
                  "250 transcriptions",
                  "White-label branding",
                  "Team collaboration",
                ],
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-2xl shadow-xl p-8 ${
                  plan.popular ? "ring-4 ring-indigo-500 transform scale-105" : ""
                }`}>
                {plan.popular && (
                  <div className="text-center mb-4">
                    <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-center mb-2">
                  {plan.name}
                </h3>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className="block w-full text-center py-3 px-6 rounded-lg font-semibold transition bg-indigo-600 text-white hover:bg-indigo-700">
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Automate Your YouTube Comments?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join hundreds of creators who are saving hours every week
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-4 text-lg font-medium text-indigo-600 bg-white rounded-lg hover:bg-gray-50 transition shadow-lg">
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Youtube className="h-6 w-6 text-indigo-500" />
                <span className="text-xl font-bold text-white">YTReply</span>
              </div>
              <p className="text-sm">
                Automate YouTube comments with AI. Save time, engage more.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-white">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/about" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/privacy" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-white">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
            <p>&copy; 2025 YTReply by Ali Sohel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
