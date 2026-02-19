// src/services/development/development.service.ts
import { axiosInstance } from "@/api/axios";
import {
  CreateDevelopmentPayload,
  Development,
} from "@/types/development.type";

/* ================= API ================= */
export const getDevelopmentById = async (id: string): Promise<Development> => {
  const response = await axiosInstance.get<{ data: Development }>(
    `/development/${id}`,
  );

  return response.data.data;
};

export const createDevelopment = async (
  payload: CreateDevelopmentPayload,
): Promise<Development> => {
  const { data } = await axiosInstance.post("/development", payload);
  return data.data;
};

export const deleteDevelopment = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/development/${id}`);
};
