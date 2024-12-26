import { Eye, StackPlus } from "@phosphor-icons/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { buttonVariants } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

dayjs.extend(relativeTime);

type RepositoryCardProps = {
  name: string;
  description: string | null;
  sourceUrl: string;
  updatedAt: string;
};

export default function TemplateCard({
  name,
  description,
  sourceUrl,
  updatedAt,
}: RepositoryCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>Updated {dayjs(updatedAt).fromNow()}</CardDescription>
      </CardHeader>
      {Boolean(description) && (
        <CardContent>
          <HoverCard>
            <HoverCardTrigger>
              <p className="line-clamp-2 text-sm cursor-pointer">
                {description}
              </p>
            </HoverCardTrigger>
            <HoverCardContent className="w-full max-w-sm">
              <p>{description}</p>
            </HoverCardContent>
          </HoverCard>
        </CardContent>
      )}
      <CardFooter className="mt-auto">
        <div className="flex justify-end space-x-1 w-full">
          <a
            href={sourceUrl}
            target="_blank"
            className={buttonVariants({ variant: "outline", size: "icon" })}
          >
            <Eye weight="bold" />
          </a>
          <a
            href={`/app/build/${name}`}
            className={buttonVariants({ variant: "default" })}
          >
            <StackPlus weight="bold" /> Use Template
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}
