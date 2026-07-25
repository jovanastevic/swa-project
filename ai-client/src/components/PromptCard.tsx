import { Badge } from "@/components/ui/badge"
import type {Prompt} from "@/api-client/models"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface PromptCardProps {
    prompt: Prompt
}

// used in homepage "/"
// Used components and their documentation:
// https://ui.shadcn.com/docs/components/base/card
export function PromptCard({prompt}: PromptCardProps) {
    return (
        <Card className="mx-auto w-full max-w-1/2">
            <CardHeader>
                <div>
                    <Badge>{prompt.category_title}</Badge>
                </div>
                <CardTitle><a href={`/prompt/${prompt.prompt_id}`}>{prompt.title}</a></CardTitle>
                <CardDescription>
                    <span className="font-bold">@{prompt.username}</span>
                </CardDescription>
            </CardHeader>
        </Card>
    )
}
