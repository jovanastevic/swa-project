import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

// used in homepage "/"
// Used components and their documentation:
// https://ui.shadcn.com/docs/components/base/card
export function PromptCard({prompt}) {
    return (
        <Card className="mx-auto w-full max-w-1/2">
            <CardHeader>
                <div>
                    <Badge>{prompt.category_id}</Badge>
                </div>
                <CardTitle><a href={`/prompt/${prompt.id}`}>{prompt.title}</a></CardTitle>
                <CardDescription>
                    <span className="font-bold">@{prompt.username}</span>
                </CardDescription>
            </CardHeader>
        </Card>
    )
}
