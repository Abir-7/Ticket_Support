import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const appConfig = {
  database: { dataBase_uri: process.env.DATABASE_URI },
  server: {
    port: process.env.PORT,
    node_env: process.env.NODE_ENV,
    ip: process.env.IP_ADDRESS,
  },

  jwt: {
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_access_exprire: process.env.JWT_ACCESS_EXPIRE,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_refresh_exprire: process.env.JWT_REFRESH_EXPIRE,
  },
  bcrypt: {
    salt_round: process.env.SALT_ROUND,
  },
  email: {
    nodeMailer: {
      from: process.env.EMAIL_FROM,
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT as string),
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    resend: {
      re_send_api_key: process.env.RESEND_API_KEY,
    },
    mail_jett: {
      secret_key: process.env.SECRET_KEY,
      api_key: process.env.API_KEY,
    },
  },
  multer: {
    file_size_limit: process.env.MAX_FILE_SIZE,
    max_file_number: process.env.MAX_COUNT_FILE,
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
  ai_key: {
    gemini: process.env.GEMINI_KEY,
    open_ai: process.env.GPT_KEY,
  },
  encrypt: {
    s_key: process.env.ENCRYPTION_SECRET_KEY,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  rabbitMq: {
    url: process.env.RABBITMQ_URL,
  },
};
