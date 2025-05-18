import React, { useState, useMemo } from "react";

export default function MachineList({ machines, selectedMachine, onSelect }) {
  const [filterOS, setFilterOS] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Determine machine status (ok or issues)
  function getStatus(machine) {
    const issues = [];
    if (!machine.disk_encryption) issues.push("Disk not encrypted");
    if (machine.os_update !== "Up to date" && machine.os_update !== "No new software available")
      issues.push("OS outdated");
    if (!machine.sleep_ok) issues.push("Sleep setting not OK");
    return issues.length === 0 ? "OK" : issues.join(", ");
  }

  // Filter and sort machines
  const filteredMachines = useMemo(() => {
    return machines
      .filter((m) => (filterOS ? m.os.toLowerCase().includes(filterOS.toLowerCase()) : true))
      .filter((m) => {
        if (!filterStatus) return true;
        const status = getStatus(m);
        if (filterStatus === "OK") return status === "OK";
        return status !== "OK";
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [machines, filterOS, filterStatus]);

  return (
    <div className="md:w-1/3 bg-white rounded shadow p-4 overflow-y-auto max-h-[70vh]">
      <h2 className="text-xl font-semibold mb-4">Machines</h2>

      <div className="mb-4 flex flex-col gap-2">
        <input
          type="text"
          placeholder="Filter by OS"
          value={filterOS}
          onChange={(e) => setFilterOS(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">All status</option>
          <option value="OK">OK</option>
          <option value="Issues">With Issues</option>
        </select>
      </div>

      {filteredMachines.length === 0 && <p>No machines found.</p>}

      <ul>
        {filteredMachines.map((machine) => {
          const status = getStatus(machine);
          const hasIssues = status !== "OK";

          return (
            <li
              key={machine._id}
              onClick={() => onSelect(machine.machine_id)}
              className={`cursor-pointer p-2 rounded mb-2 ${
                selectedMachine === machine.machine_id
                  ? "bg-blue-200 font-bold"
                  : "hover:bg-blue-100"
              } flex flex-col`}
            >
              <div className="flex justify-between items-center">
                <p>ID: {machine.machine_id}</p>
                {hasIssues && (
                  <span className="text-sm text-red-700 font-semibold bg-red-100 px-2 py-0.5 rounded">
                    ⚠️ Issues
                  </span>
                )}
              </div>
              <p>OS: {machine.os}</p>
              <p>Antivirus: {machine.antivirus}</p>
              <p>Last Check-in: {new Date(machine.timestamp).toLocaleString()}</p>
              {hasIssues && (
                <p className="text-red-600 text-sm mt-1">Issues: {status}</p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
