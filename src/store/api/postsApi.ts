import { createApi } from "@reduxjs/toolkit/query/react";
import { db } from "../../../firebase-config";
import { addDoc, collection, getDocs, updateDoc, deleteDoc, doc, orderBy, query } from "firebase/firestore";

const firebaseBaseQuery = async ({ baseUrl, url, method, body }) => {
  switch (method) {
    case "GET_POSTS":
      try {
        const snapshotPosts = await getDocs(query(collection(db, "posts"), orderBy("post.createdDate", "desc")));
        const dataPosts = snapshotPosts.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdDate: doc.data().createdDate ? doc.data().createdDate.toMillis() : null
        }));
        return { data: dataPosts };
      } catch (error) {
        throw new Error("Error fetching posts");
      }

    case "POST":
      try {
        const docRef = await addDoc(collection(db, url), body);
        return { data: { id: docRef.id, ...body } };
      } catch (error) {
        throw new Error("Error creating post");
      }

    case "PUT":
      if (body) {
        try {
          await updateDoc(doc(db, url), body);
          return { data: { ...body } };
        } catch (error) {
          throw new Error("Error updating post");
        }
      } else {
        throw new Error("Missing body for PUT request");
      }

    case "DELETE":
      try {
        await deleteDoc(doc(db, url));
        return { data: null };
      } catch (error) {
        throw new Error("Error deleting post");
      }

    case "DELETE_ALL":
      try {
        const snapshotDocs = await getDocs(collection(db, "posts"));
        const toDelete = snapshotDocs.docs
          .filter((doc) => doc.data().post.createdBy.id === body.id)
          .map((doc) => doc.ref);
        for await (const doc of toDelete) {
          await deleteDoc(doc);
        }
        return { data: null };
      } catch (error) {
        console.error("ERROR IN DELETE ALL POSTS", error);
        throw new Error("Error deleting post");
      }

    default:
      throw new Error(`Unhandled method ${method}`);
  }
};

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: firebaseBaseQuery,
  tagTypes: ["posts"],
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: ({ post }) => ({
        baseUrl: "",
        url: "posts",
        method: "POST",
        body: { post }
      }),
      invalidatesTags: ["posts"]
    }),
    getPosts: builder.query({
      query: () => ({
        baseUrl: "",
        url: "posts",
        method: "GET_POSTS",
        body: {}
      }),
      providesTags: ["posts"]
    }),
    updatePost: builder.mutation({
      query: ({ post }) => ({
        baseUrl: "",
        url: `posts/${post.id}`,
        method: "PUT",
        body: post
      })
    }),
    deletePost: builder.mutation({
      query: ({ postId }) => ({
        baseUrl: "",
        url: `posts/${postId}`,
        method: "DELETE",
        body: {}
      })
    }),
    deleteAllPosts: builder.mutation({
      query: ({ userId }) => ({
        baseUrl: "",
        url: "posts",
        method: "DELETE_ALL",
        body: { id: userId }
      })
    })
  })
});

export const {
  useCreatePostMutation,
  useGetPostsQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
  useDeleteAllPostsMutation
} = postsApi;
