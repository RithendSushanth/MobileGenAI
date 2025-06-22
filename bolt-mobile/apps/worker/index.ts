//Anthropic version

// import cors from "cors";
// import express from "express";
// import { prismaClient } from "db/client";
// // import Anthropic from '@anthropic-ai/sdk'; // <--- REMOVE THIS LINE
// import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai"; // <--- ADD THIS LINE
// import { systemPrompt } from "./systemPrompt";
// import { ArtifactProcessor } from "./parser";
// import { onFileUpdate, onShellCommand } from "./os";

// // Load environment variables (make sure dotenv.config() is at the very top of your entry file)
// import dotenv from 'dotenv';
// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Initialize Gemini client globally or in the handler
// let geminiClient: GoogleGenerativeAI;
// let geminiModel: GenerativeModel;

// try {
//     const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
//     if (!GEMINI_API_KEY) {
//         throw new Error("GEMINI_API_KEY environment variable is not set.");
//     }
//     geminiClient = new GoogleGenerativeAI(GEMINI_API_KEY);
//     // Choose your model. 'gemini-1.5-flash-latest' is generally fast and cost-effective.
//     // 'gemini-1.5-pro-latest' for more advanced reasoning.
//     geminiModel = geminiClient.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
// } catch (error) {
//     console.error("Failed to initialize GoogleGenerativeAI:", error);
//     // Handle the error appropriately, e.g., exit the process or render an error page
//     process.exit(1);
// }


// app.post("/prompt", async (req, res) => {
//     const { prompt, projectId } = req.body;

//     await prismaClient.prompt.create({
//         data: {
//             content: prompt,
//             projectId,
//             type: "USER",
//         },
//     });

//     const allPrompts = await prismaClient.prompt.findMany({
//         where: {
//             projectId,
//         },
//         orderBy: {
//             createdAt: "asc",
//         },
//     });

//     let artifactProcessor = new ArtifactProcessor("", (filePath, fileContent) => onFileUpdate(filePath, fileContent, projectId), (shellCommand) => onShellCommand(shellCommand, projectId));
//     let fullAssistantResponse = ""; // Accumulate the full response here

//     // Transform prompts for Gemini's format
//     const history = allPrompts.map((p: any) => ({
//         role: p.type === "USER" ? "user" : "model", // Gemini uses 'model' for AI responses
//         parts: [{ text: p.content }],
//     }));

//     // Gemini doesn't have a direct 'system' prompt argument like Claude.
//     // The system prompt is usually integrated into the first 'user' turn or
//     // explicitly passed as context in the history if it's a "primer" message.
//     // For simpler cases, you can prepend it to the user's first message or the history.
//     // If systemPrompt is meant to be a strict "system message" that the model adheres to,
//     // you might need to add it as the very first message in the history with the 'user' role.
//     // For now, let's assume `systemPrompt` can be prepended to the first user message or handled
//     // as context. For continuous chat, it's often best to treat the system prompt as an initial "user"
//     // message that sets the context.

//     // Let's create the chat session
//     const chat = geminiModel.startChat({
//         history: history, // Pass the existing chat history
//         // You can add generation config here if needed, e.g., temperature, topP, topK
//         // generationConfig: { maxOutputTokens: 8000 },
//     });

//     // Gemini's streaming works differently from Anthropic's 'on("text")'
//     try {
//         const result = await chat.sendMessageStream(prompt); // Send the *new* user prompt

//         // Send a 200 OK response immediately, but don't close it yet.
//         // For streaming responses to the client, you'd use res.write() and res.end().
//         // However, your original code accumulates 'artifact' and then saves to DB.
//         // If you want to stream to the client as well, you'd need to adjust `res.json` to a stream.
//         // For now, we'll mimic the original behavior of accumulating and then saving.
//         res.json({ message: "Processing prompt...", streamInitiated: true }); // Acknowledge request

//         for await (const chunk of result.stream) {
//             const chunkText = chunk.text();
//             if (chunkText) {
//                 artifactProcessor.append(chunkText);
//                 artifactProcessor.parse(); // Process artifacts as they come in
//                 fullAssistantResponse += chunkText;
//             }
//         }

//         // After the stream finishes
//         console.log("done!");
//         await prismaClient.prompt.create({
//             data: {
//                 content: fullAssistantResponse, // Save the full accumulated response
//                 projectId,
//                 type: "SYSTEM", // Or "MODEL" if you prefer
//             },
//         });

//         await prismaClient.action.create({
//             data: {
//                 content: "Done!", // This seems like a generic action for completion
//                 projectId,
//             },
//         });

//     } catch (error) {
//         console.error("Error communicating with Gemini API:", error);
//         // Ensure to send an error response if something goes wrong during streaming
//         if (!res.headersSent) { // Check if headers have already been sent by res.json({ response })
//              res.status(500).json({ error: "Failed to get response from AI model" });
//         }
//         // No explicit 'return' needed after sending an error response here if it's the last action
//     }
// });

// app.listen(9091, () => {
//     console.log("Server is running on port 9091");
// });



// //Gemini v:1
// import cors from "cors";
// import express from "express";
// import { prismaClient } from "db/client";
// import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
// import { systemPrompt } from "./systemPrompt";
// import { onFileUpdate, onShellCommand } from "./os";

// import dotenv from 'dotenv';
// import { ArtifactProcessor } from "./parser";
// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// let geminiModel: GenerativeModel;

// try {
//     const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
//     if (!GEMINI_API_KEY) {
//         throw new Error("GEMINI_API_KEY environment variable is not set.");
//     }
//     const geminiClient = new GoogleGenerativeAI(GEMINI_API_KEY);
//     geminiModel = geminiClient.getGenerativeModel({ model: "gemini-2.5-flash" });
// } catch (error) {
//     console.error("Failed to initialize GoogleGenerativeAI:", error);
//     process.exit(1);
// }

// app.post("/prompt", async (req, res) => {
//     const { prompt, projectId } = req.body;

//     await prismaClient.prompt.create({
//         data: {
//             content: prompt,
//             projectId,
//             type: "USER",
//         },
//     });

//     const allPrompts = await prismaClient.prompt.findMany({
//         where: {
//             projectId,
//         },
//         orderBy: {
//             createdAt: "asc",
//         },
//     });

//     let artifactProcessor = new ArtifactProcessor("", (filePath, fileContent) => onFileUpdate(filePath, fileContent, projectId), (shellCommand) => onShellCommand(shellCommand, projectId));
//     let fullAssistantResponse = "";

//     const initialSystemMessage = {
//         role: 'user',
//         parts: [{ text: systemPrompt }],
//     };

//     const chatHistoryFromDB = allPrompts.map((p: any) => ({
//         role: p.type === "USER" ? "user" : "model",
//         parts: [{ text: p.content }],
//     }));

//     const historyForGemini = [initialSystemMessage, ...chatHistoryFromDB];

//     const chat = geminiModel.startChat({
//         history: historyForGemini,
//         generationConfig: { maxOutputTokens: 6000 },
//     });

//     try {
//         const result = await chat.sendMessageStream(prompt);
//         res.json({ message: "Processing prompt...", streamInitiated: true });

//         for await (const chunk of result.stream) {
//             const chunkText = chunk.text();
//             if (chunkText) {
//                 artifactProcessor.append(chunkText);
//                 artifactProcessor.parse();
//                 fullAssistantResponse += chunkText;
//             }
//         }

//         console.log("done!");
//         await prismaClient.prompt.create({
//             data: {
//                 content: fullAssistantResponse,
//                 projectId,
//                 type: "SYSTEM",
//             },
//         });

//         await prismaClient.action.create({
//             data: {
//                 content: "Done!",
//                 projectId,
//             },
//         });

//     } catch (error) {
//         console.error("Error communicating with Gemini API:", error);
//         if (!res.headersSent) {
//              res.status(500).json({ error: "Failed to get response from AI model" });
//         }
//     }
// });

// app.listen(9091, () => {
//     console.log("Server is running on port 9091");
// });



//Gemini v:2
import cors from "cors";
import express from "express";
import { prismaClient } from "../../packages/db/index.ts";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { systemPrompt } from "./systemPrompt";
import { onFileUpdate, onShellCommand } from "./os";

import dotenv from 'dotenv';
import { ArtifactProcessor } from "./parser";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let geminiModel: GenerativeModel;

try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY environment variable is not set.");
    }
    const geminiClient = new GoogleGenerativeAI(GEMINI_API_KEY);
    geminiModel = geminiClient.getGenerativeModel({ model: "gemini-2.5-flash" });
    console.log("✅ Gemini 2.5 Flash initialized successfully");
} catch (error) {
    console.error("❌ Failed to initialize GoogleGenerativeAI:", error);
    process.exit(1);
}

// Input validation middleware
const validatePromptRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { prompt, projectId } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        return res.status(400).json({ error: "Prompt is required and must be a non-empty string" });
    }

    if (!projectId || typeof projectId !== 'string') {
        return res.status(400).json({ error: "ProjectId is required and must be a string" });
    }

    // Sanitize prompt length
    if (prompt.length > 10000) {
        return res.status(400).json({ error: "Prompt too long (max 10,000 characters)" });
    }

    next();
};

app.post("/prompt", async (req, res) => {
    const { prompt, projectId } = req.body;
    let artifactProcessor: ArtifactProcessor | null = null;
    let fullAssistantResponse = "";

    try {
        // Store user prompt in database
        await prismaClient.prompt.create({
            data: {
                content: prompt,
                projectId,
                type: "USER",
            },
        });

        // Fetch conversation history
        const allPrompts = await prismaClient.prompt.findMany({
            where: { projectId },
            orderBy: { createdAt: "asc" },
        });

        // Initialize artifact processor
        artifactProcessor = new ArtifactProcessor(
            "",
            (filePath, fileContent) => {
                console.log(`📁 Processing file: ${filePath}`);

                onFileUpdate(filePath, fileContent, projectId);
            },
            (shellCommand) => {
                console.log(`🔧 Executing command: ${shellCommand}`);
                onShellCommand(shellCommand, projectId);
            }
        );

        // Prepare chat history for Gemini
        const initialSystemMessage = {
            role: 'user',
            parts: [{ text: systemPrompt }],
        };

        const chatHistoryFromDB = allPrompts.map((p: any) => ({
            role: p.type === "USER" ? "user" : "model",
            parts: [{ text: p.content }],
        }));

        const historyForGemini = [initialSystemMessage, ...chatHistoryFromDB];

        // Start chat session
        const chat = geminiModel.startChat({
            history: historyForGemini,
            generationConfig: {
                maxOutputTokens: 8000,  // Increased for better responses
                temperature: 0.7,       // Balanced creativity
                topP: 0.9,             // Good diversity
                topK: 40               // Reasonable selection
            },
        });

        // Send immediate response to client
        res.json({
            message: "Processing prompt...",
            streamInitiated: true,
            projectId,
            timestamp: new Date().toISOString()
        });

        console.log(`🚀 Starting stream for project: ${projectId}`);
        const startTime = Date.now();

        // Process streaming response
        const result = await chat.sendMessageStream(prompt);
        let chunkCount = 0;

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
                chunkCount++;
                artifactProcessor.append(chunkText);
                artifactProcessor.parse();
                fullAssistantResponse += chunkText;

                // Optional: Log progress every 10 chunks
                if (chunkCount % 10 === 0) {
                    console.log(`📊 Processed ${chunkCount} chunks...`);
                }
            }
        }

        const endTime = Date.now();
        const duration = endTime - startTime;

        console.log(`✅ Stream completed in ${duration}ms (${chunkCount} chunks)`);

        // Store assistant response in database
        if (fullAssistantResponse.trim()) {
            await prismaClient.prompt.create({
                data: {
                    content: fullAssistantResponse,
                    projectId,
                    type: "SYSTEM",
                },
            });
        }

        // Mark completion
        await prismaClient.action.create({
            data: {
                content: `Completed processing prompt (${duration}ms, ${chunkCount} chunks) Done!`,
                projectId,
            },
        });

        console.log(`🎉 Request completed for project: ${projectId}`);

    } catch (error) {
        console.error("❌ Error processing prompt:", error);

        // Store error information
        try {
            await prismaClient.action.create({
                data: {
                    content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    projectId,
                },
            });
        } catch (dbError) {
            console.error("❌ Failed to log error to database:", dbError);
        }

        // Send error response if headers not sent
        if (!res.headersSent) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            res.status(500).json({
                error: "Failed to process prompt",
                details: errorMessage,
                projectId,
                timestamp: new Date().toISOString()
            });
        }
    }
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        model: "gemini-2.5-flash",
        port: 9091
    });
});

// Get project history endpoint
app.get("/project/:projectId/history", async (req, res) => {
    try {
        const { projectId } = req.params;

        const prompts = await prismaClient.prompt.findMany({
            where: { projectId },
            orderBy: { createdAt: "asc" },
        });

        const actions = await prismaClient.action.findMany({
            where: { projectId },
            orderBy: { createdAt: "asc" },
        });

        res.json({
            projectId,
            prompts: prompts.length,
            actions: actions.length,
            history: prompts,
            recentActions: actions.slice(-10), // Last 10 actions
        });
    } catch (error) {
        console.error("❌ Error fetching project history:", error);
        res.status(500).json({ error: "Failed to fetch project history" });
    }
});

// Graceful shutdown handler
process.on('SIGTERM', async () => {
    console.log('🔄 Received SIGTERM, shutting down gracefully...');
    await prismaClient.$disconnect();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('🔄 Received SIGINT, shutting down gracefully...');
    await prismaClient.$disconnect();
    process.exit(0);
});

app.listen(9091, () => {
    console.log("🚀 Server is running on port 9091");
    console.log("📊 Health check available at: http://localhost:9091/health");
    console.log("🤖 AI Model: Gemini 2.5 Flash");
});


