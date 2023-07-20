import { format } from "date-fns";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import { db } from "./firebase";

const Chats = ({ selectedUser }) => {
  const { currentUser } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);

  useEffect(() => {
    const chatsQuery = query(
      collection(db, "chats"),
      where("senderId", "in", [selectedUser.uid, currentUser.uid]),
      where("receiverId", "in", [selectedUser.uid, currentUser.uid]),
      orderBy("timestamp")
    );

    const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
      const messages = snapshot.docs.map((doc) => doc.data());
      setMessages(messages);
    });
    return () => unsubscribe();
  }, [selectedUser, currentUser.uid]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatRef.current?.scrollIntoView({ behavoir: "smooth" });
  };

  return (
    <div className="chats p-4 h-[calc(100vh-128px)] overflow-y-auto bg-slate-200">
      {messages.map((message) => {
        return (
          <div
            className={`relative flex ${
              message.senderId == currentUser.uid
                ? "justify-end"
                : "justify-start"
            }`}
            key={message.timestamp}
          >
            {message.imageUrl ? (
              <div
                className={`shadow mb-1 p-1 rounded-lg max-w-[80%] lg:max-w-[60%] ${
                  message.senderId == currentUser.uid
                    ? "bg-emerald-500 text-white rounded-tr-none"
                    : "bg-white text-slate-600 rounded-tl-none"
                }`}
              >
                <img
                  src={message.imageUrl}
                  alt="Chat Image"
                  className="max-w-[200px] mx-auto mb-2 rounded-md"
                />
                <div className="flex justify-between items-end px-1">
                  <p className="py-1 px-2">{message.message}</p>
                  {message.timestamp && (
                    <p
                      className={`text-[11px] ${
                        message.senderId == currentUser.uid
                          ? "text-slate-200"
                          : "text-slate-400"
                      }`}
                    >
                      {format(message.timestamp.toDate(), "HH:mm")}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div
                className={`flex items-end shadow mb-1 py-1 px-2 rounded-lg max-w-[80%] lg:max-w-[60%] ${
                  message.senderId == currentUser.uid
                    ? "bg-emerald-500 text-white rounded-tr-none"
                    : "bg-white text-slate-600 rounded-tl-none"
                }`}
              >
                <p className="py-1 px-2">{message.message}</p>
                {message.timestamp && (
                  <p
                    className={`text-[11px] ${
                      message.senderId == currentUser.uid
                        ? "text-slate-200"
                        : "text-slate-400"
                    }`}
                  >
                    {format(message.timestamp.toDate(), "HH:mm")}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
      <div ref={chatRef}></div>
    </div>
  );
};

export default Chats;
