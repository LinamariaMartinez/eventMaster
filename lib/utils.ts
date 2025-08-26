import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isAfter, isBefore, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, formatStr: string = "PPP"): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr)
}

export function formatDateTime(date: string | Date, time?: string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const timeStr = time ? ` at ${time}` : ''
  return `${format(dateObj, "PPP")}${timeStr}`
}

export function getEventStatus(eventDate: string): 'upcoming' | 'ongoing' | 'past' {
  const today = new Date()
  const event = parseISO(eventDate)
  
  if (isBefore(event, today)) {
    return 'past'
  } else if (isAfter(event, today)) {
    return 'upcoming'
  } else {
    return 'ongoing'
  }
}

export function generatePublicUrl(eventId: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${eventId}`
}

export function generateEventSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function getGuestStatusColor(status: 'pending' | 'confirmed' | 'declined'): string {
  switch (status) {
    case 'confirmed':
      return 'text-green-600 bg-green-50'
    case 'declined':
      return 'text-red-600 bg-red-50'
    default:
      return 'text-yellow-600 bg-yellow-50'
  }
}

export function calculateGuestStats(guests: { status: string }[]) {
  const total = guests.length
  const confirmed = guests.filter(g => g.status === 'confirmed').length
  const declined = guests.filter(g => g.status === 'declined').length
  const pending = guests.filter(g => g.status === 'pending').length
  
  return { total, confirmed, declined, pending }
}

export function downloadCSV(data: Record<string, unknown>[], filename: string) {
  const csvContent = "data:text/csv;charset=utf-8," 
    + Object.keys(data[0]).join(",") + "\n"
    + data.map(row => Object.values(row).join(",")).join("\n")
  
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}