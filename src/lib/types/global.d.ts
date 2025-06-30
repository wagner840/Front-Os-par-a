declare global {
  interface Window {
    activeEditor?: {
      insertContent: (content: string) => void;
    };
  }
}

export {};
