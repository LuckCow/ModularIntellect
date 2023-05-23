import React, { useEffect, useState, useContext } from "react";
import {SocketContext} from "../../services/socket";


const PAGE_SIZE = 50;

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const { socket } = useContext(SocketContext);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchLogs = async (page: number) => {
      const response = await fetch(`/latest_logs?page=${page}`);
      const pageLogs = await response.json();
      setLogs(pageLogs);
    };

    fetchLogs(currentPage);

    socket.on("new_log", (message: string) => {
      if (currentPage === 1) {
        setLogs((prevLogs) => [message, ...prevLogs]);
      }
    });

    return () => {
      socket.off('new_log');
    };
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(logs.length / PAGE_SIZE);

  return (
    <div>
      <h1>Real-time logs</h1>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
      <div>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            disabled={index + 1 === currentPage}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Logs;
