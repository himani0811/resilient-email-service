export interface Email {
  to: string;
  subject: string;
  body: string;
}

export interface EmailProvider {
  send(email: Email): Promise<boolean>;
}

export class MockEmailProvider1 implements EmailProvider {
  async send(email: Email): Promise<boolean> {
    console.log("MockEmailProvider1 sending:", email.subject);
    return true;
  }
}

export class MockEmailProvider2 implements EmailProvider {
  async send(email: Email): Promise<boolean> {
    console.log("MockEmailProvider2 sending:", email.subject);
    return true;
  }
}
