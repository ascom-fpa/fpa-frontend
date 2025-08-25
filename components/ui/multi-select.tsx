'use client'

import { useEffect, useRef, useState } from "react"
import { Check, ChevronDown, X } from "lucide-react"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
// import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./command"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

export interface MultiSelectOption {
    label: string
    value: string
}

interface MultiSelectProps {
    selected: string[]
    onChange: (selected: string[]) => void
    options: MultiSelectOption[]
    placeholder?: string
    emptyMessage?: string
}

export function MultiSelect({
    selected,
    onChange,
    options,
    placeholder = "Selecionar...",
    emptyMessage = "Nenhum item encontrado",
}: MultiSelectProps) {
    const [open, setOpen] = useState(false)

    const handleSelect = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((v) => v !== value))
        } else {
            onChange([...selected, value])
        }
    }

    const selectedOptions = options.filter((option) => selected.includes(option.value))

    const triggerRef = useRef<HTMLButtonElement>(null)
    const [triggerWidth, setTriggerWidth] = useState<number>(0)

    useEffect(() => {
        if (triggerRef.current) {
            setTriggerWidth(triggerRef.current.offsetWidth)
        }
    }, [open])

    return (
        <div className="space-y-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={triggerRef}
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                    >
                        {selected.length > 0 ? `${selected.length} selecionado(s)` : placeholder}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent side="bottom" align="start" style={{ width: triggerWidth }} className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput placeholder={placeholder} />
                        <CommandEmpty>{emptyMessage}</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    onSelect={() => handleSelect(option.value)}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={cn("h-4 w-4 rounded border", selected.includes(option.value) && "bg-primary")} />
                                        <span>{option.label}</span>
                                    </div>
                                    {selected.includes(option.value) && (
                                        <Check className="ml-auto h-4 w-4" />
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>

            {selectedOptions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedOptions.map((option) => (
                        <Badge
                            key={option.value}
                            variant="secondary"
                            className="flex items-center gap-1"
                        >
                            {option.label}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => handleSelect(option.value)}
                            />
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}