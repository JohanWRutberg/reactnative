// postsApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { db } from "../../../firebase-config";
import { addDoc, collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

const firebaseBaseQuery = async ({ baseUrl, url, method, body }) => {
  switch (method) {
    case "GET_POSTS":
      const snapshotPosts = await getDocs(collection(db, "posts"));
      const dataPosts = snapshotPosts.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdDate: doc.data().createdDate ? doc.data().createdDate.toMillis() : null
      }));
      return { data: dataPosts };

    case "POST":
      const docRef = await addDoc(collection(db, url), body);
      return { data: { id: docRef.id, ...body } };

    case "PUT":
      if (body) {
        await updateDoc(doc(db, url), body);
        return { data: { ...body } };
      } else {
        throw new Error("Missing body for PUT request");
      }

    case "DELETE":
      await deleteDoc(doc(db, url));
      return { data: null };

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
        method: "GET_POSTS", // Use "GET_POSTS" for the correct method
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
    })
  })
});

export const { useCreatePostMutation, useGetPostsQuery, useUpdatePostMutation, useDeletePostMutation } = postsApi;
