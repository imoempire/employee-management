import React from 'react';

// Note: In your actual Next.js app, install the package with:
// npm install react-organizational-chart
// npm install @types/react-organizational-chart (if available)

// Types
interface Employee {
  title?: string;
  name?: string;
  department?: string;
  highlight?: boolean;
}

interface TreeProps {
  children: React.ReactNode;
  lineWidth?: string;
  lineColor?: string;
  nodePadding?: string;
}

interface TreeNodeProps {
  label: React.ReactNode;
  children?: React.ReactNode;
}

interface EmployeeCardProps extends Employee {
  className?: string;
}

// Simplified Tree components for demo (replace with actual package imports)
const Tree: React.FC<TreeProps> = ({ 
  children, 
  lineWidth = '2px', 
  lineColor = '#ffffff', 
  nodePadding = '5px' 
}) => (
  <div 
    className="flex flex-col items-center" 
    style={{ 
      '--line-width': lineWidth, 
      '--line-color': lineColor, 
      '--node-padding': nodePadding 
    } as React.CSSProperties}
  >
    {children}
  </div>
);

const TreeNode: React.FC<TreeNodeProps> = ({ label, children }) => (
  <div className="relative flex flex-col items-center">
    <div className="mb-4">
      {label}
    </div>
    {children && (
      <div className="relative">
        {/* Connecting lines */}
        {React.Children.count(children) > 1 && (
          <div className="absolute top-0 left-0 right-0 h-4">
            <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-white transform -translate-x-1/2"></div>
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-white"></div>
            {React.Children.map(children, (_, index: number) => (
              <div 
                key={index}
                className="absolute top-4 w-0.5 h-4 bg-white"
                style={{ 
                  left: `${(index + 0.5) * (100 / React.Children.count(children))}%`,
                  transform: 'translateX(-50%)'
                }}
              ></div>
            ))}
          </div>
        )}
        {React.Children.count(children) === 1 && (
          <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-white transform -translate-x-1/2"></div>
        )}
        <div className="flex justify-center gap-8 pt-8">
          {children}
        </div>
      </div>
    )}
  </div>
);

// Employee data structure with proper typing
interface OrganizationData {
  ceo: Employee;
  assistant: Employee;
  coo: Employee;
  secretary: Employee;
  departments: {
    marketing: DepartmentData;
    finance: DepartmentData;
    sales: DepartmentData;
    afterSales: DepartmentData;
    procurement: DepartmentData;
  };
}

interface DepartmentData {
  manager: Employee;
  staff: Employee[];
  subDepartments?: { [key: string]: Employee[] };
}

const organizationData: OrganizationData = {
  ceo: { title: "CHIEF EXECUTIVE OFFICER", name: "Vice" },
  assistant: { title: "PERSONAL ASSISTANT", name: "Carolina" },
  coo: { title: "CHIEF OPERATING OFFICER", name: "Batablle" },
  secretary: { title: "COMPANY SECRETARY", name: "Zintle" },
  departments: {
    marketing: {
      manager: { title: "MARKETING MANAGER" },
      staff: [
        { title: "GOOGLE ADS DTM", highlight: true },
        { title: "SOCIALS FACEBOOK ADS", highlight: true },
        { title: "SOCIALS (Content & Organic)", name: "Kat" },
        { name: "Floyd" },
        { name: "Esnapsi" }
      ]
    },
    finance: {
      manager: { title: "FINANCE MANAGER" },
      staff: [
        { name: "Emily" },
        { name: "Sarah" }
      ]
    },
    sales: {
      manager: { title: "SALES MANAGER", name: "Benjamin" },
      staff: [
        { name: "Muhle" }
      ],
      subDepartments: {
        b1: [
          { title: "B1", name: "Chane" },
          { name: "Muhammad" },
          { name: "Brian" }
        ],
        b2: [
          { title: "B2", name: "Banzi" },
          { name: "Banoo" },
          { name: "Matthew" }
        ]
      }
    },
    afterSales: {
      manager: { title: "AFTER SALES MANAGER", name: "Gareth" },
      staff: [
        { title: "AFTER SALES REP", name: "Fredericko" }
      ],
      subDepartments: {
        technicians: [
          { title: "TECHNICIANS" },
          { name: "Lewela" },
          { name: "Tebatso" },
          { name: "Thapelo" }
        ]
      }
    },
    procurement: {
      manager: { title: "PROCUREMENT MANAGER", name: "Ashley" },
      staff: [
        { name: "Mpho" }
      ]
    }
  }
};

// Employee card component with proper typing
const EmployeeCard: React.FC<EmployeeCardProps> = ({ 
  title, 
  name, 
  department, 
  highlight = false,
  className = ""
}) => (
  <div className={`
    rounded-lg shadow-lg p-3 text-center min-w-[120px] max-w-[140px]
    ${highlight ? 'bg-blue-700 text-white' : 'bg-white text-gray-800'}
    border border-gray-200 ${className}
  `}>
    {title && (
      <div className="font-bold text-xs leading-tight mb-1">
        {title}
      </div>
    )}
    {name && (
      <div className="text-xs font-medium">
        {name}
      </div>
    )}
    {department && (
      <div className="text-xs text-gray-500 mt-1">
        {department}
      </div>
    )}
  </div>
);

// Helper function to create employee nodes
const createEmployeeNode = (employee: Employee): React.ReactNode => (
  <EmployeeCard 
    title={employee.title}
    name={employee.name}
    department={employee.department}
    highlight={employee.highlight}
  />
);

// Helper function to create department nodes
const createDepartmentNode = (departmentKey: keyof OrganizationData['departments']): React.ReactNode => {
  const dept = organizationData.departments[departmentKey];
  
  const departmentChildren: React.ReactNode[] = [];
  
  // Add regular staff
  dept.staff.forEach((employee: Employee) => {
    departmentChildren.push(
      <TreeNode key={`${departmentKey}-${employee.name || employee.title}`} label={createEmployeeNode(employee)} />
    );
  });
  
  // Add sub-departments
  if (dept.subDepartments) {
    Object.entries(dept.subDepartments).forEach(([subDeptKey, employees]: [string, Employee[]]) => {
      if (employees.length > 1) {
        const [head, ...subordinates] = employees;
        departmentChildren.push(
          <TreeNode key={`${departmentKey}-${subDeptKey}`} label={createEmployeeNode(head)}>
            {subordinates.map((employee: Employee, index: number) => (
              <TreeNode 
                key={`${departmentKey}-${subDeptKey}-${index}`} 
                label={createEmployeeNode(employee)} 
              />
            ))}
          </TreeNode>
        );
      } else {
        employees.forEach((employee: Employee) => {
          departmentChildren.push(
            <TreeNode 
              key={`${departmentKey}-${subDeptKey}-${employee.name || employee.title}`} 
              label={createEmployeeNode(employee)} 
            />
          );
        });
      }
    });
  }
  
  return (
    <TreeNode label={createEmployeeNode(dept.manager)}>
      {departmentChildren}
    </TreeNode>
  );
};

const OrgChart: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 p-6 overflow-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-white text-4xl font-bold mb-2">ADK</div>
        <div className="text-white text-xl mb-1">AFRICA DRONE KINGS</div>
        <div className="text-white text-sm opacity-90">AUTHORIZED DISTRIBUTOR & REPAIR CENTRE</div>
      </div>

      {/* Organizational Chart */}
      <div className="flex justify-center">
        <Tree lineWidth="2px" lineColor="#ffffff" nodePadding="20px">
          <TreeNode
            label={
              <div className="flex gap-4">
                {createEmployeeNode(organizationData.ceo)}
                {createEmployeeNode(organizationData.assistant)}
              </div>
            }
          >
            <TreeNode
              label={
                <div className="flex gap-4">
                  {createEmployeeNode(organizationData.coo)}
                  {createEmployeeNode(organizationData.secretary)}
                </div>
              }
            >
              {/* Marketing Department */}
              {createDepartmentNode('marketing')}

              {/* Finance Department */}
              {createDepartmentNode('finance')}

              {/* Sales Department */}
              {createDepartmentNode('sales')}

              {/* After Sales Department */}
              {createDepartmentNode('afterSales')}

              {/* Procurement Department */}
              {createDepartmentNode('procurement')}
            </TreeNode>
          </TreeNode>
        </Tree>
      </div>
    </div>
  );
};

export default OrgChart;