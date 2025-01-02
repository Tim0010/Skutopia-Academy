import { useContext, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InstructorContext } from "@/context/instructor-context";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Info } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function CourseSettings() {
  const { courseSettingsFormData, setCourseSettingsFormData } = useContext(InstructorContext);
  const [enrollmentDate, setEnrollmentDate] = useState(new Date());

  const handleSettingChange = (key, value) => {
    setCourseSettingsFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Enrollment Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Enrollment Settings</CardTitle>
          <CardDescription>
            Configure how students can enroll in your course
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Open for Enrollment</Label>
              <div className="text-sm text-muted-foreground">
                Allow students to enroll in this course
              </div>
            </div>
            <Switch
              checked={courseSettingsFormData.openForEnrollment}
              onCheckedChange={(checked) => handleSettingChange('openForEnrollment', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Enrollment Limit</Label>
            <div className="flex gap-2">
              <Switch
                checked={courseSettingsFormData.hasEnrollmentLimit}
                onCheckedChange={(checked) => handleSettingChange('hasEnrollmentLimit', checked)}
              />
              {courseSettingsFormData.hasEnrollmentLimit && (
                <Input
                  type="number"
                  min="1"
                  value={courseSettingsFormData.enrollmentLimit}
                  onChange={(e) => handleSettingChange('enrollmentLimit', e.target.value)}
                  className="w-32"
                  placeholder="Enter limit"
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Enrollment Period</Label>
            <div className="flex gap-2">
              <Switch
                checked={courseSettingsFormData.hasEnrollmentPeriod}
                onCheckedChange={(checked) => handleSettingChange('hasEnrollmentPeriod', checked)}
              />
              {courseSettingsFormData.hasEnrollmentPeriod && (
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !courseSettingsFormData.enrollmentStartDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {courseSettingsFormData.enrollmentStartDate ? (
                          format(courseSettingsFormData.enrollmentStartDate, "PPP")
                        ) : (
                          <span>Start date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={courseSettingsFormData.enrollmentStartDate}
                        onSelect={(date) => handleSettingChange('enrollmentStartDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !courseSettingsFormData.enrollmentEndDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {courseSettingsFormData.enrollmentEndDate ? (
                          format(courseSettingsFormData.enrollmentEndDate, "PPP")
                        ) : (
                          <span>End date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={courseSettingsFormData.enrollmentEndDate}
                        onSelect={(date) => handleSettingChange('enrollmentEndDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Access Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Course Access Settings</CardTitle>
          <CardDescription>
            Configure how students can access your course content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Self-Paced Learning</Label>
              <div className="text-sm text-muted-foreground">
                Allow students to progress through the course at their own pace
              </div>
            </div>
            <Switch
              checked={courseSettingsFormData.selfPacedLearning}
              onCheckedChange={(checked) => handleSettingChange('selfPacedLearning', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Course Certificate</Label>
              <div className="text-sm text-muted-foreground">
                Enable course completion certificates for students
              </div>
            </div>
            <Switch
              checked={courseSettingsFormData.courseCertificate}
              onCheckedChange={(checked) => handleSettingChange('courseCertificate', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Access Duration</Label>
            <div className="flex gap-2">
              <Switch
                checked={courseSettingsFormData.hasAccessDuration}
                onCheckedChange={(checked) => handleSettingChange('hasAccessDuration', checked)}
              />
              {courseSettingsFormData.hasAccessDuration && (
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    min="1"
                    value={courseSettingsFormData.accessDuration}
                    onChange={(e) => handleSettingChange('accessDuration', e.target.value)}
                    className="w-32"
                    placeholder="Duration"
                  />
                  <Select
                    value={courseSettingsFormData.accessDurationUnit}
                    onValueChange={(value) => handleSettingChange('accessDurationUnit', value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                      <SelectItem value="years">Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discussion Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Discussion Settings</CardTitle>
          <CardDescription>
            Configure how students can interact in course discussions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Enable Discussions</Label>
              <div className="text-sm text-muted-foreground">
                Allow students to participate in course discussions
              </div>
            </div>
            <Switch
              checked={courseSettingsFormData.enableDiscussions}
              onCheckedChange={(checked) => handleSettingChange('enableDiscussions', checked)}
            />
          </div>

          {courseSettingsFormData.enableDiscussions && (
            <>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Moderation Required</Label>
                  <div className="text-sm text-muted-foreground">
                    Review and approve discussions before they are visible
                  </div>
                </div>
                <Switch
                  checked={courseSettingsFormData.moderationRequired}
                  onCheckedChange={(checked) => handleSettingChange('moderationRequired', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Allow File Attachments</Label>
                  <div className="text-sm text-muted-foreground">
                    Let students attach files to their discussion posts
                  </div>
                </div>
                <Switch
                  checked={courseSettingsFormData.allowFileAttachments}
                  onCheckedChange={(checked) => handleSettingChange('allowFileAttachments', checked)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CourseSettings;
