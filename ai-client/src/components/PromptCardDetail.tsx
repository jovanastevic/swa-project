import { Badge } from "@/components/ui/badge"
import type {Prompt} from "@/api-client/models"
import {
    Card,
    CardFooter,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {formatTimestamp} from "@/lib/utils.ts";

// TODO: check if interface needed
interface PromptCardDetailProps {
    prompt: Prompt
}

export function PromptCardDetail({prompt}: PromptCardDetailProps) {
    console.log(prompt);
    return (
        <Card className="mx-auto w-full max-w-1/2">
            <CardHeader>
                <div>
                    <Badge>{prompt.category_title}</Badge>
                </div>
                <CardTitle><a href={`/prompt/${prompt.prompt_id}`}>{prompt.title}</a></CardTitle>
                <CardDescription>
                    {formatTimestamp(prompt.time_stamp)} <br/> <p className="font-bold">@{prompt.username}</p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>
                    {prompt.description}
                </p>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full">
                    Start Chat
                </Button>
            </CardFooter>
        </Card>
    )
}
