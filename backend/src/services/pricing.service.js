export function calculateAmount({
  ratePerHour,
  durationMinutes,
  graceMinutes = 0
}) {
  if (durationMinutes <= graceMinutes) return 0;

  const billableMinutes = durationMinutes - graceMinutes;
  const hours = Math.ceil(billableMinutes / 60);

  return hours * ratePerHour;
}
