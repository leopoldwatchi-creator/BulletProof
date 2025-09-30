/// <reference types="vite/client" />

declare module 'stockfish' {
  const stockfish: () => Promise<any>;
  export default stockfish;
}
