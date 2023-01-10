import { Link } from "react-router-dom";
export const HomePage = () => {
  return (
    <div>
      <h1> Home page</h1>
      <Link to="/create">
        <button>Create</button>
      </Link>
      <Link to="/join">
        <button>Join</button>
      </Link>
    </div>
  );
};
