import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calculator, 
  BookOpen, 
  Timer, 
  Ruler, 
  PenTool, 
  Globe, 
  Compass, 
  Brain 
} from "lucide-react";

export default function StudentToolsPage() {
  const [activeTab, setActiveTab] = useState("academic");

  const toolCategories = {
    academic: [
      {
        name: "Scientific Calculator",
        description: "Advanced calculator for complex mathematical calculations",
        icon: Calculator,
        link: "/calculator"
      },
      {
        name: "Reference Manager",
        description: "Organize and cite your research materials",
        icon: BookOpen,
        link: "/reference-manager"
      },
      {
        name: "Study Timer",
        description: "Pomodoro technique timer for focused study sessions",
        icon: Timer,
        link: "/study-timer"
      }
    ],
    measurement: [
      {
        name: "Unit Converter",
        description: "Convert between different units of measurement",
        icon: Ruler,
        link: "/unit-converter"
      },
      {
        name: "Geometry Tools",
        description: "Interactive geometry tools and calculators",
        icon: Compass,
        link: "/geometry-tools"
      }
    ],
    learning: [
      {
        name: "Mind Mapping",
        description: "Create visual mind maps for better understanding",
        icon: PenTool,
        link: "/mind-map"
      },
      {
        name: "Language Translator",
        description: "Translate text between multiple languages",
        icon: Globe,
        link: "/translator"
      },
      {
        name: "Memory Trainer",
        description: "Cognitive exercises to improve memory",
        icon: Brain,
        link: "/memory-trainer"
      }
    ]
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Student Tools</h1>
        <p className="text-muted-foreground mb-8">
          Enhance your learning with these helpful academic tools
        </p>

        <Tabs 
          defaultValue="academic" 
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="academic">Academic Tools</TabsTrigger>
            <TabsTrigger value="measurement">Measurement Tools</TabsTrigger>
            <TabsTrigger value="learning">Learning Tools</TabsTrigger>
          </TabsList>

          {Object.entries(toolCategories).map(([category, tools]) => (
            <TabsContent key={category} value={category}>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                  <ToolCard key={tool.name} tool={tool} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </div>
  );
}

function ToolCard({ tool }) {
  const Icon = tool.icon;

  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-primary/10 p-3 rounded-lg mr-4">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold">{tool.name}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {tool.description}
        </p>
        <Button variant="outline" className="w-full">
          Open Tool
        </Button>
      </CardContent>
    </Card>
  );
}
