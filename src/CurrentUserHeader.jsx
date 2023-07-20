import { Avatar } from "@mui/material";
import { signOut } from "firebase/auth";
import LogoutIcon from "@mui/icons-material/Logout";
import React, { useContext, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { auth } from "./firebase";
import { Link } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const CurrentUserHeader = () => {
  const { currentUser } = useContext(AuthContext);
  const [toggleMore, setToggleMore] = useState(false);
  return (
    <div className="relative h-16 bg-slate-100 border-b border-slate-200 flex justify-between items-center py-2 px-4">
      <div className="flex items-center gap-3">
        {currentUser.photoURL ? (
          <Avatar src={currentUser.photoURL} />
        ) : (
          <Avatar>{currentUser.displayName?.[0]}</Avatar>
        )}
        <h4 className="font-semibold text-lg">{currentUser.displayName}</h4>
      </div>
      <div>
        <div
          className={`cursor-pointer p-2 ${
            toggleMore ? "bg-slate-200" : ""
          } rounded-full`}
          onClick={() => setToggleMore(!toggleMore)}
        >
          <MoreVertIcon />
        </div>
        {toggleMore && (
          <div className="absolute top-14 right-4 w-44 bg-white py-2 rounded shadow border">
            {/* <Link to="/profile">
              <div className="cursor-pointer hover:bg-slate-100 py-2 px-5 text-slate-700 flex gap-2 items-center">
                <PersonOutlineOutlinedIcon /> Profile
              </div>
            </Link> */}
            <div
              className="cursor-pointer hover:bg-slate-100 py-2 px-5 text-slate-700 flex gap-2 items-center"
              onClick={() => signOut(auth)}
            >
              <LogoutIcon /> Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentUserHeader;
