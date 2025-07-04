import React, { useState, useContext } from "react";
import { isNewProblem, returnColor, returnDifficultyText } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { IconChevronLeft, IconChevronRight, IconMoodEmpty, IconSortAscending, IconSortDescending, IconCircleCheck, IconCircleX } from '@tabler/icons';
import NewBadge from "../new-badge/NewBadge";
import Tag from "../tag/Tag";
import { LocalStorageProvider } from "../../contexts/localStorageContext";

const TableHeader = (props) => {
  const headers = [
    { key: "problemTitle", label: "Problem" },
    { key: "solved", label: "Solved" },
    { key: "difficulty", label: "Difficulty" },
    { key: "askedIn", label: "Asked in" },
    { key: "tags", label: "Topic" }
  ];

  const getSortIcon = (name) => {
    if (!props.sortConfig || props.sortConfig.key !== name) return null;
    return props.sortConfig.direction === 'ascending' 
      ? <IconSortAscending size={18} className="inline ml-1 text-zinc-300" />
      : <IconSortDescending size={18} className="inline ml-1 text-zinc-300" />;
  };

  const headerCellClass = "px-4 py-3 text-left font-medium tracking-normal text-lg bg-zinc-800 text-zinc-300";

  return (
    <thead>
      <tr>
        {headers.map((header) => (
          <th 
            key={header.key} 
            className={`${headerCellClass} cursor-pointer hover:bg-zinc-700 transition-colors`}
            onClick={() => props.onSort(header.key)}
            scope="col"
          >
            <div className="flex items-center gap-1">
              {header.label}
              {getSortIcon(header.key)}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

const TagList = (props) => {
  return (
    <div className={`flex gap-2 flex-wrap ${props.maxWidth}`}>
      {props.items?.map((item, index) => (
        <Tag
          key={`tag-${item}-${index}`}
          data={item}
          isClickable={false}
          showHash={false}
          className="text-sm"
        />
      ))}
    </div>
  );
};

const TableRow = (props) => {
  const cellClass = "px-4 py-4 text-zinc-300";
  const isNew = isNewProblem(props.question.timestamp || props.question.createdAt);
  const { solvedProblems } = useContext(LocalStorageProvider);
  const isSolved = solvedProblems.includes(props.question.documentId);

  return (
    <tr 
      className="border-b border-zinc-600 hover:bg-zinc-600 transition-colors cursor-pointer"
      onClick={props.onRowClick}
      aria-label={`Question: ${props.question.problemTitle}`}
    >
      <td className={`${cellClass} relative`}>
        <div className="flex items-center gap-2">
          {props.question.problemTitle}
          {isNew && <NewBadge />}
        </div>
      </td>
      <td className={`${cellClass} text-center`}>
        {isSolved && (
          <IconCircleCheck className="w-5 h-5 text-emerald-400 mx-auto" />
        )}
        {!isSolved && (
          <IconCircleX className="w-5 h-5 text-red-400 mx-auto" />
        )}
      </td>
      <td className={`${cellClass} whitespace-nowrap`}>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${returnColor(props.question.difficulty)}`}>
          {returnDifficultyText(props.question.difficulty)}
        </span>
      </td>
      <td className={cellClass}>
        <TagList 
          items={props.question.askedIn}
          maxWidth="max-w-xs"
        />
      </td>
      <td className={cellClass}>
        <TagList 
          items={props.question.tags}
          maxWidth="max-w-xs"
        />
      </td>
    </tr>
  );
};

const EmptyState = () => (
  <tr>
    <td 
      colSpan={5} 
      className="p-8 text-center text-zinc-500"
    >
      <div className="flex flex-col items-center justify-center">
        <IconMoodEmpty size={32} className="text-zinc-400 mb-2" />
        <h3 className="text-lg font-medium text-zinc-700">
          No questions available
        </h3>
        <p className="mt-1 text-sm">Try adjusting your filters or check back later.</p>
      </div>
    </td>
  </tr>
);

const Pagination = (props) => {
  const buttonClass = "flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-zinc-200 text-zinc-600";
  const activeClass = "bg-zinc-300";
  
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button 
        onClick={() => props.onPageChange(props.currentPage - 1)} 
        disabled={props.currentPage === 1}
        className={`${buttonClass} ${props.currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""} text-zinc-300`}
        aria-label="Previous page"
      >
        <IconChevronLeft size={20} />
      </button>
      
      {Array.from({ length: props.totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => props.onPageChange(page)}
          className={`${buttonClass} ${props.currentPage === page ? activeClass : ""}`}
          aria-label={`Page ${page}`}
          aria-current={props.currentPage === page ? "page" : undefined}
        >
          {page}
        </button>
      ))}
      
      <button 
        onClick={() => props.onPageChange(props.currentPage + 1)} 
        disabled={props.currentPage === props.totalPages}
        className={`${buttonClass} ${props.currentPage === props.totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label="Next page"
      >
        <IconChevronRight size={20} />
      </button>
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
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig || !props.data) return props.data;
    
    return [...props.data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [props.data, sortConfig]);

  const paginatedData = React.useMemo(() => {
    if (!sortedData) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = React.useMemo(() => {
    return props.data ? Math.ceil(props.data.length / itemsPerPage) : 0;
  }, [props.data]);

  const hasData = props.data && props.data.length > 0;

  return (
    <section 
      className="flex flex-col gap-3 w-full min-h-[700px]" 
      aria-label="Problems table"
    >
      <div className="overflow-x-auto rounded-lg border-2 border-zinc-600">
        <table className="min-w-full divide-y divide-zinc-600">
          <TableHeader 
            onSort={handleSort} 
            sortConfig={sortConfig}
          />
          <tbody className="divide-y-2 divide-zinc-600">
            {hasData ? (
              paginatedData.map((question, index) => (
                <TableRow
                  key={`question-${index}-${question.problemTitle}`}
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
      
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  );
};

export default Table;
