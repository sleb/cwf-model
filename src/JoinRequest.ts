export interface JoinRequest {
  id: string;
  uid: string;
  name: string;
  message: string;
}

export type JoinRequestData = Omit<JoinRequest, "id">;
