import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { routeAccessMap } from './lib/utils';

// const isProtectedRoute = createRouteMatcher(['/admin', '/teacher']);

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));
export default clerkMiddleware(async (auth, req) => {
  // if (isProtectedRoute(req)) await auth.protect();
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req) && !allowedRoles.includes(role!)) {
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';
// import { routeAccessMap } from './lib/utils';

// export default clerkMiddleware(async (auth, req) => {
//   const { sessionClaims } = await auth();
//   const role = (sessionClaims?.metadata as { role?: string })?.role;

//   // If no role is found, redirect to sign-in
//   if (!role) {
//     return NextResponse.redirect(new URL('/sign-in', req.url));
//   }

//   // Dynamic route access control based on routeAccessMap
//   for (const [route, allowedRoles] of Object.entries(routeAccessMap)) {
//     const matcher = createRouteMatcher([route]);

//     if (matcher(req)) {
//       if (!allowedRoles.includes(role)) {
//         // Redirect to appropriate dashboard based on user's role
//         return NextResponse.redirect(new URL(`/${role}`, req.url));
//       }
//       break; // Stop checking after first match
//     }
//   }

//   // Optional: Additional logging or custom logic
//   console.log(`User with role ${role} accessing ${req.nextUrl.pathname}`);
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and static files
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//     // Add specific routes you want to protect
//     '/admin/:path*',
//     '/teacher/:path*',
//     '/dashboard/:path*',
//   ],
// };
