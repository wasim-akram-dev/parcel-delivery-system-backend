import { Request, Response } from "express";
import { Parcel } from "../parcel/parcel.model";

// Admin overview: total counts by status and totals
const getAdminOverview = async (req: Request, res: Response) => {
  try {
    const total = await Parcel.countDocuments();

    // counts by status
    const byStatus = await Parcel.aggregate([
      { $group: { _id: "$parcel_status", count: { $sum: 1 } } },
    ]);

    // counts for blocked, cancelled etc.
    const extra = await Parcel.aggregate([
      {
        $group: {
          _id: null,
          blocked: { $sum: { $cond: ["$isBlocked", 1, 0] } },
          cancelled: { $sum: { $cond: ["$isCancelled", 1, 0] } },
          delivered: {
            $sum: { $cond: [{ $eq: ["$parcel_status", "Delivered"] }, 1, 0] },
          },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        total,
        byStatus,
        ...extra[0],
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const DashboardControllers = {
  getAdminOverview,
};
