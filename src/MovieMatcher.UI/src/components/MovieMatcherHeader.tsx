import React from "react";

export default function MovieMatcherHeader() {
  return (
    <header className="text-center">
      <h1 className="text-6xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
        🎬 MovieMatcher
      </h1>
      <h2 className="text-xl md:text-2xl mt-3 max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
        Swipe through movies, match with friends, and discover the perfect film
        to watch together!
      </h2>
    </header>
  );
}
