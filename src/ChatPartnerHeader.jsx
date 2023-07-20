import { Avatar } from "@mui/material";
import React, { useContext, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PhoneIcon from "@mui/icons-material/Phone";
import VideocamIcon from "@mui/icons-material/Videocam";
import {
  collectionGroup,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { AuthContext } from "./context/AuthContext";

const ChatPartnerHeader = ({ user }) => {
  const { currentUser } = useContext(AuthContext);
  const [toggleMore, setToggleMore] = useState(false);

  const handleClearMessages = async () => {
    try {
      const messagesQuery = query(
        collectionGroup(db, "chats"),
        where("senderId", "in", [user.uid, currentUser.uid]),
        where("receiverId", "in", [user.uid, currentUser.uid])
      );

      const messagesSnapshot = await getDocs(messagesQuery);

      const deletePromises = messagesSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );

      await Promise.all(deletePromises);
      setToggleMore(false);
    } catch (error) {
      console.error("Error clearing messages:", error);
    }
  };

  return (
    <div className="h-16 flex py-2 px-6 justify-between items-center bg-slate-100 border-b">
      <div className="flex items-center gap-3">
        {user.photoURL ? (
          <Avatar src={user.photoURL} />
        ) : (
          <Avatar>{user.displayName?.[0]}</Avatar>
        )}
        <h4 className="font-semibold">{user.displayName}</h4>
      </div>
      <div className="flex items-center gap-8">
        <PhoneIcon className="text-gray-600" />
        <VideocamIcon className="text-gray-600" />
        <div>
          <div
            className={`cursor-pointer p-2 ${
              toggleMore ? "bg-slate-200" : ""
            } rounded-full`}
            onClick={() => setToggleMore(!toggleMore)}
          >
            <MoreVertIcon className="text-gray-600" />
          </div>
          {toggleMore && (
            <div className="absolute top-14 right-4 w-48 bg-white py-2 rounded shadow border z-10">
              <div
                className="cursor-pointer hover:bg-slate-100 py-2 px-5 text-slate-700 flex gap-2 items-center"
                onClick={handleClearMessages}
              >
                Clear messages
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPartnerHeader;
