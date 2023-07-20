import { collection, getDocs } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import { db } from "./firebase";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      const usersCollection = collection(db, "users");
      const userSnapshot = await getDocs(usersCollection);
      const usersData = userSnapshot.docs.map((doc) => doc.data());
      setUsers(usersData);
    };

    getUsers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex min-h-screen bg-slate-100 max-w-[1400px] min-w-[850px] mx-auto">
      <div className="bg-white lg:w-[400px] w-[300px]">
        <Sidebar
          users={users}
          onUserClick={handleUserClick}
          selectedUser={selectedUser}
        />
      </div>
      <div className="bg-slate-300 flex-1">
        <MainContent selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default Home;
