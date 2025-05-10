
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";

interface ReservedDatesManagerProps {
  reservedDates: DateRange | undefined;
  setReservedDates: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const ReservedDatesManager = ({ reservedDates, setReservedDates }: ReservedDatesManagerProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Fechas Reservadas:</h3>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="justify-start text-left font-normal w-full"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {reservedDates?.from && reservedDates?.to ? (
              <>
                {format(reservedDates.from, "d MMM", { locale: es })} -{" "}
                {format(reservedDates.to, "d MMM", { locale: es })}
              </>
            ) : (
              <span>Seleccionar fechas reservadas</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={reservedDates?.from}
            selected={reservedDates}
            onSelect={setReservedDates}
            numberOfMonths={2}
            locale={es}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      <p className="text-xs text-muted-foreground mt-1">
        Seleccione rangos de fechas que ya están reservadas
      </p>
    </div>
  );
};

export default ReservedDatesManager;
