"use client";

import Roadmap from '@/components/roadmap';
import RoadmapForm from '@/components/roadmap-form';
import { Button } from '@/components/ui/button';
import { useState } from 'react';


const page = () => {
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [generateRoadmap, setGenerateRoadmap] = useState(false);
  const [formData, setFormData] = useState({
    jobRole: "Software Engineer",
    skills: "React, Next.js, Tailwind CSS, TypeScript, Node.js, MongoDB",
    duration: 6,
  })

  const getRoadmap = async () => {
    try {
      setLoading(true);
      setGenerateRoadmap(true);
      const res = await fetch("/api/interview/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roadmapDetails: {
            jobRole: formData.jobRole,
            skills: formData.skills,
            duration: formData.duration,

          },
        }),
      });
      const data = await res.json();
      console.log({ roadmap: JSON.stringify(data, null, 2) });
      console.log(data?.roadmap);
      setRoadmap(data?.roadmap);
    } catch (error) {
      setError(error);
      setGenerateRoadmap(false);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      {!generateRoadmap ? (
        <>
        <RoadmapForm formData={formData} setFormData={setFormData} getRoadmap={getRoadmap} />
        
        </>
      ) : (
        <div>
          {generateRoadmap && loading && <div>Loading...</div>}
          {error && <div>Error: {error}</div>}
     {/*      {roadmap && <Roadmap data={roadmap} />} */}
        </div>
      )}

    </div>
  )
}

export default page