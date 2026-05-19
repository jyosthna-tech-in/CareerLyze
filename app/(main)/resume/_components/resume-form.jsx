"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const resumeSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  jobTitle: z.string().min(2, "Job title is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\d{10}$/, "Must be exactly 10 digits"),
  location: z.string().min(2, "Location is required"),
  showProfilePic: z.boolean().default(false),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  links: z.array(
    z.object({
      label: z.string().min(1, "Label is required"),
      url: z.string().url("Must be a valid URL"),
    })
  ),
  expertise: z.string().min(2, "Expertise is required"),
  experience: z.array(
    z.object({
      title: z.string().min(2, "Title is required"),
      company: z.string().min(2, "Company is required"),
      dates: z.string().min(2, "Dates are required"),
      description: z.string().min(10, "Description is required"),
      highImpact: z.boolean().default(false),
    })
  ),
  projects: z.array(
    z.object({
      title: z.string().min(2, "Title is required"),
      description: z.string().min(5, "Description is required"),
      url: z.string().optional().or(z.literal("")),
    })
  ),
  education: z.array(
    z.object({
      degree: z.string().min(2, "Degree is required"),
      school: z.string().min(2, "School is required"),
      dates: z.string().optional(),
    })
  ),
});

export default function ResumeForm({ initialData, onUpdate, isExpanded = false }) {
  const form = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: initialData || {
      fullName: "ALEXANDER VANCE",
      jobTitle: "SENIOR PRODUCT STRATEGIST & AI INTEGRATION LEAD",
      email: "alexander.vance@email.com",
      phone: "9876543210",
      location: "San Francisco, CA",
      showProfilePic: false,
      summary: "Strategic leader with 10+ years of experience scaling AI-driven consumer products.",
      links: [],
      expertise: "PRODUCT VISION, LLM ARCHITECTURE, AGILE/SCRUM",
      experience: [],
      projects: [],
      education: [],
    },
    mode: "onChange",
  });

  const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
    control: form.control,
    name: "links",
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control: form.control,
    name: "education",
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      onUpdate(value);
    });
    return () => subscription.unsubscribe();
  }, [form, onUpdate]);

  const { errors } = form.formState;

  return (
    <div className={`space-y-4 w-full ${isExpanded ? 'max-w-5xl mx-auto' : 'max-w-md mx-auto xl:mx-0'} p-4 sm:p-6 bg-card rounded-md border border-border shadow-sm overflow-y-auto max-h-[calc(100vh-100px)] custom-scrollbar transition-all duration-300`}>
      <div>
        <h2 className="text-xl font-bold font-serif text-foreground mb-1">Resume Details</h2>
        <p className="text-sm text-muted-foreground mb-4">Fill out the form to update your resume.</p>
      </div>

      <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
        <Accordion type="single" collapsible defaultValue="personal" className="w-full">

          {/* PERSONAL INFO */}
          <AccordionItem value="personal" className="border-border">
            <AccordionTrigger className="text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline">Personal Info</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <div className={isExpanded ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-3"}>
                <div className="space-y-1">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" {...form.register("fullName")} className="bg-secondary/30" />
                  {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" {...form.register("jobTitle")} className="bg-secondary/30" />
                  {errors.jobTitle && <p className="text-xs text-red-500">{errors.jobTitle.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...form.register("email")} className="bg-secondary/30" />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-secondary/30 text-muted-foreground text-sm font-medium">
                      +91
                    </span>
                    <Input id="phone" {...form.register("phone")} className="rounded-l-none bg-secondary/30" placeholder="9876543210" maxLength={10} />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...form.register("location")} className="bg-secondary/30" />
                {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
              </div>

              <div className="flex items-center gap-2 mt-2 bg-secondary/20 p-3 rounded-md border border-border/50">
                <input
                  type="checkbox"
                  id="showProfilePic"
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  {...form.register("showProfilePic")}
                />
                <Label htmlFor="showProfilePic" className="flex items-center gap-2 cursor-pointer font-medium">
                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                  Include Profile Picture
                </Label>
              </div>
            </AccordionContent>
          </AccordionItem>


          {/* SUMMARY & EXPERTISE */}
          <AccordionItem value="summary" className="border-border">
            <AccordionTrigger className="text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline">Summary & Expertise</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <div className="space-y-1">
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  {...form.register("summary")}
                  className="h-24 bg-secondary/30 resize-none"
                />
                {errors.summary && <p className="text-xs text-red-500">{errors.summary.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="expertise" className="text-xs text-muted-foreground">Expertise (Comma-separated)</Label>
                <Input id="expertise" {...form.register("expertise")} className="bg-secondary/30" placeholder="React, Node.js, Design" />
                {errors.expertise && <p className="text-xs text-red-500">{errors.expertise.message}</p>}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* EXPERIENCE */}
          <AccordionItem value="experience" className="border-border">
            <AccordionTrigger className="text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline">Experience</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              {expFields.map((field, index) => (
                <div key={field.id} className="p-3 bg-secondary/10 rounded-md border border-border/50 relative group">
                  <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeExp(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2 sm:mb-3 pr-8">
                    <div className="space-y-1">
                      <Label className="text-xs">Job Title</Label>
                      <Input {...form.register(`experience.${index}.title`)} className="h-8 text-xs bg-background" />
                      {errors?.experience?.[index]?.title && <p className="text-[10px] text-red-500">{errors.experience[index].title.message}</p>}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Company</Label>
                      <Input {...form.register(`experience.${index}.company`)} className="h-8 text-xs bg-background" />
                      {errors?.experience?.[index]?.company && <p className="text-[10px] text-red-500">{errors.experience[index].company.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-1 mb-2">
                    <Label className="text-xs">Dates</Label>
                    <Input {...form.register(`experience.${index}.dates`)} className="h-8 text-xs bg-background" placeholder="Jan 2020 - Present" />
                    {errors?.experience?.[index]?.dates && <p className="text-[10px] text-red-500">{errors.experience[index].dates.message}</p>}
                  </div>
                  <div className="space-y-1 mb-2">
                    <Label className="text-xs">Description (Line breaks = Bullets)</Label>
                    <Textarea {...form.register(`experience.${index}.description`)} className="h-20 text-xs bg-background" />
                    {errors?.experience?.[index]?.description && <p className="text-[10px] text-red-500">{errors.experience[index].description.message}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id={`highImpact-${index}`} className="rounded border-border text-primary h-3 w-3" {...form.register(`experience.${index}.highImpact`)} />
                    <Label htmlFor={`highImpact-${index}`} className="text-xs cursor-pointer">High Impact Role</Label>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="w-full h-8 text-xs" onClick={() => appendExp({ title: "", company: "", dates: "", description: "", highImpact: false })}>
                <Plus className="w-3 h-3 mr-1" /> Add Experience
              </Button>
            </AccordionContent>
          </AccordionItem>

          {/* PROJECTS */}
          <AccordionItem value="projects" className="border-border">
            <AccordionTrigger className="text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline">Projects</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              {projFields.map((field, index) => (
                <div key={field.id} className="p-3 bg-secondary/10 rounded-md border border-border/50 relative group">
                  <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeProj(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2 sm:mb-3 pr-8">
                    <div className="space-y-1">
                      <Label className="text-xs">Project Title</Label>
                      <Input {...form.register(`projects.${index}.title`)} className="h-8 text-xs bg-background" />
                      {errors?.projects?.[index]?.title && <p className="text-[10px] text-red-500">{errors.projects[index].title.message}</p>}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Link (Optional)</Label>
                      <Input {...form.register(`projects.${index}.url`)} className="h-8 text-xs bg-background" />
                      {errors?.projects?.[index]?.url && <p className="text-[10px] text-red-500">{errors.projects[index].url.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Description</Label>
                    <Textarea {...form.register(`projects.${index}.description`)} className="h-16 text-xs bg-background" />
                    {errors?.projects?.[index]?.description && <p className="text-[10px] text-red-500">{errors.projects[index].description.message}</p>}
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="w-full h-8 text-xs" onClick={() => appendProj({ title: "", description: "", url: "" })}>
                <Plus className="w-3 h-3 mr-1" /> Add Project
              </Button>
            </AccordionContent>
          </AccordionItem>

          {/* EDUCATION */}
          <AccordionItem value="education" className="border-border">
            <AccordionTrigger className="text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline">Education</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              {eduFields.map((field, index) => (
                <div key={field.id} className="p-3 bg-secondary/10 rounded-md border border-border/50 relative group">
                  <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeEdu(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2 sm:mb-3 pr-8">
                    <div className="space-y-1">
                      <Label className="text-xs">Degree</Label>
                      <Input {...form.register(`education.${index}.degree`)} className="h-8 text-xs bg-background" />
                      {errors?.education?.[index]?.degree && <p className="text-[10px] text-red-500">{errors.education[index].degree.message}</p>}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">School / University</Label>
                      <Input {...form.register(`education.${index}.school`)} className="h-8 text-xs bg-background" />
                      {errors?.education?.[index]?.school && <p className="text-[10px] text-red-500">{errors.education[index].school.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Dates (Optional)</Label>
                    <Input {...form.register(`education.${index}.dates`)} className="h-8 text-xs bg-background" placeholder="2018 - 2022" />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="w-full h-8 text-xs" onClick={() => appendEdu({ degree: "", school: "", dates: "" })}>
                <Plus className="w-3 h-3 mr-1" /> Add Education
              </Button>
            </AccordionContent>
          </AccordionItem>

          {/* LINKS */}
          <AccordionItem value="links" className="border-border">
            <AccordionTrigger className="text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline">Additional Links</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              {linkFields.map((field, index) => (
                <div key={field.id} className="flex flex-col sm:flex-row gap-2 items-start bg-secondary/10 p-2 rounded border border-border/30 relative">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full pr-8 sm:pr-0">
                    <div>
                      <Input placeholder="Label (e.g. GitHub)" {...form.register(`links.${index}.label`)} className="h-8 text-xs bg-background" />
                      {errors?.links?.[index]?.label && <p className="text-[10px] text-red-500 mt-0.5">{errors.links[index].label.message}</p>}
                    </div>
                    <div>
                      <Input placeholder="URL (https://...)" {...form.register(`links.${index}.url`)} className="h-8 text-xs bg-background" />
                      {errors?.links?.[index]?.url && <p className="text-[10px] text-red-500 mt-0.5">{errors.links[index].url.message}</p>}
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 h-8 w-8 text-red-400 hover:text-red-500" onClick={() => removeLink(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="w-full h-8 text-xs" onClick={() => appendLink({ label: "", url: "" })}>
                <Plus className="w-3 h-3 mr-1" /> Add Link
              </Button>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </form>
    </div>
  );
}

