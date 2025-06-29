import React, { useState } from "react";
import { returnColor, returnDifficultyText } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { IconChevronLeft, IconChevronRight, IconMoodEmpty, IconSortAscending, IconSortDescending } from '@tabler/icons';

const TableHeader = ({ onSort, sortConfig }) => {
  const headers = [
    { key: "problemTitle", label: "Problem" },
    { key: "difficulty", label: "Difficulty" },
    { key: "askedIn", label: "Asked in" },
    { key: "tags", label: "Topic" }
  ];

  const getSortIcon = (name) => {
    if (!sortConfig || sortConfig.key !== name) return null;
    return sortConfig.direction === 'ascending' 
      ? <IconSortAscending size={18} className="inline ml-1 text-zinc-600" />
      : <IconSortDescending size={18} className="inline ml-1 text-zinc-600" />;
  };

  const headerCellClass = "px-4 py-3 text-left font-medium tracking-normal text-lg bg-zinc-800 text-zinc-300";

  return (
    <thead>
      <tr>
        {headers.map((header) => (
          <th 
            key={header.key} 
            className={`${headerCellClass} cursor-pointer hover:bg-zinc-700 transition-colors`}
            onClick={() => onSort(header.key)}
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

const TagList = ({ items = [], maxWidth = "max-w-full" }) => (
  <div className={`flex gap-2 flex-wrap ${maxWidth}`}>
    {items?.map((item, index) => (
      <span
        key={`tag-${item}-${index}`}
        className="w-fit px-3 py-1 rounded-full text-sm font-normal bg-zinc-700 text-zinc-300"
      >
        {item}
      </span>
    ))}
  </div>
);

const TableRow = ({ question, onRowClick }) => {
  const cellClass = "px-4 py-4 text-zinc-300";
  
  return (
    <tr 
      className="border-b border-zinc-600 hover:bg-zinc-600 transition-colors cursor-pointer"
      onClick={onRowClick}
      aria-label={`Question: ${question.problemTitle}`}
    >
      <td className={`${cellClass} `}>
        {question.problemTitle}
      </td>
      <td className={`${cellClass} whitespace-nowrap`}>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${returnColor(question.difficulty)}`}>
          {returnDifficultyText(question.difficulty)}
        </span>
      </td>
      <td className={cellClass}>
        <TagList 
          items={question.askedIn}
          maxWidth="max-w-xs"
        />
      </td>
      <td className={cellClass}>
        <TagList 
          items={question.tags}
          maxWidth="max-w-xs"
        />
      </td>
    </tr>
  );
};

const EmptyState = () => (
  <tr>
    <td 
      colSpan={4} 
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

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const buttonClass = "flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-zinc-200 text-zinc-600";
  const activeClass = "bg-zinc-300";
  
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        className={`${buttonClass} ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""} text-zinc-300`}
        aria-label="Previous page"
      >
        <IconChevronLeft size={20} />
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`${buttonClass} ${currentPage === page ? activeClass : ""}`}
          aria-label={`Page ${page}`}
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page}
        </button>
      ))}
      
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className={`${buttonClass} ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label="Next page"
      >
        <IconChevronRight size={20} />
      </button>
    </div>
  );
};

const Table = ({ data }) => {
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
    if (!sortConfig || !data) return data;
    
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const paginatedData = React.useMemo(() => {
    if (!sortedData) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = React.useMemo(() => {
    return data ? Math.ceil(data.length / itemsPerPage) : 0;
  }, [data]);

  const hasData = data && data.length > 0;

  return (
    <section 
      className="flex flex-col gap-3 w-full" 
      aria-label="Questions table"
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
