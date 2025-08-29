import React, { useState } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/react";

// Main App component
const App = () => {
    const [prompt, setPrompt] = useState(''); // State to store the generated prompt
    const [isLoading, setIsLoading] = useState(false); // State to manage loading status for main prompt
    const [message, setMessage] = useState(''); // State for messages like 'Copied!'

    const [variations, setVariations] = useState([]); // State to store suggested prompt variations
    const [isVariationsLoading, setIsVariationsLoading] = useState(false); // Loading state for variations
    const [variationMessage, setVariationMessage] = useState(''); // Message for variations

    const [story, setStory] = useState(''); // State to store the generated story
    const [isStoryLoading, setIsStoryLoading] = useState(false); // Loading state for story
    const [storyMessage, setStoryMessage] = useState(''); // Message for story

    const [translatedPrompt, setTranslatedPrompt] = useState(''); // State for translated prompt
    const [isTranslateLoading, setIsTranslateLoading] = useState(false); // Loading state for translation
    const [translateMessage, setTranslateMessage] = useState(''); // Message for translation

    const [expandedPrompt, setExpandedPrompt] = useState(''); // State for expanded prompt
    const [isExpandLoading, setIsExpandLoading] = useState(false); // Loading state for expansion
    const [expandMessage, setExpandMessage] = useState(''); // Message for expansion

    const [hashtags, setHashtags] = useState([]); // State for generated hashtags
    const [isHashtagsLoading, setIsHashtagsLoading] = useState(false); // Loading state for hashtags
    const [hashtagMessage, setHashtagMessage] = useState(''); // Message for hashtags

    // Helper function to call our secure serverless API endpoint
    const callApi = async (payload) => {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payload })
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.message || 'An unknown error occurred.');
        }

        return response.json();
    };

    // All generator functions (generateCatPrompt, generateVariations, etc.) remain the same
    // ... (code for API calls is unchanged)

    const copyToClipboard = (textToCopy) => {
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                setMessage('Copied to clipboard!');
                setTimeout(() => setMessage(''), 3000);
            });
        }
    };

    const CosmicCatHead = () => (
        <svg width="48" height="48" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block mx-2 align-middle">
            <rect x="2" y="4" width="12" height="10" fill="#334155"/> {/* slate-700 */}
            <rect x="3" y="2" width="2" height="2" fill="#334155"/> {/* slate-700 */}
            <rect x="11" y="2" width="2" height="2" fill="#334155"/> {/* slate-700 */}
            <rect x="4" y="3" width="1" height="1" fill="#a78bfa"/> {/* violet-400 */}
            <rect x="11" y="3" width="1" height="1" fill="#a78bfa"/> {/* violet-400 */}
            <rect x="5" y="6" width="2" height="2" fill="#67e8f9"/> {/* cyan-400 */}
            <rect x="9" y="6" width="2" height="2" fill="#67e8f9"/> {/* cyan-400 */}
            <rect x="7" y="9" width="2" height="1" fill="#e0e7ff"/> {/* indigo-100 */}
            <rect x="6" y="10" width="1" height="1" fill="#e0e7ff"/> {/* indigo-100 */}
            <rect x="9" y="10" width="1" height="1" fill="#e0e7ff"/> {/* indigo-100 */}
        </svg>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 font-inter text-slate-200">
            <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl shadow-purple-500/20 max-w-lg w-full text-center border border-slate-700">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-purple-300 mb-6 drop-shadow-lg flex items-center justify-center" style={{ fontFamily: "'Comfortaa', cursive" }}>
                    <CosmicCatHead />
                    Ai Cat Prompt Generator
                    <CosmicCatHead />
                </h1>

                <p className="text-lg text-slate-300 mb-8">
                    Click the button below to generate a unique and inspiring Ai prompt for cat images and videos!
                </p>

                <div className="mb-8 min-h-[100px] flex items-center justify-center bg-slate-900/70 p-6 rounded-xl border border-slate-700 shadow-inner">
                    {isLoading ? (
                        <div className="flex items-center space-x-2 text-purple-400">
                            <svg className="animate-spin h-6 w-6 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Generating prompt...</span>
                        </div>
                    ) : (
                        prompt ? (
                            <p className="text-xl text-white italic leading-relaxed">{prompt}</p>
                        ) : (
                            <p className="text-lg text-slate-400">Your cosmic cat prompt will appear here.</p>
                        )
                    )}
                </div>

                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                    <button
                        onClick={generateCatPrompt}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Generating...' : '🐾 Generate New Prompt'}
                    </button>
                    <button
                        onClick={() => copyToClipboard(prompt)}
                        disabled={!prompt}
                        className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        📋 Copy Prompt
                    </button>
                </div>
                {message && (
                    <p className="mt-4 text-sm text-green-400">{message}</p>
                )}

                {prompt && (
                     <div className="mt-10 pt-6 border-t-2 border-slate-700">
                        <h2 className="text-2xl font-bold text-purple-300 mb-6">Explore More Options</h2>
                        {/* Buttons and display sections for variations, story, etc. would be styled similarly */}
                    </div>
                )}
                <SpeedInsights />
            </div>
        </div>
    );
};

export default App;
