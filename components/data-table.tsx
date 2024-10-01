import { ArrowUpDown } from "lucide-react"
import { Task } from "./Task"
import { Checkbox } from "./ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"



export type DataTableProps = {
    items: Task[],
    sortColumn: keyof Task,
    handleSort: (column: keyof Task) => void
    handleCheckboxChange: (index: number) => void
}

export const DataTable = ({
    items,
    sortColumn,
    handleSort,
    handleCheckboxChange
}: DataTableProps) => {


    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Done</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('relativeTime')}>
                        Relative Time (min) {sortColumn === 'relativeTime' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('location')}>
                        Location {sortColumn === 'location' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                    </TableHead>
                    <TableHead>Task</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.map((task, index) => (
                    <TableRow key={index}>
                        <TableCell>
                            <Checkbox
                                checked={task.done}
                                onCheckedChange={() => handleCheckboxChange(task.id)}
                            />
                        </TableCell>
                        <TableCell>{task.relativeTime}</TableCell>
                        <TableCell>{task.location}</TableCell>
                        <TableCell>{task.task}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}