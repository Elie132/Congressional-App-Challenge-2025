export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL || "http://localhost:5174",
      applicationID: "convex",
    },
  ],
};
