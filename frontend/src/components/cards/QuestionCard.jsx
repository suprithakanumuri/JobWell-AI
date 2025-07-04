import React, { useState, useRef, useEffect } from 'react';
import { LuChevronDown, LuPin, LuPinOff, LuSparkles, LuStickyNote } from 'react-icons/lu';
import AIResponsePreview from '../../pages/interviewprep/components/AIResponsePreview';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from "../../utils/apiPaths";


import toast from 'react-hot-toast';

const QuestionCard = ({
  question,
  answer,
  onLearnMore,
  isPinned,
  onTogglePin,
  _id,
  notes: initialNotes = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const [shortAnswer, setShortAnswer] = useState("");
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [notes, setNotes] = useState(initialNotes);
  const [noteDraft, setNoteDraft] = useState(initialNotes);
  const [savingNote, setSavingNote] = useState(false);
  const contentRef = useRef(null);
  const noteInputRef = useRef(null);

  useEffect(() => {
    if (isExpanded) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(contentHeight + 10);
    } else {
      setHeight(0);
    }
  }, [isExpanded, shortAnswer, notes, showNoteInput]);

  useEffect(() => {
    if (showNoteInput && noteInputRef.current) {
      noteInputRef.current.focus();
    }
  }, [showNoteInput]);

  useEffect(() => {
    if (isExpanded && !shortAnswer) {
      setLoadingAnswer(true);
      axiosInstance
        .post(API_PATHS.AI.GENERATE_SHORT_ANSWER, { concept: question })
        .then((res) => {
          setShortAnswer(res.data?.answer || "No answer generated.");
        })
        .catch(() => {
          setShortAnswer("Failed to generate answer.");
        })
        .finally(() => setLoadingAnswer(false));
    }
    // eslint-disable-next-line
  }, [isExpanded, question]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleSaveNote = async () => {
    setSavingNote(true);
    try {
      await axiosInstance.patch(API_PATHS.QUESTION.PIN(_id).replace('/pin', '/note'), { note: noteDraft });
      setNotes(noteDraft);
      setShowNoteInput(false);
      toast.success('Note saved!');
    } catch (e) {
      toast.error('Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="relative mb-6 bg-white rounded-xl p-5 shadow-lg border border-gray-200 transition-all duration-300 group">
      <div className="relative z-10">
        <div className="flex items-start justify-between cursor-pointer">
          <div className="flex items-start gap-3.5">
            <span className="text-sm font-bold text-white bg-[#7B61FF] px-3 py-1 rounded-full shadow">Q</span>
            <h3
              className="text-sm md:text-base font-semibold text-gray-800 max-w-[90%] hover:text-black transition"
              onClick={toggleExpand}
            >
              {question}
            </h3>
          </div>

          <div className="flex items-center justify-end ml-4">
            <div className={`flex gap-2 ${isExpanded ? 'md:flex' : 'md:hidden group-hover:flex'}`}>
              <button
                className="bg-[#7B61FF] text-white text-xs font-medium px-3 py-1 rounded shadow"
                onClick={onTogglePin}
                title={isPinned ? "Unpin" : "Pin"}
              >
                {isPinned ? <LuPinOff size={14} /> : <LuPin size={14} />}
              </button>

              <button
                className="bg-[#6A82FB] text-white text-xs font-medium px-3 py-1 rounded shadow"
                onClick={() => {
                  setIsExpanded(true);
                  onLearnMore();
                }}
              >
                <LuSparkles size={14} />
                <span className="hidden md:inline ml-1">Learn More</span>
              </button>

              <button
                className="bg-[#7B61FF] text-white text-xs font-medium px-3 py-1 rounded shadow"
                onClick={() => setShowNoteInput(v => !v)}
                aria-label="Add Note"
              >
                <LuStickyNote size={14} />
                <span className="hidden md:inline ml-1">Note</span>
              </button>
            </div>

            <button 
              className="text-gray-600 hover:text-gray-800 ml-2 transition"
              onClick={toggleExpand}
            >
              <LuChevronDown
                size={20}
                className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Expandable Content */}
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: `${height}px` }}
        >
          <div
            ref={contentRef}
            className="mt-4 text-sm text-gray-800 bg-gray-50 px-5 py-4 rounded-xl shadow-inner"
          >
            {/* AI Answer */}
            {isExpanded && (
              loadingAnswer ? (
                <div className="text-sm text-gray-400">Generating answer...</div>
              ) : (
                <AIResponsePreview content={shortAnswer} />
              )
            )}

            {/* Notes */}
            {showNoteInput ? (
              <div className="mt-4 flex flex-col items-end w-full">
                <textarea
                  ref={noteInputRef}
                  className="w-full p-2 border-2 border-[#7B61FF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7B61FF] bg-white shadow text-gray-800"
                  rows={2}
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Add your note here..."
                />
                <button
                  className="mt-2 px-4 py-1 bg-[#7B61FF] text-white rounded text-xs font-semibold shadow transition"
                  onClick={handleSaveNote}
                  disabled={savingNote}
                >
                  {savingNote ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            ) : notes ? (
              <div className="mt-4 p-3 bg-[#F3F4F6] border-l-4 border-[#7B61FF] text-gray-700 text-sm rounded-xl shadow-sm">
                 <span className="font-semibold">Note:</span> {notes}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
