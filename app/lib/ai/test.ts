export async function temp() {
  const res = await fetch("/api/temp");
  if (!res.ok) {
    console.error("API error", res.status);
    return;
  }
  const data = await res.json(); // now safe
  console.log(data.text);
}