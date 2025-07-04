import React from 'react'

const DeleteALertContent = ({content, onDelete, onCancel}) => {
  return (
    <div className="rounded-xl card-shadow bg-white w-full flex flex-col items-center modal-animate modal-animate-open">
      <div className="w-full bg-gradient-main rounded-t-xl py-3 px-6 flex items-center justify-center">
        <p className="text-base font-semibold text-white text-center">{content}</p>
      </div>
      <div className="flex justify-center mt-6 gap-3 w-full px-6 pb-4">
        <button
          type="button"
          className="px-5 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn-gradient px-5 py-2 rounded-lg text-sm font-semibold"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default DeleteALertContent
