"use client";

import { useEditor } from "@/app/providers/editor-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { updateSite } from "@/lib/actions/page";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { siteDetails } = useEditor();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: siteDetails?.title || "",
    subdomain: siteDetails?.subdomain || "",
  });

  if (!siteDetails) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateSite(siteDetails.id, formData);
      if (res.success) {
        toast.success("Settings updated successfully");
      } else {
        toast.error(res.msg || "Failed to update settings");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your website settings</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>
              Basic information about your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Site Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="My Awesome Site"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subdomain">Subdomain</Label>
                <div className="flex gap-2">
                  <Input
                    id="subdomain"
                    value={formData.subdomain}
                    onChange={(e) =>
                      setFormData({ ...formData, subdomain: e.target.value })
                    }
                    placeholder="my-site"
                  />
                  <div className="flex items-center px-3 rounded-md bg-muted text-sm border border-input">
                    .{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
                  </div>
                </div>
              </div>
              <Button disabled={loading} type="submit" className="w-full">
                {loading ? <Loader2 className="animate-spin" /> : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions for your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">Delete Website</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
