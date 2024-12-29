import { ArrowUUpLeft, CloudX } from "@phosphor-icons/react";
import { useNavigate } from "@remix-run/react";
import { Button } from "./button";

type ErrorPageProps = {
  message: string;
};

export default function ErrorPage({ message }: ErrorPageProps) {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full flex flex-col items-center justify-center space-y-4 text-gray-500">
      <CloudX weight="light" size={48} />
      <p>{message}</p>
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowUUpLeft weight="bold" /> Take me back!
      </Button>
    </div>
  );
}
