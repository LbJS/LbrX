import { isUndefined } from '../helper-functions'

export function newDate(value: string | number | Date): Date
export function newDate(): Date
export function newDate(value: string | number): Date
export function newDate(
  year: number,
  month: number,
  date?: number | undefined,
  hours?: number | undefined,
  minutes?: number | undefined,
  seconds?: number | undefined,
  ms?: number | undefined,
): Date
export function newDate(
  valueOrYear?: string | number | Date,
  month?: number,
  date?: number | undefined,
  hours?: number | undefined,
  minutes?: number | undefined,
  seconds?: number | undefined,
  ms?: number | undefined,
): Date {
  if (isUndefined(valueOrYear)) return new Date()
  if (isUndefined(month)) return new Date(valueOrYear)
  return new Date(valueOrYear as number, month, date, hours, minutes, seconds, ms)
}
