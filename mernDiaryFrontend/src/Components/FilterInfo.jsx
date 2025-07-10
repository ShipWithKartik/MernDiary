import React from 'react';
import { IoMdClose } from 'react-icons/io';
import moment from 'moment';

const FilterInfo = ({ filterType, filterDate, onClear }) => {
  if (filterType === 'date' && filterDate.from && filterDate.to) {
    return (
      <div className="flex items-center justify-between bg-cyan-50 border-b border-cyan-200 px-6 py-3 rounded-md mb-6">
        <h2 className="text-lg font-semibold text-cyan-800">
          Travel Stories from: {moment(filterDate.from).format('Do MMM YYYY')} to {moment(filterDate.to).format('Do MMM YYYY')}
        </h2>
        <button onClick={onClear} className="ml-4 p-1 rounded hover:bg-cyan-100">
          <IoMdClose className="text-2xl text-cyan-600 hover:text-cyan-900" />
        </button>
      </div>
    );
  }
  if (filterType === 'search') {
    return (
      <div className="flex items-center justify-between bg-cyan-50 border-b border-cyan-200 px-6 py-3 rounded-md mb-6">
        <h2 className="text-lg font-semibold text-cyan-800">Search Results</h2>
        <button onClick={onClear} className="ml-4 p-1 rounded hover:bg-cyan-100">
          <IoMdClose className="text-2xl text-cyan-600 hover:text-cyan-900" />
        </button>
      </div>
    );
  }
  return null;
};

export default FilterInfo;
