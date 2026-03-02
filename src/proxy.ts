import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server"

const isProtected = createRouteMatcher(["/debates(.*)"])

export const proxy = convexAuthNextjsMiddleware(
  async (request, { convexAuth }) => {
    const authed = await convexAuth.isAuthenticated()

    if (!authed && isProtected(request)) {
      return nextjsMiddlewareRedirect(request, "/sign-in")
    }
  },
)

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
