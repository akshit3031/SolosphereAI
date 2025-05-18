import React, { useState, useMemo } from "react";

export default function MachineHistory({ history, loading, machineId }) {
  const [filterText, setFilterText] = useState("");
  const [sortNewestFirst, setSortNewestFirst] = useState(true);

  // Filter and sort history based on user input (checking os, antivirus, etc.)
  const filteredHistory = useMemo(() => {
    const text = filterText.toLowerCase();

    const filtered = history.filter((record) => {
      return (
        record.os?.toLowerCase().includes(text) ||
        record.antivirus?.toLowerCase().includes(text) ||
        (record.encryption ? "encrypted" : "unencrypted").includes(text) ||
        (record.os_updated ? "updated" : "outdated").includes(text) ||
        text === ""
      );
    });

    return filtered.sort((a, b) => {
      if (sortNewestFirst) {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else {
        return new Date(a.timestamp) - new Date(b.timestamp);
      }
    });
  }, [history, filterText, sortNewestFirst]);

  return (
    <div className="md:w-2/3 bg-white rounded shadow p-4 overflow-y-auto max-h-[70vh] flex flex-col">
      <h2 className="text-xl font-semibold mb-4">
        History for Machine: {machineId || "None selected"}
      </h2>

      <div className="mb-4 flex items-center gap-4">
        <input
          type="text"
          placeholder="Filter by OS, antivirus, encryption, update..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="border rounded px-3 py-1 flex-grow"
        />

        <button
          onClick={() => setSortNewestFirst((prev) => !prev)}
          className="border px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
          title="Toggle sort order"
        >
          Sort: {sortNewestFirst ? "Newest First" : "Oldest First"}
        </button>
      </div>

      {loading && <p>Loading history...</p>}
      {!loading && filteredHistory.length === 0 && (
        <p>No matching history records found.</p>
      )}

      {!loading && filteredHistory.length > 0 && (
        <table className="min-w-full border border-gray-300 table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-3 py-1 text-left">Timestamp</th>
              <th className="border px-3 py-1 text-left">OS</th>
              <th className="border px-3 py-1 text-left">Disk Encrypted</th>
              <th className="border px-3 py-1 text-left">OS Updated</th>
              <th className="border px-3 py-1 text-left">Antivirus</th>
              <th className="border px-3 py-1 text-left">Sleep Timeout (min)</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((record) => (
              <tr
                key={record._id}
                className="hover:bg-gray-100 cursor-default"
                title={`OS: ${record.os}, Antivirus: ${record.antivirus}`}
              >
                <td className="border px-3 py-1">
                  {new Date(record.timestamp).toLocaleString()}
                </td>
                <td className="border px-3 py-1">{record.os || "-"}</td>
                <td className="border px-3 py-1">
                  {record.encryption ? "Yes" : "No"}
                </td>
                <td className="border px-3 py-1">
                  {record.os_updated ? "Yes" : "No"}
                </td>
                <td className="border px-3 py-1">{record.antivirus || "-"}</td>
                <td className="border px-3 py-1">
                  {record.sleep_timeout_minutes != null
                    ? record.sleep_timeout_minutes
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
