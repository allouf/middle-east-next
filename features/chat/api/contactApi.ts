import chatClient from "./chatClient";
import {
  ContactEntity,
  ContactsResponse,
  CreateContactDto,
  UpdateContactDto,
} from "../types";

export const contactApi = {
  createContact: (data: CreateContactDto) =>
    chatClient.post<ContactEntity>("/contact", data),

  getContacts: (page = 1, perPage = 10, filters?: Partial<ContactEntity>) =>
    chatClient.get<ContactsResponse>("/contact/get-my-contacts", {
      params: { page, perPage, ...filters },
    }),

  getContactById: (id: string) =>
    chatClient.get<ContactEntity>(`/contact/${id}`),

  updateContact: (id: string, data: UpdateContactDto) =>
    chatClient.patch<ContactEntity>(`/contact/${id}`, data),

  deleteContact: (id: string) =>
    chatClient.delete(`/contact/${id}`),
};
