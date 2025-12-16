const euroFormatter = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function formatMoney(amount: number): string {
  return euroFormatter.format(amount) + " €";
}
