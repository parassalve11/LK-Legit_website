import { prisma } from "@/lib/db";
import DbNotice from "@/components/admin/DbNotice";
import VideoManager from "./VideoManager";

export default async function VideosPage() {
  let videos = [];
  let error = null;
  try {
    videos = await prisma.video.findMany({ orderBy: { order: "asc" } });
  } catch (e) {
    error = e?.message;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-2xl font-bold text-[#f2f0eb]">Videos</h1>
      <p className="mt-1 text-sm text-[#a19c8f]">
        The YouTube videos shown in the Learning Hub on your home page.
      </p>

      <div className="mt-6">
        <DbNotice error={error} />
      </div>

      {!error ? <VideoManager videos={videos} /> : null}
    </div>
  );
}
