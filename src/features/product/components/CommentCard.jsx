import React from "react";

const CommentCard = ({ comment }) => {
    return (
        <div className="flex items-start gap-2.5">
            <img
                className="w-8 h-8 rounded-full"
                src={comment.profileImage || "/docs/images/people/profile-picture-3.jpg"}
                alt={`${comment.created_by} image`}
            />
            <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {comment.created_by}
                    </span>
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        {new Date(comment.created_at).toLocaleTimeString()}
                    </span>
                </div>
                <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
                    {comment.text}
                </p>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {comment.status ? "Delivered" : "Pending"}
                </span>
            </div>
            <button
                id="dropdownMenuIconButton"
                data-dropdown-toggle="dropdownDots"
                data-dropdown-placement="bottom-start"
                className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
                type="button"
            >
                <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 4 15"
                >
                    <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                </svg>
            </button>
            {/* Puedes agregar aquí el dropdown si lo requieres */}
        </div>
    );
};

export default CommentCard;
