import type { BEFeedback } from "@/features/profile/types";
import { Edit } from "lucide-react";
import { useAuthStore } from "@/features/auth/stores/useAuthStore.ts";

interface FeedbackPreviewProps {
    feedback: BEFeedback;
    onEdit: () => void;
    showEditButton?: boolean;
}

export default function FeedbackPreview({ feedback, onEdit, showEditButton = true }: FeedbackPreviewProps) {
    const { user } = useAuthStore();
    const isOwnFeedback = user ? feedback?.customerId === user.id : false;

    return (
        <div className="space-y-2 bg-gray-50">
            {/* Feedback Preview with Edit Button */}
            <div className="rounded-lg p-3 relative">
                {/* Feedback Content */}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">
                        {isOwnFeedback ? "Đánh giá của bạn" : `Đánh giá của ${feedback.customerName || 'khách hàng'}`}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                            {new Date(feedback.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                        {showEditButton && (
                            <button
                                onClick={onEdit}
                                className="flex items-center gap-1 px-2 py-1 text-indigo-600 hover:bg-indigo-50 rounded transition-all duration-200 hover:shadow-sm text-xs font-medium"
                                title="Chỉnh sửa đánh giá"
                            >
                                <Edit className="w-3 h-3" />
                                Chỉnh sửa
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                                key={star}
                                className={`w-4 h-4 ${star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill={star <= feedback.rating ? 'currentColor' : 'none'}
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                            </svg>
                        ))}
                    </div>
                    <span className="text-xs text-gray-600">
                        {feedback.rating}/5
                    </span>
                </div>
                {feedback.comment && (
                    <div className="mt-2">
                        <p className="text-xs text-gray-600 line-clamp-2 overflow-hidden">
                            {feedback.comment.length > 100
                                ? `${feedback.comment.substring(0, 100)}...`
                                : feedback.comment
                            }
                        </p>
                        {feedback.comment.length > 100 && (
                            <button className="text-xs text-indigo-600 hover:text-indigo-800 mt-1">
                                Xem thêm
                            </button>
                        )}
                    </div>
                )}
                {feedback.imageUrls && feedback.imageUrls.length > 0 && (
                    <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-2">Hình ảnh ({feedback.imageUrls.length})</p>
                        <div className="flex gap-2 overflow-x-auto">
                            {feedback.imageUrls.slice(0, 4).map((url, index) => (
                                <div key={index} className="flex-shrink-0 relative">
                                    <img
                                        src={url}
                                        alt={`Feedback image ${index + 1}`}
                                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300 transition-colors"
                                        onClick={() => {
                                            console.log("URL:", url);
                                            window.open(url, '_blank');
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                            {feedback.imageUrls.length > 4 && (
                                <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
                                    <span className="text-sm font-medium text-gray-600">+{feedback.imageUrls.length - 4}</span>
                                    <span className="text-xs text-gray-500">hình</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}