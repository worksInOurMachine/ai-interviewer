"use client";

import SpotlightCard from "@/components/ui/soptlight-card";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className=" flex justify-center items-center h-screen gap-6 flex-wrap ">
      <Link href="/roadmap">
        <SpotlightCard
          className="custom-spotlight-card"
          spotlightColor="rgba(255, 229, 255, 0.2)"
        >
          Roadmap
        </SpotlightCard>
      </Link>

      <Link href="/chat">
        <SpotlightCard
          className="custom-spotlight-card"
          spotlightColor="rgba(255, 229, 255, 0.2)"
        >
          Chat
        </SpotlightCard>
      </Link>
    </div>
  );
};

export default page;
