import { zodResolver } from "@hookform/resolvers/zod";
import { FetcherWithComponents } from "@remix-run/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "./button";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Separator } from "./separator";

type PresetInput = {
  type: "string";
  label: string;
};

type Preset = {
  name: string;
  filename: string;
  inputs: Record<string, PresetInput>;
};

type BuilderFormProps = {
  fetcher: FetcherWithComponents<unknown>;
  presets: Preset[];
};

export default function BuilderForm({ fetcher, presets }: BuilderFormProps) {
  const [selectedPresetValue, setSelectedPresetValue] = useState<string | null>(
    null,
  );
  const selectedPreset = presets.find(
    (preset) => preset.filename === selectedPresetValue,
  );

  let schemaObj: Record<string, z.ZodString> = {
    name: z.string(),
    description: z.string(),
  };
  Object.entries(selectedPreset?.inputs ?? {}).forEach(([key]) => {
    schemaObj[key] = z.string();
  });
  const schema = z.object(schemaObj);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  function onSubmit(data: z.infer<typeof schema>) {
    fetcher.submit(data, {
      method: "POST",
      encType: "application/json",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormItem>
          <FormLabel>Preset</FormLabel>
          <Select onValueChange={(value) => setSelectedPresetValue(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a document" />
            </SelectTrigger>
            <SelectContent>
              {presets.map((preset) => (
                <SelectItem key={preset.filename} value={preset.filename}>
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
        {!!selectedPreset &&
          Object.entries(selectedPreset.inputs).map(([key, value]) => (
            <FormField
              key={key}
              control={form.control}
              name={key}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{value.label}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        <Button type="submit" disabled={fetcher.state !== "idle"}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
