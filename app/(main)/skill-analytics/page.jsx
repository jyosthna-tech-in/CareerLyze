"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SkillInput from "@/components/SkillInput";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { Brain, Target, TrendingUp, Zap } from "lucide-react";

const skillData = [
  { subject: 'Product Strategy', A: 95, fullMark: 100 },
  { subject: 'Data Analysis', A: 85, fullMark: 100 },
  { subject: 'UX Design', A: 70, fullMark: 100 },
  { subject: 'Technical Depth', A: 60, fullMark: 100 },
  { subject: 'Leadership', A: 90, fullMark: 100 },
  { subject: 'Agile', A: 80, fullMark: 100 },
];

const gapData = [
  { name: 'System Design', current: 40, required: 80 },
  { name: 'A/B Testing', current: 60, required: 85 },
  { name: 'SQL', current: 75, required: 90 },
  { name: 'Python', current: 30, required: 50 },
];

export default function SkillAnalyticsPage() {
  return (
    <div className="space-y-8 pb-10 mt-4">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Skill Analytics</h1>
          <p className="text-muted-foreground text-sm">Analyze your competencies against market demand for Senior Product roles.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-foreground shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          <Zap className="w-4 h-4 mr-2" /> Recalculate Score
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <SkillInput/>
        {/* Left Col - Radar Chart */}
        <Card className="col-span-1 lg:col-span-1 bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Competency Radar</CardTitle>
            <CardDescription>Your strengths distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Skills" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Right Col - Skill Gaps */}
        <Card className="col-span-1 lg:col-span-2 bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Target Role Skill Gaps</CardTitle>
            <CardDescription>Areas to improve for &quot;Senior PM - FinTech&quot;</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gapData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  contentStyle={{ backgroundColor: '#1e1e2e', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Bar dataKey="current" name="Your Level" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar dataKey="required" name="Required Level" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/* Recommended Learning */}
      <div>
        <h2 className="text-xl font-serif font-bold text-foreground mb-4">Recommended Learning Paths</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-all cursor-pointer">
            <CardContent className="p-5">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Grokking the System Design Interview</h3>
              <p className="text-xs text-muted-foreground mb-4">Master scalable architectures for technical PM rounds.</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs border-primary/30 text-primary">High Priority</Badge>
                <span className="text-xs text-muted-foreground">4 weeks</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-all cursor-pointer">
            <CardContent className="p-5">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                <Target className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Advanced Product Experimentation</h3>
              <p className="text-xs text-muted-foreground mb-4">Deep dive into A/B testing and statistical significance.</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs border-secondary/30 text-secondary">Medium Priority</Badge>
                <span className="text-xs text-muted-foreground">2 weeks</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-all cursor-pointer">
            <CardContent className="p-5">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="font-bold text-foreground mb-2">SQL for Data Science</h3>
              <p className="text-xs text-muted-foreground mb-4">Learn advanced queries for autonomous data extraction.</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs border-border text-foreground">Recommended</Badge>
                <span className="text-xs text-muted-foreground">3 weeks</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
