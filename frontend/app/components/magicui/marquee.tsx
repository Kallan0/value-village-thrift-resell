import * as React from "react";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
}

export function Marquee({
  children,
  reverse = false,
  pauseOnHover = false,
  className = "",
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={["flex overflow-hidden whitespace-nowrap", className].filter(Boolean).join(" ")}
    >
      <div
        className={[
          "flex min-w-max items-center gap-4 py-2",
          pauseOnHover ? "hover:[animation-play-state:paused]" : "",
          reverse ? "animate-[marquee_20s_linear_infinite_reverse]" : "animate-[marquee_20s_linear_infinite]",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
