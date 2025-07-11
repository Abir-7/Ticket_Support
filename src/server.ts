import server from "./app";
import { appConfig } from "./app/config";
import mongoose from "mongoose";
import logger from "./app/utils/serverTool/logger";
import seedAdmin from "./app/DB";
import { startConsumers } from "./app/rabitMQ/worker";

process.on("uncaughtException", (err) => {
  logger.error("Uncaught exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled promise rejection:", err);

  process.exit(1);
});

// Handle shutdown gracefully
process.on("SIGINT", async () => {
  process.exit(0);
});

process.on("SIGTERM", async () => {
  process.exit(0);
});

const main = async () => {
  await mongoose.connect(appConfig.database.dataBase_uri as string);
  logger.info("MongoDB connected");
  startConsumers();
  await seedAdmin();
  server.listen(
    Number(appConfig.server.port),
    appConfig.server.ip as string,

    () => {
      logger.info(
        `Example app listening on port ${appConfig.server.port} & ip:${
          appConfig.server.ip as string
        }`
      );
    }
  );
};
main().catch((err) => logger.error("Error connecting to MongoDB:", err));

// import cluster from "cluster";
// import os from "os";
// import mongoose from "mongoose";
// import server from "./app";
// import { appConfig } from "./app/config";
// import seedAdmin from "./app/DB";
// import logger from "./app/utils/serverTool/logger";

// const numCPUs = os.cpus().length;

// const gracefulShutdown = async () => {
//   logger.info(`Worker ${process.pid} shutting down...`);
//   await mongoose.disconnect();
//   server.close(() => {
//     logger.info(`Worker ${process.pid} HTTP server closed.`);
//     process.exit(0);
//   });

//   // Force exit after 10s if not closed
//   setTimeout(() => {
//     logger.error("Force shutdown");
//     process.exit(1);
//   }, 10000);
// };

// if (cluster.isPrimary) {
//   logger.info(`Primary process ${process.pid} running`);
//   logger.info(`Forking ${numCPUs} workers...`);

//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker, code, signal) => {
//     logger.error(
//       `Worker ${worker.process.pid} died with code ${code} (${signal}), restarting...`
//     );
//     cluster.fork();
//   });

//   // Listen for termination signals to gracefully shut down workers
//   const shutdown = () => {
//     logger.info("Primary shutting down all workers...");
//     for (const id in cluster.workers) {
//       cluster.workers[id]?.send("shutdown");
//     }
//     setTimeout(() => process.exit(0), 10000);
//   };

//   process.on("SIGINT", shutdown);
//   process.on("SIGTERM", shutdown);

//   // Optional: run seedAdmin once in primary only
//   (async () => {
//     try {
//       const mongoUri = appConfig.database.dataBase_uri as string;
//       if (!mongoUri) {
//         logger.error("MongoDB URI missing!");
//         process.exit(1);
//       }
//       await mongoose.connect(mongoUri);
//       logger.info("MongoDB connected (primary)");

//       await seedAdmin();
//       await mongoose.disconnect();
//       logger.info("Seed admin completed (primary)");
//     } catch (err) {
//       logger.error("Error during seedAdmin in primary:", err);
//       process.exit(1);
//     }
//   })();
// } else {
//   // Worker process

//   process.on("message", (msg) => {
//     if (msg === "shutdown") {
//       gracefulShutdown();
//     }
//   });

//   process.on("uncaughtException", (err) => {
//     logger.error(`Uncaught exception (worker ${process.pid}):`, err);
//     process.exit(1);
//   });

//   process.on("unhandledRejection", (err) => {
//     logger.error(`Unhandled rejection (worker ${process.pid}):`, err);
//     process.exit(1);
//   });

//   const main = async () => {
//     const mongoUri = appConfig.database.dataBase_uri as string;
//     if (!mongoUri) {
//       logger.error("MongoDB URI missing!");
//       process.exit(1);
//     }
//     await mongoose.connect(mongoUri);
//     logger.info(`MongoDB connected (worker ${process.pid})`);

//     // Do NOT run seedAdmin here anymore

//     server.setTimeout(15 * 60 * 1000);

//     const port = Number(appConfig.server.port);
//     const ip = appConfig.server.ip;

//     server.listen(port, ip, () => {
//       logger.info(`Worker ${process.pid} listening on ${ip}:${port}`);
//     });
//   };

//   main().catch((err) => {
//     logger.error(`Error starting server (worker ${process.pid}):`, err);
//     process.exit(1);
//   });
// }
