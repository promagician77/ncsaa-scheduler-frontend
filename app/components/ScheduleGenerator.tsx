"use client"

import { useState, useEffect, useRef } from "react"

interface ScheduleGeneratorProps {
  onScheduleGenerated: (schedule: any) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export default function ScheduleGenerator({
  onScheduleGenerated,
  isLoading,
  setIsLoading,
}: ScheduleGeneratorProps) {
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<string>("")
  const [taskId, setTaskId] = useState<string | null>(null)
  const pollingInterval = useRef<NodeJS.Timeout | null>(null)

  // const API_BASE_URL = "http://localhost:8000"
  const API_BASE_URL = "http://localhost:8001"

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current)
      }
    }
  }, [])

  const pollTaskStatus = async (taskId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/schedule/status/${taskId}`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.status === "PENDING") {
        setProgress("Task is waiting to start...")
      } else if (data.status === "PROGRESS") {
        setProgress(data.message || "Processing...")
      } else if (data.status === "SUCCESS") {
        // Task completed successfully
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current)
          pollingInterval.current = null
        }
        setProgress("Schedule generated successfully!")
        onScheduleGenerated(data.result)
        setIsLoading(false)
        setTaskId(null)
      } else if (data.status === "FAILURE") {
        // Task failed
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current)
          pollingInterval.current = null
        }
        throw new Error(data.message || "Task failed")
      }
    } catch (err) {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current)
        pollingInterval.current = null
      }
      setError(
        err instanceof Error ? err.message : "Failed to check task status"
      )
      setIsLoading(false)
      setTaskId(null)
    }
  }

  const generateSchedule = async () => {
    setIsLoading(true)
    setError(null)
    setProgress("Starting schedule generation...")

    try {
      // Start async task
      const response = await fetch(`${API_BASE_URL}/api/schedule/async`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          force_regenerate: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setTaskId(data.task_id)
      setProgress("Task started, waiting for results...")

      // Start polling for task status
      pollingInterval.current = setInterval(() => {
        pollTaskStatus(data.task_id)
      }, 2000) // Poll every 2 seconds
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate schedule"
      )
      console.error("Error generating schedule:", err)
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Generate Schedule
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Click the button to generate an optimized basketball schedule from
            Google Sheets data
          </p>
        </div>

        <button
          onClick={generateSchedule}
          disabled={isLoading}
          className={`
            px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200
            ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generating...
            </span>
          ) : (
            "Generate Schedule"
          )}
        </button>
      </div>

      {progress && isLoading && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-blue-800 dark:text-blue-200 font-medium">
            Progress:
          </p>
          <p className="text-blue-600 dark:text-blue-300">{progress}</p>
          {taskId && (
            <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
              Task ID: {taskId}
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200 font-medium">Error:</p>
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      )}
    </div>
  )
}
