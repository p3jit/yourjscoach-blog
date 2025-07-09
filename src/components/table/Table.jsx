import React, { useState, useContext } from "react";
import { isNewProblem, returnColor, returnDifficultyText } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import {
  IconChevronLeft,
  IconChevronRight,
  IconMoodEmpty,
  IconSortAscending,
  IconSortDescending,
  IconCircleCheck,
  IconCircleX,
} from "@tabler/icons";
import NewBadge from "../new-badge/NewBadge";
import Tag from "../tag/Tag";
import { LocalStorageProvider } from "../../contexts/localStorageContext";

const TableHeader = (props) => {
  const headers = [
    { key: "problemTitle", label: "Problem" },
    { key: "difficulty", label: "Difficulty" },
    { key: "askedIn", label: "Companies" },
    { key: "tags", label: "Topics" },
  ];

  const getSortIcon = (name) => {
    if (!props.sortConfig || props.sortConfig.key !== name) return null;
    return props.sortConfig.direction === "ascending" ? (
      <IconSortAscending size={16} className="ml-1.5 text-zinc-200" />
    ) : (
      <IconSortDescending size={16} className="ml-1.5 text-zinc-200" />
    );
  };

  return (
    <thead className="bg-zinc-700/20">
      <tr>
        {headers.map((header) => (
          <th
            key={header.key}
            className={`px-6 py-4 text-left text-sm font-medium text-zinc-300 uppercase tracking-wider 
              cursor-pointer hover:bg-zinc-700/30 transition-colors group`}
            onClick={() => props.onSort(header.key)}
            scope="col"
          >
            <div className="flex items-center">
              <span className="group-hover:text-white transition-colors">{header.label}</span>
              {getSortIcon(header.key)}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

const TableRow = (props) => {
  const { solvedProblems } = useContext(LocalStorageProvider);
  const isNew = isNewProblem(props.question.timestamp || props.question.createdAt);
  const isSolved = solvedProblems.includes(props.question.documentId);

  return (
    <tr
      className="border-b border-zinc-600/30 hover:bg-zinc-800/20 transition-colors duration-150 cursor-pointer bg-zinc-950/20"
      onClick={props.onRowClick}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center mr-3">
            {isSolved ? (
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <IconCircleCheck className="h-5 w-5 text-emerald-400" />
              </div>
            ) : (
              <div className="h-8 w-8 rounded-full bg-zinc-700/20 flex items-center justify-center">
                <span className="text-zinc-400 text-sm font-medium">{"•"}</span>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-100 font-medium group-hover:text-white">{props.question.problemTitle}</span>
              {isNew && <NewBadge />}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`text-sm ${returnColor(props.question.difficulty)} bg-zinc-700/40 rounded-md p-2`}>
          {returnDifficultyText(props.question.difficulty)}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1.5">
          {props.question.askedIn?.map((company, idx) => (
            <Tag
              key={idx}
              data={company}
              isClickable={false}
              showHash={false}
              className="text-xs bg-zinc-700/20 hover:bg-zinc-700/30"
            />
          ))}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1.5">
          {props.question.tags?.slice(0, 3).map((tag, idx) => (
            <Tag
              key={idx}
              data={tag}
              isClickable={false}
              showHash={false}
              className="text-xs bg-zinc-800/20 hover:bg-zinc-800/30"
            />
          ))}
          {props.question.tags?.length > 3 && (
            <span className="text-xs text-zinc-500">+{props.question.tags.length - 3}</span>
          )}
        </div>
      </td>
    </tr>
  );
};

const EmptyState = () => (
  <tr>
    <td colSpan="4" className="px-6 py-12 text-center">
      <div className="flex flex-col items-center justify-center text-zinc-400">
        <IconMoodEmpty size={40} className="mb-3 text-zinc-600" />
        <h3 className="text-lg font-medium text-zinc-200">No problems found</h3>
        <p className="mt-1 text-sm">Try adjusting your search or filters</p>
      </div>
    </td>
  </tr>
);

const Pagination = (props) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;
    let startPage, endPage;

    if (props.totalPages <= maxVisible) {
      startPage = 1;
      endPage = props.totalPages;
    } else {
      const maxVisibleBeforeCurrent = Math.floor(maxVisible / 2);
      const maxVisibleAfterCurrent = Math.ceil(maxVisible / 2) - 1;

      if (props.currentPage <= maxVisibleBeforeCurrent) {
        startPage = 1;
        endPage = maxVisible;
      } else if (props.currentPage + maxVisibleAfterCurrent >= props.totalPages) {
        startPage = props.totalPages - maxVisible + 1;
        endPage = props.totalPages;
      } else {
        startPage = props.currentPage - maxVisibleBeforeCurrent;
        endPage = props.currentPage + maxVisibleAfterCurrent;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="px-6 py-4 flex items-center justify-between border-t border-zinc-800">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => props.onPageChange(Math.max(1, props.currentPage - 1))}
          disabled={props.currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-zinc-700 text-sm font-medium rounded-md text-zinc-300 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => props.onPageChange(Math.min(props.totalPages, props.currentPage + 1))}
          disabled={props.currentPage === props.totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-zinc-700 text-sm font-medium rounded-md text-zinc-300 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-zinc-400">
            Showing <span className="font-medium">{(props.currentPage - 1) * 10 + 1}</span> to{" "}
            <span className="font-medium">{Math.min(props.currentPage * 10, props.totalItems || 0)}</span> of{" "}
            <span className="font-medium">{props.totalItems || 0}</span> results
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => props.onPageChange(Math.max(1, props.currentPage - 1))}
              disabled={props.currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-zinc-700 bg-zinc-800 text-sm font-medium text-zinc-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <IconChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            {renderPageNumbers().map((page, idx) => (
              <button
                key={idx}
                onClick={() => props.onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  props.currentPage === page
                    ? "z-10 bg-zinc-600 border-zinc-600 text-white"
                    : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => props.onPageChange(Math.min(props.totalPages, props.currentPage + 1))}
              disabled={props.currentPage === props.totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-zinc-700 bg-zinc-800 text-sm font-medium text-zinc-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <IconChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

const Table = (props) => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleRowClick = (id) => {
    navigate(`/practice/${id}`);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig || !props.data) return props.data;

    return [...props.data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [props.data, sortConfig]);

  const paginatedData = React.useMemo(() => {
    if (!sortedData) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil((props.data?.length || 0) / itemsPerPage);

  return (
    <div className="flex flex-col outline outline-1 rounded-md outline-zinc-700/30 shadow-lg">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-zinc-800 rounded-lg min-h-[900px] flex flex-col">
            <div className="flex-1">
              <table className="min-w-full divide-y divide-zinc-600/50">
                <TableHeader onSort={handleSort} sortConfig={sortConfig} />
                <tbody className="bg-zinc-900/10 divide-y divide-zinc-600/30">
                  {paginatedData?.length > 0 ? (
                    paginatedData.map((question, index) => (
                      <TableRow
                        key={`question-${index}`}
                        question={question}
                        onRowClick={() => handleRowClick(question.documentId)}
                      />
                    ))
                  ) : (
                    <EmptyState />
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-auto">
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={props.data?.length || 0}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
