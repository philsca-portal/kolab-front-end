"use client"
 
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Dispatch, SetStateAction } from "react"
import { format } from "date-fns"

interface CalendarStartDateEditProps{
    date: Date | undefined
    setDate: Dispatch<SetStateAction<Date | undefined>>
}

const CalendarStartDateEdit: React.FC<CalendarStartDateEditProps> = ({
    date,
    setDate,
}) => {
    
    const startDate = new Date();

    return (
      <Popover>
        <PopoverTrigger asChild>
            <Button
                id="calendar"
                type="button"
                size={"default"}
                variant={"outline"}
                className={cn(
                "justify-start text-left font-normal ",
                !date && "text-muted-foreground"
                )}>
                <CalendarIcon className="h-4 w-4 mr-1" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            fromDate={startDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    )
}

export default CalendarStartDateEdit;