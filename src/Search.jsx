import React, { useContext, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

const Search = ({ searchKeyword, onSearchChange }) => {
  return (
    <div className="search border-b border-slate-200 h-16 flex">
      <div className="flex items-center gap-2 px-4 text-sm py-2 m-2 rounded-lg bg-slate-100 w-full">
        <SearchIcon className="w-20 h-auto text-slate-500" />
        <input
          type="text"
          className="bg-inherit w-full"
          placeholder="Search user..."
          onChange={(e) => onSearchChange(e.target.value)}
          value={searchKeyword}
        />
      </div>
    </div>
  );
};

export default Search;
