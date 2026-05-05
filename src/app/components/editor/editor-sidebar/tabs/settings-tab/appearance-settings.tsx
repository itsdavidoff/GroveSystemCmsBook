import { useEditor } from "@/app/providers/editor-provider";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ColorPicker } from "@/components/ui/color-picker";
import { Input } from "@/components/ui/input";
import React from "react";

type Props = {
  handleOnChange: (e: any) => void;
  handleSelectChange: (value: string, property: string) => void;
};

function AppearanceSettings({ handleOnChange }: Props) {
  const { state } = useEditor();
  const styles = state.editor.selectedElement.styles;

  return (
    <AccordionItem value="Appearance" className="px-2 py-0 border-y-[1px]">
      <AccordionTrigger className="!no-underline">Appearance</AccordionTrigger>
      <AccordionContent className="flex flex-col px-1 gap-4">
        <div className="w-full">
          <p className="mb-2 text-muted-foreground text-xs uppercase font-bold tracking-widest">Colors</p>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <p className="text-[10px] text-muted-foreground">Background</p>
              <div className="flex space-x-2">
                <ColorPicker
                  onChange={(color: string) => {
                    const e = { target: { id: "backgroundColor", value: color } };
                    handleOnChange(e);
                  }}
                  id="backgroundColor"
                  value={styles.backgroundColor || "#ffffff"}
                />
                <Input
                  id="backgroundColor"
                  type="text"
                  maxLength={7}
                  value={styles.backgroundColor || "#ffffff"}
                  onChange={handleOnChange}
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[10px] text-muted-foreground">Text Color</p>
              <div className="flex space-x-2">
                <ColorPicker
                  onChange={(color: string) => {
                    const e = { target: { id: "color", value: color } };
                    handleOnChange(e);
                  }}
                  id="color"
                  value={styles.color || "#000000"}
                />
                <Input
                  id="color"
                  type="text"
                  maxLength={7}
                  value={styles.color || "#000000"}
                  onChange={handleOnChange}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <p className="mb-2 text-muted-foreground text-xs uppercase font-bold tracking-widest">Spacing</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-[10px] text-muted-foreground">Padding</p>
              <div className="grid grid-cols-2 gap-1">
                <Input id="paddingTop" placeholder="Top" value={styles.paddingTop || ""} onChange={handleOnChange} className="h-7 text-[10px] px-1" />
                <Input id="paddingBottom" placeholder="Btm" value={styles.paddingBottom || ""} onChange={handleOnChange} className="h-7 text-[10px] px-1" />
                <Input id="paddingLeft" placeholder="Left" value={styles.paddingLeft || ""} onChange={handleOnChange} className="h-7 text-[10px] px-1" />
                <Input id="paddingRight" placeholder="Right" value={styles.paddingRight || ""} onChange={handleOnChange} className="h-7 text-[10px] px-1" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[10px] text-muted-foreground">Margin</p>
              <div className="grid grid-cols-2 gap-1">
                <Input id="marginTop" placeholder="Top" value={styles.marginTop || ""} onChange={handleOnChange} className="h-7 text-[10px] px-1" />
                <Input id="marginBottom" placeholder="Btm" value={styles.marginBottom || ""} onChange={handleOnChange} className="h-7 text-[10px] px-1" />
                <Input id="marginLeft" placeholder="Left" value={styles.marginLeft || ""} onChange={handleOnChange} className="h-7 text-[10px] px-1" />
                <Input id="marginRight" placeholder="Right" value={styles.marginRight || ""} onChange={handleOnChange} className="h-7 text-[10px] px-1" />
              </div>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default AppearanceSettings;
