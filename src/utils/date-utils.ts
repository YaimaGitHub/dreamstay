// Enhance date utilities with better performance and error handling
import { format, isBefore, isSameDay, isValid, addDays } from "date-fns"

/**
 * Checks if a given date is available (not booked)
 */
export function isDateAvailable(date: Date, bookedDates: Date[]): boolean {
  if (!isValid(date)) return false

  return !bookedDates.some((bookedDate) => isSameDay(date, bookedDate))
}

/**
 * Returns an array of dates between start and end inclusive
 * Uses a more efficient algorithm to avoid creating too many Date objects
 */
export function getDatesBetween(start: Date, end: Date): Date[] {
  if (!isValid(start) || !isValid(end)) {
    throw new Error("Invalid date provided to getDatesBetween")
  }

  if (isBefore(end, start)) {
    throw new Error("End date cannot be before start date")
  }

  const dates: Date[] = []
  let currentDate = new Date(start)

  // Use a more efficient approach with a fixed number of iterations
  const daysDiff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

  for (let i = 0; i < daysDiff; i++) {
    dates.push(new Date(currentDate))
    currentDate = addDays(currentDate, 1)
  }

  return dates
}

/**
 * Formats a date in the local format with error handling
 */
export function formatDate(date: Date): string {
  if (!isValid(date)) {
    console.error("Invalid date provided to formatDate")
    return "Invalid date"
  }

  try {
    return format(date, "dd/MM/yyyy")
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Error formatting date"
  }
}

/**
 * Checks if all dates between start and end are available
 * With improved error handling and performance
 */
export function areAllDatesAvailable(start: Date, end: Date, bookedDates: Date[]): boolean {
  if (!isValid(start) || !isValid(end)) {
    console.error("Invalid date provided to areAllDatesAvailable")
    return false
  }

  if (isBefore(end, start)) {
    console.error("End date cannot be before start date")
    return false
  }

  try {
    // Optimize by checking each date individually instead of creating an array
    let currentDate = new Date(start)
    const endTime = end.getTime()

    while (currentDate.getTime() <= endTime) {
      if (!isDateAvailable(currentDate, bookedDates)) {
        return false
      }
      currentDate = addDays(currentDate, 1)
    }

    return true
  } catch (error) {
    console.error("Error checking date availability:", error)
    return false
  }
}

/**
 * Validates a date range
 */
export function isValidDateRange(start: Date | undefined, end: Date | undefined): boolean {
  if (!start || !end) return false
  if (!isValid(start) || !isValid(end)) return false

  return !isBefore(end, start)
}
