import { Avatar } from "@mui/material";
import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

const Users = ({ users, onUserClick, selectedUser }) => {
  const { currentUser } = useContext(AuthContext);

  const sortedUsers = [...users].sort((a, b) => {
    return a.displayName.localeCompare(b.displayName);
  });

  return (
    <div className="overflow-y-auto h-[calc(100vh-128px)] p-2">
      {sortedUsers.map((user) => {
        if (user.uid !== currentUser.uid) {
          return (
            <div
              className={`${
                user.uid === selectedUser?.uid ? "bg-slate-200" : ""
              } flex items-center gap-2 p-3 cursor-pointer rounded-lg`}
              key={user.uid}
              onClick={() => onUserClick(user)}
            >
              {user.photoURL ? (
                <Avatar src={user.photoURL} />
              ) : (
                <Avatar>{user.displayName?.[0]}</Avatar>
              )}
              <div>
                <h4>{user.displayName}</h4>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default Users;
