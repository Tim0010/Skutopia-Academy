import { useContext, useCallback, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InstructorContext } from "@/context/instructor-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Image as ImageIcon, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

function CourseLanding() {
  const { courseLandingFormData, setCourseLandingFormData } = useContext(InstructorContext);
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length) {
      const file = acceptedFiles[0];
      setCourseLandingFormData(prev => ({
        ...prev,
        thumbnail: file
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [setCourseLandingFormData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5242880, // 5MB
    maxFiles: 1
  });

  const handleInputChange = (field, value) => {
    setCourseLandingFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!courseLandingFormData.title?.trim()) {
      newErrors.title = "Course title is required";
    }

    if (!courseLandingFormData.category) {
      newErrors.category = "Please select a category";
    }

    if (!courseLandingFormData.description?.trim()) {
      newErrors.description = "Course description is required";
    } else if (courseLandingFormData.description.length < 100) {
      newErrors.description = "Description should be at least 100 characters";
    }

    if (!courseLandingFormData.price) {
      newErrors.price = "Course price is required";
    } else if (isNaN(courseLandingFormData.price) || courseLandingFormData.price < 0) {
      newErrors.price = "Please enter a valid price";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Landing Page</CardTitle>
          <CardDescription>
            Create an engaging landing page for your course
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Course Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Course Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter a descriptive title for your course"
              value={courseLandingFormData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Course Category */}
          <div className="space-y-2">
            <Label>
              Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={courseLandingFormData.category}
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="programming">Programming</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="music">Music</SelectItem>
                <SelectItem value="photography">Photography</SelectItem>
                <SelectItem value="personal-development">Personal Development</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Course Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Provide a detailed description of your course"
              value={courseLandingFormData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={cn(
                "min-h-[200px] resize-y",
                errors.description ? "border-red-500" : ""
              )}
            />
            <div className="flex justify-between text-sm">
              <div className={errors.description ? "text-red-500" : "text-gray-500"}>
                {courseLandingFormData.description?.length || 0} / 100 characters minimum
              </div>
              {errors.description && (
                <p className="text-red-500">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Course Thumbnail */}
          <div className="space-y-2">
            <Label>Course Thumbnail</Label>
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors",
                isDragActive ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50",
                "relative"
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                {previewUrl ? (
                  <div className="relative w-full h-48">
                    <img
                      src={previewUrl}
                      alt="Course thumbnail preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewUrl(null);
                        setCourseLandingFormData(prev => ({ ...prev, thumbnail: null }));
                      }}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {isDragActive ? "Drop your image here" : "Drag & drop your course thumbnail"}
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG or WebP (max. 5MB)
                      </p>
                    </div>
                    <Button variant="secondary" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Course Price */}
          <div className="space-y-2">
            <Label htmlFor="price">
              Price (ZMW) <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                K
              </span>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={courseLandingFormData.price || ''}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={cn(
                  "pl-8",
                  errors.price ? "border-red-500" : ""
                )}
              />
            </div>
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price}</p>
            )}
          </div>

          {/* Form Validation Alert */}
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Please fix the errors above before proceeding.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CourseLanding;
