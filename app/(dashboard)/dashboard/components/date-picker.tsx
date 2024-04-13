import { format } from "date-fns"
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
import { SelectSingleEventHandler } from "react-day-picker"

interface DatePickerProps{
    date: Date | undefined;
    setDate: Dispatch<SetStateAction<Date | undefined>>
}

const DatePicker: React.FC<DatePickerProps> = ({
    date,
    setDate
}) => {

    const currentDate = new Date();

    const handleSelect: SelectSingleEventHandler = (day) => {
        if (day instanceof Date) {
            // Check if the selected date is different from the current state
            if (!date || (day && day.getTime() !== date.getTime())) {
                // Update the state only if the selected date is different
                setDate(day);
            }
        }
    };


    return(
        <Popover>
            <PopoverTrigger asChild>
                <Button
                variant={"outline"}
                className={cn(
                    " w-[180px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                )}
                >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                mode="single"
                selected={date}
                onSelect={handleSelect}
                initialFocus
                fromDate={currentDate}
                />
            </PopoverContent>
        </Popover>
    )
}

export default DatePicker;