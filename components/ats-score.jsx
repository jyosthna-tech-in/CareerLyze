"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getATSScore } from "@/actions/resume";
import { Loader2, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import useFetch from "@/hooks/use-fetch";

export default function ATSScore({ content }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const {
    data: result,
    loading,
    error,
    fn: getATSScoreFn,
  } = useFetch(getATSScore);

  const handleCheck = async () => {
    if (!content) return;
    try {
      await getATSScoreFn(content);
    } catch (err) {
      console.log("Failed to analyze resume. Try again.");
    }
  };

  const getColor = (score) => {
    if (score >= 75) return "text-primary";
    if (score >= 50) return "text-secondary";
    return "text-destructive";
  };

  const getBarColor = (score) => {
    if (score >= 75) return "bg-primary";
    if (score >= 50) return "bg-secondary";
    return "bg-destructive";
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={handleCheck}
        disabled={loading || !content}
        className="w-full h-10 sm:h-14 text-xs sm:text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground border border-transparent hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] transition-shadow duration-300"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4 mr-2" /> Check ATS Score
          </>
        )}
      </Button>

      {error && (
        <p className="text-xs text-destructive text-center">
          {typeof error === "string" ? error : error?.message ?? "Something went wrong. Please try again."}
        </p>
      )}

      {result && (
        <Card className="bg-secondary/20 border-border/50">
          <CardContent className="p-3 sm:p-4 space-y-3">
            <div className="flex items-center justify-between cursor-pointer group" onClick={() => setIsExpanded(!isExpanded)}>
              <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase group-hover:text-foreground transition-colors">ATS Score</span>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${getColor(result.score)}`}>
                  {result.score}<span className="text-sm text-muted-foreground">/100</span>
                </span>
                <div className="w-6 h-6 ml-1 text-muted-foreground flex items-center justify-center">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="space-y-3 pt-2">
                <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${getBarColor(result.score)}`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
                <p className={`text-xs font-semibold ${getColor(result.score)}`}>
                  {result.label}
                </p>
                <div className="space-y-1.5 pt-1">
                  <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Suggestions</p>
                  <ul className="space-y-1.5">
                    {result.suggestions.map((tip, i) => (
                      <li key={i} className="text-xs text-foreground leading-relaxed flex gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}