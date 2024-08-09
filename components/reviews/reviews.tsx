import { db } from "@/server";
import Review from "./review";
import ReviewsForm from "./reviews-form";
import { desc, eq } from "drizzle-orm";
import { reviews } from "@/server/schema";
import ReviewChart from "./review-chart";

const Reviews = async ({ productId }: { productId: number }) => {
  const data = await db.query.reviews.findMany({
    with: { user: true },
    where: eq(reviews.productId, productId),
    orderBy: [desc(reviews.created)],
  });
  return (
    <section className="py-4">
      <div className="flex flex-col gap-2 lg:gap-12 justify-stretch lg:flex-row ">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Product Reviews</h2>
          <ReviewsForm />
          <Review reviews={data} />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <ReviewChart reviews={data} />
        </div>
      </div>
    </section>
  );
};

export default Reviews;
