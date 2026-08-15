import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { promptsApi } from "@/lib/api.ts"
import { ResponseError } from "@/api-client";

// TODO: code lesen und checken ob alles needed

export interface CategoryOption {
    label: string
    value: number
}

interface CreatePromptCardProps {
    categories: CategoryOption[]
}

export function CreatePromptCard({ categories }: CreatePromptCardProps) {
    console.log("CreatePromptCard categories:", categories);
    const [category, setCategory] = useState<CategoryOption | undefined>(undefined);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!category) {
            setError("Select a category.");
            return;
        }

        setLoading(true);
        try {
            await promptsApi.createPrompt({
                newPrompt: {
                    category_id: category.value,
                    title,
                    description,
                },
            });

            setCategory(undefined);
            setTitle("");
            setDescription("");
            window.location.href = "/";
        } catch (err) {
            if (err instanceof ResponseError) {
                const body = await err.response.json().catch(() => null);
                setError(body?.message ?? "Failed to create prompt");
            } else {
                setError("Failed to create prompt");
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Create prompt</CardTitle>
            </CardHeader>
            <CardContent>
                <form id="create-prompt-form" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                        <div className="grid gap-2">
                            <Label>Category</Label>
                            <Combobox items={categories} value={category} onValueChange={(value) => setCategory(value ?? undefined)}>
                                <ComboboxInput placeholder="Select a category" />
                                <ComboboxContent>
                                    <ComboboxEmpty>No entries found</ComboboxEmpty>
                                    <ComboboxList>
                                        {(cat) => (
                                            <ComboboxItem key={cat.value} value={cat}>
                                                {cat.label}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Enter your prompt here..."
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" form="create-prompt-form" disabled={loading}>
                    {loading ? "Posting..." : "Post"}
                </Button>
            </CardFooter>
        </Card>
    )
}