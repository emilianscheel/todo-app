import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { Task } from "./Task"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Slider } from "./ui/slider"

export type NewTaskFormProps = {
    open: boolean,
    onOpenChange: (open: boolean) => void
    defaultLocations: string[]
    submit: (task: Task) => void
}

export const NewTaskForm = ({
    open,
    onOpenChange,
    defaultLocations,
    submit
}: NewTaskFormProps) => {

    const [locations, setLocations] = useState<string[]>(defaultLocations.filter((location) => location !== ""))

    useEffect(() => {
        setLocations(defaultLocations.filter((location) => location !== ""))
    }, [defaultLocations])

    const [preview, setPreview] = useState<string>('')

    const [time, setTime] = useState<number>(30)
    const [location, setLocation] = useState<string>("")
    const [task, setTask] = useState<string>("Pedro Duarte")

    const handleSubmit = () => {
        submit({
            done: false,
            location: location,
            relativeTime: time,
            task: task,
            id: Math.floor(Math.random() * 1000),
        })
        onOpenChange(false)
    }

    const appendLocation = () => {

        if (preview === "") {
            return
        }

        if (locations.includes(preview)) {
            return
        }

        setLocations([...locations, preview])
        setLocation(preview)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Item</DialogTitle>
                    <DialogDescription>
                        Add a new item to your list
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="task" className="text-right">
                            Task
                        </Label>
                        <Input
                            id="task"
                            defaultValue="Pedro Duarte"
                            className="col-span-3"
                            onInput={(e) => setTask(e.currentTarget.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Location
                        </Label>

                        <div className="col-span-3 flex items-center gap-2">
                            <Input
                                id="location"
                                defaultValue={location}
                                onInput={(e) => {
                                    setPreview(e.currentTarget.value)
                                    setLocation(e.currentTarget.value)
                                }}
                            />
                            <Button type="button" onClick={appendLocation}>
                                <Plus size={16} />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Location
                        </Label>

                        <div className="col-span-3">
                            <Select>
                                <SelectTrigger defaultValue={location}>
                                    <SelectValue placeholder="Last used" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map((location, index) => (
                                        <SelectItem key={index} value={location}>{location}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>



                    <div className="grid items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Relative Time
                        </Label>

                        <div className="flex flex-col w-full">
                            <Label className="col-span-3 mb-2">
                                check after how many minutes
                            </Label>
                            <h1 className="col-span-3 text-left mb-10 text-5xl font-black">
                                {time} minutes
                            </h1>

                            <Slider
                                id="relative-time"
                                min={0}
                                max={180}
                                step={1}
                                defaultValue={[time]}
                                className="col-span-3"
                                onValueChange={(value) => setTime(value[0])}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}