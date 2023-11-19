import { createApi } from "@reduxjs/toolkit/query/react";
import { db } from "../../../firebase-config";
import { addDoc, collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

const firebaseBaseQuery = async ({ baseUrl, url, method, body }) => {
  switch (method) {
    case "GET":
      const snapshot = await getDocs(collection(db, url));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return { data };

    case "POST":
      const docRef = await addDoc(collection(db, url), body);
      await updateDoc(doc(db, url), { id: docRef.id, ...body });
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

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: firebaseBaseQuery,
  tagTypes: ["users"],
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: ({ user }) => ({
        baseUrl: "",
        url: "users",
        method: "POST",
        body: user
      }),
      invalidatesTags: ["users"]
    }),
    getUsers: builder.query({
      // Define your query function here
      query: () => ({
        baseUrl: "",
        url: "users",
        method: "GET",
        body: {} // You can customize this based on your API requirements
      }),
      providesTags: ["users"]
    }),
    updateUser: builder.mutation({
      query: ({ user }) => ({
        baseUrl: "",
        url: `users/${user.id}`,
        method: "PUT",
        body: user
      })
    }),
    deleteUser: builder.mutation({
      query: ({ userId }) => ({
        baseUrl: "",
        url: `users/${userId}`,
        method: "DELETE",
        body: {}
      })
    })
  })
});

export const { useCreateUserMutation, useGetUsersQuery, useUpdateUserMutation, useDeleteUserMutation } = usersApi;
