import { z } from "zod";

export const subtitleSchema = z.object({
  lang: z.string(),
  label: z.string(),
  url: z.string(),
});

export const streamDataSchema = z.object({
  video_url: z.string(),
  format: z.enum(["hls", "mp4", "dash"]),
  source: z.string(),
  subtitles: z.array(subtitleSchema),
  thumbnails: z.null(),
  headers: z.object({ Referer: z.string(), Origin: z.string() }),
  fallback_used: z.boolean(),
  fallback_attempts: z.array(z.string()),
});

export const streamResponseSchema = z.object({
  status: z.literal("success"),
  data: streamDataSchema,
  meta: z.object({ response_time_ms: z.number(), cached: z.boolean() }),
});

export const animeMetaSchema = z.object({
  anilist_id: z.number(),
  title: z.object({ romaji: z.string(), english: z.string(), native: z.string() }),
  description: z.string(),
  cover_image: z.string(),
  cover_color: z.string(),
  banner_image: z.string(),
  genres: z.array(z.string()),
  episodes: z.number(),
  duration: z.number(),
  status: z.string(),
  season: z.string(),
  season_year: z.number(),
  score: z.number(),
  format: z.string(),
  studio: z.string(),
  start_date: z.object({ year: z.number(), month: z.number(), day: z.number() }),
  end_date: z.object({ year: z.number(), month: z.number(), day: z.number() }),
  next_airing: z.null(),
  trailer: z.object({ site: z.string(), id: z.string() }).nullable(),
  tags: z.array(z.string()),
});

export type StreamData = z.infer<typeof streamDataSchema>;
export type AnimeMeta = z.infer<typeof animeMetaSchema>;
