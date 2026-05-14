import { json } from "../responses/json";
import type { RouteHandler } from "../types/app";

export const healthRoute: RouteHandler = () => {
  return json({
    status: "healthy",
    uptime: "ok",
  });
};
