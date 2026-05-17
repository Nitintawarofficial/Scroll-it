import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Assistant: Smart Caption endpoint
  app.post("/api/gemini/enhance-caption", async (req, res) => {
    const { text } = req.body;
    try {
      if (!text) return res.status(400).json({ error: "Text is required" });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Enhance this social media caption to be more engaging, modern, and punchy. Keep it around the same length. Use 1-2 relevant emojis. 
        Caption: "${text}"`,
        config: {
          temperature: 0.8,
        }
      });

      res.json({ enhancedText: response.text });
    } catch (error: any) {
      const isQuotaError = error.message?.includes("RESOURCE_EXHAUSTED") || 
                           error.message?.includes("429") || 
                           error.status === 429 ||
                           error.code === 429;

      if (isQuotaError) {
        console.warn("Gemini Quota Exceeded for enhance-caption");
        return res.status(429).json({ 
          error: "AI Quota reached. The AI is taking a short break. Please try again later.",
          fallback: text 
        });
      }

      console.error("Gemini Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // AI Assistant: Feed Sentiment/Insights
  app.post("/api/gemini/feed-insights", async (req, res) => {
    try {
      const { posts } = req.body;
      const postsText = posts.map((p: any) => p.content).join("\n---\n");

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze these social media posts and provide a 2-sentence 'Vibe Check' for the community trends today. 
        Posts:
        ${postsText}`,
        config: {
          temperature: 0.7,
        }
      });

      res.json({ insights: response.text });
    } catch (error: any) {
      const isQuotaError = error.message?.includes("RESOURCE_EXHAUSTED") || 
                           error.message?.includes("429") || 
                           error.status === 429 ||
                           error.code === 429;

      if (isQuotaError) {
        console.warn("Gemini Quota Exceeded for feed-insights");
        return res.status(429).json({ 
          error: "AI Quota reached. Vibes are currently unanalyzable.",
          insights: "The community is currently experiencing high-energy creative waves. Everyone is sharing their best moments!" 
        });
      }

      console.error("Gemini Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // AI Assistant: Music Search endpoint
  app.post("/api/gemini/search-music", async (req, res) => {
    const { query } = req.body;
    try {
      if (!query) return res.status(400).json({ error: "Query is required" });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Act as a music search engine. Find 10 popular songs that match this search query: "${query}". 
        Return the results as a JSON array of objects, where each object has:
        - name: string (song title)
        - artist: string (artist name)
        - id: string (unique identifier)
        
        ONLY return the JSON array.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                artist: { type: Type.STRING },
              },
              required: ["id", "name", "artist"],
            },
          }
        }
      });

      const tracks = JSON.parse(response.text || "[]");
      res.json({ tracks });
    } catch (error: any) {
      const isQuotaError = error.message?.includes("RESOURCE_EXHAUSTED") || 
                           error.message?.includes("429") || 
                           error.status === 429 ||
                           error.code === 429;

      if (isQuotaError) {
        console.warn("Gemini Quota Exceeded for search-music. Returning fallback results.");
        
        // Comprehensive fallback results when AI is capped
        const fallbacks = [
          { id: "f1", name: "Sunset Vibes", artist: "Chill Master" },
          { id: "f2", name: "City Lights", artist: "Midnight Pulse" },
          { id: "f3", name: "Aura Flow", artist: "Zenith" },
          { id: "f4", name: "Electric Dreams", artist: "Cyber Soul" },
          { id: "f5", name: "Summer Rain", artist: "Acoustic Waves" },
          { id: "f6", name: "Midnight City", artist: "Retro Wave" },
          { id: "f7", name: "Lofi Study", artist: "Chill Beats" },
          { id: "f8", name: "Morning Sun", artist: "Acoustic Folk" },
          { id: "f9", name: "Dance Floor", artist: "Techno King" },
          { id: "f10", name: "Skyline", artist: "Nu Jazz" },
        ];

        // Filter fallbacks based on query to simulate a real search
        const filtered = fallbacks.filter(t => 
          t.name.toLowerCase().includes(query.toLowerCase()) || 
          t.artist.toLowerCase().includes(query.toLowerCase())
        );

        // If no matches, return a mix
        const results = filtered.length > 0 ? filtered : fallbacks.slice(0, 5);

        return res.json({ 
          tracks: results,
          warning: "Using local fallback database due to AI quota limits."
        });
      }

      console.error("Music Search Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // AI Assistant: User Search endpoint for Indian Accounts
  app.post("/api/gemini/search-users", async (req, res) => {
    const { query } = req.body;
    try {
      if (!query) return res.status(400).json({ error: "Query is required" });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Act as a user database for an Indian Social Media app. Find 10 realistic Indian Instagram accounts (real celebrities or realistic dummy creators) that match this search query: "${query}". 
        Return the results as a JSON array of objects, where each object has:
        - id: string (unique)
        - name: string (full name in English)
        - username: string (instagram style username)
        - avatar: string (use a realistic placeholder URL from unsplash like https://images.unsplash.com/photo-[ID]?auto=format&fit=crop&w=150&h=150)
        - followers: number
        - following: number
        - bio: string
        
        ONLY return the JSON array.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                username: { type: Type.STRING },
                avatar: { type: Type.STRING },
                followers: { type: Type.NUMBER },
                following: { type: Type.NUMBER },
                bio: { type: Type.STRING },
              },
              required: ["id", "name", "username", "avatar", "followers", "following", "bio"],
            },
          }
        }
      });

      const users = JSON.parse(response.text || "[]");
      res.json({ users });
    } catch (error: any) {
      if (error.message?.includes("429") || error.status === 429) {
        // Fallback for quota
        const fallbacks = [
          { id: "u101", name: "Shah Rukh Khan", username: "iamsrk", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150", followers: 44000000, following: 6, bio: "Actor" },
          { id: "u102", name: "Sachin Tendulkar", username: "sachintendulkar", avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150", followers: 48000000, following: 30, bio: "Cricketer" },
          { id: "u103", name: "Ranbir Kapoor", username: "ranbir_kapoor_official", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", followers: 12000000, following: 100, bio: "Artist" },
        ];
        return res.json({ users: fallbacks });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // AI Assistant: Global Search endpoint
  app.post("/api/gemini/search-global", async (req, res) => {
    const { query } = req.body;
    try {
      if (!query) return res.status(400).json({ error: "Query is required" });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Act as a search engine for an Indian Social Media app. Search for: "${query}".
        Find:
        1. "users": 5 realistic Indian accounts (id, name, username, avatar, followers, bio).
        2. "posts": 5 realistic Indian posts (id, author {id, name, username, avatar}, content, image, likes).
        3. "hashtags": 5 trending Indian hashtags related to the query.

        Return as a structured JSON object with these three keys.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              users: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    username: { type: Type.STRING },
                    avatar: { type: Type.STRING },
                    followers: { type: Type.NUMBER },
                    bio: { type: Type.STRING },
                  },
                  required: ["id", "name", "username", "avatar", "followers", "bio"],
                }
              },
              posts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    author: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        username: { type: Type.STRING },
                        avatar: { type: Type.STRING },
                      }
                    },
                    content: { type: Type.STRING },
                    image: { type: Type.STRING },
                    likes: { type: Type.NUMBER },
                  }
                }
              },
              hashtags: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            }
          }
        }
      });

      const results = JSON.parse(response.text || "{}");
      res.json(results);
    } catch (error: any) {
      console.error("Global Search Error:", error);
      
      if (error.message?.includes("429") || error.status === 429) {
        // Fallback for quota
        const fallbacks = {
          users: [
            { id: "u101", name: "Shah Rukh Khan", username: "iamsrk", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150", followers: 44000000, bio: "Actor" },
            { id: "u102", name: "Sachin Tendulkar", username: "sachintendulkar", avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150", followers: 48000000, bio: "Cricketer" },
          ],
          posts: [
            { id: "p201", author: { id: "u101", name: "Shah Rukh Khan", username: "iamsrk", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150" }, content: "New movie announcement tomorrow!", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500", likes: 1200000 },
          ],
          hashtags: ["trending", "bollywood", "cricket", "indianfood", "travelindia"]
        };
        return res.json(fallbacks);
      }
      
      res.status(500).json({ error: error.message });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aura Server running on http://localhost:${PORT}`);
  });
}

startServer();
