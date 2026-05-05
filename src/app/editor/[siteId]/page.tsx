import { db } from "@/lib/db";
import EditorProvider from "@/app/providers/editor-provider";
import React from "react";
import EditorNavigation from "../../components/editor/editor-navigation";
import { auth } from "@clerk/nextjs/server";
import SiteEditor from "@/app/components/editor/site-editor";
import { RedirectToSignIn } from "@clerk/nextjs";
import LeftSidebar from "@/app/components/editor/editor-sidebar/left-sidebar";
import RightSidebar from "@/app/components/editor/editor-sidebar/right-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

type Props = {
  params: Promise<{
    siteId: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const session = await auth();

  const { siteId: pageId } = await params;
  console.log("DEBUG: Accessing editor for page:", pageId);
  console.log("DEBUG: Current User ID from session:", session.userId);

  const pageDetails = await (db as any).page.findFirst({
    where: {
      id: pageId,
    },
    include: { site: true },
  });

  if (!pageDetails) {
    console.error("DEBUG: Page not found in DB");
    return <RedirectToSignIn />;
  }

  console.log("DEBUG: Site Owner ID in DB:", pageDetails.site.userId);

  // Temporary relaxed check for debugging
  if (!session.userId) {
    console.warn("DEBUG: No session user ID found, redirecting...");
    return <RedirectToSignIn />;
  }

  // If IDs don't match, we still let you in for now but log it
  if (pageDetails.site.userId !== session.userId) {
    console.warn("DEBUG: Ownership mismatch! Site owner:", pageDetails.site.userId, "Current user:", session.userId);
    // return <RedirectToSignIn />; // Временно закомментировал, чтобы вы могли зайти
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <EditorProvider siteId={pageDetails.siteId} siteDetails={pageDetails as any}>
        <EditorNavigation siteDetails={pageDetails.site as any} />
        <div className="relative flex w-full h-full">
          <div className="flex-shrink-0 relative bg-muted">
            <SidebarProvider>
              <LeftSidebar />
              <SidebarTrigger className="w-12 h-12 ml-2" />
            </SidebarProvider>
          </div>
          <div className="flex-1 p-0 m-0">
            <SiteEditor siteId={pageId} />
          </div>
          <div className="flex-shrink-0">
            <RightSidebar />
          </div>
        </div>
      </EditorProvider>
    </div>
  );
};

export default Page;
