import express from "express";
import { crawlController } from "../controllers/crawl";
import { crawlStatusController } from "../controllers/crawl-status";
import { scrapeController } from "../controllers/scrape";
import { crawlPreviewController } from "../controllers/crawlPreview";
import { crawlJobStatusPreviewController } from "../controllers/status";
import { searchController } from "../controllers/search";
import { crawlCancelController } from "../controllers/crawl-cancel";
import { keyAuthController } from "../controllers/keyAuth";

export const v0Router = express.Router();

v0Router.post("/v0/scrape", scrapeController);
v0Router.post("/v0/crawl", crawlController);
v0Router.post("/v0/crawlWebsitePreview", crawlPreviewController);
v0Router.get("/v0/crawl/status/:jobId", crawlStatusController);
v0Router.delete("/v0/crawl/cancel/:jobId", crawlCancelController);
v0Router.get("/v0/checkJobStatus/:jobId", crawlJobStatusPreviewController);

// Auth route for key based authentication
v0Router.get("/v0/keyAuth", keyAuthController);

// Search routes
v0Router.post("/v0/search", searchController);
