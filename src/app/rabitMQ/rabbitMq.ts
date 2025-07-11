/* eslint-disable @typescript-eslint/no-explicit-any */
import amqplib from "amqplib";

import { appConfig } from "../config";
import logger from "../utils/serverTool/logger";

const uri = appConfig.rabbitMq.url as string;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getChannel = async (
  retries = 5,
  delayMs = 3000
): Promise<amqplib.Channel> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const connection = await amqplib.connect(uri);
      const channel = await connection.createChannel();
      logger.info("✅ Connected to RabbitMQ and channel created");
      return channel;
    } catch (error: any) {
      logger.error(
        `❌ RabbitMQ connection attempt ${attempt} failed: ${
          error.message || error
        }`
      );

      if (attempt < retries) {
        logger.info(`Retrying to connect in ${delayMs / 1000} seconds...`);
        await sleep(delayMs);
      } else {
        logger.error("Failed to connect to RabbitMQ after multiple attempts");
        throw new Error(error);
      }
    }
  }
  // Just to satisfy typescript, but this line is unreachable
  throw new Error("Unexpected error connecting to RabbitMQ");
};
