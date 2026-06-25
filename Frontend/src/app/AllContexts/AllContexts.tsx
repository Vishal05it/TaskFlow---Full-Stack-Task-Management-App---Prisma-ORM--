"use client";
import React, {
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { createContext } from "react";
type Context = {
  theme: string;
  setTheme: React.Dispatch<SetStateAction<"light" | "dark">>;
  isLogin: boolean;
  setIsLogin: React.Dispatch<SetStateAction<boolean>>;
  toggleTheme: () => void;
  user: User;
  setUser: React.Dispatch<SetStateAction<User>>;
  pageLoading: boolean;
  setPageLoading: React.Dispatch<SetStateAction<boolean>>;
  btnLoading: boolean;
  setBtnLoading: React.Dispatch<SetStateAction<boolean>>;
  allTasks: Task[];
  setAllTasks: React.Dispatch<SetStateAction<Task[]>>;
  called: boolean;
  setCalled: React.Dispatch<SetStateAction<boolean>>;
  lastPage: number;
  setLastPage: React.Dispatch<SetStateAction<number>>;
};
type User = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  avatar: string;
  bio: string;
};
type Task = {
  id: string;
  title: string;
  description: string;
  addedMs: number;
  createdAt: string;
  updatedAt: string;
  isDone: boolean;
  deadline: string;
  createdBy: number;
  user: User;
  priority: string;
};
export const allContexts = createContext<Context | null>(null);
function AllContexts({ children }: { children: ReactNode }) {
  let storedTheme;
  let storedLogin;
  const [theme, setTheme] = useState<"light" | "dark">(
    storedTheme ? JSON.parse(storedTheme) : "light",
  );
  let storedUser;
  const toggleTheme = () => {
    let htmlTag = document.querySelector("html");
    htmlTag?.classList.remove("dark");
    htmlTag?.classList.remove("light");
    if (theme === "light") {
      setTheme("dark");
      localStorage.setItem("theme", JSON.stringify("dark"));
      htmlTag?.classList.add("dark");
    } else {
      setTheme("light");
      localStorage.setItem("theme", JSON.stringify("light"));
      htmlTag?.classList.add("light");
    }
  };
  const [lastPage, setLastPage] = useState<number>(1);
  const [isLogin, setIsLogin] = useState<boolean>(
    storedLogin ? JSON.parse(storedLogin) : false,
  );
  const [user, setUser] = useState<User>(
    storedUser
      ? JSON.parse(storedUser)
      : {
          name: "",
          email: "",
          id: "",
          phoneNumber: "",
          bio: "",
          avatar: "",
        },
  );
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [called, setCalled] = useState<boolean>(false);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(JSON.parse(storedTheme));
    }

    const storedLogin = localStorage.getItem("isLogin");
    if (storedLogin) {
      setIsLogin(JSON.parse(storedLogin));
    }

    const storedUser = localStorage.getItem("taskUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  return (
    <allContexts.Provider
      value={{
        theme,
        setTheme,
        isLogin,
        setIsLogin,
        toggleTheme,
        user,
        setUser,
        pageLoading,
        setPageLoading,
        btnLoading,
        setBtnLoading,
        allTasks,
        setAllTasks,
        called,
        setCalled,
        lastPage,
        setLastPage,
      }}
    >
      {children}
    </allContexts.Provider>
  );
}
export const useAllContexts = () => {
  let context = useContext(allContexts);
  if (!context) {
    throw new Error("Wrap the React Node under the context");
  }
  return context;
};
export default AllContexts;
