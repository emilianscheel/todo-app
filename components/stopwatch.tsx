


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog } from "@radix-ui/react-dialog"
import { Pause, Play, StopCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from 'react'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"

type StopwatchProps = {
    onTimeUpdate: (time: number) => void
}

type DisplayFormat = 'minutes' | 'hh:mm:ss'

export default function Stopwatch({ onTimeUpdate }: StopwatchProps) {

    const params = useSearchParams()
    const router = useRouter()

    const seconds = params.get('seconds')

    const [stopDialogOpen, setStopDialogOpen] = useState<boolean>(false)

    const [time, setTime] = useState<number>(0)
    const [isRunning, setIsRunning] = useState(false)
    const [displayFormat, setDisplayFormat] = useState<DisplayFormat>('hh:mm:ss')

    useEffect(() => {
        if (seconds) setTime(parseInt(seconds) * 1000)
    }, [seconds])

    useEffect(() => {
        const seconds = time / 1000
        if (seconds % 10 !== 0) return
        const url = new URL(window.location.href)
        const searchParams = new URLSearchParams(url.search)
        searchParams.set('seconds', seconds.toString())
        router.push(`?${searchParams.toString()}`, { scroll: true })
    }, [time, router])




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
        setTime(0)
        setIsRunning(false)
        onTimeUpdate(0)
        setStopDialogOpen(false)
    }, [onTimeUpdate])

    const onStop = useCallback(() => {
        setStopDialogOpen(true)
    }, [])

    const toggleDisplayFormat = useCallback(() => {
        setDisplayFormat((prevFormat) => prevFormat === 'minutes' ? 'hh:mm:ss' : 'minutes')
    }, [])

    const formatTime = (ms: number) => {
        if (displayFormat === 'minutes') {
            const minutes = Math.floor(ms / (60 * 1000))
            const seconds = Math.floor((ms / 1000))
            if (seconds < 60) {
                return `${seconds} second${seconds !== 1 ? 's' : ''}`
            }
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
                    {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isRunning ? 'Pause' : time > 0 ? 'Resume' : 'Start'}
                </Button>
                <Button onClick={onStop} variant="outline">
                    <StopCircle className="w-4 h-4 mr-2" />
                    Stop
                </Button>
            </CardFooter>

            <Dialog open={stopDialogOpen} onOpenChange={setStopDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Stop Stopwatch</DialogTitle>
                        <DialogDescription>
                            Stopping the stopwatch will reset the timer to 0. This step cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={stop}>Reset time</Button>
                        <Button onClick={() => setStopDialogOpen(false)} variant="outline">Do not reset</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}