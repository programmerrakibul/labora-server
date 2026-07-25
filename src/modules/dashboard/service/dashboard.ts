import Application from "@/application/model/application.js";
import Job from "@/job/model/job.js";
import User from "@/user/model/user.js";
import { transformToObjectId } from "@/utils/utils.js";

const getThirtyDaysAgo = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date;
};

const getAdminStats = async () => {
  const thirtyDaysAgo = getThirtyDaysAgo();

  const [
    totalUsers,
    totalJobs,
    totalApplications,
    recentUsers,
    recentJobs,
    recentApplications,
    jobsByStatus,
    applicationsByStatus,
    usersByRole,
  ] = await Promise.all([
    User.countDocuments({ isActive: true }),
    Job.countDocuments(),
    Application.countDocuments(),
    User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Job.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Application.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Job.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Application.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]),
  ]);

  return {
    overview: {
      totalUsers,
      totalJobs,
      totalApplications,
    },
    last30Days: {
      newUsers: recentUsers,
      newJobs: recentJobs,
      newApplications: recentApplications,
    },
    breakdown: {
      jobsByStatus: jobsByStatus.reduce(
        (acc: Record<string, number>, item: { _id: string; count: number }) => ({
          ...acc,
          [item._id]: item.count,
        }),
        {} as Record<string, number>,
      ),
      applicationsByStatus: applicationsByStatus.reduce(
        (acc: Record<string, number>, item: { _id: string; count: number }) => ({
          ...acc,
          [item._id]: item.count,
        }),
        {} as Record<string, number>,
      ),
      usersByRole: usersByRole.reduce(
        (acc: Record<string, number>, item: { _id: string; count: number }) => ({
          ...acc,
          [item._id]: item.count,
        }),
        {} as Record<string, number>,
      ),
    },
  };
};

const getRecruiterStats = async (userId: string) => {
  const thirtyDaysAgo = getThirtyDaysAgo();
  const userObjectId = transformToObjectId(userId);

  const [
    totalJobsPosted,
    totalApplicationsReceived,
    recentJobsPosted,
    recentApplicationsReceived,
    jobsByStatus,
    applicationsByStatus,
  ] = await Promise.all([
    Job.countDocuments({ postedBy: userObjectId }),
    Application.aggregate([
      { $lookup: { from: "job", localField: "jobId", foreignField: "_id", as: "job" } },
      { $unwind: "$job" },
      { $match: { "job.postedBy": userObjectId } },
      { $count: "count" },
    ]),
    Job.countDocuments({
      postedBy: userObjectId,
      createdAt: { $gte: thirtyDaysAgo },
    }),
    Application.aggregate([
      { $lookup: { from: "job", localField: "jobId", foreignField: "_id", as: "job" } },
      { $unwind: "$job" },
      { $match: { "job.postedBy": userObjectId, createdAt: { $gte: thirtyDaysAgo } } },
      { $count: "count" },
    ]),
    Job.aggregate([
      { $match: { postedBy: userObjectId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Application.aggregate([
      { $lookup: { from: "job", localField: "jobId", foreignField: "_id", as: "job" } },
      { $unwind: "$job" },
      { $match: { "job.postedBy": userObjectId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);

  return {
    overview: {
      totalJobsPosted,
      totalApplicationsReceived: totalApplicationsReceived[0]?.count || 0,
    },
    last30Days: {
      newJobsPosted: recentJobsPosted,
      newApplicationsReceived: recentApplicationsReceived[0]?.count || 0,
    },
    breakdown: {
      jobsByStatus: jobsByStatus.reduce(
        (acc: Record<string, number>, item: { _id: string; count: number }) => ({
          ...acc,
          [item._id]: item.count,
        }),
        {} as Record<string, number>,
      ),
      applicationsByStatus: applicationsByStatus.reduce(
        (acc: Record<string, number>, item: { _id: string; count: number }) => ({
          ...acc,
          [item._id]: item.count,
        }),
        {} as Record<string, number>,
      ),
    },
  };
};

const getJobSeekerStats = async (userId: string) => {
  const thirtyDaysAgo = getThirtyDaysAgo();
  const userObjectId = transformToObjectId(userId);

  const [
    totalApplications,
    recentApplications,
    applicationsByStatus,
  ] = await Promise.all([
    Application.countDocuments({ applicantId: userObjectId }),
    Application.countDocuments({
      applicantId: userObjectId,
      createdAt: { $gte: thirtyDaysAgo },
    }),
    Application.aggregate([
      { $match: { applicantId: userObjectId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);

  return {
    overview: {
      totalApplications,
    },
    last30Days: {
      newApplications: recentApplications,
    },
    breakdown: {
      applicationsByStatus: applicationsByStatus.reduce(
        (acc: Record<string, number>, item: { _id: string; count: number }) => ({
          ...acc,
          [item._id]: item.count,
        }),
        {} as Record<string, number>,
      ),
    },
  };
};

const services = {
  getAdminStats,
  getRecruiterStats,
  getJobSeekerStats,
};

export default services;
