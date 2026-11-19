// Admin copy can bold words by wrapping them in **double asterisks**.
export function withBold(text = "", className = "font-semibold text-[#f2f0eb]") {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={i} className={className}>
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}
