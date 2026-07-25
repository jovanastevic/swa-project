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
import {JSX} from "react";

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
                    {formatTimestamp(prompt.time_stamp)} <br/> <a href="/#gehtnicht" className="font-bold">@{prompt.username}</a>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>
                    {prompt.description}
                </p>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full">
                    Erstellen
                </Button>
            </CardFooter>
        </Card>
    )
}
