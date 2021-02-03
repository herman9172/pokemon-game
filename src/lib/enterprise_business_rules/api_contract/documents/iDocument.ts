export interface IDocument {
  id?: number;
  ownerResourceId?: string | number;
  type?: string;
  status?: string;
  encodedContent?: string;
  documentUrl?: string;
  createdAt?: Date;
}
