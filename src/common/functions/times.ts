export function toBrazilTime(date: Date): string {
    if (!date) return null;

    const brDate = new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).formatToParts(date);

    const parts = Object.fromEntries(brDate.map(p => [p.type, p.value]));

    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
}

export function dateOnly(date: string) {
    return date.split('T')[0];
} 

export function formatDateAsIs(date: Date | string): string {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().slice(0, 19); // “2024-05-31T00:00:00”
}

export function dateHourOnly(date: string) {
    return date.replace('T', ' ');
}

export function getDateToday() {
  // obtém a data atual no fuso do Brasil
  const nowBrazil = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
  );

  // monta a data em UTC mas usando a data local do Brasil
  const hoje = new Date(Date.UTC(
    nowBrazil.getFullYear(),
    nowBrazil.getMonth(),
    nowBrazil.getDate()
  ));

  return hoje;
}