import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { AnimatePresence, motion } from 'framer-motion';
import { LuCircleAlert, LuListCollapse } from 'react-icons/lu';
import SpinnerLoader from '../../components/loader/SpinnerLoader';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from "../../utils/apiPaths";
import RoleInfoHeader from './components/RoleInfoHeader';
import QuestionCard from '../../components/cards/QuestionCard';
import AIResponsePreview from './components/AIResponsePreview';
import Drawer from '../../components/loader/Drawer';
import SkeletonLoader from '../../components/loader/SkeletonLoader';
import toast from 'react-hot-toast';
import ReactMarkDown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const InterviewPrep = () => {
  const { sessionId } = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedQuestions, setLoadedQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");

  const updateLoadedQuestions = (session) => {
    const allQuestions = session?.questions || [];
    const realUnpinned = allQuestions.filter(
      q => !q.isPinned && q.question !== 'What is your main strength?'
    );
    setLoadedQuestions(realUnpinned.slice(0, 10));
  };

  const fetchSessionDetailsById = async (afterFetchCallback) => {
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId));
      if (response.data?.session) {
        setSessionData(response.data.session);
        updateLoadedQuestions(response.data.session);
        if (afterFetchCallback) afterFetchCallback(response.data.session);
      }
    } catch (error) {
      console.error('❌ Error fetching session details:', error);
      toast.error("Failed to load session. Please try again.");
    }
  };

  const generateConceptExplanation = async (question) => {
    try {
      setErrorMsg('');
      setExplanation(null);
      setIsLoading(true);
      setOpenLearnMoreDrawer(true);
      setCurrentQuestion(question);

      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_EXPLANATION,
        { concept: question }
      );

      if (response.data) {
        setExplanation(response.data);
      }
    } catch (error) {
      setExplanation(null);
      setErrorMsg('Failed to generate explanation, try again later');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response = await axiosInstance.patch(API_PATHS.QUESTION.PIN(questionId));
      if (response.data?.question) {
        fetchSessionDetailsById();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const uploadMoreQuestions = async () => {
    try {
      setIsUpdateLoader(true);
      const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role: sessionData?.role,
        experience: sessionData?.experience,
        topicsToFocus: sessionData?.topicsToFocus,
        numberOfQuestions: 10,
      });
      const generatedQuestions = (aiResponse.data?.questions || aiResponse.data || []).map(q =>
        typeof q === 'string' ? { question: q } : q
      );
      const response = await axiosInstance.post(API_PATHS.QUESTION.ADD_TO_SESSION, {
        sessionId,
        questions: generatedQuestions,
      });
      if (response.data) {
        toast.success('Added More Q&A!!');
        await fetchSessionDetailsById((newSession) => {
          setLoadedQuestions(
            newSession?.questions?.filter(q => !q.isPinned)?.slice(-10) || []
          );
        });
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      }
      console.error('🔴 Error in uploadMoreQuestions:', error);
    } finally {
      setIsUpdateLoader(false);
    }
  };

  const getDisplayQuestions = () => {
    if (!sessionData?.questions) return [];
    const pinned = sessionData.questions.filter(q => q.isPinned);
    return [...pinned, ...loadedQuestions];
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsById((newSession) => {
        const realQuestions = newSession?.questions?.filter(
          q => q.question !== 'What is your main strength?'
        ) || [];
        if (realQuestions.length === 0) {
          uploadMoreQuestions();
        } else {
          updateLoadedQuestions(newSession);
        }
      });
    }
  }, [sessionId]);

  const displayQuestions = getDisplayQuestions();

  return (
    <DashboardLayout>
      {!sessionData ? (
        <div className="text-center py-10 text-gray-500">Loading session details...</div>
      ) : (
        <>
          <RoleInfoHeader
            role={sessionData.role || 'No role specified'}
            topicsToFocus={sessionData.topicsToFocus || 'No topics specified'}
            experience={sessionData.experience || 0}
            questions={sessionData.questions?.length || 0}
            description={sessionData.description || ''}
            lastUpdated={sessionData.updatedAt
              ? moment(sessionData.updatedAt).format('Do MMM YYYY')
              : 'N/A'}
          />

          <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
            <h1 className="text-lg font-semibold text-white bg-[#7B61FF] inline-block px-4 py-2 rounded-lg mb-5">Interview Q&A</h1>

            <div className="grid grid-cols-12 gap-4">
              <div className={`col-span-12 ${openLearnMoreDrawer ? 'md:col-span-7' : 'md:col-span-8'}`}>
                <AnimatePresence>
                  {displayQuestions.map((data, index) => (
                    <motion.div
                      key={data._id || index}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        duration: 0.4,
                        type: 'spring',
                        stiffness: 100,
                        delay: index * 0.1,
                        damping: 15,
                      }}
                      layout
                      layoutId={`question-${data._id || index}`}
                    >
                      <QuestionCard
                        question={data.question}
                        answer={data.answer}
                        onLearnMore={() => generateConceptExplanation(data.question)}
                        isPinned={data.isPinned}
                        onTogglePin={() => toggleQuestionPinStatus(data._id)}
                        _id={data._id}
                        notes={data.note}
                      />
                      {!isLoading && displayQuestions.length > 0 && index === displayQuestions.length - 1 && (
                        <div className="flex items-center justify-center mt-5">
                          <button
                            className="flex items-center gap-3 text-sm text-white font-medium bg-[#7B61FF] px-5 py-2 rounded cursor-pointer hover:bg-[#6A82FB] transition-all"
                            disabled={isLoading || isUpdateLoader}
                            onClick={uploadMoreQuestions}
                          >
                            {isUpdateLoader ? <SpinnerLoader /> : <><LuListCollapse className="text-lg" />Load More</>}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <Drawer
              isOpen={openLearnMoreDrawer}
              onClose={() => setOpenLearnMoreDrawer(false)}
              title={!isLoading && explanation?.title}
            >
              {errorMsg && (
                <p className="flex gap-2 text-sm text-amber-600 font">
                  <LuCircleAlert className="mt-1" />
                  {errorMsg}
                </p>
              )}
              {isLoading && <SkeletonLoader />}
              {!isLoading && explanation && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl text-gray-800 text-base p-6 my-4 shadow">
                  <div className="font-bold text-lg mb-3 text-indigo-700">
                    {currentQuestion}
                  </div>
                  <ReactMarkDown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1({ children }) {
                        return <h1 className="text-2xl font-bold text-indigo-800 mb-2">{children}</h1>;
                      },
                      h2({ children }) {
                        return <h2 className="text-xl font-semibold text-indigo-700 mb-2">{children}</h2>;
                      },
                      h3({ children }) {
                        return <h3 className="text-lg font-semibold text-indigo-600 mb-2">{children}</h3>;
                      },
                      code({ node, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return match ? (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-lg my-4"
                            customStyle={{ fontSize: 14, padding: 16 }}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-gray-200 text-pink-700 px-1 py-0.5 rounded">{children}</code>
                        );
                      },
                      p({ children }) {
                        return <p className="mb-3 leading-6">{children}</p>;
                      },
                      ul({ children }) {
                        return <ul className="list-disc pl-6 my-3 space-y-1">{children}</ul>;
                      },
                      ol({ children }) {
                        return <ol className="list-decimal pl-6 my-3 space-y-1">{children}</ol>;
                      },
                      li({ children }) {
                        return <li className="mb-1">{children}</li>;
                      },
                      strong({ children }) {
                        return <strong className="font-bold text-indigo-900 bg-indigo-100 px-1 rounded">{children}</strong>;
                      },
                      em({ children }) {
                        return <em className="italic">{children}</em>;
                      },
                      blockquote({ children }) {
                        return <blockquote className="border-l-4 border-indigo-300 pl-4 italic my-4 text-indigo-800 bg-indigo-100 rounded">{children}</blockquote>;
                      },
                      a({ children, href }) {
                        return <a href={href} className="text-indigo-600 underline hover:text-indigo-800">{children}</a>;
                      },
                    }}
                  >
                    {explanation.explanation}
                  </ReactMarkDown>
                </div>
              )}
            </Drawer>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default InterviewPrep;
