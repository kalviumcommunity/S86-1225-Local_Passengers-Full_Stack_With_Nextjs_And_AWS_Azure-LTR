"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";

interface Train {
  id: number;
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
}

export default function SWRDemoPage() {
  const [newTrain, setNewTrain] = useState({
    trainNumber: "",
    trainName: "",
    source: "",
    destination: "",
  });
  const [cacheInfo, setCacheInfo] = useState<string[]>([]);

  // SWR data fetching with automatic caching and revalidation
  const {
    data: trains,
    error,
    isLoading,
    mutate: mutateTrains,
  } = useSWR<Train[]>("/api/trains", fetcher, {
    revalidateOnFocus: true, // Refetch when tab gains focus
    refreshInterval: 10000, // Auto-refresh every 10 seconds
    onSuccess: () => {
      setCacheInfo((prev) => [
        ...prev,
        `Cache hit at ${new Date().toLocaleTimeString()}`,
      ]);
    },
  });

  // Optimistic UI update - Add train
  const handleAddTrain = async () => {
    if (!newTrain.trainNumber || !newTrain.trainName) return;

    const optimisticTrain: Train = {
      id: Date.now(),
      trainNumber: newTrain.trainNumber,
      trainName: newTrain.trainName,
      source: newTrain.source || "Mumbai",
      destination: newTrain.destination || "Pune",
      departureTime: "08:00",
      arrivalTime: "11:00",
    };

    // Update UI immediately (optimistic)
    mutateTrains(
      async (currentTrains) => {
        // Show optimistic data
        return [...(currentTrains || []), optimisticTrain];
      },
      {
        optimisticData: [...(trains || []), optimisticTrain],
        rollbackOnError: true,
        revalidate: false,
      }
    );

    try {
      // Actual API call
      await fetch("/api/trains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTrain),
      });

      // Revalidate after successful update
      mutate("/api/trains");
      setNewTrain({
        trainNumber: "",
        trainName: "",
        source: "",
        destination: "",
      });
      setCacheInfo((prev) => [
        ...prev,
        `Optimistic update at ${new Date().toLocaleTimeString()}`,
      ]);
    } catch {
      setCacheInfo((prev) => [
        ...prev,
        `Update failed, rolled back at ${new Date().toLocaleTimeString()}`,
      ]);
    }
  };

  // Manual revalidation
  const handleRefresh = () => {
    mutateTrains();
    setCacheInfo((prev) => [
      ...prev,
      `Manual refresh at ${new Date().toLocaleTimeString()}`,
    ]);
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> Failed to load trains. {error.message}
        </div>
      </div>
    );
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          🚄 SWR Demo - LocalPassengers
        </h1>
        <p className="text-gray-600">
          Real-time data fetching with caching, revalidation, and optimistic
          updates
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900">Cache Status</h3>
          <p className="text-2xl font-bold text-blue-600">
            {isLoading ? "Loading..." : "Active"}
          </p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="font-semibold text-green-900">Total Trains</h3>
          <p className="text-2xl font-bold text-green-600">
            {trains?.length || 0}
          </p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-900">Auto-Refresh</h3>
          <p className="text-2xl font-bold text-purple-600">Every 10s</p>
        </div>
      </div>

      {/* Add Train Form */}
      <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          ➕ Add New Train (Optimistic UI)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Train Number (e.g., 12345)"
            value={newTrain.trainNumber}
            onChange={(e) =>
              setNewTrain({ ...newTrain, trainNumber: e.target.value })
            }
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Train Name (e.g., Express)"
            value={newTrain.trainName}
            onChange={(e) =>
              setNewTrain({ ...newTrain, trainName: e.target.value })
            }
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Source Station"
            value={newTrain.source}
            onChange={(e) =>
              setNewTrain({ ...newTrain, source: e.target.value })
            }
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Destination Station"
            value={newTrain.destination}
            onChange={(e) =>
              setNewTrain({ ...newTrain, destination: e.target.value })
            }
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleAddTrain}
            disabled={!newTrain.trainNumber || !newTrain.trainName}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add Train (Optimistic)
          </button>
          <button
            onClick={handleRefresh}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            🔄 Manual Refresh
          </button>
        </div>
      </div>

      {/* Trains List */}
      <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">🚂 Train List</h2>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading trains...</p>
          </div>
        ) : trains && trains.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Train #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Route
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Timing
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {trains.map((train) => (
                  <tr key={train.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 whitespace-nowrap font-mono">
                      {train.trainNumber}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-semibold">
                      {train.trainName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {train.source} → {train.destination}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {train.departureTime} - {train.arrivalTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No trains found. Add one above!
          </p>
        )}
      </div>

      {/* Cache Activity Log */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">📊 Cache Activity Log</h2>
        <div className="bg-gray-50 p-4 rounded max-h-48 overflow-y-auto">
          {cacheInfo.length > 0 ? (
            <ul className="space-y-1 font-mono text-sm">
              {cacheInfo
                .slice(-10)
                .reverse()
                .map((info, idx) => (
                  <li key={idx} className="text-gray-700">
                    • {info}
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              No cache activity yet. Try adding a train or refreshing!
            </p>
          )}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>
            ✓ SWR Key:{" "}
            <code className="bg-gray-200 px-2 py-1 rounded">/api/trains</code>
          </p>
          <p>✓ Revalidation: On focus + every 10 seconds</p>
          <p>✓ Optimistic Updates: Enabled with rollback on error</p>
        </div>
      </div>
    </main>
  );
}
