//Need this for my Google Sign-In implementation, since the Google API doesn't have official TypeScript types and I want to avoid type errors when accessing the `google` object on the `window`.

declare global {
  interface Window {
    google: any;
  }

  const google: any;
}

export {};