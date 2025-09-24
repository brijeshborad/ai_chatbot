import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserInputService {
  private initialMessage: string | null = null;
  private readonly storageKey = 'chatbot_user_email';

  constructor() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      this.initialMessage = stored ? stored : null;
    } catch {
      this.initialMessage = null;
    }
  }

  setInitialMessage(message: string) {
    this.initialMessage = message;
    try {
      localStorage.setItem(this.storageKey, message);
    } catch {}
  }

  getInitialMessage(): string | null {
    return this.initialMessage;
  }

  clearInitialMessage() {
    this.initialMessage = null;
    try {
      localStorage.removeItem(this.storageKey);
    } catch {}
  }
}


