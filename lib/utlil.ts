import dayjs from "dayjs";

export const formatCurrency = (amount: number) => {
  return `$${amount.toFixed(2)}`;
};

export const formatDate = (date: string) => {
  if (!date) return "";

  const parsedDate = dayjs(date);
  if (!parsedDate.isValid()) return date;

  return parsedDate.format("MM/DD/YYYY");
};

export const FORMAT_DATE = (date: string) => {
  if (!date) return "";

  const parsedDate = dayjs(date);
  if (!parsedDate.isValid()) return date;

  return parsedDate.format("MM/DD");
};
