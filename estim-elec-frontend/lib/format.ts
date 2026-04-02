export function formatDate(
  value: string | number | Date | null | undefined,
  locale = "fr-FR",
): string {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(locale).format(date);
}

export function formatCurrency(
  amount: number | null | undefined,
  locale = "fr-FR",
  currency = "EUR",
): string {
  if (amount == null || !Number.isFinite(amount)) {
    return "";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}