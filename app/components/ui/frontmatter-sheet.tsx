import { Code } from "@phosphor-icons/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Button } from "./button";
import { Separator } from "./separator";

type FrontmatterSheetProps = {
  frontmatter: Record<string, string> | null | undefined;
};

export default function FrontmatterSheet({
  frontmatter,
}: FrontmatterSheetProps) {
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="ghost" size="sm">
          <Code weight="bold" /> Metadata
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col space-y-2">
        <SheetHeader>
          <SheetTitle>Metadata</SheetTitle>
          <SheetDescription>
            Front matter attributes discovered
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="text-sm flex flex-col space-y-2">
          {Object.entries(frontmatter ?? {}).map(([key, value]) => (
            <code key={`${key}-${value}`}>
              {key}: {value}
            </code>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
