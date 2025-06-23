import { Button, Text } from "@mantine/core";
import { IconCamera } from "@tabler/icons-react";
import React from "react";

export const CourseCard = ({
  title,
  description,
  duration,
  category,
  image,
}: {
  title: string;
  description: string;
  duration: string;
  category: string;
  image: string;
}) => (
  <div className="rounded-lg overflow-hidden shadow-md bg-white flex flex-col">
    {/* Image Section */}
    <div
      className="h-60 relative bg-amber-700"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Category Badge */}
      <div className="absolute top-2 right-2">
        <span className="bg-gray-900 text-white text-xs px-3 py-1 rounded">
          {category}
        </span>
      </div>
    </div>

    {/* Content Section */}
    <div className="p-6 flex flex-col flex-grow">
      <h2 className="text-2xl font-bold truncate">{title}</h2>
      <p className="text-[#6B7A91] text-md mt-1">{description}</p>

      {/* Footer */}
      <div className="flex justify-between items-center mt-10 mb-10">
        <p className="text-[#6B7A91] font-bold text-md">Duration: {duration}</p>
        <Button
          variant="outline"
          leftSection={<IconCamera color="black" />}
          color="#E2E8F0"
          className="flex items-center text-black text-xs"
        >
          <Text c={"dark"} fw={"bold"}>Watch Now</Text>
        </Button>
      </div>
    </div>
  </div>
);
