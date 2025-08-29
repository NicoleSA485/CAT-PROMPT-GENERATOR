import React, { useState } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/react";

// Main App component
const App = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [variations, setVariations] = useState([]);
    const [isVariationsLoading, setIsVariationsLoading] = useState(false);
    const [variationMessage, setVariationMessage] = useState('');
    const [story, setStory] = useState('');
    const [isStoryLoading, setIsStoryLoading] = useState(false);
    const [storyMessage, setStoryMessage] = useState('');
    const [translatedPrompt, setTranslatedPrompt] = useState('');
    const [isTranslateLoading, setIsTranslateLoading] = useState(false);
    const [translateMessage, setTranslateMessage] = useState('');
    const [expandedPrompt, setExpandedPrompt] = useState('');
    const [isExpandLoading, setIsExpandLoading] = useState(false);
    const [expandMessage, setExpandMessage] = useState('');
    const [hashtags, setHashtags] = useState([]);
    const [isHashtagsLoading, setIsHashtagsLoading] = useState(false);
    const [hashtagMessage, setHashtagMessage] = useState('');

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
        const userPrompt = `Generate a highly detailed, imaginative, and Ai-friendly cat prompt for image and video generation...`;
        const payload = { contents: [{ role: "user", parts: [{ text: userPrompt }] }] };
        try {
            const result = await callApi(payload);
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                setPrompt(result.candidates[0].content.parts[0].text);
            } else {
                setMessage('Failed to generate prompt. Please try again.');
            }
        } catch (error) {
            setMessage(`An error occurred: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const generateVariations = async () => {
        if (!prompt) return;
        setIsVariationsLoading(true);
        setVariations([]);
        setVariationMessage('');
        const userPrompt = `Given the following Ai cat prompt: "${prompt}", generate 3 distinct variations...`;
        const payload = { contents: [{ role: "user", parts: [{ text: userPrompt }] }], generationConfig: { responseMimeType: "application/json", responseSchema: { type: "ARRAY", items: { "type": "STRING" } } } };
        try {
            const result = await callApi(payload);
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                const jsonText = result.candidates[0].content.parts[0].text;
                setVariations(JSON.parse(jsonText));
            } else {
                setVariationMessage('Failed to generate variations.');
            }
        } catch (error) {
            setVariationMessage(`An error occurred: ${error.message}`);
        } finally {
            setIsVariationsLoading(false);
        }
    };

    const generateStory = async () => {
        if (!prompt) return;
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

    const expandPrompt = async () => {
        if (!prompt) return;
        setIsExpandLoading(true);
        setExpandedPrompt('');
        setExpandMessage('');
        const userPrompt = `Expand and elaborate on the following Ai image prompt...: "${prompt}"`;
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

    const generateHashtags = async () => {
        if (!prompt) return;
        setIsHashtagsLoading(true);
        setHashtags([]);
        setHashtagMessage('');
        const userPrompt = `Generate 5-7 relevant hashtags...: "${prompt}"`;
        const payload = { contents: [{ role: "user", parts: [{ text: userPrompt }] }], generationConfig: { responseMimeType: "application/json", responseSchema: { type: "ARRAY", items: { "type": "STRING" } } } };
        try {
            const result = await callApi(payload);
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                const jsonText = result.candidates[0].content.parts[0].text;
                setHashtags(JSON.parse(jsonText).map(tag => `#${tag.replace(/[^a-zA-Z0-9]/g, '')}`));
            } else {
                setHashtagMessage('Failed to generate hashtags.');
            }
        } catch (error) {
            setHashtagMessage(`An error occurred: ${error.message}`);
        } finally {
            setIsHashtagsLoading(false);
        }
    };

    const translatePrompt = async () => {
        if (!prompt) return;
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

    const copyToClipboard = (textToCopy) => {
        if (textToCopy) navigator.clipboard.writeText(textToCopy).then(() => setMessage('Copied!'));
    };

    const CosmicCatHead = () => (
        <svg width="48" height="48" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block mx-2 align-middle">
            <rect x="2" y="4" width="12" height="10" fill="#334155"/>
            <rect x="3" y="2" width="2" height="2" fill="#334155"/>
            <rect x="11" y="2" width="2" height="2" fill="#334155"/>
            <rect x="4" y="3" width="1" height="1" fill="#a78bfa"/>
            <rect x="11" y="3" width="1" height="1" fill="#a78bfa"/>
            <rect x="5" y="6" width="2" height="2" fill="#67e8f9"/>
            <rect x="9" y="6" width="2" height="2" fill="#67e8f9"/>
            <rect x="7" y="9" width="2" height="1" fill="#e0e7ff"/>
            <rect x="6" y="10" width="1" height="1" fill="#e0e7ff"/>
            <rect x="9" y="10" width="1" height="1" fill="#e0e7ff"/>
        </svg>
    );

    const ActionButton = ({ onClick, isLoading, disabled, children, className }) => (
        <button onClick={onClick} disabled={isLoading || disabled} className={`w-full font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed mb-4 ${className}`}>
            {isLoading ? 'Loading...' : children}
        </button>
    );

    const ResultCard = ({ title, children }) => (
        <div className="bg-slate-900/70 p-6 rounded-xl border border-slate-700 shadow-inner text-left mb-6">
            <h3 className="text-lg font-semibold text-purple-300 mb-3">{title}</h3>
            {children}
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 font-inter text-slate-200">
            <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl shadow-purple-500/20 max-w-lg w-full text-center border border-slate-700">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-purple-300 mb-6 drop-shadow-lg flex items-center justify-center" style={{ fontFamily: "'Comfortaa', cursive" }}>
                    <CosmicCatHead /> Ai Cat Prompt Generator <CosmicCatHead />
                </h1>
                <p className="text-lg text-slate-300 mb-8">Click the button to generate a unique and inspiring Ai prompt for your next creation!</p>
                
                <div className="mb-8 min-h-[100px] flex items-center justify-center bg-slate-900/70 p-6 rounded-xl border border-slate-700 shadow-inner">
                    {isLoading ? <span className="text-purple-400">Generating...</span> : (prompt ? <p className="text-xl text-white italic leading-relaxed">{prompt}</p> : <p className="text-lg text-slate-400">Your cosmic cat prompt will appear here.</p>)}
                </div>

                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                    <button onClick={generateCatPrompt} disabled={isLoading} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? 'Generating...' : '🐾 Generate New Prompt'}
                    </button>
                    <button onClick={() => copyToClipboard(prompt)} disabled={!prompt} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-slate-400 disabled:opacity-50 disabled:cursor-not-allowed">
                        📋 Copy Prompt
                    </button>
                </div>
                {message && <p className="mt-4 text-sm text-green-400">{message}</p>}

                {prompt && (
                    <div className="mt-10 pt-6 border-t-2 border-slate-700">
                        <h2 className="text-2xl font-bold text-purple-300 mb-6">Explore More Options</h2>
                        
                        <ActionButton onClick={generateVariations} isLoading={isVariationsLoading} disabled={!prompt} className="bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-400">💡 Suggest Variations</ActionButton>
                        {variations.length > 0 && <ResultCard title="Prompt Variations:"><ul className="list-disc list-inside space-y-2 text-slate-300">{variations.map((v, i) => <li key={i}>{v}</li>)}</ul></ResultCard>}
                        {variationMessage && <p className="mt-2 text-sm text-red-500">{variationMessage}</p>}

                        <ActionButton onClick={generateStory} isLoading={isStoryLoading} disabled={!prompt} className="bg-teal-600 hover:bg-teal-700 focus:ring-teal-400">📖 Generate Story</ActionButton>
                        {story && <ResultCard title="The Cat's Tale:"><p className="text-slate-300 italic leading-relaxed">{story}</p></ResultCard>}
                        {storyMessage && <p className="mt-2 text-sm text-red-500">{storyMessage}</p>}

                        <ActionButton onClick={expandPrompt} isLoading={isExpandLoading} disabled={!prompt} className="bg-sky-600 hover:bg-sky-700 focus:ring-sky-400">➕ Expand Prompt</ActionButton>
                        {expandedPrompt && <ResultCard title="Expanded Prompt:"><p className="text-slate-300 italic leading-relaxed">{expandedPrompt}</p></ResultCard>}
                        {expandMessage && <p className="mt-2 text-sm text-red-500">{expandMessage}</p>}

                        <ActionButton onClick={generateHashtags} isLoading={isHashtagsLoading} disabled={!prompt} className="bg-rose-600 hover:bg-rose-700 focus:ring-rose-400">🏷️ Generate Hashtags</ActionButton>
                        {hashtags.length > 0 && <ResultCard title="Suggested Hashtags:"><p className="text-slate-300 italic leading-relaxed">{hashtags.join(' ')}</p></ResultCard>}
                        {hashtagMessage && <p className="mt-2 text-sm text-red-500">{hashtagMessage}</p>}

                        <ActionButton onClick={translatePrompt} isLoading={isTranslateLoading} disabled={!prompt} className="bg-slate-600 hover:bg-slate-700 focus:ring-slate-400">🌐 Translate to Japanese</ActionButton>
                        {translatedPrompt && <ResultCard title="Translated Prompt:"><p className="text-slate-300 italic leading-relaxed">{translatedPrompt}</p></ResultCard>}
                        {translateMessage && <p className="mt-2 text-sm text-red-500">{translateMessage}</p>}
                    </div>
                )}
                <SpeedInsights />
            </div>
        </div>
    );
};

export default App;