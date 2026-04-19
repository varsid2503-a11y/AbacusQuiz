import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

// Initialize AI only if API key is available (for server-side or build-time use)
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (error) {
  console.warn("GoogleGenAI initialization skipped: API key not available or running in browser");
}

export async function generateFavicon(): Promise<string | null> {
  if (!ai) {
    console.warn("Favicon generation skipped: API not available");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: 'A professional, minimal high-tech abacus icon, neon teal and purple colors, cyber-zen aesthetic, square composition, flat design, suitable for a favicon, isolated on dark background.',
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Favicon generation failed:", error);
  }
  return null;
}

export async function generateBGM(): Promise<string | null> {
  if (!ai) {
    console.warn("BGM generation skipped: API not available");
    return null;
  }

  try {
    const response = await ai.models.generateContentStream({
      model: "lyria-3-clip-preview",
      contents: 'Create a 30-second zen atmospheric lo-fi track with subtle mechanical click sounds and a soft cyber-synth pad, perfect for deep concentration and mental math.',
    });

    let audioBase64 = "";
    let mimeType = "audio/wav";

    for await (const chunk of response) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
      }
    }

    if (!audioBase64) return null;

    const binary = atob(audioBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("BGM generation failed:", error);
  }
  return null;
}

