"use client"
import { 
  Card, 
  Text, 
  TextInput, 
  Textarea, 
  Checkbox, 
  Button, 
  Group, 
  Divider, 
  SimpleGrid,
  Stack,
  Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

const qualityIssueTypes = [
  'Expectation Failure',
  'Specification Failure', 
  'Quality Failure',
  'Process Failure',
  'Communication Failure'
];

interface FormData {
  docNumber: string;
  originatorName: string;
  date: string;
  problemDescription: string;
  qualityIssueType: string[];
  why1: string;
  why2: string;
  why3: string;
  why4: string;
  why5: string;
  proposedSolution: string;
  futureAvoidance: string;
  ticketStatus: 'open' | 'closed';
  problemFixed: string;
  overseeName: string;
  closingDate: string;
  department: string;
  financialCost: string;
  opportunityCost: string;
  resourcesCost: string;
  otherCost: string;
}

export default function RootCauseAnalysis() {
  const form = useForm<FormData>({
    initialValues: {
      docNumber: 'QM 0001',
      originatorName: '',
      date: '',
      problemDescription: '',
      qualityIssueType: [],
      why1: '',
      why2: '',
      why3: '',
      why4: '',
      why5: '',
      proposedSolution: '',
      futureAvoidance: '',
      ticketStatus: 'open',
      problemFixed: '',
      overseeName: '',
      closingDate: '',
      department: '',
      financialCost: '',
      opportunityCost: '',
      resourcesCost: '',
      otherCost: '',
    },

    validate: {
      originatorName: (value) => (value ? null : 'Originator name is required'),
      date: (value) => (value ? null : 'Date is required'),
      problemDescription: (value) => (value ? null : 'Problem description is required'),
      qualityIssueType: (value) => (value.length > 0 ? null : 'Select at least one quality issue type'),
      proposedSolution: (value) => (value ? null : 'Proposed solution is required'),
      futureAvoidance: (value) => (value ? null : 'Future avoidance plan is required'),
      overseeName: (value) => (value ? null : 'Oversee name is required'),
      department: (value) => (value ? null : 'Department is required'),
    },
  });

  const handleSubmit = (values: FormData) => {
    console.log('Form submitted:', values);
    notifications.show({
      title: 'Root Cause Analysis Submitted',
      message: 'Your root cause analysis has been successfully submitted.',
      icon: <IconCheck size="1rem" />,
      color: 'teal',
    });
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', backgroundColor: '#f8f9fa' }}>
      <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="md">
            <Group justify="space-between">
              <Title order={2}>Root Cause Analysis</Title>
            </Group>
          </Card.Section>

          <Card.Section inheritPadding py="md">
            <form onSubmit={form.onSubmit(handleSubmit)}>
              {/* Header Info */}
              <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
                <TextInput
                  label="Doc. no."
                  {...form.getInputProps('docNumber')}
                  readOnly
                  styles={{ input: { backgroundColor: '#f1f3f5' } }}
                />
                <TextInput
                  label="Originator Name"
                  placeholder="Enter originator name"
                  {...form.getInputProps('originatorName')}
                  required
                />
                <TextInput
                  type="date"
                  label="Date"
                  {...form.getInputProps('date')}
                  required
                />
              </SimpleGrid>

              {/* Problem Description */}
              <Textarea
                label="Description of the problem"
                placeholder="Describe the problem in detail..."
                minRows={4}
                mt="md"
                {...form.getInputProps('problemDescription')}
                required
              />

              {/* Quality Management Issue Type */}
              <Stack gap="sm" mt="md">
                <Text fw={500} size="sm">Type of Quality Management Issue</Text>
                <SimpleGrid cols={3}>
                  {qualityIssueTypes.map((type) => (
                    <Checkbox
                      key={type}
                      label={type}
                      color='dark'
                      checked={form.values.qualityIssueType.includes(type)}
                      onChange={(event) => {
                        if (event.currentTarget.checked) {
                          form.setFieldValue('qualityIssueType', [...form.values.qualityIssueType, type]);
                        } else {
                          form.setFieldValue(
                            'qualityIssueType',
                            form.values.qualityIssueType.filter((item) => item !== type)
                          );
                        }
                      }}
                    />
                  ))}
                </SimpleGrid>
                {form.errors.qualityIssueType && (
                  <Text c="red" size="sm">{form.errors.qualityIssueType}</Text>
                )}
              </Stack>

              <Divider my="md" />

              {/* Reasons for failure */}
              <Stack gap="md">
                <Text fw={500}>Reasons for the failure</Text>
                {[1, 2, 3, 4, 5].map((num) => (
                  <TextInput
                    key={num}
                    label={`Why? -`}
                    placeholder={`Why ${num}...`}
                    {...form.getInputProps(`why${num}`)}
                  />
                ))}
              </Stack>

              <Divider my="md" />

              {/* Proposed Solution */}
              <Textarea
                label="What is the proposed solution for the problem at hand?"
                placeholder="Describe the proposed solution..."
                minRows={4}
                {...form.getInputProps('proposedSolution')}
                required
              />

              {/* Future Avoidance */}
              <Textarea
                label="What could be done to avoid this problem in-future?"
                placeholder="Describe prevention measures..."
                minRows={4}
                mt="md"
                {...form.getInputProps('futureAvoidance')}
                required
              />

              <Divider my="md" />

              {/* Status */}
              <Stack gap="sm">
                <Text fw={500} size="sm">Status of the ticket?</Text>
                <Group>
                  <Checkbox
                    label="Open"
                    color='dark'
                    checked={form.values.ticketStatus === 'open'}
                    onChange={() => form.setFieldValue('ticketStatus', 'open')}
                  />
                  <Checkbox
                    label="Closed"
                    color='dark'
                    checked={form.values.ticketStatus === 'closed'}
                    onChange={() => form.setFieldValue('ticketStatus', 'closed')}
                  />
                </Group>
              </Stack>

              {/* Problem Fixed */}
              <Textarea
                label="How was the problem fixed?"
                placeholder="Describe how the problem was resolved..."
                minRows={4}
                mt="md"
                {...form.getInputProps('problemFixed')}
              />

              <Divider my="md" />

              {/* Footer Info */}
              <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
                <TextInput
                  label="Oversee name"
                  placeholder="Enter oversee name"
                  {...form.getInputProps('overseeName')}
                  required
                />
                <TextInput
                  type="date"
                  label="Closing date"
                  {...form.getInputProps('closingDate')}
                />
                <TextInput
                  label="Department"
                  placeholder="Enter department"
                  {...form.getInputProps('department')}
                  required
                />
              </SimpleGrid>

              {/* Costs */}
              <Stack gap="sm" mt="md">
                <Text fw={500}>Cost Analysis</Text>
                <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
                  <TextInput
                    label="Financial Cost"
                    placeholder="0.00"
                    {...form.getInputProps('financialCost')}
                  />
                  <TextInput
                    label="Opportunity Cost"
                    placeholder="0.00"
                    {...form.getInputProps('opportunityCost')}
                  />
                  <TextInput
                    label="Resources Cost"
                    placeholder="0.00"
                    {...form.getInputProps('resourcesCost')}
                  />
                  <TextInput
                    label="Other"
                    placeholder="0.00"
                    {...form.getInputProps('otherCost')}
                  />
                </SimpleGrid>
              </Stack>

              <Group justify="flex-end" mt="xl">
                <Button color='dark' type="submit" size="md">
                  Submit Root Cause Analysis
                </Button>
              </Group>
            </form>
          </Card.Section>
        </Card>
      </div>
    </div>
  );
}