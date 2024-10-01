


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useCallback, useEffect, useState } from 'react'

type StopwatchProps = {
    onTimeUpdate: (time: number) => void
}

type DisplayFormat = 'minutes' | 'hh:mm:ss'

export default function Stopwatch({ onTimeUpdate }: StopwatchProps) {
    const [time, setTime] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const [displayFormat, setDisplayFormat] = useState<DisplayFormat>('hh:mm:ss')

    useEffect(() => {
        let intervalId: NodeJS.Timeout

        if (isRunning) {
            intervalId = setInterval(() => {
                setTime((prevTime) => {
                    const newTime = prevTime + 1000 // Increment by 1 second
                    onTimeUpdate(newTime)
                    return newTime
                })
            }, 1000)
        }

        return () => clearInterval(intervalId)
    }, [isRunning, onTimeUpdate])

    const startPause = useCallback(() => {
        setIsRunning((prevIsRunning) => !prevIsRunning)
    }, [])

    const stop = useCallback(() => {
        setIsRunning(false)
        setTime(0)
        onTimeUpdate(0)
    }, [onTimeUpdate])

    const toggleDisplayFormat = useCallback(() => {
        setDisplayFormat((prevFormat) => prevFormat === 'minutes' ? 'hh:mm:ss' : 'minutes')
    }, [])

    const formatTime = (ms: number) => {
        if (displayFormat === 'minutes') {
            const minutes = Math.floor(ms / 60000)
            return `${minutes} minute${minutes !== 1 ? 's' : ''}`
        } else {
            const hours = Math.floor(ms / 3600000)
            const minutes = Math.floor((ms % 3600000) / 60000)
            const seconds = Math.floor((ms % 60000) / 1000)
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        }
    }

    return (
        <Card className="w-full">
            <CardContent className="pt-6 space-y-4">
                <div className="text-4xl font-bold text-center tabular-nums">
                    {formatTime(time)}
                </div>
                <div className="flex items-center space-x-2 justify-center">
                    <Switch id="format-switch" checked={displayFormat === 'hh:mm:ss'} onCheckedChange={toggleDisplayFormat} />
                    <Label htmlFor="format-switch">
                        {displayFormat === 'hh:mm:ss' ? 'HH:MM:SS' : 'Total Minutes'}
                    </Label>
                </div>
            </CardContent>
            <CardFooter className="flex justify-center space-x-2">
                <Button onClick={startPause}>
                    {isRunning ? 'Pause' : 'Start'}
                </Button>
                <Button onClick={stop} variant="outline">
                    Stop
                </Button>
            </CardFooter>
        </Card>
    )
}