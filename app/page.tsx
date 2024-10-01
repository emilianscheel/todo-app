'use client'

import { DataTable } from "@/components/data-table"
import { downloadTextFile } from "@/components/download"
import { NewTaskForm } from "@/components/new-form"
import { QrCodeGenerator } from "@/components/qr-code-generator"
import { QrCodeScanner } from "@/components/qr-code-reader"
import Stopwatch from "@/components/stopwatch"
import { Task } from "@/components/Task"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab"
import { Check, Clipboard, Copy, Download, Eye, File, Lightbulb, MoreVerticalIcon, Plus, QrCode, Save, ScanQrCode, TextIcon, Upload, X } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from 'react'

type Drawer = 'save' | 'load' | 'qr-code' | 'add' | undefined

export default function Component() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [sortColumn, setSortColumn] = useState<keyof Task>('relativeTime')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [searchTerm, setSearchTerm] = useState('')

    const [drawer, setDrawer] = useState<Drawer>()
    const [tab, setTab] = useState<'show' | 'scan'>('show')

    const [timer, setTimer] = useState<boolean>(false)
    const [time, setTime] = useState<number>(0)

    // time are milliseconds
    const minutes = useMemo(() => Math.floor(time / 60000), [time])

    useEffect(() => {
        generateSample()
    }, [])

    const generateSample = () => {
        setTasks([
            { done: false, relativeTime: 30, location: 'Home', task: 'Clean the kitchen', id: 1 },
            { done: true, relativeTime: 60, location: 'Office', task: 'Finish report', id: 2 },
            { done: false, relativeTime: 15, location: 'Gym', task: 'Workout', id: 3 },
        ])
    }


    const handleSort = (column: keyof Task) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    const sortedTasks = [...tasks].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
        if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
        return 0
    })

    const filteredTasks = sortedTasks.filter(task =>
        Object.values(task).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    const handleCheckboxChange = (id: number) => {
        const newTasks = [...tasks]
        const index = tasks.findIndex(task => task.id === id)
        newTasks[index].done = !newTasks[index].done
        setTasks(newTasks)
    }

    const downloadCSV = () => {
        const csvContent = exportText()
        downloadTextFile(csvContent, 'tasks.csv', 'text/csv;charset=utf-8;')
        setDrawer(undefined)
    }

    const importCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const content = e.target?.result as string
                importText(content)
            }
            reader.readAsText(file)
        }
    }

    const importClipboard = () => {
        navigator.clipboard.readText()
            .then(importText)
            .then(() => setDrawer(undefined))

    }

    const importText = (text: string) => {
        const lines = text.split('\n')
        const newTasks: Task[] = lines.slice(1).map(line => {
            const [done, relativeTime, location, task] = line.split(',')
            return {
                id: Math.floor(Math.random() * 1000),
                done: done.trim().toLowerCase() === 'yes',
                relativeTime: parseInt(relativeTime.trim(), 10),
                location: location.trim(),
                task: task.trim()
            }
        })
        setTasks(newTasks)
    }

    const exportText = useCallback(() => {
        return [
            'Done,Relative Time (min),Location,Task',
            ...filteredTasks.map(task => [
                task.done ? 'Yes' : 'No',
                task.relativeTime,
                task.location,
                task.task
            ].join(','))
        ].join('\n')
    }, [filteredTasks])

    const exportClipboard = () => {
        const data = exportText()
        navigator.clipboard.writeText(data)
        setDrawer(undefined)
    }

    const onScan = (text: string) => {
        importText(text)
        setDrawer(undefined)
    }

    const rawText = useMemo(() => exportText(), [exportText])

    return (
        <div className="container mx-auto p-4 space-y-4">
            <div className="flex justify-between items-center">
                <Drawer open={drawer === 'load'} onOpenChange={(open: boolean) => setDrawer(open ? 'load' : undefined)}>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Choose a way to upload!</DrawerTitle>
                            <DrawerDescription>Upload your tasks from a file, clipboard or scan a QR-code.</DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter>

                            <Button onClick={importClipboard}>
                                <Clipboard className="mr-2 h-4 w-4" /> Paste from Clipboard
                            </Button>

                            <Button asChild>
                                <label>
                                    <Upload className="mr-2 h-4 w-4" /> Import CSV
                                    <input type="file" onChange={importCSV} className="hidden" accept=".csv" />
                                </label>
                            </Button>

                            <Button onClick={() => {
                                setDrawer('qr-code')
                                setTab('scan')
                            }}>
                                <ScanQrCode className="mr-2 h-4 w-4" /> Scan QR-code
                            </Button>

                            <DrawerClose>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>

                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>


                <Drawer open={drawer === 'save'} onOpenChange={(open: boolean) => setDrawer(open ? 'save' : undefined)}>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Choose a way to save!</DrawerTitle>
                            <DrawerDescription>Save your tasks to a file, clipboard or QR-code.</DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter>

                            <Button onClick={downloadCSV}>
                                <Download className="mr-2 h-4 w-4" /> + <File className="mr-2 ml-2 h-4 w-4" /> Download CSV
                            </Button>

                            <Button onClick={exportClipboard}>
                                <Copy className="mr-2 h-4 w-4" /> + <TextIcon className="mr-2 ml-2 h-4 w-4" /> Copy CSV to Clipboard
                            </Button>

                            <Button onClick={() => {
                                setDrawer('qr-code')
                                setTab('show')
                            }}>
                                <QrCode className="mr-2 h-4 w-4" /> Generate QR-Code
                            </Button>

                            <DrawerClose>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>

                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>

                <Drawer open={drawer === 'qr-code'} onOpenChange={(open: boolean) => setDrawer(open ? 'qr-code' : undefined)}>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Choose a way to save!</DrawerTitle>
                            <DrawerDescription>Save your tasks to a file, clipboard or QR-code.</DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter>

                            <Tabs defaultValue={tab} >
                                <TabsList className="w-full flex justify-center">
                                    <TabsTrigger value="show" className="w-full" onClick={() => setTab('show')}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Show
                                    </TabsTrigger>
                                    <TabsTrigger value="scan" className="w-full" onClick={() => setTab('scan')}>
                                        <ScanQrCode className="mr-2 h-4 w-4" />
                                        Scan
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="show" className="h-[70vh]">
                                    <QrCodeGenerator text={rawText} />
                                </TabsContent>
                                <TabsContent value="scan" className="h-[70vh]">
                                    <QrCodeScanner onScan={onScan} />
                                </TabsContent>
                            </Tabs>

                            <DrawerClose>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>

                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>

                <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="w-full flex wrap items-center gap-4">

                        <div className="flex flex-1 gap-4">
                            <Button onClick={() => setDrawer('load')}>
                                <Plus className="mr-2 h-4 w-4" /> New
                            </Button>

                            <Button onClick={() => setDrawer('save')}>
                                <Save className="mr-2 h-4 w-4" /> Save
                            </Button>
                        </div>


                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant="outline">
                                    <MoreVerticalIcon className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Options</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={generateSample}><Lightbulb className="mr-2 h-4 w-4" /> Generate Sample</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setDrawer('qr-code')}><QrCode className="mr-2 h-4 w-4" /> QR Code</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setDrawer('add')}><Plus className="mr-2 h-4 w-4" /> Add item</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTimer(!timer)}>{timer ? <X className="mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />} {timer ? 'Hide' : 'Show'} Timer</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>

                    <Input
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>
            </div>

            {timer && <Stopwatch onTimeUpdate={setTime} />}


            <DataTable
                items={filteredTasks}
                sortColumn={sortColumn}
                handleSort={handleSort}
                handleCheckboxChange={handleCheckboxChange}
                minutes={minutes}
            />

            <NewTaskForm
                defaultLocations={filteredTasks.map(task => task.location)}
                open={drawer === 'add'}
                onOpenChange={(open: boolean) => setDrawer(open ? 'add' : undefined)}
                submit={(task) => setTasks([...tasks, task])}
            />

        </div>
    )
}