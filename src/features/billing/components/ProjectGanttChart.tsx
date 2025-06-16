
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, ChevronLeft, ChevronRight, Clock, Users, AlertTriangle } from "lucide-react";
import { BillingProject, WorkPlanStep, ProjectMilestone } from "../types/billingTypes";

interface ProjectGanttChartProps {
  project: BillingProject;
}

const ProjectGanttChart = ({ project }: ProjectGanttChartProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Calculate project timeline data
  const timelineData = useMemo(() => {
    const startDate = new Date(project.startDate || project.createdAt);
    const endDate = new Date(project.expectedEndDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));
    
    // Generate months for timeline
    const months = [];
    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    while (current <= endDate) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }

    return { startDate, endDate, months };
  }, [project]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-300';
      case 'delayed': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const calculateTaskPosition = (startDate: string, endDate: string) => {
    const taskStart = new Date(startDate);
    const taskEnd = new Date(endDate);
    const timelineStart = timelineData.startDate;
    const timelineEnd = timelineData.endDate;
    
    const totalDays = (timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24);
    const startOffset = (taskStart.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24);
    const duration = (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24);
    
    const left = (startOffset / totalDays) * 100;
    const width = (duration / totalDays) * 100;
    
    return { left: `${Math.max(0, left)}%`, width: `${Math.max(1, width)}%` };
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  return (
    <div className="space-y-6">
      {/* Project Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Project Gantt Chart - {project.name}
            </CardTitle>
            <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
              {project.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Duration
              </div>
              <div className="font-medium">
                {project.baselineDuration || 'N/A'} days
                {project.actualDuration && (
                  <span className="text-sm text-muted-foreground ml-2">
                    (Actual: {project.actualDuration} days)
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Progress
              </div>
              <div className="space-y-1">
                <Progress value={project.overallProgress || 0} className="h-2" />
                <span className="text-sm">{project.overallProgress || 0}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                Team
              </div>
              <div className="font-medium">
                {project.projectTeam?.length || 0} members
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4" />
                Risks
              </div>
              <div className="font-medium">
                {project.riskFactors?.length || 0} identified
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Timeline View</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium min-w-[120px] text-center">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Timeline Header */}
          <div className="mb-4 relative">
            <div className="flex border-b pb-2">
              <div className="w-64 font-medium">Task / Phase</div>
              <div className="flex-1 relative">
                <div className="flex">
                  {timelineData.months.map((month, index) => (
                    <div key={index} className="flex-1 text-center text-sm font-medium border-l px-2">
                      {month.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Project Phases */}
          {project.projectPhases?.map((phase) => (
            <div key={phase.id} className="mb-6">
              <div className="flex items-center mb-2">
                <div className="w-64 font-medium text-lg">{phase.name}</div>
                <div className="flex-1 relative h-8">
                  <div
                    className={`absolute h-6 rounded ${getStatusColor(phase.status)} opacity-80`}
                    style={calculateTaskPosition(phase.startDate, phase.endDate)}
                  >
                    <div className="h-full flex items-center justify-center text-white text-xs font-medium">
                      {phase.progress}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Plan Steps under this phase */}
              {project.workPlan
                .filter(step => phase.workPlanSteps?.includes(step.id))
                .map((step) => (
                  <div key={step.id} className="flex items-center mb-1 ml-4">
                    <div className="w-60 text-sm">
                      <div className="flex items-center gap-2">
                        <span>{step.departmentName}</span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getPriorityColor(step.priority || 'medium')}`}
                        >
                          {step.priority || 'medium'}
                        </Badge>
                      </div>
                      {step.assignedTo && (
                        <div className="text-xs text-muted-foreground">{step.assignedTo}</div>
                      )}
                    </div>
                    <div className="flex-1 relative h-6">
                      <div
                        className={`absolute h-4 rounded ${getStatusColor(step.status)} mt-1`}
                        style={calculateTaskPosition(step.startDate || step.targetDate, step.endDate || step.targetDate)}
                      >
                        <div className="h-full flex items-center justify-center text-white text-xs">
                          {step.progress || 0}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}

          {/* Milestones */}
          <div className="mt-6 border-t pt-4">
            <h4 className="font-medium mb-2">Milestones</h4>
            {project.milestones?.map((milestone) => (
              <div key={milestone.id} className="flex items-center mb-1">
                <div className="w-64 text-sm flex items-center gap-2">
                  <span>{milestone.name}</span>
                  {milestone.isPaymentMilestone && (
                    <Badge variant="secondary" className="text-xs">Payment</Badge>
                  )}
                </div>
                <div className="flex-1 relative h-6">
                  <div
                    className="absolute w-3 h-3 rounded-full bg-purple-500 border-2 border-white shadow-md"
                    style={{
                      left: calculateTaskPosition(milestone.targetDate, milestone.targetDate).left,
                      top: '6px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <span className="text-sm">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm">Milestone</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectGanttChart;
