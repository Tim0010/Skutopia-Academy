import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, GraduationCapIcon, MapPinIcon } from "lucide-react";

export function ScholarshipCard({ scholarship }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl font-bold">{scholarship.title}</CardTitle>
          <Badge variant="secondary">{scholarship.category}</Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          {scholarship.provider}
        </CardDescription>
        <div className="flex gap-2 mt-2 flex-wrap">
          <Badge variant="outline" className="flex items-center gap-1">
            <MapPinIcon className="w-3 h-3" />
            {scholarship.region}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <GraduationCapIcon className="w-3 h-3" />
            {scholarship.level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{scholarship.description}</p>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-primary mb-2">Benefits</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {scholarship.benefits.map((benefit, i) => (
                <li key={i}>{benefit}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-primary mb-2">Eligibility</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {scholarship.eligibility.map((criteria, i) => (
                <li key={i}>{criteria}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-primary mb-2">Key Deadlines</h4>
            <div className="space-y-2">
              {Object.entries(scholarship.deadlines).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{key}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
