export interface EmployeeDocDataTable {
  id: number;
  employee_id: number;
  document_name: string;
  view_document: string;
  status: string;
  date_uploaded: string;
}

export interface EmployeeDocData {
  message: string;
  documents: EmployeeDocDataTable[];
}
