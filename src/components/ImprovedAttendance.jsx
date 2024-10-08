import { useState, useEffect } from "react";
import { TrashIcon } from "./TrashIcon";

const ImprovedAttendance = () => {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [attendanceList, setAttendanceList] = useState([]);
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [classYear, setClassYear] = useState("");
  const [newTabName, setNewTabName] = useState("");

  const MAX_TABS = 5;

  useEffect(() => {
    const savedTabs = JSON.parse(localStorage.getItem("tabs")) || [];
    setTabs(savedTabs);
    if (savedTabs.length > 0) {
      setActiveTab(savedTabs[0]);
    }
  }, []);

  useEffect(() => {
    if (activeTab) {
      const savedList = JSON.parse(localStorage.getItem(`a_${activeTab}`)) || [];
      setAttendanceList(savedList);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab) {
      localStorage.setItem(`a_${activeTab}`, JSON.stringify(attendanceList));
    }
  }, [attendanceList, activeTab]);

  const handleAddTab = () => {
    if (tabs.length >= MAX_TABS) {
      alert(`標籤數已達上限，最多只能有 ${MAX_TABS} 個標籤。`);
      return;
    }
    if (newTabName && !tabs.includes(newTabName)) {
      const updatedTabs = [...tabs, newTabName];
      setTabs(updatedTabs);
      localStorage.setItem("tabs", JSON.stringify(updatedTabs));
      setNewTabName("");
      setActiveTab(newTabName);
    }
  };

  const handleDeleteTab = (tab) => {
    const confirmed = window.confirm(`確定要刪除標籤 "${tab}" 嗎？`);
    if (confirmed) {
      const updatedTabs = tabs.filter((t) => t !== tab);
      setTabs(updatedTabs);
      localStorage.setItem("tabs", JSON.stringify(updatedTabs));
      localStorage.removeItem(`a_${tab}`);

      if (activeTab === tab) {
        setActiveTab(updatedTabs.length > 0 ? updatedTabs[0] : "");
        setAttendanceList(updatedTabs.length > 0 ? JSON.parse(localStorage.getItem(updatedTabs[0])) || [] : []);
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (name && studentId && classYear) {
      const timestamp = new Date().toLocaleString();
      const newEntry = { name, studentId, classYear, timestamp };
      setAttendanceList([...attendanceList, newEntry]);
      setName("");
      setStudentId("");
      setClassYear("");
    } else {
      alert("請完整輸入資料！");
    }
  };

  const handleDeleteRecord = (index) => {
    const confirmed = window.confirm("確定要刪除這筆簽到資料嗎？");
    if (confirmed) {
      const updatedList = attendanceList.filter((_, i) => i !== index);
      setAttendanceList(updatedList);
    }
  };

  const downloadCSV = () => {
    const csvHeader = "名字,學號,系級,簽到時間\n";
    const csvRows = attendanceList.map(entry => 
      `${entry.name},${entry.studentId},${entry.classYear},${entry.timestamp}`
    );
    const csvContent = csvHeader + csvRows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_list_${activeTab}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteAllRecords = () => {
    const confirmed = window.confirm("確定要刪除所有簽到資料嗎？");
    if (confirmed) {
      setAttendanceList([]);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">簽到系統</h1>
      
      <div className="flex overflow-x-auto mb-4 space-x-2 border-b pb-2">
        {tabs.map((tab, index) => (
          <div key={index} className="flex items-center">
            <button
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-300"}`}
            >
              {tab}
            </button>
            <button
              onClick={() => handleDeleteTab(tab)}
              className="ml-2 text-red-500"
            >
              &times;
            </button>
          </div>
        ))}
        <input
          type="text"
          value={newTabName}
          onChange={(e) => setNewTabName(e.target.value)}
          className="border p-2 rounded"
          placeholder="新增標籤"
        />
        <button onClick={handleAddTab} className="ml-2 bg-green-500 text-white px-4 py-2 rounded">
          新增
        </button>
      </div>

      {activeTab && (
        <>
          <form onSubmit={handleFormSubmit} className="mb-6 p-4 bg-white shadow rounded-lg">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">系級：</label>
              <input
                type="text"
                value={classYear}
                onChange={(e) => setClassYear(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="輸入系級"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">名字：</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="輸入名字"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">學號：</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="輸入學號"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            >
              簽到
            </button>
          </form>

          <h2 className="text-xl font-semibold mb-2">簽到清單：</h2>
          <ul className="bg-white shadow rounded-lg p-4">
            {attendanceList.length > 0 ? (
              attendanceList.map((entry, index) => (
                <li key={index} className="border-b border-gray-200 py-2 flex justify-between items-center">
                  <div>
                    <p>{entry.classYear} {entry.name} {entry.studentId}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteRecord(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    <TrashIcon />
                  </button>
                </li>
              ))
            ) : (
              <p className="text-gray-500">目前沒有簽到紀錄。</p>
            )}
          </ul>

          <button
            onClick={downloadCSV}
            className="mt-6 w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
            disabled={attendanceList.length === 0}
          >
            下載 CSV
          </button>
          <button
            onClick={deleteAllRecords}
            className="mt-2 w-full bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
            disabled={attendanceList.length === 0}
          >
            刪除所有紀錄
          </button>
        </>
      )}
    </div>
  );
};

export default ImprovedAttendance;
