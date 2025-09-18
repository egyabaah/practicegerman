"use client";

import { FC } from "react";
import { Card } from "@/components/ui/card";

interface FeedbackCardProps {
    result: string | null;
}

export const FeedbackCard: FC<FeedbackCardProps> = ({ result }) => {
    return (
        <Card className="flex-1 p-3 bg-muted gap-0 min-h-[200px]">
            {result
                ? result
                : "Corrections and suggestions will appear here after you check your sentence."}
        </Card>
    );
};