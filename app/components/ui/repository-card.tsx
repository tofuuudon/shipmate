import {
  Eye,
  Files,
  LockSimple,
  LockSimpleOpen,
  Star,
} from "@phosphor-icons/react";
import classNames from "classnames";
import { Badge } from "./badge";
import { Button, buttonVariants } from "./button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

type RepositoryCardProps = {
  name: string;
  description: string | null;
  isPrivate: boolean;
  stars: number;
  sourceUrl: string;
};

export default function RepositoryCard({
  name,
  description,
  isPrivate,
  stars,
  sourceUrl,
}: RepositoryCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="space-y-2">
        <CardTitle>{name}</CardTitle>
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
      <CardContent>
        {Boolean(description) && (
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
        )}
      </CardContent>
      <CardFooter className="mt-auto">
        <div className="flex justify-end space-x-1 w-full">
          <Button variant="outline">
            <Files weight="bold" />
          </Button>
          <a
            href={sourceUrl}
            target="_blank"
            className={buttonVariants({ variant: "outline" })}
          >
            <Eye weight="bold" />
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}