"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Page, Site } from "@prisma/client";
import { revalidateTag, unstable_cache } from "next/cache";

type SiteProps = {
  title: string;
  subdomain: string;
};

export async function createSite({ title, subdomain }: SiteProps) {
  const { userId } = await auth();

  if (!userId) return { success: false, msg: "User not signed in" };

  const existingSite = await (db as any).site.findFirst({
    where: { subdomain: subdomain },
  });

  if (existingSite) {
    return { success: false, msg: "Subdomain is already in use" };
  }

  try {
    const site = await (db as any).site.create({
      data: {
        userId: userId,
        title: title,
        subdomain: subdomain,
        pages: {
          create: {
            title: "Home",
            slug: "index",
            content: "[]",
          },
        },
      },
    });
    return { success: true, site: site };
  } catch (error) {
    return {
      success: false,
      msg: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function updateSite(siteId: string, data: Partial<Site>) {
  const { userId } = await auth();
  if (!userId) return { success: false, msg: "User not signed in" };

  try {
    const site = await (db as any).site.update({
      where: { id: siteId, userId: userId },
      data: {
        title: data.title,
        subdomain: data.subdomain,
        previewImage: data.previewImage,
        visible: data.visible,
      },
    });

    revalidateTag(site.subdomain);
    return { success: true, site };
  } catch (error) {
    return {
      success: false,
      msg: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function upsertPage({
  id,
  title,
  slug,
  content,
}: {
  id: string;
  title?: string;
  slug?: string;
  content?: string;
}) {
  const { userId } = await auth();
  if (!userId) return { success: false, msg: "User not signed in" };

  try {
    const page = await (db as any).page.update({
      where: { id: id },
      data: {
        title: title,
        slug: slug,
        content: content,
      },
      include: { site: true },
    });

    revalidateTag(page.site.subdomain);
    return { success: true, page };
  } catch (error) {
    return {
      success: false,
      msg: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function deleteSite(siteId: string) {
  const { userId } = await auth();

  if (!userId) return { success: false, msg: "User not signed in" };

  try {
    const response = await (db as any).site.delete({
      where: {
        id: siteId,
        userId: userId,
      },
    });

    revalidateTag(response.subdomain);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      msg: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function getPageDetails(pageId: string) {
  try {
    const res = await (db as any).page.findUnique({
      where: { id: pageId },
      include: { site: true },
    });
    if (!res) {
      throw new Error("Page not found");
    }
    return { success: true, content: res.content, page: res };
  } catch (error) {
    return {
      success: false,
      msg: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function createPage({
  siteId,
  title,
  slug,
}: {
  siteId: string;
  title: string;
  slug: string;
}) {
  const { userId } = await auth();
  if (!userId) return { success: false, msg: "User not signed in" };

  try {
    const page = await (db as any).page.create({
      data: {
        siteId,
        title,
        slug,
        content: "[]",
      },
    });
    return { success: true, page };
  } catch (error) {
    return {
      success: false,
      msg: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function getSitePages(siteId: string) {
  try {
    const pages = await (db as any).page.findMany({
      where: { siteId },
      orderBy: { createdAt: "asc" },
    });
    return { success: true, pages };
  } catch (error) {
    return {
      success: false,
      msg: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function deletePage(pageId: string) {
  const { userId } = await auth();
  if (!userId) return { success: false, msg: "User not signed in" };

  try {
    const page = await (db as any).page.delete({
      where: { id: pageId },
      include: { site: true },
    });

    revalidateTag(page.site.subdomain);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      msg: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export const getSiteByDomain = async (subdomainName: string) => {
  try {
    const response = await unstable_cache(
      async () => {
        const response = await (db as any).site.findUnique({
          where: {
            subdomain: subdomainName,
          },
          include: {
            pages: {
              where: {
                slug: "index",
              },
            },
          },
        });

        return response;
      },
      [subdomainName],
      {
        revalidate: 900, // 15 Minutes
        tags: [subdomainName],
      }
    )();

    if (!response) {
      return { success: false, msg: "Site not found" };
    }

    if (!response.visible) {
      const session = await auth();
      if (!(session.userId === response.userId))
        return {
          success: true,
          msg: "The requested site is private (for now), come back later!",
          private: true,
        };

      return { success: true, site: response };
    }

    return { success: true, site: response };
  } catch (error) {
    return {
      success: false,
      msg: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};
