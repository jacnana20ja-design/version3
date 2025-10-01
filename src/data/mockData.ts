import data from './data.json';
import { Intern, Project, Task, Activity, DashboardMetrics } from '../types';

export const mockMetrics: DashboardMetrics = data.metrics;
export const mockInterns: Intern[] = data.interns;
export const mockProjects: Project[] = data.projects;
export const mockTasks: Task[] = data.tasks;
export const mockActivities: Activity[] = data.activities;
export const mockNotifications = data.notifications;
export const progressData = data.progressData;
export const projectStatusData = data.projectStatusData;
export const departmentData = data.departmentData;