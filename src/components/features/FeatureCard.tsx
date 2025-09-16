import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type LucideIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: React.ReactNode; // custom content body
  ctaText: string;
  ctaVariant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | null;
  onCtaClick?: () => void;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  children,
  ctaText,
  ctaVariant = "default",
  onCtaClick,
}: FeatureCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Icon className="h-6 w-6 text-primary" />
          <CardTitle>{title}</CardTitle>
        </div>
        {description ? (
          <CardDescription>{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="h-full flex flex-col justify-between">
        <div className="space-y-4">
          {children}
        </div>
        <Button className="w-full mt-6" variant={ctaVariant || "default"} onClick={onCtaClick}>
          {ctaText}
        </Button>
      </CardContent>
    </Card>
  );
}


