import React from 'react';
import { Users, FolderOpen, CheckSquare, TrendingUp } from 'lucide-react';
import MetricCard from './MetricCard';
import ProgressChart from './ProgressChart';
import ProjectStatusChart from './ProjectStatusChart';
import DepartmentChart from './DepartmentChart';
import RecentActivity from './RecentActivity';
import { mockMetrics } from '../../data/mockData';

export default function Dashboard() {
  return (
    <div className="space-y-6 mt-0 md:mt-[90px]">
      {/* Welcome Section */}
      

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Interns"
          value={mockMetrics.totalInterns}
          icon={Users}
          color="bg-blue-500"
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Active Projects"
          value={mockMetrics.activeProjects}
          icon={FolderOpen}
          color="bg-green-500"
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard
          title="Completed Tasks"
          value={mockMetrics.completedTasks.toLocaleString()}
          icon={CheckSquare}
          color="bg-purple-500"
          trend={{ value: 15, isPositive: true }}
        />
        <MetricCard
          title="Success Rate"
          value={`${mockMetrics.successRate}%`}
          icon={TrendingUp}
          color="bg-orange-500"
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressChart />
        <ProjectStatusChart />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DepartmentChart />
        </div>
        <RecentActivity />
      </div>
    </div>
  );
}