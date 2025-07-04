import React from 'react';
import { LuTrash2 } from 'react-icons/lu';
import { getInitials } from '../../utils/helper';

const SummaryCard = ({
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
  onSelect,
  onDelete,
  colors,
}) => {
  return (
    <div
      onClick={onSelect}
      className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all group cursor-pointer card-animate card-animate-hover overflow-hidden"
    >
      {/* Header Section */}
      <div className="p-4 text-white relative" style={{ background: colors?.bgcolor }}>
        {/* Delete Button */}
        <button
          className="absolute top-3 right-3 hidden group-hover:flex items-center gap-1 text-xs font-medium bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-[#22223b] transition"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <LuTrash2 size={14} />
        </button>

        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center text-[#22223b] font-bold text-lg border-2 border-white shadow" style={{textShadow: '0 1px 6px rgba(0,0,0,0.08)'}}>
            {getInitials(role)}
          </div>

          {/* Role + Topics */}
          <div className="flex flex-col">
            <h3 className="text-base font-semibold text-[#22223b]" style={{textShadow: '0 1px 6px rgba(0,0,0,0.08)'}}>{role}</h3>
            {topicsToFocus && (
              <p className="text-xs text-[#22223b] mt-1" style={{textShadow: '0 1px 6px rgba(0,0,0,0.08)'}}>{topicsToFocus}</p>
            )}
          </div>
        </div>
      </div>

      {/* Body Section */}
      <div className="p-4 pt-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 text-[11px] text-black/80 font-medium mb-3">
          <span className="px-2 py-1 border border-gray-300 rounded-full">
            Experience: {experience} {experience === 1 ? 'year' : 'years'}
          </span>
          <span className="px-2 py-1 border border-gray-300 rounded-full">
            {questions} Q&A
          </span>
          <span className="px-2 py-1 border border-gray-300 rounded-full">
            Last updated: {lastUpdated}
          </span>
        </div>

        {/* Description */}
        <p className="text-[13px] text-gray-600 line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
