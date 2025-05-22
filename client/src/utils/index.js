export const formatDateTime = (dateString) => {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

export const formatDate2 = (dateString) => {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const getUserInitials = (userName) => {
  if (!userName || typeof userName !== "string") {
    return "AA";
  }

  // Remove extra spaces and get the first two characters
  const cleanName = userName.trim();
  return cleanName.slice(0, 2).toUpperCase();
};

export function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const invoiceStatusColors = {
  DRAFT: "bg-gray-200 text-gray-800",
  SUBMITTED: "bg-blue-100 text-blue-800",
  AUTHORISED: "bg-indigo-100 text-indigo-800",
  PAID: "bg-green-100 text-green-800",
  DELETED: "bg-red-100 text-red-800",
  VOIDED: "bg-yellow-100 text-yellow-800",
};
