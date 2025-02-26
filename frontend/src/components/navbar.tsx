import { Dispatch, SetStateAction } from "react";
import { User } from "../App";

export const Navbar = ({ user, setUser }: { user: User; setUser: Dispatch<SetStateAction<User | null>> }) => {
  const name = user?.email.split("@")[0];
  const signOut = () => {
    setUser(null);
  };
  return (
    <div className="navbar bg-base-100 h-min">
      <div className="flex-1">
        <p className="btn btn-outline text-xl btn-active cursor-default">Hola {name}!</p>
      </div>
      <div className="dropdown dropdown-bottom dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-square btn-ghost disabled">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            ></path>
          </svg>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 border border-gray-100 shadow"
        >
          <li>
            <button onClick={signOut}>Cerrar sesion</button>
          </li>
        </ul>
      </div>
    </div>
  );
};
