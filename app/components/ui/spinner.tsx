import { CircleNotch } from "@phosphor-icons/react";

type SpinnerProps = {
  size?: number;
};

export default function Spinner({ size = 20 }: SpinnerProps) {
  return (
    <CircleNotch weight="bold" size={size}>
      <animate
        attributeName="opacity"
        values="0.3;1;0.3"
        dur="1.5s"
        repeatCount="indefinite"
      ></animate>
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        dur="0.6s"
        from="0 0 0"
        to="360 0 0"
        repeatCount="indefinite"
      ></animateTransform>
    </CircleNotch>
  );
}
