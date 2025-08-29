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

    // Function to generate an Ai-friendly cat prompt
    const generateCatPrompt = async () => {
        setIsLoading(true);
        setMessage('');
        setPrompt('');
        setVariations([]);
        setStory('');
        setTranslatedPrompt('');
        setExpandedPrompt('');
        setHashtags([]);
        setVariationMessage('');
        setStoryMessage('');
        setTranslateMessage('');
        setExpandMessage('');
        setHashtagMessage('');

        const userPrompt = `Generate a highly detailed, imaginative, and Ai-friendly cat prompt for image and video generation...`; // (prompt content omitted for brevity)
        const payload = { contents: [{ role: "user", parts: [{ text: userPrompt }] }] };

        try {
            const result = await callApi(payload);
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                setPrompt(result.candidates[0].content.parts[0].text);
            } else {
                console.error('Unexpected Ai response structure:', result);
                setMessage('Failed to generate prompt. Please try again.');
            }
        } catch (error) {
            console.error('Error generating prompt:', error);
            setMessage(`An error occurred: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to generate prompt variations
    const generateVariations = async () => {
        if (!prompt) {
            setVariationMessage('Please generate a main prompt first.');
            return;
        }
        setIsVariationsLoading(true);
        setVariations([]);
        setVariationMessage('');

        const userPrompt = `Given the following Ai cat prompt: "${prompt}"...`; // (prompt content omitted for brevity)
        const payload = {
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            generationConfig: { responseMimeType: "application/json", responseSchema: { type: "ARRAY", items: { "type": "STRING" } } }
        };

        try {
            const result = await callApi(payload);
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                const jsonText = result.candidates[0].content.parts[0].text;
                try {
                    const parsedVariations = JSON.parse(jsonText);
                    setVariations(parsedVariations);
                } catch (e) {
                    setVariationMessage('Invalid response format. Please try again.');
                }
            } else {
                setVariationMessage('Failed to generate variations.');
            }
        } catch (error) {
            setVariationMessage(`An error occurred: ${error.message}`);
        } finally {
            setIsVariationsLoading(false);
        }
    };

    // Function to generate a short story
    const generateStory = async () => {
        if (!prompt) {
            setStoryMessage('Please generate a main prompt first.');
            return;
        }
        setIsStoryLoading(true);
        setStory('');
        setStoryMessage('');

        const userPrompt = `Write a short, imaginative, and engaging story (around 3-5 sentences) based on the following Ai cat prompt: "${prompt}"`;
        const payload = { contents: [{ role: "user", parts: [{ text: userPrompt }] }] };

        try {
            const result = await callApi(payload);
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                setStory(result.candidates[0].content.parts[0].text);
            } else {
                setStoryMessage('Failed to generate story.');
            }
        } catch (error) {
            setStoryMessage(`An error occurred: ${error.message}`);
        } finally {
            setIsStoryLoading(false);
        }
    };

    // Function to translate the prompt
    const translatePrompt = async () => {
        if (!prompt) {
            setTranslateMessage('Please generate a main prompt first.');
            return;
        }
        setIsTranslateLoading(true);
        setTranslatedPrompt('');
        setTranslateMessage('');

        const userPrompt = `Translate the following Ai image prompt into Japanese: "${prompt}"`;
        const payload = { contents: [{ role: "user", parts: [{ text: userPrompt }] }] };

        try {
            const result = await callApi(payload);
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                setTranslatedPrompt(result.candidates[0].content.parts[0].text);
            } else {
                setTranslateMessage('Failed to translate prompt.');
            }
        } catch (error) {
            setTranslateMessage(`An error occurred: ${error.message}`);
        } finally {
            setIsTranslateLoading(false);
        }
    };

    // Function to expand the prompt
    const expandPrompt = async () => {
        if (!prompt) {
            setExpandMessage('Please generate a main prompt first.');
            return;
        }
        setIsExpandLoading(true);
        setExpandedPrompt('');
        setExpandMessage('');

        const userPrompt = `Expand and elaborate on the following Ai image prompt, adding more descriptive details, elements, and potential artistic modifiers. Make it significantly longer and richer: "${prompt}"`;
        const payload = { contents: [{ role: "user", parts: [{ text: userPrompt }] }] };

        try {
            const result = await callApi(payload);
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                setExpandedPrompt(result.candidates[0].content.parts[0].text);
            } else {
                setExpandMessage('Failed to expand prompt.');
            }
        } catch (error) {
            setExpandMessage(`An error occurred: ${error.message}`);
        } finally {
            setIsExpandLoading(false);
        }
    };

    // Function to generate hashtags
    const generateHashtags = async () => {
        if (!prompt) {
            setHashtagMessage('Please generate a main prompt first.');
            return;
        }
        setIsHashtagsLoading(true);
        setHashtags([]);
        setHashtagMessage('');

        const userPrompt = `Generate 5-7 relevant and popular hashtags for social media based on the following Ai image prompt: "${prompt}". Provide them as a JSON array of strings.`;
        const payload = {
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            generationConfig: { responseMimeType: "application/json", responseSchema: { type: "ARRAY", items: { "type": "STRING" } } }
        };

        try {
            const result = await callApi(payload);
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                const jsonText = result.candidates[0].content.parts[0].text;
                try {
                    const parsedHashtags = JSON.parse(jsonText);
                    setHashtags(parsedHashtags.map(tag => `#${tag.replace(/[^a-zA-Z0-9]/g, '')}`));
                } catch (e) {
                    setHashtagMessage('Invalid response format. Please try again.');
                }
            } else {
                setHashtagMessage('Failed to generate hashtags.');
            }
        } catch (error) {
            setHashtagMessage(`An error occurred: ${error.message}`);
        } finally {
            setIsHashtagsLoading(false);
        }
    };

    // Function to copy text to the clipboard
    const copyToClipboard = (textToCopy) => {
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                setMessage('Copied to clipboard!');
                setTimeout(() => setMessage(''), 3000);
            }, (err) => {
                console.error('Could not copy text: ', err);
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = textToCopy;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                setMessage('Copied to clipboard!');
                setTimeout(() => setMessage(''), 3000);
            });
        }
    };

    const PixelCatHead = () => (
        <svg width="48" height="48" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block mx-2 align-middle">
            <rect x="2" y="4" width="12" height="10" fill="#a8a29e"/>
            <rect x="3" y="2" width="2" height="2" fill="#a8a29e"/>
            <rect x="11" y="2" width="2" height="2" fill="#a8a29e"/>
            <rect x="4" y="3" width="1" height="1" fill="#d6d3d1"/>
            <rect x="11" y="3" width="1" height="1" fill="#d6d3d1"/>
            <rect x="5" y="6" width="2" height="2" fill="#78350f"/>
            <rect x="9" y="6" width="2" height="2" fill="#78350f"/>
            <rect x="7" y="9" width="2" height="1" fill="#57534e"/>
            <rect x="6" y="10" width="1" height="1" fill="#57534e"/>
            <rect x="9" y="10" width="1" height="1" fill="#57534e"/>
        </svg>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-amber-100 p-4 font-inter">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center border-4 border-amber-300">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-amber-800 mb-6 drop-shadow-md flex items-center justify-center" style={{ fontFamily: "'Comfortaa', cursive" }}>
                    <PixelCatHead />
                    Ai Cat Prompt Generator
                    <PixelCatHead />
                </h1>
                <p className="text-lg text-gray-700 mb-8">
                    Click the button below to generate a unique and inspiring Ai prompt for cat images and videos!
                </p>

                {/* Main Prompt Section */}
                <div className="mb-8 min-h-[100px] flex items-center justify-center bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner">
                    {isLoading ? (
                        <div className="flex items-center space-x-2 text-amber-500">
                            <svg className="animate-spin h-6 w-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Generating prompt...</span>
                        </div>
                    ) : (
                        prompt ? (
                            <p className="text-xl text-gray-800 italic leading-relaxed">{prompt}</p>
                        ) : (
                            <p className="text-lg text-gray-500">Your Ai cat prompt will appear here.</p>
                        )
                    )}
                </div>

                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                    <button
                        onClick={generateCatPrompt}
                        disabled={isLoading}
                        className="bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-amber-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Generating...' : '🐾 Generate New Prompt'}
                    </button>
                    <button
                        onClick={() => copyToClipboard(prompt)}
                        disabled={!prompt}
                        className="bg-stone-500 hover:bg-stone-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-stone-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        📋 Copy Prompt
                    </button>
                </div>
                {message && (
                    <p className="mt-4 text-sm text-gray-600">{message}</p>
                )}

                {/* Additional LLM Features Section */}
                {prompt && (
                    <div className="mt-10 pt-6 border-t-2 border-stone-200">
                        <h2 className="text-2xl font-bold text-amber-700 mb-6">Explore More Options</h2>

                        {/* Suggest Variations Button */}
                        <button
                            onClick={generateVariations}
                            disabled={isVariationsLoading || isLoading || !prompt}
                            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                        >
                            {isVariationsLoading ? 'Suggesting Variations...' : '💡 Suggest Variations'}
                        </button>

                        {/* Variations Display */}
                        {isVariationsLoading ? (
                            <div className="flex items-center justify-center space-x-2 text-gray-500 my-4">
                                <svg className="animate-spin h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Generating variations...</span>
                            </div>
                        ) : (
                            variations.length > 0 && (
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner mb-6 text-left">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Prompt Variations:</h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                                        {variations.map((v, index) => (
                                            <li key={index} className="flex justify-between items-start">
                                                <span className="flex-1 pr-2">{v}</span>
                                                <button
                                                    onClick={() => copyToClipboard(v)}
                                                    className="text-sm text-gray-500 hover:underline ml-2 flex-shrink-0"
                                                >
                                                    📋 Copy
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        )}
                        {variationMessage && (
                            <p className="mt-2 text-sm text-red-500">{variationMessage}</p>
                        )}

                        {/* Generate Story Button */}
                        <button
                            onClick={generateStory}
                            disabled={isStoryLoading || isLoading || !prompt}
                            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                        >
                            {isStoryLoading ? 'Generating Story...' : '📖 Generate Story'}
                        </button>

                        {/* Story Display */}
                        {isStoryLoading ? (
                            <div className="flex items-center justify-center space-x-2 text-emerald-500 my-4">
                                <svg className="animate-spin h-6 w-6 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Crafting story...</span>
                            </div>
                        ) : (
                            story && (
                                <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200 shadow-inner text-left mb-6">
                                    <h3 className="text-lg font-semibold text-emerald-700 mb-3">The Cat's Tale:</h3>
                                    <p className="text-gray-800 italic leading-relaxed">{story}</p>
                                </div>
                            )
                        )}
                        {storyMessage && (
                            <p className="mt-2 text-sm text-red-500">{storyMessage}</p>
                        )}

                        {/* Expand Prompt Button */}
                        <button
                            onClick={expandPrompt}
                            disabled={isExpandLoading || isLoading || !prompt}
                            className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-amber-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                        >
                            {isExpandLoading ? 'Expanding...' : '➕ Expand Prompt'}
                        </button>

                        {/* Expanded Prompt Display */}
                        {isExpandLoading ? (
                            <div className="flex items-center justify-center space-x-2 text-amber-500 my-4">
                                <svg className="animate-spin h-6 w-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Expanding prompt...</span>
                            </div>
                        ) : (
                            expandedPrompt && (
                                <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 shadow-inner text-left">
                                    <h3 className="text-lg font-semibold text-amber-700 mb-3">Expanded Prompt:</h3>
                                    <p className="text-gray-800 italic leading-relaxed">{expandedPrompt}</p>
                                    <button
                                        onClick={() => copyToClipboard(expandedPrompt)}
                                        className="text-sm text-slate-500 hover:underline mt-3"
                                    >
                                        📋 Copy Expanded Prompt
                                    </button>
                                </div>
                            )
                        )}
                        {expandMessage && (
                            <p className="mt-2 text-sm text-red-500">{expandMessage}</p>
                        )}

                        {/* Generate Hashtags Button */}
                        <button
                            onClick={generateHashtags}
                            disabled={isHashtagsLoading || isLoading || !prompt}
                            className="w-full bg-orange-700 hover:bg-orange-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-orange-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                        >
                            {isHashtagsLoading ? 'Generating Hashtags...' : '🏷️ Generate Hashtags'}
                        </button>

                        {/* Hashtags Display */}
                        {isHashtagsLoading ? (
                            <div className="flex items-center justify-center space-x-2 text-orange-500 my-4">
                                <svg className="animate-spin h-6 w-6 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Generating hashtags...</span>
                            </div>
                        ) : (
                            hashtags.length > 0 && (
                                <div className="bg-orange-50 p-6 rounded-xl border border-orange-200 shadow-inner text-left mb-6">
                                    <h3 className="text-lg font-semibold text-orange-700 mb-3">Suggested Hashtags:</h3>
                                    <p className="text-gray-800 italic leading-relaxed">{hashtags.join(' ')}</p>
                                    <button
                                        onClick={() => copyToClipboard(hashtags.join(' '))}
                                        className="text-sm text-gray-500 hover:underline mt-3"
                                    >
                                        📋 Copy Hashtags
                                    </button>
                                </div>
                            )
                        )}
                        {hashtagMessage && (
                            <p className="mt-2 text-sm text-red-500">{hashtagMessage}</p>
                        )}


                        {/* Translate Prompt Button */}
                        <button
                            onClick={translatePrompt}
                            disabled={isTranslateLoading || isLoading || !prompt}
                            className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                        >
                            {isTranslateLoading ? 'Translating...' : '🌐 Translate Prompt (Japanese)'}
                        </button>

                        {/* Translated Prompt Display */}
                        {isTranslateLoading ? (
                            <div className="flex items-center justify-center space-x-2 text-slate-500 my-4">
                                <svg className="animate-spin h-6 w-6 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Translating prompt...</span>
                            </div>
                        ) : (
                            translatedPrompt && (
                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner text-left mb-6">
                                    <h3 className="text-lg font-semibold text-slate-700 mb-3">Translated Prompt:</h3>
                                    <p className="text-gray-800 italic leading-relaxed">{translatedPrompt}</p>
                                    <button
                                        onClick={() => copyToClipboard(translatedPrompt)}
                                        className="text-sm text-slate-500 hover:underline mt-3"
                                    >
                                        📋 Copy Translated Prompt
                                    </button>
                                </div>
                            )
                        )}
                        {translateMessage && (
                            <p className="mt-2 text-sm text-red-500">{translateMessage}</p>
                        )}

                    </div>
                )}
                 <SpeedInsights />
            </div>
        </div>
    );
};

export default App;