import React, { useState } from "react";
import ReactDOM from "react-dom/client";

// import "./index.css";
// import App from "./App";

import StarRating from "./starRating";

function Test() {
  const [movieRating, setMovieRating] = useState(0);

  return (
    <div>
      <StarRating maxRating={10} color="blue" onSetRating={setMovieRating} />
      <p>The movie was rated {movieRating} stars</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StarRating
      maxRating={5}
      messages={["Terrible", "Bad", "Ok", "Good", "Amazing"]}
      defaultRating={3}
    />
    <StarRating maxRating={10} size={30} color="red" />
    <Test />
  </React.StrictMode>
);
