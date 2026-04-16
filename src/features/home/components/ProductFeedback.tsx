import { Loader2, Star } from 'lucide-react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import { productApi } from '@/features/home/api/product-api';
import type { BEFeedback } from '@/features/profile/types';
import FeedbackPreview from '@/features/profile/components/feedback/FeedbackPreview';
import {useAuthStore} from "@/features/auth/stores/useAuthStore.ts";
import {useState} from "react";
import FeedbackModal from "@/features/profile/components/feedback/FeedbackModal.tsx";

export default function ProductFeedback({ productId }: { productId: string }) {
    const { user } = useAuthStore();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<BEFeedback | null>(null);
    const queryClient = useQueryClient();

    const {
        data: feedbacks,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['product-feedbacks', productId],
        queryFn: async () => {
            try {
                const response = await productApi.getProductFeedback(productId);
                return response as BEFeedback[];
            } catch (error) {
                console.error("Error fetching product feedbacks:", error);
                return [];
            }
        },
        enabled: !!productId,
    });

    const handleEditFeedback = (feedback: BEFeedback) => {
        setSelectedFeedback(feedback);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setSelectedFeedback(null);
    };

    const handleFeedbackSuccess = () => {
        // Refresh product feedbacks
        queryClient.invalidateQueries({ queryKey: ['product-feedbacks', productId] });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-[#4A8795]" />
                <p className="text-sm text-gray-500 mt-2">Đang tải đánh giá...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                Không thể tải đánh giá sản phẩm. Vui lòng thử lại sau.
            </div>
        );
    }

    if (!feedbacks || feedbacks.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này</p>
            </div>
        );
    }

    // Calculate average rating
    const averageRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length;
    const ratingCounts = feedbacks.reduce((acc, feedback) => {
        acc[feedback.rating] = (acc[feedback.rating] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    return (
        <div className="space-y-6">
            {/* Rating Summary */}
            <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Đánh giá sản phẩm</h3>

                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-[#4A8795]">
                            {averageRating.toFixed(1)}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                        star <= Math.round(averageRating)
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-300'
                                    }`}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{feedbacks.length} đánh giá</p>
                    </div>

                    <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-3">
                                <span className="text-sm text-gray-600 w-3">{rating}</span>
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-yellow-400 h-full rounded-full transition-all"
                                        style={{
                                            width: `${(ratingCounts[rating] || 0) / feedbacks.length * 100}%`
                                        }}
                                    />
                                </div>
                                <span className="text-sm text-gray-600 w-8 text-right">
                  {ratingCounts[rating] || 0}
                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-800">Tất cả đánh giá</h4>
                {feedbacks.map((feedback) => {
                    const canEdit = user ? feedback?.customerId === user.id : false;

                    return (
                        <div key={feedback.feedbackId} className="bg-white border border-gray-200 rounded-xl">
                            <FeedbackPreview
                                feedback={feedback}
                                onEdit={() => handleEditFeedback(feedback)}
                                showEditButton={canEdit}
                            />
                        </div>
                    );
                })}
            </div>

            <FeedbackModal
                isOpen={isEditModalOpen}
                onClose={handleCloseModal}
                orderId={selectedFeedback?.orderId || ''}
                productId={selectedFeedback?.productId || productId}
                existingFeedback={selectedFeedback}
                onSuccess={handleFeedbackSuccess}
            />
        </div>
    );
}