export function getISTNow() {
  const now = new Date();
  return new Date(
    now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  );
}

export function diffMinutes(start, end) {
  return Math.ceil((end - start) / (1000 * 60));
}
