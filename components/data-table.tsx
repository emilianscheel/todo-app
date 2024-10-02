import { ArrowUpDown } from "lucide-react"
import { useMemo } from "react"
import { Task } from "./Task"
import { Checkbox } from "./ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"



export type DataTableProps = {
    items: Task[],
    sortColumn: keyof Task,
    handleSort: (column: keyof Task) => void
    handleCheckboxChange: (index: number) => void
    seconds?: number
}

export const DataTable = ({
    items,
    sortColumn,
    handleSort,
    handleCheckboxChange,
    seconds = 0
}: DataTableProps) => {

    const minutes = useMemo(() => Math.floor(seconds / 60), [seconds])


    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px]">Done</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('relativeTime')}>
                        Time {sortColumn === 'relativeTime' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('location')}>
                        Location {sortColumn === 'location' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                    </TableHead>
                    <TableHead>Task</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.map((task, index) => {

                    const isTimerRunning = seconds > 0

                    const isSoon = task.relativeTime > minutes && task.relativeTime < (minutes + 5) && !task.done && isTimerRunning
                    const isVerySoon = task.relativeTime > minutes && task.relativeTime < (minutes + 2) && !task.done && isTimerRunning
                    const isOverdue = task.relativeTime <= minutes && !task.done && isTimerRunning
                    const isDone = task.done && isTimerRunning

                    return (
                        <TableRow key={index} className={`${isSoon ? 'bg-yellow-100 dark:bg-yellow-800' : ''} ${isVerySoon ? 'bg-orange-100 dark:bg-orange-800' : ''} ${isOverdue ? 'bg-red-100 dark:bg-red-800' : ''} ${isDone ? 'bg-green-100 dark:bg-green-800' : ''}`}>
                            <TableCell>
                                <Checkbox
                                    checked={task.done}
                                    onCheckedChange={() => handleCheckboxChange(task.id)}
                                    className="w-8 h-8 rounded-lg"
                                />
                            </TableCell>
                            <TableCell>
                                <h1 className="text-xl font-black">
                                    {task.relativeTime}
                                </h1>
                            </TableCell>
                            <TableCell>{task.location}</TableCell>
                            <TableCell>{task.task}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}