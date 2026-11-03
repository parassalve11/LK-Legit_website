export default function DbNotice({ error }) {
  if (!error) return null;
  return (
    <div className="mb-6 rounded-2xl border border-[#e6483c]/40 bg-[#e6483c]/10 p-5">
      <h3 className="font-display text-base font-bold text-[#e6483c]">
        The website database isn&apos;t connected
      </h3>
      <p className="mt-2 max-w-2xl text-sm text-[#e6e2d6]">
        Your public website is still online and showing its built-in content, so
        visitors see everything as normal. Editing is paused until the database is
        reachable again.
      </p>
      <p className="mt-3 text-xs text-[#a19c8f]">Technical detail: {error}</p>
    </div>
  );
}
