"use client"
import React from "react";
import { CourseCard } from "./_components/Card";
import { useDisclosure } from "@mantine/hooks";
import EmployeeAssessment from "./_components/EmployeeAssessment";
import { Modal } from "@mantine/core";

export default function Page() {
  const courses = [
    {
      title: "Drone Basics & Safety",
      description: "Essential knowledge for all drone sales and repair staff.",
      duration: "45 min",
      category: "Basics",
      image: "/drone2.png",
    },
    {
      title: "Common Drone Repair Issues",
      description: "Identifying and fixing the most frequent drone problems.",
      duration: "60 min",
      category: "Repair",
      image: "/drone2.png",
    },
    {
      title: "Advanced Camera Drone Maintenance",
      description: "Specialized repair techniques for high-end camera drones.",
      duration: "75 min",
      category: "Repair",
      image: "/drone2.png",
    },
    {
      title: "Drone Sales Techniques",
      description: "Best practices for showcasing features and specifications.",
      duration: "45 min",
      category: "Sales",
      image: "/drone2.png",
    },
    {
      title: "Understanding Drone Specifications",
      description: "In-depth look at drone specs and features.",
      duration: "60 min",
      category: "Sales",
      image: "/drone2.png",
    },
    {
      title: "Drone Battery Repair & Maintenance",
      description: "Techniques for repairing and maintaining drone batteries.",
      duration: "75 min",
      category: "Repair",
      image: "/drone2.png",
    },
  ];

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <div className="min-h-screen">
        <div className="container mx-auto p-6">
          <div className="flex justify-between mb-8 items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Training Videos</h1>
              <p className="text-xl">
                Required training for all drone sales and repair technicians
              </p>
            </div>
            <button onClick={open} className="bg-[#0039C8] text-white px-4 py-2 rounded-full">
              Take Assessment
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
            {courses.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>
        </div>
      </div>

      <Modal size={"80%"} opened={opened} onClose={close}>
        <EmployeeAssessment />
      </Modal>
    </>
  );
}
