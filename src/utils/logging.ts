import { getAnalytics, logEvent } from "firebase/analytics";
import { app } from "../firebase";

const analytics = getAnalytics(app);

export const logPageView = (path: string) => {
  logEvent(analytics, "page_view", {
    page_path: path,
  });
};

export const logClick = (name: string) => {
  logEvent(analytics, "click", {
    name,
  });
};

export const logSearch = (query: string) => {
  logEvent(analytics, "search", {
    query,
  });
};
