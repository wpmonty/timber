import { withAuth } from 'next-auth/middleware';

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // Add any custom middleware logic here if needed
    console.log('Middleware: User is authenticated');
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Return true if user is authenticated
        return !!token;
      },
    },
  }
);

// Protect these routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/property/:path*',
    '/maintenance/:path*',
    '/api/properties/:path*',
    '/api/systems/:path*',
    '/api/logs/:path*',
    '/api/property/:path*',
    '/api/system/:path*',
    '/api/log/:path*',
  ],
};
