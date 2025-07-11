import { sendEmail } from "../utils/sendEmail";
import logger from "../utils/serverTool/logger";

import { consumeQueue } from "./consumer";

// Call the consumeQueue function to start consuming messages
export const startConsumers = () => {
  // Start consuming from the emailQueue
  consumeQueue("emailQueue", async (job) => {
    const { to, subject, body } = job;
    try {
      logger.info(`Processing job: ${to}, ${subject}`);
      await sendEmail(to, subject, body);
    } catch (error) {
      logger.error("Error processing the job:", error);
    }
  });
};

// Initialize consumers when the app starts
