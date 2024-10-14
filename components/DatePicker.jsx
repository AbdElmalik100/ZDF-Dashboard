"use client"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format, set } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"

function DatePicker({data, setData, dataDate}) {
    const [date, setDate] = useState(new Date())
    

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataDate ? format(dataDate, "PPP") : date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    name="date"
                    selected={date}
                    onSelect={date => {
                        setData({ ...data, date: date })
                        setDate(date)
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

export default DatePicker