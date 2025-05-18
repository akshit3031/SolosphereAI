import React, { useEffect, useState } from "react";
import MachineList from "./components/MachineList";
import MachineHistory from "./components/MachineHistory";



export default function App() {
  const [machines, setMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/reports')
      .then(res => res.json())
      .then(data => {
        setMachines(data);
        console.log(data)
        if (data.length > 0) {
          setSelectedMachine(data[0].machineId);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedMachine) return;
    setLoading(true);
    fetch(`/api/reports/${selectedMachine}/history`)
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        console.log("history data",data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedMachine]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-700">
        Machine Monitoring Dashboard
      </h1>

      <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
        <MachineList
          machines={machines}
          selectedMachine={selectedMachine}
          onSelect={setSelectedMachine}
        />
        <MachineHistory history={history} loading={loading} machineId={selectedMachine} />
      </div>
    </div>
  );
}
