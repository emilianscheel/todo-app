

"use client"
import { Button } from "@/components/ui/button"
import { useState } from 'react'
import { QrReader } from 'react-qr-reader'

export default function Component() {
    const [data, setData] = useState<string[][]>([])
    const [isScanning, setIsScanning] = useState(false)

    const handleScan = (result: string | null) => {
        if (result) {
            const parsedData = result.split('\n').map(row => row.split(','))
            setData(parsedData)
            setIsScanning(false)
        }
    }

    const handleError = (error: Error) => {
        console.error(error)
        setIsScanning(false)
    }

    return (
        <div className="space-y-4">
            <Button onClick={() => setIsScanning(!isScanning)}>
                {isScanning ? 'Stop Scanning' : 'Start Scanning'}
            </Button>
            {isScanning && (
                <div className="relative aspect-square w-full">
                    <QrReader
                        onResult={(result: any) => result && handleScan(result.getText())}
                        constraints={{ facingMode: 'environment' }}
                        className="w-full h-full"
                    />
                </div>
            )}
            {data.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Scanned CSV Content:</h3>
                    <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                        <table className="w-full">
                            <tbody>
                                {data.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                            <td key={cellIndex} className="border px-2 py-1">{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}