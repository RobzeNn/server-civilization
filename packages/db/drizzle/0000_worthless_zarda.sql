CREATE TABLE "citizens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"civilization_id" uuid NOT NULL,
	"discord_user_id" varchar(32) NOT NULL,
	"display_name" varchar(256) NOT NULL,
	"avatar_url" varchar(512),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "civilizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"discord_guild_id" varchar(32) NOT NULL,
	"name" varchar(256) NOT NULL,
	"current_day" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "civilizations_discord_guild_id_unique" UNIQUE("discord_guild_id")
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"civilization_id" uuid NOT NULL,
	"food" integer DEFAULT 100 NOT NULL,
	"wood" integer DEFAULT 100 NOT NULL,
	"stone" integer DEFAULT 50 NOT NULL,
	"gold" integer DEFAULT 0 NOT NULL,
	"population" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "resources_civilization_id_unique" UNIQUE("civilization_id")
);
--> statement-breakpoint
ALTER TABLE "citizens" ADD CONSTRAINT "citizens_civilization_id_civilizations_id_fk" FOREIGN KEY ("civilization_id") REFERENCES "public"."civilizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_civilization_id_civilizations_id_fk" FOREIGN KEY ("civilization_id") REFERENCES "public"."civilizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "citizen_civ_user_idx" ON "citizens" USING btree ("civilization_id","discord_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "civ_guild_idx" ON "civilizations" USING btree ("discord_guild_id");--> statement-breakpoint
CREATE UNIQUE INDEX "resources_civ_idx" ON "resources" USING btree ("civilization_id");