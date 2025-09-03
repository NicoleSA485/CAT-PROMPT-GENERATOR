import React, { useState } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

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

    const resetState = () => {
        setPrompt('');
        setVariations([]);
        setStory('');
        setTranslatedPrompt('');
        setExpandedPrompt('');
        setHashtags([]);
        setMessage('');
        setVariationMessage('');
        setStoryMessage('');
        setTranslateMessage('');
        setExpandMessage('');
        setHashtagMessage('');
    };

    const generateCatPrompt = async () => {
        setIsLoading(true);
        resetState();

        const userPrompt = `Generate a highly detailed, imaginative, and Ai-friendly cat prompt for image and video generation.
        Focus on descriptive adjectives, actions, environments, and specific stylistic elements.
        The prompt should be suitable for generating diverse and creative cat imagery.
        Include elements like:
        - Cat's breed, color, or unique markings
        - Its expression or emotion
        - An action it's performing
        - The setting or environment
        - Lighting conditions
        - Artistic style (e.g., cyberpunk, watercolor, realistic, fantasy)
        - Camera angle or shot type (e.g., close-up, wide shot)

        Examples:
        - "A majestic fluffy Ragdoll cat with sapphire eyes, gracefully leaping through a sunlit field of lavender, hyperrealistic, golden hour, wide shot."
        - "A mischievous black Scottish Fold kitten, playfully batting at a glowing pixelated butterfly in a neon-lit cyberpunk alley, low angle, digital art, vibrant colors."
        - "An ancient, wise Siamese cat, meditating atop a snow-capped mountain peak under a starry night sky, mystical, highly detailed, dramatic lighting."
        - "A cute ginger tabby cat wearing a tiny wizard hat, casting a sparkling spell from a spellbook in a cozy, magical library, enchanted, soft lighting, depth of field."

        Generate only one prompt.`;

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
        }
        finally {
            setIsLoading(false);
        }
    };

    const generateVariations = async () => {
        if (!prompt) return;
        setIsVariationsLoading(true);
        setVariations([]);
        setVariationMessage('');
        const userPrompt = `Given the following Ai cat prompt: "${prompt}"
        
        Generate 3 distinct variations of this prompt. Each variation should offer a different artistic style, environment, or action, while keeping the core subject (a cat) consistent. Format the output as a JSON array of strings, where each string is a new prompt variation.
        
        Example:
        [
          "A sleek black cat with glowing emerald eyes, perched on a futuristic skyscraper overlooking a neon-drenched city, cyberpunk art, rainy night, cinematic shot.",
          "A fluffy Persian cat with a whimsical expression, floating amongst oversized glowing mushrooms in an enchanted forest, watercolor painting, soft ethereal light.",
          "An adventurous tabby cat exploring ancient ruins covered in lush vines, realistic, dappled sunlight, wide-angle lens."
        ]`;
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
        }
        finally {
            setIsVariationsLoading(false);
        }
    };

    const generateStory = async () => {
        if (!prompt) return;
        setIsStoryLoading(true);
        setStory('');
        setStoryMessage('');
        const userPrompt = `Write a short, imaginative, and engaging story (around 3-5 sentences) based on the following Ai cat prompt: "${prompt}"
        
        Focus on bringing the cat and its described environment/action to life in a narrative format.`;
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
        }
        finally {
            setIsStoryLoading(false);
        }
    };

    const expandPrompt = async () => {
        if (!prompt) return;
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
        }
        finally {
            setIsExpandLoading(false);
        }
    };

    const generateHashtags = async () => {
        if (!prompt) return;
        setIsHashtagsLoading(true);
        setHashtags([]);
        setHashtagMessage('');
        const userPrompt = `Generate 5-7 relevant and popular hashtags for social media based on the following Ai image prompt: "${prompt}". Provide them as a JSON array of strings.`;
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
        }
        finally {
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
        }
        finally {
            setIsTranslateLoading(false);
        }
    };

    const copyToClipboard = (textToCopy) => {
        if (textToCopy) navigator.clipboard.writeText(textToCopy).then(() => {
            setMessage('Copied!');
            setTimeout(() => setMessage(''), 2000);
        });
    };

    

    const ActionButton = ({ onClick, isLoading, disabled, children, className }) => (
        <button onClick={onClick} disabled={isLoading || disabled} className={`font-bold py-3 px-6 rounded-xl transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed mb-4 uppercase ${className}`}>
            {isLoading ? 'Loading...' : children}
        </button>
    );

    const ResultCard = ({ title, children, textToCopy }) => (
        <div className="bg-slate-900/[0.70] p-4 rounded-xl text-left mb-6 relative">
            <h3 className="text-lg font-semibold text-purple-300 mb-3">{title}</h3>
            <div className="text-slate-300 italic leading-relaxed pr-10">
                {children}
            </div>
            {textToCopy && (
                <button onClick={() => copyToClipboard(textToCopy)} className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </button>
            )}
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 text-slate-200">
            <div className="bg-slate-800/[0.50] backdrop-blur-xl p-6 sm:p-8 rounded-2xl max-w-2xl w-full text-center">
                <h1 className="text-3xl sm:text-5xl font-extrabold text-purple-300 mb-6 drop-shadow-lg flex items-center justify-center">
                    <img src="/FavIcon.png" alt="Cat Icon" className="inline-block mx-2 align-middle" width="104" height="104" /> Ai Cat Prompt Generator <img src="/FavIcon.png" alt="Cat Icon" className="inline-block mx-2 align-middle" width="104" height="104" />
                </h1>
                <div className="flex justify-center mb-8">
                    <button onClick={generateCatPrompt} disabled={isLoading} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed uppercase">
                        {isLoading ? 'Generating...' : 'Click Button'}
                    </button>
                </div>
                
                
                <div className="mb-8 min-h-[120px] flex items-center justify-center bg-slate-900/[0.70] p-6 rounded-xl relative">
                    {isLoading ? <span className="text-purple-400">Generating...</span> : (prompt ? <p className="text-lg sm:text-xl text-white italic leading-relaxed">{prompt}</p> : <p className="text-lg text-slate-400">Your cosmic cat prompt will appear here.</p>)}
                </div>

                <div className="bg-slate-900/[0.50] p-4 rounded-xl">
                    
                    {prompt && !isLoading && (
                        <div className="inline-block">
                            <button onClick={() => copyToClipboard(prompt)} className="text-slate-400 hover:text-white transition-colors uppercase" style={{ textTransform: 'uppercase' }}>
                                Copy Prompt
                            </button>
                        </div>
                    )}
                </div>
                {message && <p className="mt-4 text-sm text-green-400">{message}</p>}

                {prompt && !isLoading && (
                    <div className="mt-10 pt-6">
                        <h2 className="text-2xl font-bold text-purple-300 mb-6">Explore More Options</h2>
                        
                        <div className="flex flex-wrap justify-center gap-4">
                        <div className="bg-slate-900/[0.50] p-4 rounded-xl">
                            <ActionButton onClick={generateVariations} isLoading={isVariationsLoading} disabled={!prompt} className="bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-400">💡 Suggest Variations</ActionButton>
                        </div>
                        {variations.length > 0 && <ResultCard title="Prompt Variations:" textToCopy={variations.join(`

`)}><ul className="list-none space-y-2">{variations.map((v, i) => <li key={i} className="p-2 bg-slate-800/[0.50] rounded-md">{v}</li>)}</ul></ResultCard>}
                        {variationMessage && <p className="mt-2 text-sm text-red-500">{variationMessage}</p>}

                        <div className="bg-slate-900/[0.50] p-4 rounded-xl">
                            <ActionButton onClick={generateStory} isLoading={isStoryLoading} disabled={!prompt} className="bg-teal-600 hover:bg-teal-700 focus:ring-teal-400">📖 Generate Story</ActionButton>
                        </div>
                        {story && <ResultCard title="The Cat's Tale:" textToCopy={story}><p>{story}</p></ResultCard>}
                        {storyMessage && <p className="mt-2 text-sm text-red-500">{storyMessage}</p>}

                        <div className="bg-slate-900/[0.50] p-4 rounded-xl">
                            <ActionButton onClick={expandPrompt} isLoading={isExpandLoading} disabled={!prompt} className="bg-sky-600 hover:bg-sky-700 focus:ring-sky-400">➕ Expand Prompt</ActionButton>
                        </div>
                        {expandedPrompt && <ResultCard title="Expanded Prompt:" textToCopy={expandedPrompt}><p>{expandedPrompt}</p></ResultCard>}
                        {expandMessage && <p className="mt-2 text-sm text-red-500">{expandMessage}</p>}

                        <div className="bg-slate-900/[0.50] p-4 rounded-xl">
                            <ActionButton onClick={generateHashtags} isLoading={isHashtagsLoading} disabled={!prompt} className="bg-rose-600 hover:bg-rose-700 focus:ring-rose-400">🏷️ Generate Hashtags</ActionButton>
                        </div>
                        {hashtags.length > 0 && <ResultCard title="Suggested Hashtags:" textToCopy={hashtags.join(' ')}><p>{hashtags.join(' ')}</p></ResultCard>}
                        {hashtagMessage && <p className="mt-2 text-sm text-red-500">{hashtagMessage}</p>}

                        <div className="bg-slate-900/[0.50] p-4 rounded-xl">
                            <ActionButton onClick={translatePrompt} isLoading={isTranslateLoading} disabled={!prompt} className="bg-slate-600 hover:bg-slate-700 focus:ring-slate-400">🌐 Translate to Japanese</ActionButton>
                        </div>
                        {translatedPrompt && <ResultCard title="Translated Prompt:" textToCopy={translatedPrompt}><p>{translatedPrompt}</p></ResultCard>}
                        {translateMessage && <p className="mt-2 text-sm text-red-500">{translateMessage}</p>}
                    </div>
                )}
                <Analytics />
                <SpeedInsights />
            </div>
        </div>
    );
};

export default App;