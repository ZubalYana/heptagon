export default function formatDate(
  date: Date | string,
  length?: "short" | "long",
  year?: "includingYear" | "excludingYear"
): string {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: length == "short"? "short" : "long",
    ...(year === "includingYear" && { year: "numeric" })
  });
}
