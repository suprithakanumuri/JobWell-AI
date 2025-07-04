import React, { useEffect, useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { API_PATHS } from "../../utils/apiPaths";


import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { CARD_BG } from '../../utils/data';
import SummaryCard from '../../components/cards/SummaryCard';
import CreateSessionForm from './CreateSessionForm';
import Modal from 'react-modal';
import DeleteALertContent from '../../components/loader/DeleteALertContent';

Modal.setAppElement('#root');

const Dashboard = () => {
  const navigate = useNavigate();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ open: false, data: null });

  const fetchAllSessions = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(response.data.sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast.error("Unable to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionData) => {
    try {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData._id));
      setSessions((prev) => prev.filter((s) => s._id !== sessionData._id));
      toast.success("Session deleted successfully");
      setOpenDeleteAlert({ open: false, data: null });
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("Failed to delete session");
    }
  };

  useEffect(() => {
    fetchAllSessions();
  }, []);

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
    fetchAllSessions(); // ✅ Refresh sessions after creating
  };

  return (
    <DashboardLayout>
      <div className='w-full fade-in'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7 pt-1 pb-6 px-4 md:px-0'>
          {loading ? (
            <div className="flex justify-center items-center col-span-3 py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#7B61FF]" />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((data, index) => (
              <SummaryCard
                key={data?._id}
                colors={CARD_BG[index % CARD_BG.length]}
                role={data?.role || "No Role"}
                topicsToFocus={data?.topicsToFocus || "N/A"}
                experience={data?.experience || 0}
                questions={data?.questions?.length || 0}
                description={data?.description || "No description"}
                lastUpdated={
                  data?.updatedAt ? moment(data.updatedAt).format("DD MMM YYYY") : "N/A"
                }
                onSelect={() => navigate(`/interview-prep/${data?._id}`)}
                onDelete={() => setOpenDeleteAlert({ open: true, data })}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center col-span-3 py-16 fade-in">
              {/* Optional illustration: replace src with your own or remove img if not needed */}
              <svg width="120" height="120" fill="none" viewBox="0 0 120 120" className="mb-6 opacity-80">
                <circle cx="60" cy="60" r="56" fill="#e0e7ff" />
                <rect x="35" y="50" width="50" height="30" rx="8" fill="#7B61FF" fillOpacity="0.15" />
                <rect x="45" y="60" width="30" height="10" rx="3" fill="#7B61FF" fillOpacity="0.25" />
                <circle cx="60" cy="65" r="3" fill="#7B61FF" fillOpacity="0.4" />
              </svg>
              <h2 className="text-2xl font-bold mb-2 text-white" style={{textShadow: '0 2px 12px rgba(30,41,59,0.18)'}}>Welcome to JobWell AI!</h2>
              <p className="mb-6 text-center max-w-md text-white/90" style={{textShadow: '0 2px 12px rgba(30,41,59,0.18)'}}>
                Start your interview prep journey by creating your first session. You'll get personalized questions and smart features to help you succeed!
              </p>
              <button
                className="btn-gradient px-8 py-3 rounded-full text-lg font-semibold shadow-lg"
                onClick={() => setOpenCreateModal(true)}
              >
                + Create Your First Session
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Now Button */}
      <div>
        <button
          className='h-12 flex items-center justify-center gap-3 btn-gradient text-sm font-semibold px-7 py-2.5 rounded-full transition-all cursor-pointer shadow-lg fixed bottom-10 right-10'
          onClick={() => setOpenCreateModal(true)}
        >
          <LuPlus className='text-2xl text-white' /> Add Now
        </button>
      </div>

      {/* Create Session Modal */}
      <Modal
        isOpen={openCreateModal}
        onRequestClose={handleCloseCreateModal}
        contentLabel="Create Session Modal"
        style={{
          overlay: {
            backgroundColor: 'rgba(106,130,251,0.18)',
            zIndex: 999,
          },
          content: {
            maxWidth: '420px',
            margin: 'auto',
            borderRadius: '18px',
            padding: '0',
            border: 'none',
            background: 'white',
            boxShadow: 'var(--color-modal-shadow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        <div className="w-full p-8 modal-animate modal-animate-open">
          <CreateSessionForm onClose={handleCloseCreateModal} />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={openDeleteAlert?.open}
        onRequestClose={() => setOpenDeleteAlert({ open: false, data: null })}
        contentLabel="Delete Alert"
        style={{
          overlay: {
            backgroundColor: 'rgba(106,130,251,0.18)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          content: {
            maxWidth: '320px',
            width: '90%',
            margin: 'auto',
            borderRadius: '16px',
            padding: '0',
            border: 'none',
            inset: 'unset',
            background: 'white',
            boxShadow: 'var(--color-modal-shadow)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        <div className="w-full p-6 modal-animate modal-animate-open">
          <DeleteALertContent
            content="Are you sure you want to delete this session detail?"
            onDelete={() => deleteSession(openDeleteAlert.data)}
            onCancel={() => setOpenDeleteAlert({ open: false, data: null })}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
