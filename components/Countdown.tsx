import React, { Suspense } from "react";
import CountdownLogic from "./CountdownLogic";

export default function Countdown() {
  return (
    <Suspense fallback={<div className="h-screen"></div>}>
      <CountdownLogic />
    </Suspense>
  );
}
