import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

export const logger = pino({
    name: "Website Builder SDK",
    level: isProduction ? "silent" : "debug",
    ...(isProduction ? {} : { transport: { target: "pino-pretty" } })
});
