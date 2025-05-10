
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

const SearchForm = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 7)),
  });
  const [guests, setGuests] = useState("1");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // En una implementación real, esto pasaría parámetros a la página de resultados
    navigate("/habitaciones");
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-lg shadow-lg p-4 md:p-6 grid gap-4 md:flex md:items-end"
    >
      <div className="space-y-2 flex-1">
        <label htmlFor="location" className="block text-sm font-medium">
          Destino
        </label>
        <Input id="location" placeholder="Ciudad, región o hotel" className="border-muted" />
      </div>

      <div className="space-y-2 flex-1">
        <label className="block text-sm font-medium">Fechas</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal w-full border-muted"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from && dateRange?.to ? (
                <>
                  {format(dateRange.from, "d MMM", { locale: es })} -{" "}
                  {format(dateRange.to, "d MMM", { locale: es })}
                </>
              ) : (
                <span>Seleccionar fechas</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              locale={es}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label htmlFor="guests" className="block text-sm font-medium">
          Huéspedes
        </label>
        <Select value={guests} onValueChange={setGuests}>
          <SelectTrigger className="w-[120px] border-muted">
            <SelectValue placeholder="Huéspedes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Huésped</SelectItem>
            <SelectItem value="2">2 Huéspedes</SelectItem>
            <SelectItem value="3">3 Huéspedes</SelectItem>
            <SelectItem value="4">4 Huéspedes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button className="bg-terracotta hover:bg-terracotta/90 mt-4 md:mt-0" size="lg">
        <Search className="mr-2 h-4 w-4" />
        Buscar
      </Button>
    </form>
  );
};

export default SearchForm;
