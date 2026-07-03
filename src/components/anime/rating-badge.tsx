interface RatingBadgeProps {
  rating: number;
  showValue?: boolean;
}

export function RatingBadge({ rating, showValue = true }: RatingBadgeProps) {
  const color =
    rating >= 80 ? "text-rating-high" : rating >= 60 ? "text-rating-mid" : "text-rating-low";

  return (
    <span className={`inline-flex items-center gap-1 text-sm font-medium ${color}`}>
      ⭐ {showValue ? `${rating}%` : ""}
    </span>
  );
}
