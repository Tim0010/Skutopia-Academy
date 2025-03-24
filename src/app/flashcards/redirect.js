export function middleware(request) {
  return Response.redirect(new URL('/dashboard/flashcards', request.url));
}

export const config = {
  matcher: ['/flashcards', '/flashcards/subjects'],
};
