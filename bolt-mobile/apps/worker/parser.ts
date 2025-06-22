// /*
//     <boltArtifact>
//         <boltAction type="shell">
//             npm run start
//         </boltAction>
//         <boltAction type="file" filePath="src/index.js">
//             console.log("Hello, world!");
//         </boltAction>
//     </boltArtifact>
// */

// export class ArtifactProcessor {
//     public currentArtifact: string;
//     private onFileContent: (filePath: string, fileContent: string) => void;
//     private onShellCommand: (shellCommand: string) => void;

//     constructor(currentArtifact: string, onFileContent: (filePath: string, fileContent: string) => void, onShellCommand: (shellCommand: string) => void) {
//         this.currentArtifact = currentArtifact;
//         this.onFileContent = onFileContent;
//         this.onShellCommand = onShellCommand;
//     }

//     append(artifact: string) {
//         this.currentArtifact += artifact;
//     }

//     parse() {
//        const latestActionStart = this.currentArtifact.split("\n").findIndex((line) => line.includes("<boltAction type="));
//        const latestActionEnd = this.currentArtifact.split("\n").findIndex((line) => line.includes("</boltAction>")) ?? (this.currentArtifact.split("\n").length - 1);

//        if (latestActionStart === -1) {
//         return;
//        }

//        const latestActionType = this.currentArtifact.split("\n")[latestActionStart].split("type=")[1].split(" ")[0].split(">")[0];
//        const latestActionContent = this.currentArtifact.split("\n").slice(latestActionStart, latestActionEnd + 1).join("\n");

//        try {
//        if (latestActionType === "\"shell\"") {
//         let shellCommand = latestActionContent.split('\n').slice(1).join('\n');
//         if (shellCommand.includes("</boltAction>")) {
//             shellCommand = shellCommand.split("</boltAction>")[0];
//             this.currentArtifact = this.currentArtifact.split(latestActionContent)[1];
//             this.onShellCommand(shellCommand);
//         }
//        } else if (latestActionType === "\"file\"") {
//         const filePath = this.currentArtifact.split("\n")[latestActionStart].split("filePath=")[1].split(">")[0];
//         let fileContent = latestActionContent.split("\n").slice(1).join("\n");
//         if (fileContent.includes("</boltAction>")) {
//             fileContent = fileContent.split("</boltAction>")[0];
//             this.currentArtifact = this.currentArtifact.split(latestActionContent)[1];
//             this.onFileContent(filePath.split("\"")[1], fileContent);
//         }
//        }
//     } catch(e) {}
//     }
// }
// }









interface BoltAction {
    type: 'shell' | 'file';
    filePath?: string;
    content: string;
    startIndex: number;
    endIndex: number;
    fullMatch: string;
}

export class ArtifactProcessor {
    public currentArtifact: string;
    private onFileContent: (filePath: string, fileContent: string) => void;
    private onShellCommand: (shellCommand: string) => void;
    private processedActions: Set<string> = new Set();

    constructor(
        currentArtifact: string, 
        onFileContent: (filePath: string, fileContent: string) => void, 
        onShellCommand: (shellCommand: string) => void
    ) {
        this.currentArtifact = currentArtifact;
        this.onFileContent = onFileContent;
        this.onShellCommand = onShellCommand;
    }

    append(artifact: string): void {
        this.currentArtifact += artifact;
    }

    parse(): void {
        // Process all complete actions that haven't been processed yet
        const actions = this.findCompleteActions();
        
        for (const action of actions) {
            const actionId = this.getActionId(action);
            if (this.processedActions.has(actionId)) continue;

            try {
                this.processAction(action);
                this.processedActions.add(actionId);
            } catch (error) {
                console.warn('Failed to process action:', error);
            }
        }
    }

    private findCompleteActions(): BoltAction[] {
        const actionPattern = /<boltAction\s+type="(shell|file)"(?:\s+filePath="([^"]*)")?[^>]*>([\s\S]*?)<\/boltAction>/g;
        const actions: BoltAction[] = [];
        let match: RegExpExecArray | null;

        while ((match = actionPattern.exec(this.currentArtifact)) !== null) {
            const [fullMatch, type, filePath, content] = match;
            
            actions.push({
                type: type as 'shell' | 'file',
                filePath,
                content: content.trim(),
                startIndex: match.index,
                endIndex: match.index + fullMatch.length,
                fullMatch
            });
        }

        return actions;
    }

    private getActionId(action: BoltAction): string {
        // Create a unique ID for each action based on its position and content
        return `${action.startIndex}-${action.type}-${action.filePath || 'shell'}-${action.content.substring(0, 50)}`;
    }

    private processAction(action: BoltAction): void {
        switch (action.type) {
            case 'shell':
                this.onShellCommand(action.content);
                break;
            case 'file':
                if (!action.filePath) {
                    throw new Error('File action missing filePath');
                }
                this.onFileContent(action.filePath, action.content);
                break;
            default:
                throw new Error(`Unknown action type: ${action.type}`);
        }
    }

    private removeProcessedContent(action: BoltAction): void {
        // Don't remove content during streaming - just track what's been processed
        // Content cleanup can happen after streaming is complete if needed
    }

    // Call this after streaming is complete to clean up processed actions
    cleanup(): void {
        const actions = this.findCompleteActions();
        for (const action of actions) {
            const actionId = this.getActionId(action);
            if (this.processedActions.has(actionId)) {
                this.currentArtifact = 
                    this.currentArtifact.slice(0, action.startIndex) + 
                    this.currentArtifact.slice(action.endIndex);
                break; // Only remove one at a time to maintain indices
            }
        }
    }

    // Reset the processor state
    reset(newArtifact: string = ''): void {
        this.currentArtifact = newArtifact;
        this.processedActions.clear();
    }
}
