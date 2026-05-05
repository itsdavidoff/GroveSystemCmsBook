"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteSite } from "../../../lib/actions/page";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Button } from "../../../components/ui/button";
import { MoreHorizontal, Globe, Clock, ExternalLink } from "lucide-react";
import { formatTimeAgo } from "../../../lib/utils";
import { Page } from "@prisma/client";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import Link from "next/link";
import { getLink } from "../../../lib/getLink";

function PageItem({ site }: { site: Page }) {
  const router = useRouter();

  const handleDelete = async (siteId: string) => {
    const result = await deleteSite(siteId);
    if (result.success) {
      toast.success("Success", { description: "Site deleted successfully" });
    } else {
      toast.error("Error", { description: "Failed to delete site" });
    }

    router.refresh();
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border-muted-foreground/10">
      <div className="flex flex-col sm:flex-row">
        {/* Preview Placeholder */}
        <div className="w-full sm:w-48 h-32 bg-muted/30 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-muted-foreground/10 group-hover:bg-muted/50 transition-colors">
          <Globe className="w-10 h-10 text-muted-foreground/20" />
        </div>
        
        <div className="flex-1 flex flex-col justify-between p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <Link
                href={getLink({ subdomain: "editor", pathName: site.id })}
                className="group/title block"
              >
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold truncate transition-colors group-hover/title:text-primary">
                    {site.title}
                  </h2>
                  <ExternalLink className="w-4 h-4 opacity-0 transition-opacity group-hover/title:opacity-100 text-primary" />
                </div>
              </Link>
              
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <Link
                  href={getLink({ subdomain: site.subdomain })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors truncate"
                >
                  {site.subdomain}.{process.env.NEXT_PUBLIC_ROOT_DOMAIN || "vercel.app"}
                </Link>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 hover:bg-accent/50 -mr-2"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={getLink({ subdomain: "editor", pathName: site.id })}>
                    Open Editor
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 text-destructive"
                  onClick={() => handleDelete(site.id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4 flex items-center gap-4 text-[12px] text-muted-foreground border-t border-muted-foreground/5 pt-3">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimeAgo(Number(site.updatedAt))}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${site.visible ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span>{site.visible ? 'Published' : 'Draft'}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default PageItem;
