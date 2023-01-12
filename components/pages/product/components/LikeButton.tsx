import { LikeIcon, LikeFilledIcon } from "@lib/icons";
import { useAuth } from "@lib/services/auth";
import Skeleton from "react-loading-skeleton";
import { useLikeMutation } from "../queries/like";

export const LikeButtonPlaceholder = () => {
  return (
    <div className="flex flex-col items-center pr-4">
      <LikeIcon className="w-8 h-8 fill-gray-600" />
      <p className="mt-1 text-sm text-gray-600">
        <Skeleton className="w-8" />
      </p>
    </div>
  );
};

export const LikeButton = ({
  likesCnt,
  isLike,
  userId,
  id,
}: {
  likesCnt: number;
  isLike: boolean;
  userId: number;
  id: number;
}) => {
  const { isLoading, mutate } = useLikeMutation();
  const { user } = useAuth();

  if (!user || user.userId === userId)
    return (
      <div className="flex flex-col items-center pr-4">
        <LikeIcon className="w-8 h-8 fill-gray-600" />
        <p className="mt-1 text-sm text-gray-600">{likesCnt}</p>
      </div>
    );

  return (
    <>
      <button
        onClick={() =>
          mutate({
            mode: !isLike,
            id,
          })
        }
        disabled={isLoading}
        className="flex flex-col items-center pr-4"
      >
        {isLike ? (
          <LikeFilledIcon className="w-8 h-8 fill-gray-600" />
        ) : (
          <LikeIcon className="w-8 h-8 fill-gray-600" />
        )}
        <p className="mt-1 text-sm text-gray-600">{likesCnt}</p>
      </button>
    </>
  );
};