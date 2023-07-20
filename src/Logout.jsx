import React from "react";

const Logout = () => {
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <button
        className="px-4 py-2 rounded bg-red-500 text-white"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

export default Logout;
