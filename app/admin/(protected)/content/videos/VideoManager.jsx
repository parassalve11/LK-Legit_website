"use client";

import { useActionState, useState } from "react";
import { saveVideo, deleteVideo, moveVideo } from "@/app/admin/actions";
import {
  Card,
  Field,
  Input,
  Toggle,
  SubmitButton,
  ConfirmSubmit,
  Status,
  GhostButton,
  EmptyState,
} from "@/components/admin/ui";

function VideoForm({ video, onDone }) {
  const [state, formAction] = useActionState(saveVideo, { ok: false });
  const errors = state?.errors || {};

  return (
    <form action={formAction} className="space-y-4">
      {video?.id ? <input type="hidden" name="id" value={video.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Video Title" error={errors.title}>
            <Input name="title" defaultValue={video?.title || ""} required />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field
            label="YouTube Video ID"
            hint="The part after v= in the video link. For youtube.com/watch?v=abc123 enter abc123"
            error={errors.youtubeId}
          >
            <Input name="youtubeId" defaultValue={video?.youtubeId || ""} required />
          </Field>
        </div>
        <Field label="Length" error={errors.duration}>
          <Input name="duration" placeholder="12:34" defaultValue={video?.duration || ""} />
        </Field>
        <Field label="View Count" error={errors.views}>
          <Input name="views" placeholder="12K" defaultValue={video?.views || ""} />
        </Field>
      </div>

      <Toggle name="visible" defaultChecked={video?.visible ?? true} label="Show on website" />

      <div className="flex items-center gap-3">
        <SubmitButton>{video?.id ? "Save Video" : "Add Video"}</SubmitButton>
        {onDone ? (
          <GhostButton type="button" onClick={onDone}>
            Cancel
          </GhostButton>
        ) : null}
      </div>

      <Status state={state} />
    </form>
  );
}

export default function VideoManager({ videos }) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);

  return (
    <div className="space-y-6">
      {videos.length ? (
        <Card title="Your videos" description="Drag order with the arrows. Hidden videos stay saved.">
          <ul className="divide-y divide-[rgba(212,175,55,0.12)]">
            {videos.map((v, i) => (
              <li key={v.id} className="py-4">
                {editing === v.id ? (
                  <VideoForm video={v} onDone={() => setEditing(null)} />
                ) : (
                  <div className="flex items-center gap-4">
                    <img
                      src={`https://i.ytimg.com/vi/${v.youtubeId}/default.jpg`}
                      alt=""
                      className="h-12 w-20 shrink-0 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-[#f2f0eb]">
                        {v.title}
                      </div>
                      <div className="text-xs text-[#a19c8f]">
                        {v.views} views · {v.duration} {v.visible ? "" : "· Hidden"}
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <form action={moveVideo}>
                        <input type="hidden" name="id" value={v.id} />
                        <input type="hidden" name="direction" value="up" />
                        <button
                          disabled={i === 0}
                          aria-label="Move up"
                          className="rounded border border-[rgba(212,175,55,0.25)] px-2 text-xs text-[#f5c451] disabled:opacity-25"
                        >
                          ↑
                        </button>
                      </form>
                      <form action={moveVideo}>
                        <input type="hidden" name="id" value={v.id} />
                        <input type="hidden" name="direction" value="down" />
                        <button
                          disabled={i === videos.length - 1}
                          aria-label="Move down"
                          className="rounded border border-[rgba(212,175,55,0.25)] px-2 text-xs text-[#f5c451] disabled:opacity-25"
                        >
                          ↓
                        </button>
                      </form>
                    </div>

                    <GhostButton type="button" onClick={() => setEditing(v.id)}>
                      Edit
                    </GhostButton>

                    <form action={deleteVideo}>
                      <input type="hidden" name="id" value={v.id} />
                      <ConfirmSubmit message={`Delete "${v.title}"? This cannot be undone.`} />
                    </form>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <EmptyState
          title="No videos yet"
          description="Add your first YouTube video to show it on the website."
        />
      )}

      {adding ? (
        <Card title="Add a video">
          <VideoForm onDone={() => setAdding(false)} />
        </Card>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="btn-gold rounded-full px-6 py-2.5 text-sm"
        >
          + Add Video
        </button>
      )}
    </div>
  );
}
