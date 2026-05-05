"use client";

import { useEditor } from "@/app/providers/editor-provider";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Trash2, Loader2 } from "lucide-react";
import { createPage, getSitePages, deletePage } from "@/lib/actions/page";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";

function PagesManager() {
  const { state, dispatch } = useEditor();
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();
  const params = useParams();
  const currentPageId = params.siteId; // This is actually the pageId in the current URL structure

  const fetchPages = async () => {
    const siteId = state.editor.siteId;
    if (!siteId) return;
    setFetching(true);
    const res = await getSitePages(siteId);
    if (res.success) {
      setPages(res.pages || []);
    }
    setFetching(false);
  };

  useEffect(() => {
    fetchPages();
  }, [state.editor.siteId]);

  const handleSwitchPage = (pageId: string) => {
    if (currentPageId === pageId) return;
    router.push(`/editor/${pageId}`);
  };

  const handleCreatePage = async () => {
    const title = prompt("Enter page title (e.g., About Us)");
    if (!title) return;
    
    const slug = title.toLowerCase().replace(/\s+/g, "-");
    
    setLoading(true);
    const res = await createPage({
      siteId: state.editor.siteId,
      title,
      slug,
    });

    if (res.success) {
      toast.success("Page created!");
      fetchPages();
    } else {
      toast.error("Failed to create page");
    }
    setLoading(false);
  };

  const handleDeletePage = async (e: React.MouseEvent, pageId: string, slug: string) => {
    e.stopPropagation();
    if (slug === "index") {
      toast.error("Cannot delete home page");
      return;
    }

    if (!confirm("Are you sure you want to delete this page?")) return;

    const res = await (deletePage as any)(pageId);
    if (res.success) {
      toast.success("Page deleted");
      fetchPages();
      if (currentPageId === pageId) {
        // Find index page and redirect
        const indexPage = pages.find(p => p.slug === "index");
        if (indexPage) router.push(`/editor/${indexPage.id}`);
      }
    } else {
      toast.error("Failed to delete page");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Pages</h2>
        <Button size="icon" variant="ghost" onClick={handleCreatePage} disabled={loading}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-col gap-1">
        {fetching ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          pages.map((page) => (
            <div 
              key={page.id}
              onClick={() => handleSwitchPage(page.id)}
              className={cn(
                "flex items-center justify-between group p-2 rounded-lg border cursor-pointer text-sm transition-all",
                currentPageId === page.id 
                  ? "bg-primary/10 border-primary/20 font-medium text-primary" 
                  : "hover:bg-muted border-transparent"
              )}
            >
              <div className="flex items-center gap-2 truncate">
                <FileText className={cn("h-4 w-4", currentPageId === page.id ? "text-primary" : "text-muted-foreground")} />
                <span className="truncate">{page.title}</span>
                {page.slug === "index" && <span className="text-[10px] opacity-50">(Home)</span>}
              </div>
              
              {page.slug !== "index" && (
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleDeletePage(e, page.id, page.slug)}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PagesManager;
