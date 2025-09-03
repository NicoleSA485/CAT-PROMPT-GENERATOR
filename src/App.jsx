import React from 'react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 text-slate-200">
      <div className="bg-slate-800 backdrop-blur-xl p-6 sm:p-8 rounded-2xl max-w-2xl w-full text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-purple-300 mb-6 drop-shadow-lg flex items-center justify-center">
          Ai Cat Prompt Generator
        </h1>
        <Analytics />
        <SpeedInsights />
      </div>
    </div>
  );
};

export default App;
