export interface IEmail {
  fromEmail?: string;
  fromName?: string;
  to: Array<IEmailTo>;
  subject: string;
  text?: string;
  templateName?: string;
  tags?: Array<IEmailTag>;
  attachments?: Array<IEmailAttachment>;
}

export interface IEmailTo {
  email: string;
  name: string;
  type: string;
}

export interface IEmailTag {
  name: string;
  content: string;
}

export interface IEmailAttachment {
  type: string;
  name: string;
  content: string;
}
