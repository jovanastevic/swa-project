import {Button} from "@/components/ui/button"
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
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {useState} from "react";

import {_api} from "@/lib/_api.ts";

type Category = {
    label: string
    value: number
}

//hardcoded categories weil combobox nervt
const categories: Category[] = [
    {label: "Hausübung", value: 1},
    {label: "Bauen", value: 2},
    {label: "Programmieren", value: 3},
]

export function TestCard() {
    const [formData, setFormData] = useState({
        category_id: 0,
        userowner: "",
        title: "",
        description: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({...formData, [e.target.id]: e.target.value});
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            await _api.createPrompt({
                category_id: 1, //hardcoded gelassen, weil combobox nervt
                title: formData.title,
                description: formData.description,
            })
        } catch (err: any) {
            console.error(err);
        }
    }
    // @ts-ignore
    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Erstelle Prompt</CardTitle>
            </CardHeader>
            <CardContent>
                <form id="create-prompt-form" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                        <Combobox items={categories}>
                            <ComboboxInput placeholder="Kategorie wählen"/>
                            <ComboboxContent>
                                <ComboboxEmpty>Keine Einträge gefunden</ComboboxEmpty>
                                <ComboboxList>
                                    {(category) => (
                                        <ComboboxItem key={category.value} value={category}>
                                            {category.label}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        <div className="grid gap-2">
                            <Label htmlFor="title">Titel</Label>
                            <Input
                                id="title"
                                type="text"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="description">Beschreibung</Label>
                            </div>
                            <Textarea id="description" placeholder="Gib hier deinen Prompt ein... " required onChange={handleChange}/>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="" form="create-prompt-form">
                    Posten
                </Button>
            </CardFooter>
        </Card>
    )
}
