export function formatDate(
  dateString: string,
  locale: string = 'pt-BR',
): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Date(dateString).toLocaleDateString(locale, options)
}
