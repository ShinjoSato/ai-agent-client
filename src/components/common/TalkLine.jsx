import { Skeleton } from "@/components/ui/skeleton"
import { AnimatedText } from "@/components/effects/AnimatedText"

export const TalkLine = ({icon, title, subtitle, isLoading=false}) => {
    return (
        <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
            <div>
                {(isLoading)
                    ? <Skeleton className="h-4 w-4 rounded-full" />
                    : icon
                }
            </div>
            <div className="space-y-1">
                <div className="text-sm font-medium leading-none">
                    {(isLoading)
                        ? <Skeleton className="w-full h-4" />
                        : <AnimatedText text={ title } />
                    }
                </div>
                <div className="text-sm text-muted-foreground">
                    {(isLoading)
                        ? <Skeleton className="w-24 h-4" />
                        : <AnimatedText text={ subtitle } />
                    }
                </div>
            </div>
        </div>
    )
}
