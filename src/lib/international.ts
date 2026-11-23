export const indicativeUsdRate = 26000;
export const internationalPackages = [
  { id: 'delegate', name: 'Delegate Package', price: 295 },
  { id: 'experience', name: 'Experience Package', price: 350 },
] as const;
export type InternationalPackageId = typeof internationalPackages[number]['id'];
export const delegateBenefits = [
  '2 nights at Wyndham Grand Vedana', 'Breakfast on 16 & 17 January',
  'Lunch on 15 & 16 January', 'Welcome Night & Gala Night',
  'Hanoi – Ninh Binh return transfers', 'Scheduled group airport pickup & drop-off',
];
export const experienceBenefits = [
  'Half-day Ninh Binh tour on 15 January', 'Private after-party for international delegates',
];
export const usd = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
