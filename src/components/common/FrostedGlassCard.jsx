import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export const FrostedGlassCard = (Content) => {
    return (
        <Card className="bg-black/30 backdrop-blur">
        {/* <CardHeader>
        </CardHeader> */}
        <CardContent className="p-4">
            { Content }
        </CardContent>
        {/* <CardFooter>
            <p className="text-xs text-gray-400">version 0.0</p>
        </CardFooter> */}
        </Card>
    )
}
