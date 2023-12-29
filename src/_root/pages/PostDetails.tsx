import { useParams, Link, useNavigate } from "react-router-dom"
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useGetPostById, useDeletePost } from "@/lib/react-query/queriesAndMutations"
import { multiFormatDateString } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const PostDetails = () => {
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || '');
  const { user } = useUserContext();

  const { mutate: deletePost } = useDeletePost();

  const handleDeletePost = () => {
    setConfirmationModalOpen(true)
  }

  const confirmDeletePost = () => {
    setConfirmationModalOpen(false);

    deletePost({
      postId: id,
      imageId: post?.imageId
    });

    toast({
      title: 'Post has been successfully removed',
      duration: 5000,
      isClosable: true
    })

    navigate(-1);
  };

  const cancelDeletePost = () => {
    setConfirmationModalOpen(false);

    toast({
      title: 'Deletion canceled',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <div className="post_details-container">
      {isPending ? <Loader /> : (
        <div className="post_details-card">
          <img
            src={post?.imageUrl}
            alt="post"
            className="post_details-img"
          />
          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link to={`/profile/${post?.creator.$id}`} className="flex items-center gap-3">
                <img
                  src={post?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'}
                  alt="creator"
                  className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
                  loading="lazy"
                />


                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">{post?.creator.name}</p>
                  <div className="flex gap-1 text-light-3 items-center">
                    <p className="subtle-semibold lg:small-regular">{multiFormatDateString(post?.$createdAt)}</p>
                    -
                    <p className="subtle-semibold lg:small-regular">{post?.location}</p>
                  </div>
                </div>
              </Link>

              <div className="flex-center">

                <Link to={`/update-post/${post?.$id}`} className={`${user.id !== post?.creator.$id && 'hidden'}`}>
                  <img
                    src="/assets/icons/edit.svg"
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>

                {isConfirmationModalOpen && (
                  <div className="confirmation-modal fixed top-0 right-0 p-4 bg-gray-950 max-w-5xl text-center mx-auto">
                    <p>Are you sure you want to delete this post?</p>
                    <div className="flex justify-center gap-3 my-3">
                      <Button variant="ghost" className="shad-button_dark_4" onClick={confirmDeletePost}>Yes</Button>
                      <Button variant="ghost" className="shad-button_dark_4" onClick={cancelDeletePost}>No</Button>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ghost_details-delete_btn ${user.id !== post?.creator?.$id && 'hidden'}`}
                >
                  <img
                    src="/assets/icons/delete.svg"
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full">
                <PostStats post={post} userId={user.id} />
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetails