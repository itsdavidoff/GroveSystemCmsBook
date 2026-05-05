export function getLink({
  subdomain,
  pathName = "",
  method = true,
}: {
  subdomain?: string;
  pathName?: string;
  method?: boolean;
}): string {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
  if (!rootDomain) {
    throw new Error("NEXT_PUBLIC_ROOT_DOMAIN is not defined");
  }

  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const base = method ? `${protocol}://${rootDomain}` : rootDomain;

  // Handle editor separately for Vercel Hobby compatibility
  if (subdomain === "editor") {
    return `${base}/editor/${pathName}`;
  }

  // Handle other subdomains
  if (subdomain) {
    return method 
      ? `${protocol}://${subdomain}.${rootDomain}/${pathName}`
      : `${subdomain}.${rootDomain}/${pathName}`;
  }

  return `${base}/${pathName}`;
}
