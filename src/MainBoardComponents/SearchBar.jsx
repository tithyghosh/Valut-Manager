import React, { useEffect, useRef, useState } from "react";

const sortChoices = [
  {
    value: "date-desc",
    label: "Date: Newest First",
    hint: "Recently added cards appear first",
  },
  {
    value: "date-asc",
    label: "Date: Oldest First",
    hint: "Earlier saved cards appear first",
  },
  {
    value: "name-asc",
    label: "Name: A to Z",
    hint: "Alphabetical ascending order",
  },
  {
    value: "name-desc",
    label: "Name: Z to A",
    hint: "Alphabetical descending order",
  },
];

const SearchBar = ({
  searchTerm,
  onSearchChange,
  sortOrder,
  onSortChange,
}) => {
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const sortMenuRef = useRef(null);
  const activeSort =
    sortChoices.find((choice) => choice.value === sortOrder) || sortChoices[0];

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        sortMenuRef.current &&
        !sortMenuRef.current.contains(event.target)
      ) {
        setIsSortMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or URL"
            className="w-full rounded-2xl border border-neutral-800 bg-neutral-950/60 py-3 pl-11 pr-4 text-sm text-white placeholder:text-neutral-500 transition focus:border-blue-500 focus:bg-neutral-950 focus:outline-none"
          />
        </label>

        <div ref={sortMenuRef} className="relative flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsSortMenuOpen((prev) => !prev)}
            aria-expanded={isSortMenuOpen}
            aria-haspopup="menu"
            className="inline-flex items-center gap-2 rounded-2xl border border-neutral-800/80 bg-neutral-900/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-300 transition hover:border-blue-500 hover:text-white"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4h18l-8 8v6l-4 4v-8z"
              ></path>
            </svg>
            Sort by
            <span className="rounded-full bg-neutral-800 px-2 py-1 text-[10px] tracking-[0.2em] text-neutral-400">
              {activeSort.value === "date-desc" && "Newest"}
              {activeSort.value === "date-asc" && "Oldest"}
              {activeSort.value === "name-asc" && "A-Z"}
              {activeSort.value === "name-desc" && "Z-A"}
            </span>
            <svg
              className={`h-4 w-4 transition ${isSortMenuOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          {isSortMenuOpen && (
            <div className="absolute right-0 top-full z-20 mt-3 w-72 rounded-3xl border border-neutral-800 bg-neutral-950/95 p-3 shadow-2xl shadow-black/40 backdrop-blur">
              <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-500">
                Sort Order
              </p>

              <div className="mt-3 space-y-2">
                {sortChoices.map((choice) => {
                  const isActive = choice.value === sortOrder;

                  return (
                    <button
                      key={choice.value}
                      type="button"
                      onClick={() => {
                        onSortChange(choice.value);
                        setIsSortMenuOpen(false);
                      }}
                      className={`flex w-full items-start justify-between rounded-2xl border px-4 py-3 text-left transition ${
                        isActive
                          ? "border-blue-500/70 bg-blue-500/10 text-white"
                          : "border-neutral-800 bg-neutral-900/70 text-neutral-300 hover:border-blue-500/40 hover:text-white"
                      }`}
                    >
                      <span className="text-sm font-semibold">{choice.label}</span>
                      <span className="ml-4 max-w-[9rem] text-right text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                        {choice.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
        Find cards instantly by website name or URL. Sorted by {activeSort.label}
      </p>
    </div>
  );
};

export default SearchBar;
