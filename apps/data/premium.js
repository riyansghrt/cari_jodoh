export const premiumBenefits = [
  {
    icon: "heart",
    title: "Lihat yang menyukaimu",
    description: "Temukan ketertarikan yang bisa menjadi match.",
    plusOnly: false,
  },
  {
    icon: "repeat",
    title: "Love tanpa batas",
    description: "Lebih banyak kesempatan untuk bertemu.",
    plusOnly: false,
  },
  {
    icon: "sliders",
    title: "Preferensi lebih lengkap",
    description: "Temukan usia, jarak, dan tujuan yang sejalan.",
    plusOnly: false,
  },
  {
    icon: "zap",
    title: "Profil lebih menonjol",
    description: "Pilihan Spotlight untuk meningkatkan visibilitas.",
    plusOnly: true,
  },
  {
    icon: "star",
    title: "Super Love setiap minggu",
    description: "Tunjukkan ketertarikan yang lebih spesial.",
    plusOnly: true,
  },
  {
    icon: "bar-chart-2",
    title: "Insight foto profil",
    description: "Kenali foto yang paling menarik perhatian.",
    plusOnly: true,
  },
];
export const premiumPlans = [
  { id: "week", label: "1 minggu", weeks: 1, premium: 49000, plus: 69000 },
  { id: "month", label: "1 bulan", weeks: 4, premium: 92400, plus: 129732 },
  { id: "quarter", label: "3 bulan", weeks: 12, premium: 199000, plus: 299000 },
];
export const formatRupiah = (amount) => `Rp ${amount.toLocaleString("id-ID")}`;
