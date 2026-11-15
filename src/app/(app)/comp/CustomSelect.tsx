import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Role } from "@/types/types"



export function CustomSelect({ items, title, onChange }: { items: { label: string, value: string, }[], title: string, onChange: (value: Role | null) => void }) {
    return (
        <Select items={items} onValueChange={onChange}>
            <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder={title} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{title}</SelectLabel>
                    {items.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
