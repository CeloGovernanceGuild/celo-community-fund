import { activeInitiatives } from "./active_initiatives.js";
import { completedInitiatives } from "./completed_initiatives.js";

export { drafts } from "./drafts.js";
export const initiatives = [...activeInitiatives, ...completedInitiatives];
