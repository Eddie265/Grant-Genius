import "dotenv/config"
import { defineConfig, env } from "prisma/config"

function withConnectTimeout(url: string) {
  const parsed = new URL(url)
  if (!parsed.searchParams.has("connect_timeout")) parsed.searchParams.set("connect_timeout", "30")
  return parsed.toString()
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // The CLI (db push / migrate) needs the direct, non-pooled Neon connection.
  // A longer connect timeout rides out Neon scale-to-zero cold starts.
  datasource: {
    url: withConnectTimeout(env("DATABASE_URL_UNPOOLED")),
  },
})
