import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ResourceSection({ resource }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{resource.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {resource.items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
