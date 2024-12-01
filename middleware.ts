import { NextRequest, NextResponse } from "next/server";

import { AllowedUsersId, cookieValues, Roles } from "./constants/data";
import {
  AUTHENTICATED_ROUTES,
  AuthRouteConfig,
  LandingPages,
  UNAUTHENTICATED_ROUTES,
} from "./constants/routes";

async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (AUTHENTICATED_ROUTES.some((v) => pathname.startsWith(v))) {
    const token = request.cookies.get(cookieValues.token);
    if (!token || !token.value) {
      return NextResponse.redirect(new URL(LandingPages.HOME, request.url));
    }
  }
  const userRole = request.cookies.get(cookieValues.userType);

  if (
    AUTHENTICATED_ROUTES.some((v) => pathname.startsWith(v)) &&
    !AllowedUsersId.includes(userRole?.value as string)
  ) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  return reRouteIftoken(request);
}

const reRouteIftoken = (request: NextRequest) => {
  const userRole = request.cookies.get(cookieValues.userType);
  const pathname = request.nextUrl.pathname;
  if (userRole && UNAUTHENTICATED_ROUTES.includes(pathname)) {
    return NextResponse.redirect(
      new URL(AuthRouteConfig.ORGANIZATIONAL_SETUP_COMPANIES, request.url),
    );
  }
};

module.exports = { middleware };
