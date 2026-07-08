import { Badge } from "@/components/ui/badge"
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

export function PromptCardDetail({prompt}) {
    console.log(prompt);
    return (
        <Card className="mx-auto w-full max-w-1/2">
            <CardHeader>
                <div>
                    <Badge>{prompt.name}</Badge>
                </div>
                <CardTitle><a href={`/prompt/${prompt.id}`}>{prompt.title}</a></CardTitle>
                <CardDescription>
                    {formatTimestamp(prompt.time_stamp)} <br/> <a href="/#gehtnicht" className="font-bold">@{prompt.userowner}</a>
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
