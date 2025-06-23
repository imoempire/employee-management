import { EmployeeDocDataTable } from "@/app/dashboard/document-management/_components/Types";

export function calculateCompletionPercentage(
  requiredDocs: string[],
  acceptedDocs: string[]
): number {
  const completedDocs = acceptedDocs.filter((doc) =>
    requiredDocs.includes(doc)
  ).length;
  const result = (completedDocs / requiredDocs.length) * 100;
  return +result.toFixed(0);
}

interface Profile {
  [key: string]: string | number | undefined | null;
}

const fieldWeights: { [key: string]: number } = {
  full_name: 10,
  email: 10,
  phone_number: 10,
  start_date: 10,
  department: 20,
  position: 20,
  technical_skills: 10,
  professional_bio: 10,
};

export function calculateProfileCompletionPercentage(
  profile: Profile,
  requiredFields: string[]
): number {
  if (!profile || !requiredFields.length) return 0;

  const totalWeight = requiredFields.reduce(
    (sum, field) => sum + (fieldWeights[field] || 0),
    0
  );

  const completedWeight = requiredFields.reduce((sum, field) => {
    const value = profile[field];
    if (value !== null && value !== undefined && value !== "") {
      return sum + (fieldWeights[field] || 0);
    }
    return sum;
  }, 0);

  if (totalWeight === 0) return 0;

  const result = (completedWeight / totalWeight) * 100;
  return +result.toFixed(0);
}

export function isDocumentAccepted(
  doc: string,
  acceptedDocs: string[]
): boolean {
  return acceptedDocs.includes(doc);
}

export function calculateDocumentCompletion(
  documents: EmployeeDocDataTable[]
): number {
  // Check if documents array is empty or undefined
  if (!documents || documents.length === 0) {
    return 0;
  }

  // List of required document names
  const requiredDocs: string[] = [
    "ID",
    "Proof of Address",
    "Contract",
    "Certificate",
  ];

  // Get unique document names from the documents array
  const uploadedDocNames: string[] = [
    ...new Set(documents.map((doc) => doc.document_name)),
  ];

  // Count how many required documents are present
  const matchingDocsCount: number = requiredDocs.filter((doc) =>
    uploadedDocNames.includes(doc)
  ).length;

  // Calculate percentage (each document is worth 25%) and fix to 0 decimal places
  const completionPercentage: number = Math.round(matchingDocsCount * 25);

  return completionPercentage;
}
