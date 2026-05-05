"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

type ImageUploadProps = {
  onUpload: (url: string) => void;
  id?: string;
};

export function ImageUpload({ onUpload, id }: ImageUploadProps) {
  const [uploading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from("media").getPublicUrl(filePath);

      if (data) {
        onUpload(data.publicUrl);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error("Error uploading image");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative group">
        <Input
          type="file"
          id={id || "image-upload"}
          className="hidden"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
        />
        <Button
          asChild
          variant="outline"
          className="w-full h-20 border-dashed border-2 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 cursor-pointer"
          disabled={uploading}
        >
          <label htmlFor={id || "image-upload"}>
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Click to upload image</span>
              </>
            )}
          </label>
        </Button>
      </div>
    </div>
  );
}
