"use client";

import { useEditor } from "@/app/providers/editor-provider";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Settings2 } from "lucide-react";
import { createPage } from "@/lib/actions/page";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function PagesManager() {
  const { state } = useEditor();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      router.refresh();
    } else {
      toast.error("Failed to create page");
    }
    setLoading(false);
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
        <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg border border-primary/20 cursor-pointer text-sm font-medium">
          <FileText className="h-4 w-4 text-primary" />
          <span>Home (index)</span>
        </div>
        {/* Placeholder for more pages */}
        <p className="text-[10px] text-center text-muted-foreground mt-2 italic">
          Additional pages will appear here.
        </p>
      </div>
    </div>
  );
}

export default PagesManager;
