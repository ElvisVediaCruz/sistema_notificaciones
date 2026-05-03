export const normalizeDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split("T")[0];
};

const daysInMonth = (year, month) => new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

// Returns the next alert date from today based on day_alert (1-31)
export const calculateNextAlertDate = (dayAlert) => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const today = now.getUTCDate();

  const clampedCurrent = Math.min(dayAlert, daysInMonth(year, month));
  if (clampedCurrent > today) {
    return new Date(Date.UTC(year, month, clampedCurrent)).toISOString().split("T")[0];
  }

  const nextMonth = (month + 1) % 12;
  const nextYear = month === 11 ? year + 1 : year;
  const clampedNext = Math.min(dayAlert, daysInMonth(nextYear, nextMonth));
  return new Date(Date.UTC(nextYear, nextMonth, clampedNext)).toISOString().split("T")[0];
};

// Advances time_process by one month, clamping to last day if needed
export const advanceAlertDate = (dayAlert, currentTimeProcess) => {
  const current = new Date(currentTimeProcess + "T00:00:00Z");
  const month = current.getUTCMonth();
  const year = current.getUTCFullYear();
  const nextMonth = (month + 1) % 12;
  const nextYear = month === 11 ? year + 1 : year;
  const clampedDay = Math.min(dayAlert, daysInMonth(nextYear, nextMonth));
  return new Date(Date.UTC(nextYear, nextMonth, clampedDay)).toISOString().split("T")[0];
};