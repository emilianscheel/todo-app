import { ArrowUpDown } from "lucide-react"
import { Task } from "./Task"
import { Checkbox } from "./ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"



export type DataTableProps = {
    items: Task[],
    sortColumn: keyof Task,
    handleSort: (column: keyof Task) => void
    handleCheckboxChange: (index: number) => void
    minutes: number
}

export const DataTable = ({
    items,
    sortColumn,
    handleSort,
    handleCheckboxChange,
    minutes
}: DataTableProps) => {


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



                    const isSoon = task.relativeTime > minutes && task.relativeTime < (minutes + 5) && !task.done && minutes > 0
                    const isVerySoon = task.relativeTime > minutes && task.relativeTime < (minutes + 2) && !task.done && minutes > 0
                    const isOverdue = task.relativeTime <= minutes && !task.done && minutes > 0
                    const isDone = task.done && minutes > 0

                    return (
                        <TableRow key={index} className={`${isSoon ? 'bg-yellow-100' : ''} ${isVerySoon ? 'bg-orange-100' : ''} ${isOverdue ? 'bg-red-100' : ''} ${isDone ? 'bg-green-100' : ''}`}>
                            <TableCell>
                                <Checkbox
                                    checked={task.done}
                                    onCheckedChange={() => handleCheckboxChange(task.id)}
                                />
                            </TableCell>
                            <TableCell>
                                <h1 className="text-lg font-black">
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