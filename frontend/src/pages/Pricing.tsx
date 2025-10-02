/**
 * Pricing Page with Stripe Integration
 * Author: Ali Sohel <avesohel@gmail.com>
 */
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Check } from "lucide-react";
import toast from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const plans = [
  {
    name: "Free",
    price: 0,
    priceId: null,
    features: [
      "1 YouTube channel",
      "25 auto-responses/month",
      "3 video transcriptions/month",
      "Basic templates",
      "Community support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: 49,
    priceId: "price_pro_monthly",
    features: [
      "5 YouTube channels",
      "500 auto-responses/month",
      "50 video transcriptions/month",
      "Custom templates",
      "Sentiment analysis",
      "Email support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Business",
    price: 149,
    priceId: "price_business_monthly",
    features: [
      "Unlimited channels",
      "2,500 auto-responses/month",
      "250 video transcriptions/month",
      "White-label branding",
      "Team collaboration",
      "Priority support",
      "Advanced analytics",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
];

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string | null, planName: string) => {
    if (!priceId) {
      window.location.href = "/signup";
      return;
    }

    setLoading(planName);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ priceId }),
      });

      const { sessionId } = await response.json();

      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({ sessionId });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to start checkout");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Start free, upgrade as you grow. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-xl p-8 ${
                plan.popular ? "ring-4 ring-indigo-500 transform scale-105" : ""
              }`}>
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.priceId, plan.name)}
                disabled={loading === plan.name}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                } disabled:opacity-50`}>
                {loading === plan.name ? "Loading..." : plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
