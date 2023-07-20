import React, { useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { auth, db, storage } from "./firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Avatar } from "@mui/material";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisibile] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisibile(!passwordVisible);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      alert("Please fill out all the fields!");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      console.log(user);

      if (profileImage) {
        // Upload the profileImage to Firebase Storage
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, profileImage);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Handle upload progress if needed
          },
          (error) => {
            // Handle upload error if needed
            setLoading(false);
          },
          async () => {
            // On successful upload, get the download URL and update the user's profile with it
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateProfile(user, {
              displayName: `${firstName} ${lastName}`,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "users", user.uid), {
              uid: user.uid,
              displayName: `${firstName} ${lastName}`,
              email: user.email,
              photoURL: downloadURL,
            });

            setLoading(false);
            navigate("/");
          }
        );
      } else {
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
          photoURL: "",
        });

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName: `${firstName} ${lastName}`,
          email: user.email,
          photoURL: "",
        });

        setLoading(false);
        navigate("/");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);

      switch (error.code) {
        case "auth/email-already-in-use":
          alert("The email address is already in use.");
          break;
        case "auth/invalid-email":
          alert("The email address is invalid.");
          break;
        case "auth/weak-password":
          alert("Password should be atleast 6 characters long.");
          break;
        default:
          alert("Something went wrong, please try again later.");
          break;
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen flex justify-center items-center flex-col">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="w-[400px] bg-white text-slate-700 shadow rounded-lg p-8">
        <h4 className="text-2xl font-semibold text-center mb-5">SignUp</h4>
        <form>
          <div className="flex mb-3 gap-3">
            <input
              type="text"
              className="w-full border border-slate-300 shadow rounded py-2 px-4"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              className="w-full border border-slate-300 shadow rounded py-2 px-4"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <input
            type="email"
            className="w-full border border-slate-300 shadow rounded py-2 px-4 mb-3"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex border border-slate-300 shadow rounded py-2 px-4 mb-3">
            <input
              type={passwordVisible ? "text" : "password"}
              className="w-full"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="text-slate-400"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? (
                <VisibilityOutlinedIcon />
              ) : (
                <VisibilityOffOutlinedIcon />
              )}
            </button>
          </div>
          <label
            for="profile"
            className="cursor-pointer flex items-center gap-3 justify-center mb-3"
          >
            <p>Profile Image</p>
            {profileImage ? (
              <Avatar
                sx={{ width: 50, height: 50 }}
                src={URL.createObjectURL(profileImage)}
              />
            ) : (
              <Avatar sx={{ width: 50, height: 50 }} />
            )}
          </label>
          <input
            type="file"
            id="profile"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => setProfileImage(e.target.files[0])}
          />
          <button
            type="submit"
            onClick={handleSignup}
            className="w-full bg-emerald-500 text-white px-4 py-2 rounded shadow font-semibold"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-3 text-center">
          Already have an account?{" "}
          <Link to="/signin" className="text-emerald-500">
            Signin
          </Link>
        </p>
        <div className="flex items-center gap-3 my-5">
          <hr className="w-full border-slate-300" />
          <p>OR</p>
          <hr className="w-full border-slate-300" />
        </div>
        <button
          className="flex bg-sky-500 text-white w-full justify-between py-2 px-4 rounded shadow font-semibold"
          onClick={handleGoogleSignup}
        >
          <GoogleIcon />
          <span>Continue with Google</span>
          <span></span>
        </button>
      </div>
    </div>
  );
};

export default Signup;
