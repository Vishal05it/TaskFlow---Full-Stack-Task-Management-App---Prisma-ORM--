import { BrevoClient } from "@getbrevo/brevo";
if (!process.env.BREVO_PASSWORD) {
  throw new Error("BREVO KEY MISSING");
}
export const brevo = new BrevoClient({
  apiKey: process.env.BREVO_PASSWORD!,
});
