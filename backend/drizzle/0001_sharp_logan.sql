CREATE INDEX "document_user_id_idx" ON "document" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "document_created_at_idx" ON "document" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "document_user_created_idx" ON "document" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_token_idx" ON "session" USING btree ("token");