import { sendEmailBySandGrid } from "../utils/sendEmail";
import logger from "../utils/serverTool/logger";

import { consumeQueue } from "./consumer";

// Call the consumeQueue function to start consuming messages
export const startConsumers = async () => {
  // Start consuming from the emailQueue
  consumeQueue("emailQueue", async (job) => {
    const { to, subject, body } = job;
    try {
      logger.info(`Processing job: ${to}, ${subject} ,${body}`);
      await sendEmailBySandGrid(to, subject, body);
      logger.info(`Processing job done: ${to}, ${subject} ,${body}`);
    } catch (error) {
      logger.error("Error processing the job:", error);
    }
  });
};

// Initialize consumers when the app starts
