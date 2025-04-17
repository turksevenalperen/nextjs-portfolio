import { Server } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";
import { fetchAktifUygulamalar } from "@/lib/data";


type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: {
      io?: Server;
      on: (event: string, callback: () => void) => void;
    };
  };
};

export default function SocketHandler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket?.server) {
    res.status(500).end("Sunucu soketi mevcut değil.");
    return;
  }


  if (res.socket.server.io) {
    console.log("Socket.IO already running");
    res.end();
    return;
  }

  console.log("Setting up Socket.IO server...");

 
  const io = new Server(res.socket.server as any); 
  res.socket.server.io = io;

  
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    sendInitialData(socket); 

    socket.on("getAktifUygulamalar", () => {
      sendInitialData(socket);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

 
  const intervalId = setInterval(async () => {
    try {
      const data = await fetchAktifUygulamalar();
      io.emit("aktifUygulamalar", data);
      console.log("Data sent to all clients:", new Date().toISOString());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, 2000);

  
  res.socket.server.on("close", () => {
    clearInterval(intervalId);
  });

  console.log("Socket.IO server started");
  res.end();
}


async function sendInitialData(socket: any) {
  try {
    const data = await fetchAktifUygulamalar();
    socket.emit("aktifUygulamalar", data);
    console.log("Initial data sent to client:", socket.id);
  } catch (error) {
    console.error("Error sending initial data:", error);
  }
}
