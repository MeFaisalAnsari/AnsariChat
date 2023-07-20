import React from "react";
import icon from "./assets/icon.png";

const Logo = () => {
  return (
    <div className="flex gap-4 items-center">
      <img src={icon} className="w-10" />
      <h1 className="font-black text-slate-700 text-2xl">AnsariChat</h1>
    </div>
  );
};

export default Logo;
