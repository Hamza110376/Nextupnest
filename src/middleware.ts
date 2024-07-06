import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
   publicRoutes: ['./site', '/api/uploadthing']
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};