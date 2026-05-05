"use client";

import { useEditor } from "@/app/providers/editor-provider";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { upsertSite } from "@/lib/actions/page";
import React, { useState } from "react";
import { toast } from "sonner";

function SEOSettings() {
  const { state } = useEditor();
  const [loading, setLoading] = useState(false);

  const handleUpdateSEO = async (field: string, value: string) => {
    setLoading(true);
    try {
      const res = await upsertSite({
        id: state.editor.siteId,
        [field]: value,
      } as any);
      
      if (res.success) {
        toast.success("SEO Updated", { description: `${field} saved successfully` });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccordionItem value="SEO" className="px-2 py-0 border-y-[1px]">
      <AccordionTrigger className="!no-underline">Page SEO</AccordionTrigger>
      <AccordionContent className="flex flex-col px-1 gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] text-muted-foreground uppercase font-bold">SEO Title</p>
          <Input 
            placeholder="Page title for Google..." 
            className="h-8 text-xs"
            onBlur={(e) => handleUpdateSEO("title", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[10px] text-muted-foreground uppercase font-bold">SEO Description</p>
          <Textarea 
            placeholder="Short description for search results..." 
            className="text-xs resize-none"
            rows={3}
            onBlur={(e) => handleUpdateSEO("description", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[10px] text-muted-foreground uppercase font-bold">Favicon URL</p>
          <Input 
            placeholder="https://.../icon.png" 
            className="h-8 text-xs"
            onBlur={(e) => handleUpdateSEO("favicon", e.target.value)}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default SEOSettings;
