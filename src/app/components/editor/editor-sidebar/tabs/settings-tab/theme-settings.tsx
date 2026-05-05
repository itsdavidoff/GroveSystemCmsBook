"use client";

import { useEditor } from "@/app/providers/editor-provider";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

const fonts = [
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Roboto", value: "'Roboto', sans-serif" },
  { label: "Playfair Display", value: "'Playfair Display', serif" },
  { label: "Montserrat", value: "'Montserrat', sans-serif" },
  { label: "Open Sans", value: "'Open Sans', sans-serif" },
];

function ThemeSettings() {
  const { state, dispatch } = useEditor();
  const { designTokens } = state.editor;

  const updateTokens = (updates: any) => {
    dispatch({
      type: "SET_DESIGN_TOKENS",
      payload: updates,
    });
  };

  return (
    <AccordionItem value="Theme" className="px-2 py-0 border-y-[1px]">
      <AccordionTrigger className="!no-underline">Global Theme</AccordionTrigger>
      <AccordionContent className="flex flex-col px-1 gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Typography</p>
          
          <div className="flex flex-col gap-2">
            <p className="text-[10px] text-muted-foreground">Primary Font (Headings)</p>
            <Select
              value={designTokens.fonts.primary}
              onValueChange={(val) => updateTokens({ fonts: { primary: val } })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                {fonts.map((f) => (
                  <SelectItem key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[10px] text-muted-foreground">Secondary Font (Body)</p>
            <Select
              value={designTokens.fonts.secondary}
              onValueChange={(val) => updateTokens({ fonts: { secondary: val } })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                {fonts.map((f) => (
                  <SelectItem key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Brand Colors</p>
          
          <div className="flex flex-col gap-2">
            <p className="text-[10px] text-muted-foreground">Primary Action Color</p>
            <div className="flex items-center gap-2">
              <ColorPicker
                value={designTokens.colors.primary}
                onChange={(val) => updateTokens({ colors: { primary: val } })}
              />
              <span className="text-[10px] font-mono">{designTokens.colors.primary}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[10px] text-muted-foreground">Secondary Color</p>
            <div className="flex items-center gap-2">
              <ColorPicker
                value={designTokens.colors.secondary}
                onChange={(val) => updateTokens({ colors: { secondary: val } })}
              />
              <span className="text-[10px] font-mono">{designTokens.colors.secondary}</span>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default ThemeSettings;
