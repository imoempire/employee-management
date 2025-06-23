import React, { useState } from "react";
import { Radio, Button, Text, Progress, Stack } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

// Sample quiz questions data
const quizQuestions = [
  {
    id: 1,
    question: "What is the primary goal of project management?",
    options: [
      "To complete projects on time and within budget",
      "To maximize team size",
      "To create detailed documentation",
      "To minimize communication needs",
    ],
    correctAnswer: 0,
  },
  {
    id: 2,
    question: "Which of the following is a key principle of Agile methodology?",
    options: [
      "Detailed planning up front",
      "Responding to change over following a plan",
      "Comprehensive documentation",
      "Contract negotiation over collaboration",
    ],
    correctAnswer: 1,
  },
  // Add more questions as needed to reach 20
  // ...
];

export default function EmployeeAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(quizQuestions.length).fill(null)
  );

  const totalQuestions = quizQuestions.length;
  const answeredCount = selectedAnswers.filter(
    (answer) => answer !== null
  ).length;

  const handleAnswerSelect = (index: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = index;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <Stack align="center" mb={24}>
          <Text size="xl" fw={700}>
            Employee Knowledge Assessment
          </Text>
          <Text c="#4a5565">
            Complete all {totalQuestions} questions and submit to see your score
          </Text>
        </Stack>

        {/* Progress Bar */}
        <Progress
          value={((currentQuestion + 1) / totalQuestions) * 100}
          radius="xl"
          size="sm"
          color="#e0e0e0"
          bg={"#e5e7eb"}
          mb={"xl"}
        />

        {/* Question Counter */}
        <div className="flex justify-between mb-4">
          <Text fw={700} c={"#4a5565"}>
            Question {currentQuestion + 1} of {totalQuestions}
          </Text>
          <Text fw={700} c={"#4a5565"}>
            Answered: {answeredCount} / {totalQuestions}
          </Text>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
          <Text fw={600} size="lg" mb={24} c={"#4a5565"}>
            Question {currentQuestion + 1}:{" "}
            {quizQuestions[currentQuestion].question}
          </Text>

          <Radio.Group
            value={selectedAnswers[currentQuestion]?.toString()}
            onChange={(value) => handleAnswerSelect(parseInt(value))}
          >
            <Stack>
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <div key={index} className="py-2">
                  <Radio
                    value={index.toString()}
                    label={option}
                    classNames={{
                      root: "flex items-center",
                      radio: "border-gray-400",
                      label: "text-base ml-2",
                    }}
                  />
                </div>
              ))}
            </Stack>
          </Radio.Group>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            leftSection={<IconChevronLeft size={14} />}
            variant="outline"
            color="gray"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            radius="sm"
            px={"md"}
            py={"sm"}
          >
            Previous
          </Button>

          <Button
            rightSection={<IconChevronRight size={14} />}
            variant="filled"
            color="dark"
            onClick={handleNext}
            bg={"#101828"}
            radius="sm"
            px={"xl"}
            py={"sm"}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
