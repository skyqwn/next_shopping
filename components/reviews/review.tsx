"use client";

import Image from "next/image";
import { formatDistance, subDays } from "date-fns";

import { ReviewsWithUser } from "@/lib/infer-type";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import Stars from "./stars";

interface ReviewProps {
  reviews: ReviewsWithUser[];
}

const Review = ({ reviews }: ReviewProps) => {
  return (
    <motion.div
      className="
    flex flex-col gap-4"
    >
      {reviews.length === 0 && (
        <p className="py-2 text-md font-medium">
          아직 리뷰가 없습니다. 가장 먼저 리뷰를 작성해보세요!
        </p>
      )}
      {reviews.map((review) => (
        <Card key={review.id} className="p-4">
          <div className="flex gap-2 items-center">
            <Image
              className="rounded-full size-10"
              width={32}
              height={32}
              alt={review.user.name!}
              src={review.user.image!}
            />
            <div>
              <p className="text-sm font-bold">{review.user.name}</p>
              <div className="flex items-center gap-2">
                <Stars rating={review.rating} />
                <p className="text-xs text-bold text-muted-foreground">
                  {formatDistance(subDays(review.created!, 0), new Date())}
                </p>
              </div>
            </div>
          </div>
          <p className="py-2 font-medium">{review.comment}</p>
        </Card>
      ))}
    </motion.div>
  );
};

export default Review;
