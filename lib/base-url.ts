export default function getBaseURL() {
  if (typeof window !== "undefined") return "";
  return "http://localhost:3000";
}
