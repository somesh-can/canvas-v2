function normalizePathname(pathname) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
}

export function getSessionIdFromPresentationData(presentationData) {
  const joinUrl = presentationData?.voting?.joinUrl ?? "";
  const joinMatch = String(joinUrl).match(/\/join\/([^/?#]+)/i);

  if (joinMatch?.[1]) {
    return decodeURIComponent(joinMatch[1]);
  }

  const joinCode = String(presentationData?.voting?.joinCode ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (joinCode) {
    return joinCode;
  }

  return "session";
}

export function getParticipantPath(sessionId) {
  return `/join/${encodeURIComponent(sessionId)}`;
}

export function parseAppRoute(pathname) {
  const normalizedPathname = normalizePathname(pathname);
  const participantMatch = normalizedPathname.match(/^\/join\/([^/]+)$/i);

  if (participantMatch?.[1]) {
    return {
      kind: "participant",
      sessionId: decodeURIComponent(participantMatch[1]),
    };
  }

  if (normalizedPathname === "/report") {
    return { kind: "report" };
  }

  return { kind: "canvas" };
}

export function getPathForRoute(route) {
  if (route?.kind === "participant") {
    return getParticipantPath(route.sessionId);
  }

  return route?.kind === "report" ? "/report" : "/canvas";
}
