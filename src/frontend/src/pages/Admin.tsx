import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useGetAllContactForms } from '@/hooks/useQueries';
import { Mail, Phone, User, MessageSquare } from 'lucide-react';

export default function Admin() {
  const { data: submissions, isLoading, error } = useGetAllContactForms();

  const getUserTypeBadgeVariant = (userType: string) => {
    switch (userType.toLowerCase()) {
      case 'farmer':
        return 'default';
      case 'buyer':
        return 'secondary';
      case 'distributor':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div>
      {/* Header Section */}
      <section className="bg-muted/30 py-16">
        <div className="section-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            View and manage all contact form submissions
          </p>
        </div>
      </section>

      {/* Submissions Section */}
      <section className="section-container section-padding">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              Contact Form Submissions
              {submissions && (
                <Badge variant="secondary" className="ml-2">
                  {submissions.length} total
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading submissions...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-destructive">Error loading submissions. Please try again.</p>
              </div>
            )}

            {!isLoading && !error && submissions && submissions.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No submissions yet.</p>
              </div>
            )}

            {!isLoading && !error && submissions && submissions.length > 0 && (
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Phone</TableHead>
                      <TableHead className="font-semibold">User Type</TableHead>
                      <TableHead className="font-semibold">Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {submission.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={`mailto:${submission.email}`}
                              className="text-primary hover:underline"
                            >
                              {submission.email}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={`tel:${submission.phoneNumber}`}
                              className="text-primary hover:underline"
                            >
                              {submission.phoneNumber}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getUserTypeBadgeVariant(submission.userType)}>
                            {submission.userType}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {submission.message}
                          </p>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
