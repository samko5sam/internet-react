import { useState, useEffect } from "react";
import { TrashIcon } from "./TrashIcon";

const AttendanceApp = () => {
  // State variables for storing input values and the attendance list
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [classYear, setClassYear] = useState("");
  const [attendanceList, setAttendanceList] = useState([]);

  // Load data from localStorage when the component mounts
  useEffect(() => {
    const savedList = JSON.parse(localStorage.getItem("attendanceList"));
    if (savedList) {
      setAttendanceList(savedList);
    }
  }, []);

  // Save the attendance list to localStorage whenever it changes
  useEffect(() => {
    if (attendanceList.length){
      localStorage.setItem("attendanceList", JSON.stringify(attendanceList));
    }
  }, [attendanceList]);

  // Function to handle form submission
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

  const handleDelete = (index) => {
    const confirmed = window.confirm("確定要刪除這筆簽到資料嗎？");
    if (confirmed) {
      const updatedList = attendanceList.filter((_, i) => i !== index);
      setAttendanceList(updatedList);
    }
  };

  const deleteAllRecords = () => {
    const confirmed = window.confirm("確定要刪除所有簽到資料嗎？");
    if (confirmed) {
      setAttendanceList([]);
      localStorage.removeItem("attendanceList");
    }
  };

  const downloadCSV = () => {
    const csvHeader = "名字,學號,系級,簽到時間\n";
    const csvRows = attendanceList.map(entry => 
      `${entry.name},${entry.studentId},${entry.classYear},${entry.timestamp}`
    );
    const csvContent = csvHeader + csvRows.join("\n");

    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance_list.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">簽到系統</h1>
      {/* Form for user input */}
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

      {/* Attendance List */}
      <h2 className="text-xl font-semibold mb-2">簽到清單：</h2>
      <ul className="bg-white shadow rounded-lg p-4">
        {attendanceList.length > 0 ? (
          attendanceList.map((entry, index) => (
            <li key={index} className="border-b border-gray-200 py-2 flex justify-between items-center">
              <p>{entry.classYear} {entry.name} {entry.studentId}</p>
              <button
                onClick={() => handleDelete(index)}
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

      {/* CSV Download Button */}
      <button
        onClick={downloadCSV}
        className="mt-6 w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
      >
        下載 CSV
      </button>

      <button
        onClick={deleteAllRecords}
        className="mt-2 w-full bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
      >
        刪除所有紀錄
      </button>
    </div>
  );
};

export default AttendanceApp;
