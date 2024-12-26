import {
  BookOpenText,
  Code,
  Eye,
  LockSimple,
  LockSimpleOpen,
  Star,
} from "@phosphor-icons/react";
import classNames from "classnames";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Badge } from "./badge";
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
  isPrivate: boolean;
  stars: number;
  sourceUrl: string;
  updatedAt: string;
};

export default function RepositoryCard({
  name,
  description,
  isPrivate,
  stars,
  sourceUrl,
  updatedAt,
}: RepositoryCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>Updated {dayjs(updatedAt).fromNow()}</CardDescription>
        <div className="flex space-x-1.5">
          <Badge
            variant="outline"
            className="space-x-1 items-center bg-amber-100 w-fit"
          >
            <Star weight="bold" />
            <p>{stars}</p>
          </Badge>
          <Badge
            variant="outline"
            className={classNames("space-x-1 items-center w-fit", {
              "bg-sky-100": isPrivate,
              "bg-green-100": !isPrivate,
            })}
          >
            {isPrivate ? (
              <LockSimple weight="bold" />
            ) : (
              <LockSimpleOpen weight="bold" />
            )}
            <p>{isPrivate ? "Private" : "Public"}</p>
          </Badge>
        </div>
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
            href={`/app/${name}/docs`}
            className={buttonVariants({ variant: "secondary", size: "icon" })}
          >
            <BookOpenText weight="bold" />
          </a>
          <a
            href={sourceUrl}
            target="_blank"
            className={buttonVariants({ variant: "secondary", size: "icon" })}
          >
            <Code weight="bold" />
          </a>
          <a
            href={`/app/${name}`}
            className={buttonVariants({ variant: "outline", size: "icon" })}
          >
            <Eye weight="bold" />
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}
