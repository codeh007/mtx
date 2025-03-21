import { Request, Response } from "express";
import { getWebScraperQueue } from "../services/queue-service";
import { supabaseGetJobById } from "../lib/supabase-jobs";

export async function crawlJobStatusPreviewController(req: Request, res: Response) {
  try {
    const job = await getWebScraperQueue().getJob(req.params.jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const { current, current_url, total, current_step, partialDocs } = await job.progress();
    let data = job.returnvalue;
    if (process.env.USE_DB_AUTHENTICATION === "true") {
      const supabaseData = await supabaseGetJobById(req.params.jobId);

      if (supabaseData) {
        data = supabaseData.docs;
      }
    }

    const jobStatus = await job.getState();

    res.json({
      status: jobStatus,
      // progress: job.progress(),
      current,
      current_url,
      current_step,
      total,
      data: data ? data : null,
      partial_data: jobStatus == 'completed' ? [] : partialDocs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
