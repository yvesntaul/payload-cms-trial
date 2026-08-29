import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'viewer');
  CREATE TYPE "public"."enum_artifacts_workflow_status" AS ENUM('draft', 'submitted', 'approved', 'rejected', 'archived');
  CREATE TYPE "public"."enum_artifacts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__artifacts_v_version_workflow_status" AS ENUM('draft', 'submitted', 'approved', 'rejected', 'archived');
  CREATE TYPE "public"."enum__artifacts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_exhibits_workflow_status" AS ENUM('draft', 'submitted', 'approved', 'rejected', 'archived');
  CREATE TYPE "public"."enum_exhibits_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__exhibits_v_version_workflow_status" AS ENUM('draft', 'submitted', 'approved', 'rejected', 'archived');
  CREATE TYPE "public"."enum__exhibits_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_achievements_requirement_type" AS ENUM('pearls_collected', 'exhibits_completed', 'perfect_score');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'viewer' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"prefix" varchar DEFAULT 'media',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "artifacts_assessment_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"is_correct" boolean DEFAULT false
  );
  
  CREATE TABLE "artifacts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"full_description" jsonb,
  	"thumbnail_id" integer,
  	"model_file_id" integer,
  	"audio_narration_id" integer,
  	"workflow_status" "enum_artifacts_workflow_status" DEFAULT 'draft',
  	"published_at" timestamp(3) with time zone,
  	"assessment_question" varchar,
  	"difficulty_config_easy_fragment_count" numeric,
  	"difficulty_config_easy_time_limit" numeric,
  	"difficulty_config_easy_pearl_reward" numeric,
  	"difficulty_config_medium_fragment_count" numeric,
  	"difficulty_config_medium_time_limit" numeric,
  	"difficulty_config_medium_pearl_reward" numeric,
  	"difficulty_config_hard_fragment_count" numeric,
  	"difficulty_config_hard_time_limit" numeric,
  	"difficulty_config_hard_pearl_reward" numeric,
  	"model_metadata_file_size" numeric,
  	"model_metadata_polygon_count" numeric,
  	"model_metadata_texture_resolution" varchar,
  	"model_metadata_mobile_optimized" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_artifacts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_artifacts_v_version_assessment_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"is_correct" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_artifacts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_full_description" jsonb,
  	"version_thumbnail_id" integer,
  	"version_model_file_id" integer,
  	"version_audio_narration_id" integer,
  	"version_workflow_status" "enum__artifacts_v_version_workflow_status" DEFAULT 'draft',
  	"version_published_at" timestamp(3) with time zone,
  	"version_assessment_question" varchar,
  	"version_difficulty_config_easy_fragment_count" numeric,
  	"version_difficulty_config_easy_time_limit" numeric,
  	"version_difficulty_config_easy_pearl_reward" numeric,
  	"version_difficulty_config_medium_fragment_count" numeric,
  	"version_difficulty_config_medium_time_limit" numeric,
  	"version_difficulty_config_medium_pearl_reward" numeric,
  	"version_difficulty_config_hard_fragment_count" numeric,
  	"version_difficulty_config_hard_time_limit" numeric,
  	"version_difficulty_config_hard_pearl_reward" numeric,
  	"version_model_metadata_file_size" numeric,
  	"version_model_metadata_polygon_count" numeric,
  	"version_model_metadata_texture_resolution" varchar,
  	"version_model_metadata_mobile_optimized" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__artifacts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "exhibits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"description" jsonb,
  	"thumbnail_id" integer,
  	"workflow_status" "enum_exhibits_workflow_status" DEFAULT 'draft',
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_exhibits_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "exhibits_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"artifacts_id" integer
  );
  
  CREATE TABLE "_exhibits_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_description" jsonb,
  	"version_thumbnail_id" integer,
  	"version_workflow_status" "enum__exhibits_v_version_workflow_status" DEFAULT 'draft',
  	"version_sort_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__exhibits_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_exhibits_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"artifacts_id" integer
  );
  
  CREATE TABLE "achievements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"icon_id" integer,
  	"requirement_type" "enum_achievements_requirement_type" NOT NULL,
  	"requirement_value" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"artifacts_id" integer,
  	"exhibits_id" integer,
  	"achievements_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artifacts_assessment_options" ADD CONSTRAINT "artifacts_assessment_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."artifacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artifacts" ADD CONSTRAINT "artifacts_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "artifacts" ADD CONSTRAINT "artifacts_model_file_id_media_id_fk" FOREIGN KEY ("model_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "artifacts" ADD CONSTRAINT "artifacts_audio_narration_id_media_id_fk" FOREIGN KEY ("audio_narration_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artifacts_v_version_assessment_options" ADD CONSTRAINT "_artifacts_v_version_assessment_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_artifacts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_artifacts_v" ADD CONSTRAINT "_artifacts_v_parent_id_artifacts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."artifacts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artifacts_v" ADD CONSTRAINT "_artifacts_v_version_thumbnail_id_media_id_fk" FOREIGN KEY ("version_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artifacts_v" ADD CONSTRAINT "_artifacts_v_version_model_file_id_media_id_fk" FOREIGN KEY ("version_model_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artifacts_v" ADD CONSTRAINT "_artifacts_v_version_audio_narration_id_media_id_fk" FOREIGN KEY ("version_audio_narration_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "exhibits" ADD CONSTRAINT "exhibits_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "exhibits_rels" ADD CONSTRAINT "exhibits_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."exhibits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exhibits_rels" ADD CONSTRAINT "exhibits_rels_artifacts_fk" FOREIGN KEY ("artifacts_id") REFERENCES "public"."artifacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_exhibits_v" ADD CONSTRAINT "_exhibits_v_parent_id_exhibits_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."exhibits"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_exhibits_v" ADD CONSTRAINT "_exhibits_v_version_thumbnail_id_media_id_fk" FOREIGN KEY ("version_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_exhibits_v_rels" ADD CONSTRAINT "_exhibits_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_exhibits_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_exhibits_v_rels" ADD CONSTRAINT "_exhibits_v_rels_artifacts_fk" FOREIGN KEY ("artifacts_id") REFERENCES "public"."artifacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "achievements" ADD CONSTRAINT "achievements_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_artifacts_fk" FOREIGN KEY ("artifacts_id") REFERENCES "public"."artifacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_exhibits_fk" FOREIGN KEY ("exhibits_id") REFERENCES "public"."exhibits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_achievements_fk" FOREIGN KEY ("achievements_id") REFERENCES "public"."achievements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "artifacts_assessment_options_order_idx" ON "artifacts_assessment_options" USING btree ("_order");
  CREATE INDEX "artifacts_assessment_options_parent_id_idx" ON "artifacts_assessment_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "artifacts_slug_idx" ON "artifacts" USING btree ("slug");
  CREATE INDEX "artifacts_thumbnail_idx" ON "artifacts" USING btree ("thumbnail_id");
  CREATE INDEX "artifacts_model_file_idx" ON "artifacts" USING btree ("model_file_id");
  CREATE INDEX "artifacts_audio_narration_idx" ON "artifacts" USING btree ("audio_narration_id");
  CREATE INDEX "artifacts_updated_at_idx" ON "artifacts" USING btree ("updated_at");
  CREATE INDEX "artifacts_created_at_idx" ON "artifacts" USING btree ("created_at");
  CREATE INDEX "artifacts__status_idx" ON "artifacts" USING btree ("_status");
  CREATE INDEX "_artifacts_v_version_assessment_options_order_idx" ON "_artifacts_v_version_assessment_options" USING btree ("_order");
  CREATE INDEX "_artifacts_v_version_assessment_options_parent_id_idx" ON "_artifacts_v_version_assessment_options" USING btree ("_parent_id");
  CREATE INDEX "_artifacts_v_parent_idx" ON "_artifacts_v" USING btree ("parent_id");
  CREATE INDEX "_artifacts_v_version_version_slug_idx" ON "_artifacts_v" USING btree ("version_slug");
  CREATE INDEX "_artifacts_v_version_version_thumbnail_idx" ON "_artifacts_v" USING btree ("version_thumbnail_id");
  CREATE INDEX "_artifacts_v_version_version_model_file_idx" ON "_artifacts_v" USING btree ("version_model_file_id");
  CREATE INDEX "_artifacts_v_version_version_audio_narration_idx" ON "_artifacts_v" USING btree ("version_audio_narration_id");
  CREATE INDEX "_artifacts_v_version_version_updated_at_idx" ON "_artifacts_v" USING btree ("version_updated_at");
  CREATE INDEX "_artifacts_v_version_version_created_at_idx" ON "_artifacts_v" USING btree ("version_created_at");
  CREATE INDEX "_artifacts_v_version_version__status_idx" ON "_artifacts_v" USING btree ("version__status");
  CREATE INDEX "_artifacts_v_created_at_idx" ON "_artifacts_v" USING btree ("created_at");
  CREATE INDEX "_artifacts_v_updated_at_idx" ON "_artifacts_v" USING btree ("updated_at");
  CREATE INDEX "_artifacts_v_latest_idx" ON "_artifacts_v" USING btree ("latest");
  CREATE UNIQUE INDEX "exhibits_slug_idx" ON "exhibits" USING btree ("slug");
  CREATE INDEX "exhibits_thumbnail_idx" ON "exhibits" USING btree ("thumbnail_id");
  CREATE INDEX "exhibits_updated_at_idx" ON "exhibits" USING btree ("updated_at");
  CREATE INDEX "exhibits_created_at_idx" ON "exhibits" USING btree ("created_at");
  CREATE INDEX "exhibits__status_idx" ON "exhibits" USING btree ("_status");
  CREATE INDEX "exhibits_rels_order_idx" ON "exhibits_rels" USING btree ("order");
  CREATE INDEX "exhibits_rels_parent_idx" ON "exhibits_rels" USING btree ("parent_id");
  CREATE INDEX "exhibits_rels_path_idx" ON "exhibits_rels" USING btree ("path");
  CREATE INDEX "exhibits_rels_artifacts_id_idx" ON "exhibits_rels" USING btree ("artifacts_id");
  CREATE INDEX "_exhibits_v_parent_idx" ON "_exhibits_v" USING btree ("parent_id");
  CREATE INDEX "_exhibits_v_version_version_slug_idx" ON "_exhibits_v" USING btree ("version_slug");
  CREATE INDEX "_exhibits_v_version_version_thumbnail_idx" ON "_exhibits_v" USING btree ("version_thumbnail_id");
  CREATE INDEX "_exhibits_v_version_version_updated_at_idx" ON "_exhibits_v" USING btree ("version_updated_at");
  CREATE INDEX "_exhibits_v_version_version_created_at_idx" ON "_exhibits_v" USING btree ("version_created_at");
  CREATE INDEX "_exhibits_v_version_version__status_idx" ON "_exhibits_v" USING btree ("version__status");
  CREATE INDEX "_exhibits_v_created_at_idx" ON "_exhibits_v" USING btree ("created_at");
  CREATE INDEX "_exhibits_v_updated_at_idx" ON "_exhibits_v" USING btree ("updated_at");
  CREATE INDEX "_exhibits_v_latest_idx" ON "_exhibits_v" USING btree ("latest");
  CREATE INDEX "_exhibits_v_rels_order_idx" ON "_exhibits_v_rels" USING btree ("order");
  CREATE INDEX "_exhibits_v_rels_parent_idx" ON "_exhibits_v_rels" USING btree ("parent_id");
  CREATE INDEX "_exhibits_v_rels_path_idx" ON "_exhibits_v_rels" USING btree ("path");
  CREATE INDEX "_exhibits_v_rels_artifacts_id_idx" ON "_exhibits_v_rels" USING btree ("artifacts_id");
  CREATE INDEX "achievements_icon_idx" ON "achievements" USING btree ("icon_id");
  CREATE INDEX "achievements_updated_at_idx" ON "achievements" USING btree ("updated_at");
  CREATE INDEX "achievements_created_at_idx" ON "achievements" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_artifacts_id_idx" ON "payload_locked_documents_rels" USING btree ("artifacts_id");
  CREATE INDEX "payload_locked_documents_rels_exhibits_id_idx" ON "payload_locked_documents_rels" USING btree ("exhibits_id");
  CREATE INDEX "payload_locked_documents_rels_achievements_id_idx" ON "payload_locked_documents_rels" USING btree ("achievements_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "artifacts_assessment_options" CASCADE;
  DROP TABLE "artifacts" CASCADE;
  DROP TABLE "_artifacts_v_version_assessment_options" CASCADE;
  DROP TABLE "_artifacts_v" CASCADE;
  DROP TABLE "exhibits" CASCADE;
  DROP TABLE "exhibits_rels" CASCADE;
  DROP TABLE "_exhibits_v" CASCADE;
  DROP TABLE "_exhibits_v_rels" CASCADE;
  DROP TABLE "achievements" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_artifacts_workflow_status";
  DROP TYPE "public"."enum_artifacts_status";
  DROP TYPE "public"."enum__artifacts_v_version_workflow_status";
  DROP TYPE "public"."enum__artifacts_v_version_status";
  DROP TYPE "public"."enum_exhibits_workflow_status";
  DROP TYPE "public"."enum_exhibits_status";
  DROP TYPE "public"."enum__exhibits_v_version_workflow_status";
  DROP TYPE "public"."enum__exhibits_v_version_status";
  DROP TYPE "public"."enum_achievements_requirement_type";`)
}
