export const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(n) + " ₫";
