"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export default function MetricsPanel({ blinkRate, confidence, nervousness, happy, sad }: any) {


    return (
        <div className="flex mb-20 flex-col gap-2 p-4">
            <div className=" flex gap-2 w-full justify-between">
                {/* Blink Rate */}
                <Card className="shadow-lg h-20 flex justify-between w-full flex-row">
                    <CardHeader className=" w-50">
                        <CardTitle>Blink Rate</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xl font-bold">{blinkRate} / min</CardContent>
                </Card>

                {/* Confidence */}
                <Card className="shadow-lg h-20 flex justify-between flex-row w-full">
                    <CardHeader>
                        <CardTitle>Confidence</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xl font-bold">  {Math.round(confidence * 100)}%</CardContent>
                </Card>
            </div>
          

            {/* Nervousness */}
            <Card className="col-span-2 shadow-lg">
                <CardHeader>
                    <CardTitle>Nervousness</CardTitle>
                </CardHeader>
                <CardContent>
                    <Progress value={nervousness * 100} className="h-3" />
                </CardContent>
            </Card>

            {/* Happy */}
            <Card className="col-span-2 shadow-lg">
                <CardHeader>
                    <CardTitle>Happy</CardTitle>
                </CardHeader>
                <CardContent>
                    <Progress value={happy * 100} className="h-3" />
                </CardContent>
            </Card>

            {/* Sad */}
            <Card className="col-span-2 shadow-lg">
                <CardHeader>
                    <CardTitle>Sad</CardTitle>
                </CardHeader>
                <CardContent>
                    <Progress value={sad * 100} className="h-3" />
                </CardContent>
            </Card>
        </div>
    );
}
